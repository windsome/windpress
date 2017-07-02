import _debug from 'debug'
const debug = _debug('app:server:wechat')
debug.log = console.log.bind(console);
import getRawBody from 'raw-body'
import mqtt from 'mqtt'
import _ from 'lodash'

import emitter from './emitter';
import config from '../../config';
import Koa3Wechat from 'koa3-wechat/lib/wechat';
import WechatOauth from 'koa3-wechat/lib/oauth';
import WechatUser from 'koa3-wechat/lib/user';
import WechatPay from 'koa3-wechat/lib/wepay';
import WechatJssdk from 'koa3-wechat/lib/jssdk';
import WechatQrcode from 'koa3-wechat/lib/qrcode';

const MQTT_TOPIC_PREFIX = '/broker/pay/server/';

export default class Wechat {
    constructor (app) {
        // save opts.
        debug ("constructor wechat")
        this.app = app;
        // init router for apis.
        this.router = require('koa-router')({ prefix: '/wcapis/v1' });
        this.init ();
        this.registerServices();
    }

    init () {
        this.msgHandler = new Koa3Wechat({
            token: config.wechat.token, 
            appid: config.wechat.appId, 
            encodingAESKey: config.wechat.encodingAESKey
        });
        this.oauth = new WechatOauth({
            appId: config.wechat.appId, 
            appSecret: config.wechat.appSecret
        });
        this.wcuser = new WechatUser({
            appId: config.wechat.appId, 
            appSecret: config.wechat.appSecret
        });
        this.wepay = new WechatPay (config.wechatPay);
        this.jssdk = new WechatJssdk({
            appId: config.wechat.appId, 
            appSecret: config.wechat.appSecret
        });
        this.qrcode = new WechatQrcode({
            appId: config.wechat.appId, 
            appSecret: config.wechat.appSecret
        });
        this.qrcodes = {
        };

        // init mqtt client.
        this.mqttClient = mqtt.connect ('mqtt://localhost', {
            port: 3883,
            host: 'localhost',
        });
        this.mqttClient.on ('connect', () => {
            debug ('connected mqtt ok!');
            this.mqttConnected = true;
            this.mqttClient.subscribe (MQTT_TOPIC_PREFIX+'#');
        });
        this.mqttClient.on('message', this.processMqttMessageWrap.bind(this));
        this.mqttClient.on('error', (e)=>{
            debug ("mqtt client error:", e);
            this.mqttClient.end();
            this.mqttClient = null;
        });
        // init emitter.
        emitter.onWechatRecv (this.onWechatRecvMsg.bind(this));
    }
    
    registerServices() {
        var router = this.router;
        // for receive xml message from wechat server.
        router.all('/message', this.msgHandler.middleware(this.processWechatMessage.bind(this)));

        // for wechat pay notify message from wechat pay server.
        router.all('/pay_notify', this.payNotify.bind(this));
        router.post('/get_sign_key', this.getSandboxSignKey.bind(this));
        router.post('/get_pay_request_params', this.getPayRequestParams.bind(this));
        router.post('/refund', this.refund.bind(this));

        // for wechat oauth
        router.all('/get_authorize_url', this.getAuthorizeURL.bind(this));
        router.all('/get_authorize_url_website', this.getAuthorizeURLForWebsite.bind(this));
        router.get('/get_user_base', this.getOpenid.bind(this));
        router.post('/get_user_base', this.getOpenid.bind(this));
        router.get('/get_session_user', this.getSessionUser.bind(this));

        // for wechat jssdk
        router.post('/get_sign_package', this.getSignPackage.bind(this));

        // for wechat qrcode
        router.post('/get_temp_qrcode', this.getTempQrcode.bind(this));
        
        // for wechat user
        router.get('/get_followers', async (ctx, next) => {
            var retobj = await this.wcuser.getFollowers();
            ctx.body = retobj;
        });
        router.post('/get_user', async (ctx, next) => {
            var openid = ctx.request.body && ctx.request.body.openid;
            var lang = ctx.request.body && ctx.request.body.lang || 'zh_CN';
            var retobj = await this.wcuser.getUser(openid, lang);
            ctx.body = retobj;
        });
        router.post('/batch_get_users', async (ctx, next) => {
            var openids = ctx.request.body && ctx.request.body.openids;
            var lang = ctx.request.body && ctx.request.body.lang || 'zh_CN';
            var retobj = await this.wcuser.batchGetUsers(openids, lang);
            ctx.body = retobj;
        });

        this.app.use(async (ctx, next) => {
            if(/^\/wcapis/.test(ctx.path)) {
                try {
                    //debug ("start process input path:", ctx.path, ", body:", ctx.request.body);
                    var result = await next();
                    //debug ("end process input path:", ctx.path);
                } catch (e) {
                    debug ("error:",e);
                    //ctx.body = e;
                    ctx.body = { errcode:e.errcode || -1, message: e.message };
                }
            } else {
                await next();
            }
        });
        this.app.use(router.routes()).use(router.allowedMethods());
    }

