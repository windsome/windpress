import config from '../../config';
import _debug from 'debug'
const debug = _debug('app:coin:index')
import _ from 'lodash';
import moment from 'moment';
const crypto = require('crypto');
import qs from 'qs';

import emitter from '../wechat/emitter';
import Errcode, * as EC from '../Errcode'
import models from './dbmodels';
import Dbase from './dbBase';
import userHasCaps from './roles';

import Lottery from '../lottery/base';
import PostLoop from './postLoop';
import RefundLoop from './refundLoop';
import Middleware from './middleware';

const parseUserAgent = (ua) => {
    // Wechat UserAgent: "Mozilla/5.0(iphone;CPU iphone OS 5_1_1 like Mac OS X) AppleWebKit/534.46(KHTML,like Geocko) Mobile/9B206 MicroMessenger/5.0"
    var Sys = {};
    if (ua) {
        ua = ua.toLowerCase();
        var s;
        (s = ua.match(/micromessenger\/([\d.]+)/)) ? Sys.wechat = s[1] :
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
            (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    }
    return Sys;
}

export default class Apis {
    constructor (app) {
        this.app = app;
        // init router for apis.
        this.router = require('koa-router')({ prefix: '/coinapis/v1' });
        this.router2 = require('koa-router')({ prefix: '/coinapis/v2' });
        this.domain = config.domain; // mp.zdili.com
        // init database.
        this.database_status = false;
        models.sequelize.sync()
            .then(async function() {
                // if user `root` not exist, init database.
                var root = await Dbase.findOne(models.User, {id:1});
                if (!root) {
                    // no root. init database.
                    var md5pass = this._md5sum('123456');
                    root = await Dbase.create (models.User, {id: 1, nicename: 'root', pass: md5pass, status: 1, caps:['ROOT','POST_PUBLISH']});
                    var agent = await Dbase.create (models.User, {nicename: 'agent', pass: '123456', status: 2, caps:['POST_PUBLISH','SHOP_AGENT', 'EDIT_POSTS', 'POST_FAVOR', 'MANAGE_REFUNDS','POST_REFUND']});
                    var customer = await Dbase.create (models.User, {id:9, nicename: 'customer', pass: '123456', status: 3, caps:['POST_PUBLISH']});
                    var demo = await Dbase.create (models.User, {id:10, nicename: 'demo', pass: '123456', status: 3, caps:['POST_PUBLISH']});
                    var cust = await Dbase.create (models.User, {id:11, nicename: 'cust', pass: '123456', status: 3});
                    if (!root || !agent || !customer || !demo) {
                        debug ("create user fail!", root, agent, customer, demo);
                    }

                    var post1 = await Dbase.create (models.Post, { status:0, unit: 1, count: 1000, lucky: 0, owner: 1, images:['/images/art1.jpg','/images/art2.jpg']});
                    var post2 = await Dbase.create (models.Post, { status:2, unit: 10, count: 200, lucky: 0, owner: 2, images:['/images/art3.jpg','/images/art4.jpg','/images/art5.jpg']});
                    var post3 = await Dbase.create (models.Post, { status:3, unit: 10, count: 200, lucky: 0, owner: 2, images:['/images/art6.jpg','/images/art7.jpg','/images/art8.jpg','/images/art9.jpg']});
                    var post4 = await Dbase.create (models.Post, { status:1, unit: 10, count: 89, lucky: 0, owner: 2, images:['/images/art0.jpg','/images/art8.jpg','/images/art9.jpg','/images/art1.jpg']});
                    if (!post1 || !post2 || !post3 || !post4) {
                        debug ("create post fail!", post1, post2, post3, post4);
                    }
                    
                }

                var lastOrder = await Dbase.findOne (models.Order, {}, { order: [ ['id', 'DESC'] ], limit:1 });
                if (lastOrder && lastOrder.uuid) {
                    var date = lastOrder.uuid.substr (0, 8);
                    var id = parseInt (lastOrder.uuid.substr (8));
                    this.lastTradeNo = { date, id };
                }
                debug ("lastOrder:", lastOrder, ", lastTradeNo:", this.lastTradeNo);

                var lastRefund = await Dbase.findOne (models.Refund, {}, { order: [ ['id', 'DESC'] ], limit:1 });
                if (lastRefund && lastRefund.uuid) {
                    var date = lastRefund.uuid.substr (0, 8);
                    var id = parseInt (lastRefund.uuid.substr (8));
                    this.lastRefundUuid = { date, id };
                }
                debug ("lastRefund:", lastRefund, ", lastRefundUuid:", this.lastRefundUuid);

                debug ("Middleware.initUsersFromWechat ..."); 
                await Middleware.initUsersFromWechat();

                debug ("init postLoop ...");
                this.postLoop = new PostLoop(this.domain);
                this.refundLoop = new RefundLoop (this.app);

                debug ("windsome coin database init ok!");
                this.database_status = true;
            }.bind(this))
            .catch(function (e) {
                debug ("windsome coin database init fail!", e);
                this.database_status = false;
            }.bind(this));

        this.init();
        this.registerServices();
    }

    async init () {
        debug ("init start");
        this.pageSize = 10;
        //await WpTaxonomy.init();
        //await PostTypeManager.init();
        //await RoleManager.init();
        //await CapGroupManager.init();
        emitter.onFromWechat (this.onFromWechatMsgWrapper.bind(this));
        //this.orderChecker = setInterval (this.orderCheck.bind(this))
        //this.orderCache = [];
        this.orderCache = new Set();
        this.orderCheckLoop ();
        debug ("init end");
    }

    registerServices() {
        var router = this.router;
        var router2 = this.router2;

        router.all('/user/login', this.loginByNicename.bind(this));
        router.all('/user/login_cookie', this.loginByCookie.bind(this));
        router.all('/user/login_phone', this.loginByPhone.bind(this));
        router.all('/user/login_openid', this.loginByOpenid.bind(this));
        router.all('/user/logout', this.logout.bind(this));
        router.all('/user/get_session_user', this.getSessionUser.bind(this));

        router.get('/users/:qs', this.getUsers.bind(this));
        router.get('/users', this.getUsers.bind(this));
        router.post('/searchusers', this.searchUsers.bind(this));
        router.post('/users', this.createUser.bind(this));
        router.put('/users/:id', this.updateUser.bind(this));
        router.delete('/users/:id', this.deleteUser.bind(this));

        router.get('/posts/:qs', this.getPosts.bind(this));
        router.get('/posts', this.getPosts.bind(this));
        router.get('/myposts/:qs', this.getMyPosts.bind(this));
        router.get('/myposts', this.getMyPosts.bind(this));
        router.get('/rootposts/:qs', this.getRootPosts.bind(this));
        router.get('/rootposts', this.getRootPosts.bind(this));
        router.post('/searchposts', this.searchPosts.bind(this));
        router.post('/posts', this.createPost.bind(this));
        router.put('/posts/:id', this.updatePost.bind(this));
        router.delete('/posts/:id', this.deletePost.bind(this));

        router.get('/orders/:qs', this.getOrders.bind(this));
        router.get('/orders', this.getOrders.bind(this));
        router.get('/myorders/:qs', this.getMyOrders.bind(this));
        router.get('/myorders', this.getMyOrders.bind(this));
        router.get('/mylucky/:qs', this.getMyLuckyOrders.bind(this));
        router.get('/mylucky', this.getMyLuckyOrders.bind(this));
        router.post('/orders', this.createOrder.bind(this));
        router.put('/orders/:id', this.updateOrder.bind(this));
        router.delete('/orders/:id', this.deleteOrder.bind(this));
        router2.get('/orders/:qs', this.getOrdersV2.bind(this));

        router.get('/myrefunds/:qs', this.getMyRefunds.bind(this));
        router.get('/myrefunds', this.getMyRefunds.bind(this));
        router.get('/rootrefunds/:qs', this.getRootRefunds.bind(this));
        router.get('/rootrefunds', this.getRootRefunds.bind(this));
        router.post('/post_refund/:postId', this.refundPost.bind(this));

        router.get('/lottery', this.getLotteryResult.bind(this));

        this.app.use(async (ctx, next) => {
            if(/^\/coinapis/.test(ctx.path)) {
                
                try {
                    if (!this.database_status) {
                        debug ("database not ready! try later");
                        throw new Errcode("busy! database not ready! try later!", EC.ERR_BUSY);
                    }
                    //debug ("start process input path:", ctx.path, ", body:", ctx.request.body);
                    var result = await next();
                    //debug ("end process input path:", ctx.path);
                    //debug ("output params:", ctx.params, ", result:", result, ", body:", ctx.body && ctx.body.toJSON());
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
        this.app.use(router2.routes()).use(router2.allowedMethods());
    }

    ///////////////////////////////////////////////////
    // util functions:
    // check whether use has caps, if not will throw an exception.
    ///////////////////////////////////////////////////
    hasCaps (user, caps) {
        if (!user || !user.caps) {
            debug ("user caps is null! return false!", user);
            return false;
        }

        if (!caps || caps.length <= 0) {
            debug ("need none caps, everyone can do.");
            return true;
        }

        // clean need caps.
        if (_.isString(caps)) {
            caps = caps.split(',');
        }
        caps = caps && caps.map (item => {
            return item.toUpperCase();
        });

        // clean user caps.
        var userCaps = user && user.caps;
        if (userCaps && _.isString(userCaps)) {
            // convert old string cap to array.
            userCaps = userCaps.split(',');
        }
        userCaps = userCaps && _.isArray(userCaps) && userCaps.map (item => {
            return item.toUpperCase();
        });

        if (userCaps.indexOf('ROOT') >= 0) {
            debug ("ROOT got! userCaps=", userCaps, ", needCaps=", caps);
            return true;
        }

        var noCaps = [];
        var canDo = userCaps && caps && caps.reduce ((result, cap) => {
            var orCaps = cap.split ('|');
            var canDo1 = false;
            for (var i = 0; i < orCaps.length; i++) {
                var cap1 = orCaps[i];
                if (userCaps.indexOf(cap1) >= 0) {
                    canDo1 = true;
                    break;
                }
            }
            if (!canDo1) {
                debug ("don't has cap="+cap);
                noCaps.push(cap);
            }
            return result && canDo1;
        }, true);

        if (!canDo) {
            debug ("return false! caps can not fullfill! userCaps="+ noCaps.toString() + ", userCaps="+ userCaps.toString());
        }

        return !!canDo; // convert object/null to true/false.
    }
    shouldHasCaps (ctx, caps) {
        var user = ctx.session && ctx.session.user;
        var userId = user && user.id;
        if (!userId) {
            debug ("error! user not login!", user);
            throw new Errcode ("user not login!", EC.ERR_USER_NOT_LOGIN);
        }
        
        var canDo = this.hasCaps (user, caps);
        
        if (!canDo) {
            debug ("error! caps not fullfill! userCaps=", user.caps, ", needCaps=", caps);
            throw new Errcode ("no cap! need: "+ (caps && caps.toString()) + ", userCaps="+ (user.caps && user.caps.toString()), EC.ERR_USER_NO_CAP);
        }

        return canDo;
    }
    isOwner (user, owner) {
        if (!user || !owner) {
            debug ("user or <owner> is null!", user, owner);
            return false;
        }
        return user.id == owner;
    }
    shouldBeOwner (ctx, owner) {
        var user = ctx.session && ctx.session.user;
        if (!user || !user.id) {
            debug ("error! user not login!", user);
            throw new Errcode ("user not login!", EC.ERR_USER_NOT_LOGIN);
        }
        if (user.id != owner) {
            debug ("error! not owner! current user.id=", user.id, ",owner=", owner);
            throw new Errcode ("not owner! current="+user.id+", owner="+owner, EC.ERR_NOT_OWNER);
        }
        return true;
    }

    parseQueryString (args) {
        // GET /users/1
        // GET /users/<query=xxx>;<page=1>;<order=status+&createAt+>
        var options = { where: {}, order: [ ['id', 'ASC'] ], limit: this.pageSize };
        var params = null;
        if (!args) {
            // GET /users
        } else if  (params = args.match(/(^\d+$)/)) {
            // GET /users/1
            options.where.id = parseInt(params[1]);
        } else if (!_.isEmpty(args)) {
            params = _.split(args, ';')
            // GET /users/<attr=xxx>;<page=1>;<order=createAt+>;
            params.map ((param)=>{
                // parse special query: page/order
                var qs = param.match(/([^=]*)=(.*$)/);
                //debug ("qs:", qs);
                var key = qs[1];
                var value = qs[2];
                if (key == 'page') {
                    var page = _.toNumber(value);
                    if (_.isNaN(page)) page = 0;
                    options.offset = this.pageSize * page;
                    options.limit = this.pageSize;
                } else if (key == 'order') {
                    if (value && value.length > 0) {
                        //var attrs = _.words(value);
                        //var attr = attrs[0];
                        var attr = value.replace(/([+|-])/, "");
                        var direct = value.charAt(value.length-1);
                        if (direct == '+') {
                            options.order = [ [attr, 'ASC'] ];
                        } else {
                            options.order = [ [attr, 'DESC'] ];
                        }
                    }
                } else {
                    var valarr = value.match(/^\[(.*)\]$/);
                    debug ("value:", value, ", valarr:", valarr);
                    if (valarr) {
                        var params2 = _.split(valarr[1], ',');
                        debug ("get array: ", valarr[1], ", params2:", params2);
                        options.where[key] = { $in: params2 };
                    } else {
                        options.where[key] = value;
                    }
                }
            });
        }
        return options;
    }

    _md5sum (values) {
        var md5sum = crypto.createHash('md5');
        md5sum.update(values);
        return md5sum.digest('hex').toUpperCase();
    }


    ///////////////////////////////////////////////////
    // service functions.
    ///////////////////////////////////////////////////
    async loginByCookie (ctx, next) {
        var user = ctx.session.user;
        if (!user) {
            throw new Errcode("user not login, maybe session expired!", EC.ERR_USER_NOT_LOGIN);
        } else {
            var user2 = await Dbase.findOneV2(models.User, { where:{ id: user.id } });
            if (!user2) {
                throw new Errcode("no such user in db! user.id="+user2.id, EC.ERR_USER_AUTH_NO_USER);
            }
            var { pass, ...userinfo } = user2;
            ctx.session.user = userinfo;
            ctx.body = { ...userinfo };
            return ;
        }

        //ctx.body = { ...user };
    }
    async loginByNicename (ctx, next) {
        var args = ctx.request.body;
        if (!args || !args.nicename || !args.pass) {
            throw new Errcode("parameter missing! nicename or pass, nicename="+args.nicename, EC.ERR_USER_AUTH_WRONG_PASS);
        }

        var user = await Dbase.findOneV2(models.User, { where:{ nicename:args.nicename } });
        if (!user) {
            throw new Errcode("no such user! nicename="+args.nicename, EC.ERR_USER_AUTH_NO_USER);
        }
        if (!user.pass) {
            throw new Errcode("user's password not set! should set in wechat! nicename="+args.nicename, EC.ERR_USER_AUTH_WRONG_PASS);
        }

        var md5pass = this._md5sum (args.pass);
        if (md5pass != user.pass) {
            throw new Errcode("password wrong! nicename="+args.nicename, EC.ERR_USER_AUTH_WRONG_PASS);
        }
        //debug ("session:", ctx.session);
        var {pass, ...userinfo} = user;
        ctx.session.user = userinfo;
        ctx.body = { ...userinfo };
    }
    async loginByPhone (ctx, next) {
        var args = ctx.request.body;
        if (!args || !args.phone || !args.pass) {
            throw new Errcode("parameter missing! phone or pass, phone="+args.phone, EC.ERR_USER_AUTH_WRONG_PASS);
        }
        var user = await Dbase.findOneV2(models.User, { where:{ phone:args.phone } });
        if (!user) {
            throw new Errcode("no such user! phone="+args.phone, EC.ERR_USER_AUTH_NO_USER);
        }
        if (!user.pass) {
            throw new Errcode("user's password not set! should set in wechat! nicename="+args.nicename, EC.ERR_USER_AUTH_WRONG_PASS);
        }

        var md5pass = this._md5sum (args.pass);
        if (md5pass != user.pass) {
            throw new Errcode("password wrong! phone="+args.phone, EC.ERR_USER_AUTH_WRONG_PASS);
        }

        //debug ("session:", ctx.session);
        var {pass, ...userinfo} = user;
        ctx.session.user = userinfo;
        ctx.body = { ...userinfo };
    }
    async loginByOpenid (ctx, next) {
        var args = ctx.request.body;
        var user = null;
        if (args.openid)
            user = await Dbase.findOneV2(models.User, { where:{ openid:args.openid } });
        if (!user) {
            throw new Errcode("no such user "+args.login, EC.ERR_USER_AUTH_NO_USER);
        }
        //debug ("session:", ctx.session);
        var { pass, ...userinfo } = user;
        ctx.session.user = userinfo;
        ctx.body = { ...userinfo };
    }
    async logout (ctx, next) {
        //var user = ctx.request.body;
        if (ctx.session.user) {
            ctx.session.user = null;
        }
        debug ("session:", ctx.session);

        ctx.body = { errcode: 0 };
    }

    async getSessionUser (ctx, next) {
        var user = ctx.session && ctx.session.user;
        if (user && user.id) {
            debug ("warning! already login! return user in session!");
            var user2 = await Dbase.findOneV2(models.User, { where:{ id: user.id } });
            if (!user2) {
                throw new Errcode("no such user! user.id="+user2.id, EC.ERR_USER_AUTH_NO_USER);
            }
            var { pass, ...userinfo } = user2;
            ctx.session.user = userinfo;
            ctx.body = { ...userinfo };
            return;
        } else {
            debug ("warning! no user in session!");
            ctx.body = {errcode: -1, message: 'no session coin user.'}
            return;
        }
    }

    async getUsers (ctx, next) {
        // GET /users
        // GET /users/1
        // GET /users/<query=xxx>;<page=1>;<order=createAt+>;
        var options = this.parseQueryString(ctx.params.qs);
        debug ("options:", options);
        var items = await Dbase.findAndCountAll(models.User, options);
        ctx.body = items;
    }
    async searchUsers (ctx, next) {
        // POST /searchuser {key:'112', page: 0}
        var args = ctx.request.body;
        var page = args && args.page && parseInt(args.page) || 0;
        var keys = args && args.key && args.key.trim() || '';
        var orconds = [];
        keys.split(' ').map (key=>{
            orconds.push ({ id: { $like: '%'+key+'%' } });
            orconds.push ({ openid: { $like: '%'+key+'%' } });
            orconds.push ({ nicename: { $like: '%'+key+'%' } });
            orconds.push ({ phone: { $like: '%'+key+'%' } });
            orconds.push ({ address: { $like: '%'+key+'%' } });
        })

        var options = {
            where: {
                $or: orconds,
            },
            offset: this.pageSize * page,
            limit: this.pageSize,
            order: [['id', 'DESC']],
        }
        if (!keys) options.where = {};
        debug ("searchPosts:", keys, ", keylen="+keys.length+", page="+page+", options:", JSON.stringify(options));
        
        var items = await Dbase.findAndCountAll(models.User, options);
        ctx.body = items;
    }
    async createUser (ctx, next) {
        this.shouldHasCaps (ctx, "edit_users");
        var args = ctx.request.body;
        var md5pass = this._md5sum (args.pass || '123456');
        var item = await Dbase.create(models.User, { ...args, pass: md5pass });
        ctx.body = item;
    }
    async updateUser (ctx, next) {
        //this.shouldHasCaps (ctx, "edit_users");
        var id = ctx.params.id;
        var args = ctx.request.body;
        if (!id || !args) {
            throw new Errcode ("param error! id="+id+", args="+args, EC.ERR_PARAM_ERROR);
        }
        if (args.nicename) {
            // if need to change nicename, should find if exist!
            var items = await Dbase.findAndCountAll(models.User, { where: { nicename: args.nicename, id: { $ne: id } } });
            if (items && items.count > 0) {
                debug ("error! duplicated nicename! nicename="+args.nicename);
                throw new Errcode ("nicename alreay exist! nicename="+args.nicename, EC.ERR_USER_DUP_LOGIN);
            }
        }
        var item = await Dbase.findOne (models.User, {id});
        if (item) {
            if (item.nicename == 'root') {
                if (args.nicename && (item.nicename != args.nicename)) {
                    debug ("error! 'root' can't change its name! nicename="+args.nicename);
                    throw new Errcode ("'root' user can't change its name! nicename="+args.nicename, EC.ERR_NOT_ALLOW);
                }
                if (!_.isUndefined(args.caps)) {
                    // if update caps, should ROOT cap.
                    if (args.caps) {
                        if (_.isArray(args.caps) && (args.caps.indexOf ('ROOT') >= 0)) {
                            debug ("change root caps to:"+args.caps.toString());
                        } else {
                            debug ("error! should not remove cap 'ROOT' from user root!");
                            throw new Errcode ("not allow! 'root' can remove cap from its caps! nicename="+args.nicename, EC.ERR_NOT_ALLOW);
                        }
                    }
                }
            }
            if (!_.isUndefined(args.caps)) {
                // if update caps, should ROOT cap.
                var capChanged = _.difference (args.caps, item.caps);
                if (capChanged && (capChanged.length > 0)) {
                    debug ("warning, change caps need edit_users cap!");
                    this.shouldHasCaps (ctx, "edit_users");
                }
            }
            if (!_.isUndefined(args.status)) {
                // if update status, should edit_users cap.
                if (args.status != item.status) {
                    debug ("warning, change status need edit_users cap!");
                    this.shouldHasCaps (ctx, "edit_users");
                }
            }
            if (!_.isUndefined(args.pass)) {
                // if update status, should edit_users cap.
                var amOwner = this.isOwner(ctx.session.user, item.id);
                if (!amOwner) {
                    var isRoot = this.hasCaps(ctx.session.user, 'ROOT');
                    if (!isRoot) {
                        debug ("error! user is neither owner nor ROOT!");
                        throw new Errcode ("user is neither owner nor ROOT!", EC.ERR_USER_NO_CAP);
                    }
                }
                var md5pass = this._md5sum(args.pass);
                args.pass = md5pass;
            }

            var result = await Dbase.update( models.User, {...item, ...args}, { id } );
            debug ("update result :", result);
            ctx.body = result;
        } else {
            throw new Errcode ( "no such user "+id, EC.ERR_NO_SUCH_ENTITY );
        }
    }
    async deleteUser (ctx, next) {
        this.shouldHasCaps (ctx, "manage_users");
        var id = ctx.params.id;
        var ret = await Dbase.destroy(models.User, {id});
        ctx.body = ret;
    }

    async getPosts (ctx, next) {
        // GET /posts
        // GET /posts/1
        // GET /posts/<query=xxx>;<page=1>;<order=createAt+>;
        var options = this.parseQueryString(ctx.params.qs);
        debug ("options:", options);
        var items = await Dbase.findAndCountAll(models.Post, options);
        ctx.body = items;
    }
    async getPublishedPosts (ctx, next) {
        // GET /posts
        // GET /posts/1
        // GET /posts/<query=xxx>;<page=1>;<order=createAt+>;
        var options = this.parseQueryString(ctx.params.qs);
        options.where.status = 2;
        debug ("options:", options);
        var items = await Dbase.findAndCountAll(models.Post, options);
        ctx.body = items;
    }
    async getMyPosts (ctx, next) {
        // GET /posts
        // GET /posts/1
        // GET /posts/<query=xxx>;<page=1>;<order=createAt+>;
        var userId = ctx.session.user && ctx.session.user.id;
        if (!userId) {
            debug ("error! user not login!", ctx.session.user);
            throw new Errcode ("user not login!", EC.ERR_USER_NOT_LOGIN);
        }
        var options = this.parseQueryString(ctx.params.qs);
        if (options && options.where) options.where.owner = userId;
        else if (options) options.where = { owner:userId }
        else options = { where: { owner:userId } }
        debug ("qs:", ctx.params.qs, "options:", options);

        var items = await Dbase.findAndCountAll(models.Post, options);
        ctx.body = items;
    }
    async getRootPosts (ctx, next) {
        // GET /posts
        // GET /posts/1
        // GET /posts/<query=xxx>;<page=1>;<order=createAt+>;
        this.shouldHasCaps (ctx, "root");
        var options = this.parseQueryString(ctx.params.qs);
        debug ("qs:", ctx.params.qs, "options:", options);
        var items = await Dbase.findAndCountAll(models.Post, options);
        ctx.body = items;
    }
    async searchPosts (ctx, next) {
        // POST /searchposts {key:'黄山', page: 0}
        var args = ctx.request.body;
        var page = args && args.page && parseInt(args.page) || 0;
        var keys = args && args.key && args.key.trim().split(' ') || [];
        var orconds = keys.map (key=>{
            return { desc: { $like: '%'+key+'%' } }
        })

        var options = {
            where: {
                $or: orconds,
                status: 2,
            },
            offset: this.pageSize * page,
            limit: this.pageSize,
            order: [['id', 'DESC']],
        }
        //if (!keys || _.isEmpty(keys)) options.where = {};
        debug ("searchPosts:", keys, ", keylen="+keys.length+", page="+page+", options:", JSON.stringify(options));
        
        var items = await Dbase.findAndCountAll(models.Post, options);
        ctx.body = items;
    }
    async createPost (ctx, next) {
        this.shouldHasCaps (ctx, "edit_posts");
        var userId = ctx.session.user && ctx.session.user.id;
        if (!userId) {
            debug ("error! should not reach here! not login!", ctx.session.user);
            throw new Errcode ("user not login!", EC.ERR_USER_NOT_LOGIN);
        }
        var args = ctx.request.body;
        //if (!args || !args.uuid) {
        //    throw new Errcode ("param error! need post uuid ", EC.ERR_PARAM_ERROR);
        //}
        if (!args || !args.count || !args.unit) {
            throw new Errcode ("missing count or unit! should not be 0", EC.ERR_MISS_REQUIRE);
        }

        var random1 = Math.floor(Math.random() * parseInt(args.count || 0))
        var item = await Dbase.create(models.Post, {...args, random1, owner: userId, status:0});
        ctx.body = item;
    }
    async updatePost (ctx, next) {
        this.shouldHasCaps (ctx, "edit_posts");
        var id = ctx.params.id;
        var args = ctx.request.body;
        if (!id || !args) {
            throw new Errcode ("param error! id="+id+", args="+args, EC.ERR_PARAM_ERROR);
        }

        var item = await Dbase.findOne (models.Post, { id });
        if (item) {
            if (!_.isUndefined(args.status) && (args.status != item.status)) {
                debug ("warning! change status!");
                var nextStatus = args.status;
                if (_.indexOf ([0, 1], nextStatus) >= 0) {
                    debug ("waring! change status to "+nextStatus+" need SHOP_AGENT cap!")
                    this.shouldHasCaps (ctx, "SHOP_AGENT");
                }
                if (_.indexOf ([2, 3], nextStatus) >= 0) {
                    debug ("waring! change status to "+nextStatus+" need POST_PUBLISH cap!")
                    this.shouldHasCaps (ctx, "POST_PUBLISH");
                }
                if (nextStatus == 7) {
                    debug ("waring! change status to "+nextStatus+" need POST_PUBLISH cap!")
                    this.shouldHasCaps (ctx, "POST_REFUND");
                }
            }
            if (!_.isUndefined(args.favor) && (args.favor != item.favor)) {
                debug ("warning, change favor need POST_FAVOR cap!");
                this.shouldHasCaps (ctx, "POST_FAVOR");
            }

            var updated = {...item, ...args};
            if (!updated || !updated.count || !updated.unit) {
                throw new Errcode ("missing count or unit, should not be 0!", EC.ERR_MISS_REQUIRE);
            }

            var result = await Dbase.update( models.Post, updated, { id } );
            debug ("update result :", result);
            ctx.body = result;
        } else {
            throw new Errcode ( "no such item "+id, EC.ERR_NO_SUCH_ENTITY );
        }
    }
    async deletePost (ctx, next) {
        this.shouldHasCaps (ctx, "manage_posts");
        var userId = ctx.session.user && ctx.session.user.id;
        if (!userId) {
            debug ("error! should not reach here! not login!", ctx.session.user);
            throw new Errcode ("user not login!", EC.ERR_USER_NOT_LOGIN);
        }
        var id = ctx.params.id;
        var item = await Dbase.findOne (models.Post, { id });
        if (item) {
            if (item.owner == userId) {
                var ret = await Dbase.destroy(models.Post, {id});
                if (ret && ret.count > 0)
                    debug ("delete post ok! id="+id, ret);
                ctx.body = ret;
            } else {
                throw new Errcode ( "error! you are not the post owner! id="+id, EC.ERR_USER_NO_CAP );
            }
        } else {
            throw new Errcode ( "no such item "+id, EC.ERR_NO_SUCH_ENTITY );
        }
    }

    async getOrders (ctx, next) {
        // GET /orders
        // GET /orders/1
        // GET /orders/<query=xxx>;<page=1>;<order=createAt+>;
        //this.shouldHasCaps (ctx, "manage_orders");
        var options = this.parseQueryString(ctx.params.qs);
        debug ("options:", options);
        var items = await Dbase.findAndCountAll(models.Order, options);
        ctx.body = items;
    }
    async getMyOrders (ctx, next) {
        // GET /orders
        // GET /orders/1
        // GET /orders/<query=xxx>;<page=1>;<order=createAt+>;

        //this.shouldHasCaps (ctx, "manage_orders");
        var userId = ctx.session.user && ctx.session.user.id;
        if (!userId) {
            debug ("error! should not reach here! not login!", ctx.session.user);
            throw new Errcode ("user not login!", EC.ERR_USER_NOT_LOGIN);
        }
        var options = this.parseQueryString(ctx.params.qs);
        if (options && options.where) options.where.userId = userId;
        else if (options) options.where = { userId }
        else options = { where: { userId } }
        debug ("qs:", ctx.params.qs, "options:", options);
        var items = await Dbase.findAndCountAll(models.Order, options);
        ctx.body = items;
    }
    async getMyLuckyOrders (ctx, next) {
        // 1: get all my orders.
        // 2: get all order associated post.
        // 3: find lucky orders. (post's lucky is defined, and match order.)
        var userId = ctx.session.user && ctx.session.user.id;
        if (!userId) {
            debug ("error! user not login!", ctx.session.user);
            throw new Errcode ("user not login!", EC.ERR_USER_NOT_LOGIN);
        }
        var options = this.parseQueryString(ctx.params.qs);
        if (options && options.where) options.where.userId = userId;
        else if (options) options.where = { userId }
        else options = { where: { userId } }
        options.where.status = 2;
        debug ("qs:", ctx.params.qs, "options:", options);

        var items = await Dbase.findAndCountAll(models.Order, options);
        var lucky = items;
        if (items && items.data) {
            var postIds = new Set ();
            items.data.map (item => {
                postIds.add(item.postId);
            });
            //debug ("postIds:", postIds);
            var posts = await Dbase.findAndCountAll(models.Post, { where: {id: {$in: [...postIds]}, status:6} });
            var postMap = {};
            posts && posts.data && posts.data.map ( post => {
                postMap[post.id] = post;
            });
            debug ("postMap:", postMap);
            
            var luckyArr = [];
            for (var i = 0; i< items.data.length; i++) {
                var item = items.data[i];
                var post = postMap[item.postId];
                if (item && post) {
                    if ((post.lucky >= item.serial) && (post.lucky < (item.serial + item.count))) {
                        debug ("get a lucky order!");
                        luckyArr.push (item);
                    }
                }
            }
            //debug ("luckyArr:", luckyArr);
            ctx.body = {count: luckyArr.length, date: items.date, data: luckyArr};
        } else {
            //debug ("no lucky orders!");
            ctx.body = {count: 0, date: items.date, data: []};
        }
    }
    async createOrder (ctx, next) {
        var userId = ctx.session.user && ctx.session.user.id;
        if (!userId) {
            debug ("error! user not login!", ctx.session.user);
            throw new Errcode ("user not login!", EC.ERR_USER_NOT_LOGIN);
        }
        var args = ctx.request.body;
        //if (!args || !args.uuid) {
        //    throw new Errcode ("param error! need order uuid ", EC.ERR_PARAM_ERROR);
        //}
        var items = await Dbase.findAndCountAll(models.Order, {
            where: {
                postId: args.postId,
                status: {$in: [1, 2]},
            },
            order: [ ['id', 'DESC'] ]
        });
        var allpay = 0;
        items && items.data && items.data.map ((it) => {
            allpay += it.count;
        });

        var total = 0;
        var item = await Dbase.findOne (models.Post, { id: args.postId });
        if (item) {
            total = item.count;
        }

        if ((allpay + args.count) <= total) {
            item = await Dbase.create(models.Order, { ...args, uuid: this._createOutTradeNo(), userId });
        } else {
            debug ("total:"+total+", allpay:"+allpay+", want:"+args.count);
            throw new Errcode ("order count overflow!" + ctx.session.user, EC.ERR_ORDER_COUNT_OVERFLOW);
        }
        ctx.body = item;
    }
    async updateOrder (ctx, next) {
        this.shouldHasCaps (ctx, "edit_orders");
        var userId = ctx.session.user && ctx.session.user.id;
        if (!userId) {
            debug ("error! user not login!", ctx.session.user);
            throw new Errcode ("user not login!", EC.ERR_USER_NOT_LOGIN);
        }

        var id = ctx.params.id;
        var args = ctx.request.body;
        if (!id || !args) {
            throw new Errcode ("param error! id="+id+", args="+args, EC.ERR_PARAM_ERROR);
        }

        var item = await Dbase.findOne (models.Order, { id });
        if (item) {
            var result = await Dbase.update( models.Order, {...item, ...args}, { id } );
            debug ("update result :", result);
            ctx.body = result;
        } else {
            throw new Errcode ( "no such item "+id, EC.ERR_NO_SUCH_ENTITY );
        }
    }
    async deleteOrder (ctx, next) {
        this.shouldHasCaps (ctx, "manage_orders");
        var userId = ctx.session.user && ctx.session.user.id;
        if (!userId) {
            debug ("error! user not login!", ctx.session.user);
            throw new Errcode ("user not login!", EC.ERR_USER_NOT_LOGIN);
        }

        var id = ctx.params.id;
        var item = await Dbase.findOne (models.Order, { id });
        if (item) {
            if (item.userId == userId) {
                var ret = await Dbase.destroy(models.Order, {id});
                if (ret && ret.count > 0)
                    debug ("delete order ok! id="+id, ret);
                ctx.body = ret;
            } else {
                throw new Errcode ( "error! you are not the order owner! id="+id, EC.ERR_USER_NO_CAP );
            }
        } else {
            throw new Errcode ( "no such item "+id, EC.ERR_NO_SUCH_ENTITY );
        }
    }

    async getOrdersV2 (ctx, next) {
        // GET /orders/<json>;
        var options = JSON.parse(decodeURIComponent(ctx.params.qs));
        debug ("getOrdersV2 options:", options);
        var items = await Dbase.findAndCountAll(models.Order, options);
        ctx.body = items;
    }

    async getRefunds (ctx, next) {
        // GET /refunds
        // GET /refunds/1
        // GET /refunds/<query=xxx>;<page=1>;<order=createAt+>;
        // view all refunds, should has cap: manage_refunds.
        this.shouldHasCaps (ctx, "manage_refunds");
        var options = this.parseQueryString(ctx.params.qs);
        debug ("options:", options);
        var items = await Dbase.findAndCountAll(models.Refund, options);
        ctx.body = items;
    }
    async getMyRefunds (ctx, next) {
        // GET /myrefunds
        // GET /myrefunds/1
        // GET /myrefunds/<query=xxx>;<page=1>;<order=createAt+>;
        var userId = ctx.session.user && ctx.session.user.id;
        if (!userId) {
            debug ("error! should not reach here! not login!", ctx.session.user);
            throw new Errcode ("user not login!", EC.ERR_USER_NOT_LOGIN);
        }
        var options = this.parseQueryString(ctx.params.qs);
        if (options && options.where) options.where.userId = userId;
        else if (options) options.where = { userId }
        else options = { where: { userId } }
        debug ("qs:", ctx.params.qs, "options:", options);
        var items = await Dbase.findAndCountAll(models.Refund, options);
        ctx.body = items;
    }
    async getRootRefunds (ctx, next) {
        // GET /refunds
        // GET /refunds/1
        // GET /refunds/<query=xxx>;<page=1>;<order=createAt+>;
        // view all refunds, should has cap: manage_refunds.
        this.shouldHasCaps (ctx, "manage_refunds");
        var options = this.parseQueryString(ctx.params.qs);
        debug ("options:", options);
        var items = await Dbase.findAndCountAll(models.Refund, options);
        ctx.body = items;
    }
    async refundPost (ctx, next) {
        // only post with status 4/5/6 can be refund.
        this.shouldHasCaps (ctx, "manage_refunds");
        var postId = ctx.params.postId;
        if (!postId) {
            debug ("error! param postId is null!");
            throw new Errcode ("param postId is null!", EC.ERR_PARAM_ERROR);
        }

        var item = await Dbase.findOne (models.Post, { id: postId });
        var status = item && item.status;
        if (_.indexOf([4,5,6],status) < 0) {
            debug ("error! post status="+status+" not allow to do refund!");
            throw new Errcode ("post in not allowed status!", EC.ERR_NOT_ALLOW);
        }

        if (!(this.app && this.app.wechat && this.app.wechat.wepay)) {
            debug ("error! wechat.wepay not exist!")
            throw new Errcode ("wechat.wepay not exist!", EC.ERR_SYSTEM_ERROR);
        }
        
        var countCancel = 0;
        var countCancelFail = 0;
        var items = await Dbase.findAndCountAll(models.Order, {
            where: {
                postId: postId,
                status: 1,
            },
            order: [ ['id', 'DESC'] ]
        });
        
        if (items && items.data) {
            countCancel = items.data.length;
            // 状态为1的订单，取消支付
            // TODO: if some order is paid, howto deal with?
            for (var i = 0; i < items.data.length; i++) {
                var order = items.data[i];
                var out_trade_no = order.uuid;
                var result = await this.wepay.closeOrder({out_trade_no});
                if (result && result.return_code == 'SUCCESS') {
                } else {
                    debug ("error! closeOrder fail! ret=", result);
                    countCancelFail ++;
                }
            }
        }

        var countRefund = 0;
        var countRefundFail = 0;
        items = await Dbase.findAndCountAll(models.Order, {
            where: {
                postId: postId,
                status: 2,
            },
            order: [ ['id', 'DESC'] ]
        });
        
        if (items && items.data) {
            // 状态为2的订单，退款
            countRefund = items.data.length;
            var refundList = [];
            var requestUserId = ctx.session.user && ctx.session.user.id;
            for (var i = 0; i < items.data.length; i++) {
                var order = items.data[i];
                var refund_uuid = this._createRefundUuid ();
                // generate a refund. then wepay.refund.
                var refund = {
                    uuid: refund_uuid,
                    totalFee: order.fee,
                    refundFee: order.fee,
                    orderUuid: order.uuid,
                    orderId: order.id,
                    userId: order.userId,
                    //openid: order.openid,
                    postId: order.postId,
                    status: 1,
                    requestUserId,
                    requestTime: new Date(),
                    issueUserId: requestUserId,
                    issueTime: new Date()
                };
                var refundInDb = await Dbase.create(models.Refund, refund);
                refund.id = refundInDb.id;
                //refundList.push (refundInDb);
                refundList.push (refund);
            }
            
            this.refundLoop && refundList && this.refundLoop.insert (refundList);
            /*
            for (var i = 0; i < refundList.length; i++) {
                var refund = refundList[i];
                var refundObj = {
                    out_trade_no: refund.orderUuid,
                    out_refund_no: refund.uuid,
                    total_fee: refund.totalFee,
                    refund_fee: refund.refundFee,
                    //sub_openid
                }
                
                var result = null;
                var status = refund.status;
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
                        countRefundFail++;
                    }
                }
                var result2 = await Dbase.update( models.Refund, { status, detail: result }, { id: refund.id } );
            }
            */
        }

        debug ("refund request already send out! update post="+postId+" status "+item.status+">7, countCancel="+countCancel+", countRefund="+countRefund+", countCancelFail="+countCancelFail+", countRefundFail="+countRefundFail);
        var result = await Dbase.update( models.Post, { status: 7 }, { id: postId } );
        ctx.body = {postId:postId, count:(countCancel+countRefund), countCancel, countCancelFail, countRefund, countRefundFail};
    }


    ///////////////////////////////////////////////////
    // util functions.
    ///////////////////////////////////////////////////
    _createOutTradeNo () {
        // 获取一个单号(order uuid).作为与微信支付交互的标识，全局唯一
        var nextTradeNo = { 
            date: moment().format("YYYYMMDD"),
            id: 1
        }
        if (this.lastTradeNo && nextTradeNo.date == this.lastTradeNo.date) {
            nextTradeNo.id = this.lastTradeNo.id + 1;
        }
        this.lastTradeNo = nextTradeNo;
        var tradeNo = new Array(6 - (""+nextTradeNo.id).length + 1).join("0") + nextTradeNo.id;
        return nextTradeNo.date+tradeNo;
    }

    _createRefundUuid () {
        // 获取一个单号(order uuid).作为与微信支付交互的标识，全局唯一
        var nextRefundUuid = { 
            date: moment().format("YYYYMMDD"),
            id: 1
        }
        if (this.lastRefundUuid && nextRefundUuid.date == this.lastRefundUuid.date) {
            nextRefundUuid.id = this.lastRefundUuid.id + 1;
        }
        this.lastRefundUuid = nextRefundUuid;
        var tradeNo = new Array(6 - (""+nextRefundUuid.id).length + 1).join("0") + nextRefundUuid.id;
        return nextRefundUuid.date+tradeNo;
    }

    ///////////////////////////////////////////////////
    // message emit from wechat module.
    ///////////////////////////////////////////////////
    async onFromWechatMsgWrapper (obj) {
        try {
            return await this.onFromWechatMsg(obj);
        } catch (error) {
            debug ("error is ", error);
        }
    }
    async onFromWechatMsg (obj) {
        debug ("onFromWechatMsg:", obj);
        var cmd = obj && obj.cmd;
        var payload = obj && obj.payload;
        if (!cmd || !payload) {
            debug ("error! onFromWechatMsg invalid parameters!");
            return false;
        }
        switch (cmd) {
        case 'payNotify': {
            var uuid = payload.out_trade_no;
            if(uuid && payload.result_code == 'SUCCESS') {
                debug ("onFromWechatMsg payNotify: receive a payment!", payload);
                // set
                var item = await Dbase.findOne (models.Order, { uuid }, { order: [ ['id', 'DESC'] ]});
                if (item) {
                    // search all orders which already paid
                    var orderCountSum = 0;
                    var postId = item.postId;
                    var items = await Dbase.findAndCountAll(models.Order, {
                        where: {
                            postId,
                            status:2,
                        }
                    });
                    items && items.data && items.data.map(item => {
                        orderCountSum += item.count;
                    });

                    var orderOwner = await Dbase.findOne (models.User, { id: item.userId });
                    var orderOwnerOpenid = orderOwner && orderOwner.openid;
                    // get post count.
                    var postCount = 0;
                    var artwork = await Dbase.findOne (models.Post, { id: postId });
                    if (artwork) {
                        postCount = artwork.count;
                        var postOwner = artwork.owner;
                        // send template message to user.
                        if (orderOwnerOpenid && postOwner) {
                            var fee = new Number(item.fee / 100).toFixed(2);
                            var postName = artwork.desc && artwork.desc.name || '未命名';
                            var url = "http://"+this.domain+"/coin/shop/"+postOwner+"/"+artwork.id;
                            try {
                                var ret2 = await Middleware.sendTemplatePaySuccess(orderOwnerOpenid, url, { first: { value:'我们已收到您的款项！', color:'#173177' }, orderMoneySum: { value:fee+'元', color:'#173177' }, orderProductName: { value: '编号'+artwork.id+':'+postName, color:'#173177' }, Remark: { value:'如有问题请致电13661989491或直接在微信留言，小易将第一时间为您服务！', color:'#173177' } });
                                debug ("sendTemplatePaySuccess result:", ret2);
                            } catch (error) {
                                debug ("error! TODO! send template pay success message fail! may need send next time!", error);
                            }
                        } else {
                            debug ("error! not get order openid or post owner, not send user template message!");
                        }
                    } else {
                        debug ("warning! not find post! id="+postId);
                    }
                    
                    // insert post count.
                    var result = await Dbase.update( models.Order, { status: 2, serial: (orderCountSum+1) }, { id: item.id } );
                    this.orderCache.delete (item.uuid);
                    debug ("onFromWechatMsg payNotify: update order status => 2, ", item);
                    orderCountSum += item.count;

                    debug ("update post "+postId+" 's 'paid' to "+orderCountSum);
                    var result2 = await Dbase.update( models.Post, { paid: orderCountSum }, { id: postId } );
                    if (!(result2 && result2.count == 1)) {
                        debug ("warning! payNotify, update post none! postId="+postId, result2);
                    }
                    
                    if (postCount && orderCountSum && (postCount == orderCountSum)) {
                        debug ("mission accomplished! postId="+postId);
                        await this.postAccomplished(postId);
                    } else if (postCount && orderCountSum && (postCount < orderCountSum)) {
                        debug ("warning! mission overflow! some mismatch error! postCount="+postCount+", orderCountSum="+orderCountSum);
                    }
                    if (!(result && result.count == 1)) {
                        debug ("warning! payNotify, update order! uuid="+item.uuid, result);
                    }
                } else {
                    debug ("error payNotify! not find such order, but user paid! order uuid="+uuid);
                }
            } else {
                debug ("error payNotify! do nothing! ", payload);
            }
            break;
        }
        case 'closeOrderResult': {
            var order = payload.order;
            var res = payload.result;
            if(order && res.return_code == 'SUCCESS' && res.result_code == 'SUCCESS') {
                var uuid = order.uuid;
                var item = await Dbase.findOne (models.Order, { uuid }, { order: [ ['id', 'DESC'] ]});
                if (item) {
                    var result = await Dbase.update( models.Order, { status: 5 }, { id: item.id } );
                    this.orderCache.delete (item.uuid);
                    debug ("closeOrderResult: update order status=>5: ", item);
                    if (!(result && result.count == 1)) {
                        debug ("warning! closeOrderResult, update order! uuid="+item.uuid, result);
                    }
                } else {
                    debug ("error do closeOrderResult! not find such order, uuid="+uuid);
                }
            }
            break;
        }
        case 'getBrandWCPayRequestParams': {
            var order = payload.order;
            var params = payload.params;
            if (order && params) {
                if (params.package && params.paySign) {
                    // has package & paySign, we trade it valid.
                    var uuid = order.out_trade_no;
                    var sub_appid = order.sub_appid;
                    var mch_id = order.mch_id;
                    var sub_mch_id = order.sub_mch_id;
                    var sub_openid = order.sub_openid;

                    var item = await Dbase.findOne (models.Order, { uuid }, { order: [ ['id', 'DESC'] ]});
                    if (item) {
                        if (item.status == 0) {
                            var result = await Dbase.update( models.Order, { status: 1 }, { id: item.id } );
                            debug ("getBrandWCPayRequestParams: update order status from 0=>1: ", item);
                            this.orderCache.add (item.uuid);
                            if (!(result && result.count == 1)) {
                                debug ("warning! getBrandWCPayRequestParams update order! uuid="+item.uuid, result);
                            }
                        } else {
                            debug ("error getBrandWCPayRequestParams! status !=0, ", item);
                        }
                    } else {
                        debug ("error getBrandWCPayRequestParams! not find such order, uuid="+uuid);
                    }
                } else {
                    debug ("error! params error, not to change order status!");
                }
            }
            break;
        }
        case 'openid': {
            // check openid, if user not exist, register silently.
            var openid = payload.openid;
            var item = await Dbase.findOne (models.User, {openid});
            if (!item) {
                debug ("not find user, register silently, openid=" + openid);
                var md5pass = this._md5sum('123456');
                item = await Dbase.create (models.User, {nicename: openid, openid, pass: md5pass, status: 3});
                if (item) {
                    debug ("create user success!", item);
                }
            }
            if (!item) {
                debug ("error! not find user! register user fail! openid="+openid);
            } else {
                debug ("session set, user:", item);
                ctx.session.user = item;
            }
            break;
        }
        case 'subscribe': {
            // check openid, if user not exist, register silently.
            var openid = payload.openid;
            var item = await Dbase.findOne (models.User, {openid});
            if (!item) {
                debug ("not find user, register silently, openid=" + openid);
                var md5pass = this._md5sum('123456');
                item = await Dbase.create (models.User, {nicename: payload.nickname, openid, pass: md5pass, status: 3, subscribe: 1, wechat: payload});
                if (item) {
                    debug ("create user success!", item);
                } else {
                    debug ("error! not find user! register user fail! openid="+openid);
                }
            } else {
                var result = await Dbase.update (models.User, {nicename: payload.nickname, subscribe: 1, wechat: payload}, {id: item.id});
                if (result && result.count == 1) {
                    debug ("update success! user "+item.id+" subscribe "+item.subscribe+"=>1");
                } else {
                    debug ("error! update result:", result);
                }
            }
            break;
        }
        case 'unsubscribe': {
            // check openid, if user not exist, register silently.
            var openid = payload.openid;
            var item = await Dbase.findOne (models.User, {openid});
            if (!item) {
                debug ("not find user, do nothing, openid=" + openid);
                break;
            } 
            var result = await Dbase.update (models.User, {subscribe: 0}, {id: item.id});
            if (result && result.count == 1) {
                debug ("update success! subscribe => 0", item);
            } else {
                debug ("error! update result:", result);
            }
            break;
        }
        default: 
            debug ("unknown command!", cmd);
            break;
        }
    }

    orderCheckLoop () {
        //debug ("orderCheckLoop 1");
        this.orderCheck()
            .then (() => {
                this.orderCheckTimer = setTimeout (this.orderCheckLoop.bind(this), 10000);
                //debug ("orderCheckLoop 2");
            }).catch ((e) => {
                this.orderCheckTimer = setTimeout (this.orderCheckLoop.bind(this), 10000);
                debug ("error! orderCheckLoop: ", e);
            })
    }
    async orderCheck () {
        // check order status in cache. 
        // if timeout, reset its status to 5(timeout).
        if (this.orderCache.size > 0) {
            debug ("orderCheck:", this.orderCache);
            var items = await Dbase.findAndCountAll(models.Order, { 
                where: {
                    uuid: { $in: [...this.orderCache] }
                }
            });
            if (items && items.data) {
                for (var i = 0; i < items.data.length; i++) {
                    var item = items.data[i];
                    if (item.status != 1) {
                        this.orderCache.delete(item.uuid);
                    } else {
                        var updatedTime = new Date (item.updatedAt).getTime();
                        var now = new Date().getTime();
                        var TIMEOUT = 40000;
                        //var TIMEMOUT = 600000;
                        if ((now - updatedTime) > TIMEOUT) {
                            debug ("timeout! close order! elapse="+new Number((now - updatedTime)/1000).toFixed(3));
                            emitter.sendToWechat ({cmd:'closeOrderCmd', payload:item});
                        }
                    }
                }
            }
        }
    }

    ///////////////////////////////////////////////////
    // get Lottery info from lottery module.
    ///////////////////////////////////////////////////
    async getLotteryResult (ctx, next) {
        var date = ctx.request.query.date || ctx.request.body.date;
        var result = await Lottery.getResultAfterTime (date);
        debug ("getLotteryResult:", result, date);
        ctx.body = result;
    }

    ///////////////////////////////////////////////////
    // logic zone.
    ///////////////////////////////////////////////////
    async postAccomplished (postId) {
        // 将完成时间写回数据库, 并更新status为状态5(已完成筹集)
        // 然后将postId放入PostLoop等待处理
        var result = await Dbase.update( models.Post, {status:5, accomplish: new Date()}, { id: postId } );
        debug ("update result :", result);
        this.postLoop.insert(postId);
    }

    ///////////////////////////////////////////////////
    // wechat oauth.
    // react-router urls will be redirect to /index.html,
    // then, we will check cookies of the request to /index.html, 
    // to determine whether is 1: a cookie login, 
    // or 2: wechat redirect with code & state.
    // or 3: none authorized(not login) visit.
    ///////////////////////////////////////////////////
    indexHtmlProcessor () {
        return async (ctx, next) => {
            const url = ctx.req.url;
            if (url == '/index.html') {
                var user = ctx.session && ctx.session.user;
                var agent = parseUserAgent(ctx.request.header && ctx.request.header['user-agent']);
                debug ("fetch /index.html, user=",user, ", agent=", agent);
                if (user) {
                    debug ("user already login!");
                } else {
                    debug ("user not login!");
                    var oauth = this.app && this.app.wechat && this.app.wechat.oauth;
                    if (agent.wechat && oauth) {
                        debug ("in wechat, need do wechat oauth first! then use openid to login!");
                        //debug ("query=", ctx.query, ", search=", ctx.request.search, ", href=", ctx.request.href, ", origin=", ctx.request.origin, ", path=", ctx.request.path);
                        var code = null;
                        var state = null;
                        var qstr = null;
                        var originalHref = ctx.request.href;
                        //var originalHref = ctx.request.protocol+"://"+ctx.request.host + ctx.request.originalUrl;
                        var qstrIndex = -1;
                        if (originalHref) qstrIndex = originalHref.indexOf('?');
                        if (qstrIndex >= 0) {
                            qstr = originalHref.substr(qstrIndex+1);
                            var qobj = qs.parse(qstr);
                            code = qobj && qobj.code;
                            state = qobj && qobj.state;
                        }
                        //debug ("originalHref=", ctx.request.href, ", qstrIndex=", qstrIndex, ", code=", code, ", state=", state, ", qstr=", qstr);
                        if (code && state) {
                            debug ("we got code="+code+", state="+state+", should be redirect from wechat server! we use code&state to get openid!");
                            var retobj = await oauth.getOauthAccessToken(code);
                            if (retobj && retobj.openid) {
                                debug ("get openid, means wechat oauth ok! then get user info from database! ret=", retobj);
                                ctx.session.wxoauth = retobj;
                                var openid = retobj.openid;
                                var user = await Dbase.findOneV2(models.User, { where:{ openid } });
                                if (!user) {
                                    debug ("warning! a new user! we need create a user with this openid! openid=", openid);
                                    user = await Dbase.create (models.User, {nicename: openid, openid, status: 3});
                                    if (!user) {
                                        debug ("error!!! create user fail! TODO:we set user={}, let it pass as a empty!!!", user);
                                        user = {};
                                    }
                                }
                                var { pass, ...userinfo } = user;
                                debug ("session a user=", userinfo);
                                ctx.session.user = userinfo;
                            } else {
                                debug ("error! TODO from wechat oauth! maybe someone share a wrong url with code&state to others, then it will fail when do oauth! TODO: redirect to wechat server! ret=", retobj);
                            }
                        } else {
                            debug ("not login and not get code&state! we treat you not login! redirect to wechat server.");
                            if (oauth) {
                                var state = 'test'; // a random state.
                                var redirect = oauth.getAuthorizeURL (originalHref, state);
                                debug ("original: ", originalHref, ", redirect to: ", redirect);
                                ctx.redirect (redirect);
                                return;
                            } else {
                                debug ("error! app->wechat->oauth not find!!!");
                            }
                        }
                    } else {
                        debug ("not in wechat or oauth is null, let user login from login page themselves! agent=", agent, ", oauth=", oauth);
                    }
                }
            }
            await next();
        }
    }
}

