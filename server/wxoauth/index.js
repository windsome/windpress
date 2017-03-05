import _debug from 'debug'
const debug = _debug('app:server:wxoauth')

import config from '../../config'

export default class Wxoauth {
    constructor (app) {
        // save opts.
        this.app = app;
        this.wechatCfg = config.wechat;
        // init router for apis.
        this.router = require('koa-router')({ prefix: '/apis/wxoauth' });
        this.registerServices();
    }

    registerServices() {
        var router = this.router;
        // database/user
        router.post('/get_state', this.getState.bind(this));
        router.post('/openid', this.getOpenid.bind(this));

        this.app.use(router.routes()).use(router.allowedMethods());
        // save router.
        //this.router = router;
    }

    
    async getState (ctx, next) {
        // deprecated.
        var scope = ctx.request.query.scope || ctx.request.body.scope;
        //var session = ctx.session;
        //console.log ("windsome getState1 ", scope, "session", session);
        // start a new oauth2 flow.
        var state =  Math.random().toString(36).substr(2, 6);
        var wxoauth = {
            appid: this.wechatCfg.appId,
            state: state,
            scope: scope,
        };
        ctx.session.wxoauth = wxoauth;
        debug ("windsome getState2 ", wxoauth);
        ctx.body = wxoauth;
    }

    async getOpenid (ctx, next) {
        //var state = ctx.request.query.state || ctx.request.body.state;
        var code = ctx.request.query.code || ctx.request.body.code;
        var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+this.wechatCfg.appId+'&secret='+this.wechatCfg.appSecret+'&code='+code+'&grant_type=authorization_code';
        var resJson = await this.request(url);
        debug ("resJson:", resJson);
        if (resJson && resJson.openid) {
            ctx.session.wxoauth = resJson;
        } else {
            debug ("error from weixin");
        }
        ctx.body = resJson;
    }

    async request (url, opts, retry) {
        if (typeof retry === 'undefined') {
            retry = 3;
        }

        var data;
        try {
            debug ("request", url, opts, retry);
            var res = await fetch(url, opts || {} );
            data = await res.json();
        } catch (error) { 
            console.log('fetch error: ' + error.message);
            let err = new Error(error.message);
            err.name = 'WeChatAPIError';
            err.code = -1;
            throw err;
        }

        if (data && data.errcode) {
            // get error!
            if (data.errcode === 40001 && retry > 0) {
                // maybe access_token is timeout. update access_token, and retry!
                await this.getAccessToken (true);
                return await this.request(url, opts, retry-1);
            }
            //// need throw Error??
            //let err = new Error(data.errmsg);
            //err.name = 'WeChatAPIError';
            //err.code = data.errcode;
            //throw err;
        }
        return data;
    }
    

}