    ///////////////////////////////////////////////////
    // wechat message.
    ///////////////////////////////////////////////////
    async processWechatMessage(ctx) {
        // 微信输入信息都在this.weixin上
        var message = ctx.weixin;
        debug ("windsome processWechatMessage:", message);

        switch (message.MsgType) {
        case 'event': {
            var event = message.Event && message.Event.toLowerCase();
            switch (event) {
            case 'subscribe': {
                //关注事件
                if (message.EventKey && (message.EventKey.indexOf('qrscene_') >= 0)) {
                    //扫描带参数二维码事件-1. 用户未关注时，进行关注后的事件推送
                    var qrscene = message.EventKey;
                    var sceneId = qrscene.substr ("qrscene_".length);
                    var info = await this.getTempQrcodeInfo (sceneId);
                    debug ("processWechatMessage subscribe qrscene:", qrscene, ", sceneId=", sceneId, ", info=", info);
                    ctx.body=info;
                } else {
                    debug ("normal subscribe, not from scene id.");
                }
                await this.onSubscribe(message.FromUserName);
                break;
            }
            case 'unsubscribe': {
                //取消关注事件
                await this.onUnsubscribe(message.FromUserName);
                break;
            }
            case 'scan': {
                //扫描带参数二维码事件-2. 用户已关注时的事件推送
                var qrscene = message.EventKey;
                debug ("processWechatMessage scan qrscene:"+ qrscene);
                ctx.body="";
                break;
            }
            case 'location': {
                //上报地理位置事件
                break;
            }
            case 'click': {
                //自定义菜单事件-点击菜单拉取消息时的事件推送
                break;
            }
            case 'view': {
                //自定义菜单事件-点击菜单跳转链接时的事件推送
                break;
            }
            default:
                break;
            }
            break;
        }
        case 'text':
            break;
        case 'image':
            break;
        case 'voice':
            break;
        case 'video':
            break;
        case 'location':
            break;
        case 'link':
            break;
        default:
            ctx.body = 'fail';
            break;
        }
        //ctx.body = '';
    }
    async getTempQrcodeInfo (sceneId) {
        var info = this.qrcodes[sceneId];
        if (info) {
            var retobj = [
                {
                    title: info.title,
                    description: info.description,
                    picurl: info.picurl,
                    url: info.url,
                }
            ];
            delete this.qrcodes[sceneId];
            return retobj;
        } else {
            return '';
        }
    }
    async onSubscribe (openid) {
        // 1.get userinfo. 
        // 2.send to coin.
        var retobj = await this.wcuser.getUser(openid);
        if (retobj && (!retobj.errcode || retobj.errcode == 0)) {
            var ret = emitter.wechatSendOut({cmd:'subscribe', payload: retobj});
            debug ("onSubscribe: ", ret);
        }
    }

