import config from '../../config';
import _debug from 'debug'
const debug = _debug('app:server:coin:RefundLoop')
import _ from 'lodash';
import moment from 'moment';

import Errcode, * as EC from '../Errcode'
import models from './dbmodels';
import Dbase from './dbBase';
import userHasCaps from './roles';
import Middleware from './middleware';

import Lottery from '../lottery/base';

/**
 * @file   refundLoop.js
 * @author windsome <windsome@windsome>
 * @date   Fri Apr 14 12:17:38 2017
 * 
 * @brief  manage refund Loop. do refund at backend.
 * 
 * 
 */
export default class RefundLoop {
    constructor (app) {
        this.app = app;
        try {
            this.init().then ( ret => {
                debug ("constructor, after init! get all items: ", this.cache);
            })
        } catch (error) {
            debug ("init fail!", error);
        }
    }

    async init () {
        debug ("init begin");
        this.cache = new Set();
        this.db = {};
        var items = await Dbase.findAndCountAll(models.Refund, { 
            where: { status: 1 }
        });
        debug ("init begin 2", items);
        items && items.data && items.data.map (item => {
            if (item) {
                this.cache.add (item.id);
                this.db[item.id] = item;
            }
        })
        debug ("init begin 3");
        this.checkLoop ();
        debug ("init end");
    }
    
    checkLoop () {
        //debug ("checkLoop 1");
        this.checkOnce()
            .then (() => {
                this.checkLoopTimer = setTimeout (this.checkLoop.bind(this), 30000);
                //debug ("checkLoop 2");
            }).catch ((e) => {
                this.checkLoopTimer = setTimeout (this.checkLoop.bind(this), 30000);
                debug ("error! checkLoop: ", e);
            })
    }
    async checkOnce () {
        // wait for lottery result. 
        // then calculate lucky with random1, random2
        // then update random2, lucky, status(6) to post.
        if (this.cache.size > 0) {
            debug ("checkOnce:", this.cache);
            var arr = [...this.cache];
            var start = 0;
            while (start < arr.length) {
                var subarr = arr.slice (start, start+100);
                start += 100;

                if (subarr && subarr.length > 0) {
                    for (var i = 0; i < subarr.length; i++) {
                        var itemId = subarr[i];
                        var item = this.db[itemId];
                        if (item) {
                            var result = await this.refundOne (item);
                            delete this.db[itemId];
                            this.cache.delete(itemId);
                            /*if (result) {
                                debug ("refund ok! remove from cache!");
                                delete this.db[itemId];
                                this.cache.delete(itemId);
                            }*/
                        }
                    }
                }
            }
        }
    }

    async refundOne (item) {
        if (!item) {
            return false;
        }
        var refundObj = {
            out_trade_no: item.orderUuid,
            out_refund_no: item.uuid,
            total_fee: item.totalFee,
            refund_fee: item.refundFee,
        }
        
        var result = null;
        var status = item.status;
        try {
            result = await this.app.wechat.wepay.refund (refundObj);
            if (result.return_code == 'SUCCESS' && result.return_msg == 'OK') {
                status = 2;
            }
        } catch (error) {
            debug ("warning! refund fail! result=", result, ", error=", error, ", try with REFUND_SOURCE_RECHARGE_FUNDS!");
            status = 3;
            try {
                refundObj = { ...refundObj, refund_account:'REFUND_SOURCE_RECHARGE_FUNDS'};
                result = await this.app.wechat.wepay.refund (refundObj);
                if (result.return_code == 'SUCCESS' && result.return_msg == 'OK') {
                    status = 2;
                }
            } catch (error2) {
                debug ("error! refund fail2! result=", result, ", error2=", error2);
                status = 3;
            }
        }
        var result2 = await Dbase.update( models.Refund, { status, detail: result }, { id: item.id } );
        return (status == 2);
    }
    
    insert (items) {
        if (items && !_.isArray(items)) {
            items = [items];
        }
        items && items.map ( item => {
            this.cache.add (item.id);
            this.db[item.id] = item;
        });
    }
}

