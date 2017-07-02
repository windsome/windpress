import _debug from 'debug'
const debug = _debug('app:coin:middleware')
import _ from 'lodash';
import moment from 'moment';
import config from '../../config';

import Errcode, * as EC from '../Errcode'
import models from './dbmodels';
import Dbase from './dbBase';
import userHasCaps from './roles';
import WechatUser from 'koa3-wechat/lib/user';
import WechatTemplate from 'koa3-wechat/lib/template';
import WechatQrcode from 'koa3-wechat/lib/qrcode';

export class Middleware {
    constructor () {
        //this.init().then(() => {
        //    debug ("init finish!");
        //});
        this.init();
    }

    init () {
        debug ("init start");
        this.pageSize = 10;

        this.templateLuckyResult = config.wechat.templateLuckyResult;
        this.templatePaySucess = config.wechat.templatePaySucess;
        this.templateRefundNotify = config.wechat.templateRefundNotify;
        this.templateOrderCancel = config.wechat.templateOrderCancel;

        this.wcuser = new WechatUser({
            appId: config.wechat.appId, 
            appSecret: config.wechat.appSecret
        });
        this.wctemplate = new WechatTemplate({
            appId: config.wechat.appId, 
            appSecret: config.wechat.appSecret
        });
        this.wcqrcode = new WechatQrcode({
            appId: config.wechat.appId, 
            appSecret: config.wechat.appSecret
        });
        debug ("init end");
    }

    async updatePostStatus (id, status) {
        var item = await Dbase.findOne (models.Post, { id });
        if (item) {
            var result = await Dbase.update( models.Post, {status}, { id } );
            debug ("update result :", result);
            return result.count;
        } else {
            debug ("error! no such post="+id);
        }
        return 0;
    }

    async initUsersFromWechat () {
        // 1: get all followers.
        // 2: get followers infos every 100 user.
        // 3: update followers to table Users.
        // 4: if not register, register silently.
        var timeStart = new Date().getTime();
        debug ("updateDatabaseFromWechat start!", new Date().toLocaleDateString());
        var openids = [];
        var next_openid='';
        for (;;) {
            var retobj = await this.wcuser.getFollowers(next_openid);
            if (retobj) {
                if (retobj.errcode && retobj.errcode != 0) {
                    debug ("error! updateDatabaseFromWechat fail!", retobj);
                    return;
                }
                if (!retobj.data || !retobj.data.openid) {
                    debug ("error! updateDatabaseFromWechat no data.openid!", retobj);
                    return;
                }
                openids = openids.concat (retobj.data.openid);
                next_openid = retobj.next_openid;
                if (openids.length >= retobj.total) {
                    debug ("got all openids, count="+openids.length+", total="+retobj.total);
                    break;
                }
            } else {
                debug ("error! not getFollowers!");
                return;
            }
        }
        
        var result = await Dbase.update( models.User, {subscribe: 0}, { subscribe: 1 } );
        if (result.count > 0) {
            debug ("reset all subscribe from 1 to 0!", result);
        } else {
            debug ("no subscribed user!", result);
        }

        // split for groups, every 100 openids as a group.
        var start = 0;
        for (;;) {
            var subarr = openids.slice(start, start + 100);
            start += 100;
            if (subarr.length <= 0) break;
            // batch get user info array.
            var retobj = await this.wcuser.batchGetUsers(subarr);
            if (!retobj || (retobj.errcode && retobj.errcode != 0)) {
                debug ("error! batchGetUsers fail!", retobj);
                return;
            }
            var userInfoList = retobj.user_info_list;
            if (!userInfoList || userInfoList.length <= 0) {
                debug ("error! userInfoList:", userInfoList);
                return;
            }

            // search from db check for whether already exist!
            var dbResult = await Dbase.findAndCountAll(models.User, { where: {openid: {$in: subarr}} });
            var dbItems = dbResult && dbResult.data;
            //debug ("dbItems:", dbItems);
            for (var i = 0; i < userInfoList.length; i++) {
                var userInfo = userInfoList[i];
                var index = -1;
                if (dbItems)
                    index = _.findIndex(dbItems, (o) => (o.openid == userInfo.openid));
                //debug ("index:", index);
                if (index >= 0) {
                    // update.
                    var dbItem = dbItems[index];
                    result = await Dbase.update( models.User, {wechat: userInfo, subscribe: 1}, { id: dbItem.id } );
                    if (result.count != 1) {
                        debug ("warning! updateDatabaseFromWechat update abnormal!", result);
                    } else {
                        debug ("update:", userInfo, dbItem);
                    }
                } else {
                    // register
                    var itemCreated = await Dbase.create (models.User, {nicename: userInfo.nickname, openid: userInfo.openid, subscribe: 1, pass: '123456', status: 3, wechat: userInfo});
                    if (!itemCreated) {
                        debug ("warning! updateDatabaseFromWechat create fail!");
                    } else {
                        debug ("register:", itemCreated);
                    }
                }
            }
        }
        var timeEnd = new Date().getTime();
        debug ("updateDatabaseFromWechat finish:", new Date().toLocaleDateString(), ", elapse:", (timeEnd-timeStart) /1000);
    }

    /*
      {{first.DATA}}

      支付金额：{{orderMoneySum.DATA}}
      商品信息：{{orderProductName.DATA}}
      {{Remark.DATA}}
    */
    async sendTemplatePaySuccess (openid, url, data) {
        return await this.wctemplate.sendTemplate (openid, this.templatePaySucess, url, "#FF0000", data);
    }
    
    /*
      {{first.DATA}}
      活动奖品：{{keyword1.DATA}}
      开奖时间：{{keyword2.DATA}}
      {{remark.DATA}}
    */
    async sendTemplateLuckyResult (openid, url, data) {
        return await this.wctemplate.sendTemplate (openid, this.templateLuckyResult, url, "#FF0000", data);
    }
    
}

export default (new Middleware());