    async onUnsubscribe (openid) {
        // 1.get userinfo. 
        // 2.send to coin.
        var ret = emitter.wechatSendOut({cmd:'unsubscribe', payload: {openid}});
        debug ("onSubscribe: ", ret);
    }

    ///////////////////////////////////////////////////
    // mqtt.
    ///////////////////////////////////////////////////
    async processMqttMessageWrap (topic, message) {
        try {
            return await this.processMqttMessage(topic, message);
        } catch (e) {
            debug ("processMqttMessage fail!", e.message);
        }
    }
    async processMqttMessage (topic, message) {
        // Process Message published by Lock or App. 
        // ***currently, only Lock publish messages.
        // Lock ---publish---> Service
        var subtopic = topic.substr (topic.indexOf(MQTT_TOPIC_PREFIX) + MQTT_TOPIC_PREFIX.length);
        var subtopics = subtopic.split('/');
        var msgstr = message.toString();
        var msg = JSON.parse(msgstr);
        debug ("topic:", topic, ", subtopic:", subtopic, ", arr:", subtopics, ", msg:",  msg);

    }

    ///////////////////////////////////////////////////
    // wechat pay.
    ///////////////////////////////////////////////////
    async payNotify (ctx, next) {
        var rawText = await getRawBody(ctx.req, {
            encoding: 'utf-8'
        });
        //debug ("get notify: ", rawText);
        try {
            var retobj = await this.wepay.notifyParse (rawText);
            debug ("payNotify parsed:", retobj);
            emitter.wechatSendOut({cmd:'payNotify', payload: retobj});
            var xml = this.wepay.notifyResult({return_code: 'SUCCESS', return_msg: 'OK'});
            debug ("payNotify process ok: ", xml);
            ctx.body = xml;
        } catch (e) {
            debug ("payNotify error: ", e);
            var xml = this.wepay.notifyResult({return_code: 'FAILURE', return_msg: 'FAIL'});
            ctx.body = xml;
        }
    }

    async getSandboxSignKey (ctx, next) {
        var params = await this.wepay.getSignKey ();
        ctx.body = params;
    }

    async getPayRequestParams (ctx, next) {
        var order = ctx.request.body || {};
        var clientIp = ctx.request.ip;
        var conn = ctx.req.connection;
        debug ("remote:", conn.remoteAddress, ":", conn.remotePort, ", local:",conn.localAddress, ":", conn.localPort);
        var params = await this.wepay.getBrandWCPayRequestParams ({ ...order, spbill_create_ip: clientIp });
        emitter.wechatSendOut ({cmd: 'getBrandWCPayRequestParams', payload: {order,params}});
        ctx.body = params;
    }

    async refund (ctx, next) {
        var order = ctx.request.body || {};
        var retobj = await this.wepay.refund ({ ...order });
        debug ("refund result:", retobj);
        ctx.body = retobj;
    }

    ///////////////////////////////////////////////////
    // wechat oauth.
    ///////////////////////////////////////////////////
    async getAuthorizeURL (ctx, next) {
        var ua = ctx.request.headers['user-agent'] || 'unknown';
        debug ("user-agent:", ua);
        var redirect = ctx.request.query.redirect ||ctx.request.body.redirect;
        var state =  Math.random().toString(36).substr(2, 6);
        var scope = ctx.request.query.scope || ctx.request.body.scope || 'snsapi_base';
        var url = this.oauth.getAuthorizeURL (redirect, state, scope);

        debug ("windsome url ", url);
        ctx.body = {url};
    }

    async getAuthorizeURLForWebsite (ctx, next) {
        var redirect = ctx.request.query.redirect ||ctx.request.body.redirect;
        var state =  Math.random().toString(36).substr(2, 6);
        var scope = ctx.request.query.scope || ctx.request.body.scope || 'snsapi_login';
        var url = this.oauth.getAuthorizeURLForWebsite (redirect, state, scope);

        debug ("windsome url ", url);
        ctx.body = {url};
    }

