import config from '../../config';
import _debug from 'debug'
const debug = _debug('app:server:coin:PostLoop')
import _ from 'lodash';
import moment from 'moment';

import Errcode, * as EC from '../Errcode'
import models from './dbmodels';
import Dbase from './dbBase';
import userHasCaps from './roles';
import Middleware from './middleware';

import Lottery from '../lottery/base';

/**
 * @file   postLoop.js
 * @author windsome.feng <86643838@163.com>
 * @date   Thu Mar 16 23:33:22 2017
 * 
 * @brief  管理那些刚达成的任务，由外面调用insert插入postCache中。
 * 等待时时彩的开奖数字作为random2的字符串值，将其转化成数字与random1相加与count取余，得到中奖序号
 * 公式为： lucky = (random1+random2) % count + 1
 * 将lucky & random2保存回数据库，并从当前检查列表中删除。
 *
 */
export default class PostLoop {
    constructor (domain) {
        this.domain = domain;
        try {
        this.init().then ( ret => {
            debug ("constructor, after init! Posts with status 5: ", this.postCache);
        })
        } catch (error) {
            debug ("init fail!", error);
        }
    }

    async init () {
        debug ("init begin");
        this.postCache = new Set();
        debug ("init begin 1");
        var items = await Dbase.findAndCountAll(models.Post, { 
            where: { status: 5 }
        });
        debug ("init begin 2", items);
        items && items.data && items.data.map (item => {
            debug ("init begin 2.1", item);
            if (item)
                this.postCache.add (item.id);
        })
        debug ("init begin 3");
        this.postCheckLoop ();
        debug ("init end");
    }
    
    postCheckLoop () {
        //debug ("postCheckLoop 1");
        this.postCheck()
            .then (() => {
                this.postCheckTimer = setTimeout (this.postCheckLoop.bind(this), 30000);
                //debug ("postCheckLoop 2");
            }).catch ((e) => {
                this.postCheckTimer = setTimeout (this.postCheckLoop.bind(this), 30000);
                debug ("error! postCheckLoop: ", e);
            })
    }
    async postCheck () {
        // wait for lottery result. 
        // then calculate lucky with random1, random2
        // then update random2, lucky, status(6) to post.
        if (this.postCache.size > 0) {
            debug ("postCheck:", this.postCache);
            var arr = [...this.postCache];
            var start = 0;
            while (start < arr.length) {
                var subarr = arr.slice (start, start+100);
                start += 100;

                var items = await Dbase.findAndCountAll(models.Post, { 
                    where: {
                        id: { $in: [...subarr] }
                    }
                });
                if (items && items.data) {
                    for (var i = 0; i < items.data.length; i++) {
                        var item = items.data[i];
                        var accomplish = new Date(item.accomplish);
                        var result = await Lottery.getResultAfterTime (accomplish);
                        if (result && result.kj) {
                            // get lottery.
                            var luckyNum = this.calculateLucky (item, result.kj);
                            var result2 = await Dbase.update(models.Post, {random2: result.kj, lucky: luckyNum, status: 6}, { id: item.id });
                            debug ("update random2 & lucky! postId="+item.id+", random1="+item.random1+", random2="+result.kj+", lucky="+luckyNum);
                            if (result2.count != 1) {
                                debug ("warning! update not 1 item!", result2);
                            }
                            this.postCache.delete (item.id);
                            await this.sendMessageToLuckyOrder ({...item, random2: result.kj, lucky: luckyNum, status: 6});
                        }
                    }
                }
            }
        }
    }

    calculateLucky (postItem, lotteryResult) {
        var postId = postItem.id;
        var count = postItem.count;
        var random1 = postItem.random1;
        var intRandom2 = parseInt(lotteryResult.match(/\d+/g).join(''));
        var lucky = (random1 + intRandom2) % count + 1;
        return lucky;
    }

    async sendMessageToLuckyOrder (post) {
        if (!post) {
            debug ("error! post should not null! why?");
            return false;
        }
        var luckyOrder = null;
        var items = await Dbase.findAndCountAll(models.Order, { where: { postId: post.id, status: 2 } });
        if (items && items.data) {
            var lucky = post.lucky;
            for (var i = 0; i < items.data.length; i++) {
                var item = items.data[i];
                if (lucky >= item.serial && lucky < (item.serial + item.count)) {
                    debug ("find lucky order!");
                    luckyOrder = item;
                    break;
                }
            }
        } else {
            debug ("error! no orders!!! why? should not happen!");
        }

        if (luckyOrder) {
            // send message to lucky person.
            var orderOwner = await Dbase.findOne (models.User, { id: luckyOrder.userId });
            if (orderOwner) {
                var postName = post.desc && post.desc.name || '未命名艺术品';
                var url = "http://"+this.domain+"/coin/shop/"+post.owner+"/"+post.id;
                var fist = '恭喜您获得了编号为'+post.id+' '+postName;
                var keyword1 = '请等待小二给您发货，请确保在个人信息里留的电话地址是正确的！';
                var keyword2 = new Date().toLocaleString();
                var totalFee = post.count * post.unit / 100;
                var myFee = luckyOrder.fee / 100;
                var remark = '您花了'+myFee+'元，获得了价值'+totalFee+'元的商品。如有疑问，请致电13661989491联系小易';
                var ret2 = await Middleware.sendTemplateLuckyResult(orderOwner.openid, url, { first: { value: first, color:'#173177' }, keyword1: { value:keyword1, color:'#173177' }, keyword2: { value: keyword2, color:'#173177' }, Remark: { value:remark, color:'#173177' } });
                debug ("sendMessageToLuckyOrder return:", ret2);
            }
        }
    }

    insert (postId) {
        this.postCache.add (postId);
    }
}

//export default (new PostLoop());