    async getOpenid (ctx, next) {
        var wxoauth = ctx.session && ctx.session.wxoauth;
        if (wxoauth && wxoauth.openid) {
            debug ("warning! already login by openid! return openid in session!");
            ctx.body = wxoauth;
            return;
        }
        var code = ctx.request.query.code || ctx.request.body.code;
        var retobj = await this.oauth.getOauthAccessToken(code);
        if (retobj && retobj.openid) {
            ctx.session.wxoauth = retobj;
            // check & register user.
            // emitter user login. other modules may react to it.
            emitter.wechatSendOut({cmd:'openid', payload: retobj});
        } else {
            debug ("error from weixin", retobj);
        }
        ctx.body = retobj;
    }

    async getSessionUser (ctx, next) {
        var wxoauth = ctx.session && ctx.session.wxoauth;
        if (wxoauth && wxoauth.openid) {
            debug ("warning! already login by openid! return openid in session!");
            ctx.body = wxoauth;
            return;
        } else {
            debug ("warning! no openid in session!");
            ctx.body = {errcode: -1, message: 'no session wechat oauth user.'}
            return;
        }
    }

    ///////////////////////////////////////////////////
    // wechat jssdk.
    ///////////////////////////////////////////////////
    async getSignPackage (ctx, next) {
        console.log ("body:"+JSON.stringify(ctx.request.body));
        var url = ctx.request.body.url;
        var pkg = await this.jssdk.getSignPackage(url);
        console.log ("url="+url+", getSignPackage:"+JSON.stringify(pkg));
        ctx.body = pkg;
    }

    ///////////////////////////////////////////////////
    // wechat qrcode.
    ///////////////////////////////////////////////////
    async getTempQrcode (ctx, next) {
        var info = ctx.request.body;
        var timestamp = parseInt(new Date().getTime() / 1000);
        var keys = _.keys (this.qrcodes);
        //debug ("cached scenes:", this.qrcodes, ", create new:", info);

        // delete expired
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var val = this.qrcodes[key];
            if (val.expire < timestamp) {
                // expire
                delete this.qrcode[key];
            }
        }
        
        keys.sort ();
        var nextSceneId = 0;
        for (var i = 1; i < 100000; i++) {
            var found_i = false;
            for (var j = 0; ((j < keys.length) && (keys[j] <= i)) ; j++) {
                if (keys[j] == i) {
                    found_i = true;
                    break;
                }
            }
            if (!found_i) {
                nextSceneId = i;
                break;
            }
        }
        //debug ("cached scenes after clean expires:", this.qrcodes);
        if (nextSceneId) {
            debug ("nextSceneId:", nextSceneId);
        }

        var scene = await this.qrcode.createTmpQRCode (nextSceneId);

        var expire = timestamp + scene.expire_seconds;
        this.qrcodes[nextSceneId] = { ...info, ticket: scene.ticket, expire };

        // we use timeout of 60 seconds for temp qrcode.
        var qrcodeUrl = this.qrcode.showQRCodeURL(scene.ticket, 120);
        debug ("getTempQrcode current cache:", this.qrcodes);
        ctx.body = {qrcode: qrcodeUrl};
    }

    ///////////////////////////////////////////////////
    // paycmd receive from other modules.
    ///////////////////////////////////////////////////
    async onWechatRecvMsg (obj) {
        debug ("onWechatRecvMsg:", obj);
        var cmd = obj && obj.cmd;
        var payload = obj && obj.payload;
        if (!cmd || !payload) {
            debug ("error! onWechatRecvMsg invalid parameters!");
            return false;
        }
        switch (cmd) {
        case 'closeOrderCmd': {
            var out_trade_no = payload.uuid;
            var result = await this.wepay.closeOrder({out_trade_no});
            debug ("onWechatRecvMsg closeOrderCmd result:", result);
            emitter.wechatSendOut ({cmd: 'closeOrderResult', payload: {order: payload, result}});
            break;
        }
        default: 
            debug ("unknown command!", cmd);
            break;
        }
    }

}
