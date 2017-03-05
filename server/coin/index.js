import config from '../../config';
import _debug from 'debug'
const debug = _debug('app:server:coin')
import _ from 'lodash';

import Errcode, * as EC from '../Errcode'
import models from './dbmodels';
import Dbase from './dbBase';
import userHasCaps from './roles';

export default class XxeApis {
    constructor (app) {
        this.app = app;
        // init router for apis.
        this.router = require('koa-router')({ prefix: '/coinapis/v1' });
        this.router2 = require('koa-router')({ prefix: '/coinapis/v2' });
        // init database.
        this.database_status = false;
        models.sequelize.sync()
            .then(async function() {
                // if user `root` not exist, init database.
                var root = await Dbase.findOne(models.User, {nicename:'root'});
                if (!root) {
                    // no root. init database.
                    root = await Dbase.create (models.User, {id: 1, nicename: 'root', pass: '123456', status: 1});
                    var agent = await Dbase.create (models.User, {nicename: 'agent', pass: '123456', status: 2});
                    var customer = await Dbase.create (models.User, {id:9, nicename: 'customer', pass: '123456', status: 3});
                    var demo = await Dbase.create (models.User, {id:10, nicename: 'demo', pass: '123456', status: 3});
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
        debug ("init end");
    }

    registerServices() {
        var router = this.router;
        var router2 = this.router2;

        router.all('/user/login', this.login.bind(this));
        router.all('/user/login_openid', this.loginByOpenid.bind(this));
        router.all('/user/logout', this.logout.bind(this));

        router.get('/users/:qs', this.getUsers.bind(this));
        router.get('/users', this.getUsers.bind(this));
        router.post('/users', this.createUser.bind(this));
        router.put('/users/:id', this.updateUser.bind(this));
        router.delete('/users/:id', this.deleteUser.bind(this));

        router.get('/posts/:qs', this.getPosts.bind(this));
        router.get('/posts', this.getPosts.bind(this));
        router.post('/posts', this.createPost.bind(this));
        router.put('/posts/:id', this.updatePost.bind(this));
        router.delete('/posts/:id', this.deletePost.bind(this));

        router.get('/orders/:qs', this.getOrders.bind(this));
        router.get('/orders', this.getOrders.bind(this));
        router.post('/orders', this.createOrder.bind(this));
        router.put('/orders/:id', this.updateOrder.bind(this));
        router.delete('/orders/:id', this.deleteOrder.bind(this));

        router2.get('/orders/:qs', this.getOrdersV2.bind(this));

        this.app.use(async (ctx, next) => {
            if(/^\/coinapis/.test(ctx.path)) {
                
                try {
                    if (!this.database_status) {
                        debug ("database not ready! try later");
                        throw new Errcode("busy! database not ready! try later!", EC.ERR_BUSY);
                    }
                    debug ("start process input path:", ctx.path, ", body:", ctx.request.body);
                    var result = await next();
                    debug ("end process input path:", ctx.path);
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
                debug ("qs:", qs);
                var key = qs[1];
                var value = qs[2];
                if (key == 'page') {
                    var page = _.toNumber(value);
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
                    options.where[key] = value;
                }
            });
        }
        return options;
    }

    async login (ctx, next) {
        var args = ctx.request.body;
        var user = await Dbase.findOneV2(models.User, { where:{ login:args.login } });
        if (!user) {
            throw new Errcode("no such user "+args.login, EC.ERR_USER_AUTH_NO_USER);
        }
        if (args.pass != user.pass) {
            throw new Errcode("password wrong "+args.login, EC.ERR_USER_AUTH_WRONG_PASS);
        }
        ctx.session.user = user;
        debug ("session:", ctx.session);
        ctx.body = { login:user.login, errcode: 0 };
    }
    async loginByOpenid (ctx, next) {
        var args = ctx.request.body;
        var user = null;
        if (args.openid)
            user = await Dbase.findOneV2(models.User, { where:{ openid:args.openid } });
        if (!user) {
            throw new Errcode("no such user "+args.login, EC.ERR_USER_AUTH_NO_USER);
        }
        var { pass, ...userinfo } = user;
        ctx.session.user = userinfo;
        //debug ("session:", ctx.session);
        ctx.body = { user:userinfo, errcode: 0 };
    }
    async logout (ctx, next) {
        //var user = ctx.request.body;
        if (ctx.session.user) {
            ctx.session.user = null;
        }
        debug ("session:", ctx.session);

        ctx.body = { errcode: 0 };
    }
    async getUsers (ctx, next) {
        // GET /users
        // GET /users/1
        // GET /users/<query=xxx>;<page=1>;<order=createAt+>;
        if (!userHasCaps (ctx.session.user, "manage_users")) {
            throw new Errcode ("no cap [manage_users] " + ctx.session.user, EC.ERR_USER_NO_CAP);
        }
        var options = this.parseQueryString(ctx.params.qs);
        console.log ("options:", options);
        var items = await Dbase.findAndCountAll(models.User, options);
        ctx.body = items;
    }
    async createUser (ctx, next) {
        if (!userHasCaps (ctx.session.user, "edit_users")) {
            throw new Errcode ("no cap [edit_users] " + ctx.session.user, EC.ERR_USER_NO_CAP);
        }
        var args = ctx.request.body;
        var item = await Dbase.create(models.User, args);
        ctx.body = item;
    }
    async updateUser (ctx, next) {
        if (!userHasCaps (ctx.session.user, "edit_users")) {
            throw new Errcode ("no cap [edit_users] " + ctx.session.user, EC.ERR_USER_NO_CAP);
        }
        var id = ctx.params.id;
        var args = ctx.request.body;
        if (!id || !args) {
            throw new Errcode ("param error! id="+id+", args="+args, EC.ERR_PARAM_ERROR);
        }
        var item = await Dbase.findOne (models.User, {id});
        if (item) {
            var itemNext = await Dbase.update( models.User, {...item, ...args}, { id } );
            debug ("update to :", itemNext);
            ctx.body = itemNext;
        } else {
            throw new Errcode ( "no such user "+id, EC.ERR_NO_SUCH_ENTITY );
        }
    }
    async deleteUser (ctx, next) {
        if (!userHasCaps (ctx.session.user, "manage_users")) {
            throw new Errcode ("no cap [manage_users] " + ctx.session.user, EC.ERR_USER_NO_CAP);
        }
        var id = ctx.params.id;
        var ret = await Dbase.destroy(models.User, {id});
        ctx.body = ret;
    }

    async getPosts (ctx, next) {
        // GET /posts
        // GET /posts/1
        // GET /posts/<query=xxx>;<page=1>;<order=createAt+>;
        if (!userHasCaps (ctx.session.user, "manage_posts")) {
            throw new Errcode ("no cap [manage_posts] " + ctx.session.user, EC.ERR_USER_NO_CAP);
        }
        var options = this.parseQueryString(ctx.params.qs);
        console.log ("options:", options);
        var items = await Dbase.findAndCountAll(models.Post, options);
        ctx.body = items;
    }
    async createPost (ctx, next) {
        if (!userHasCaps (ctx.session.user, "edit_posts")) {
            throw new Errcode ("no cap [edit_posts] " + ctx.session.user, EC.ERR_USER_NO_CAP);
        }
        var args = ctx.request.body;
        //if (!args || !args.uuid) {
        //    throw new Errcode ("param error! need post uuid ", EC.ERR_PARAM_ERROR);
        //}
        var item = await Dbase.create(models.Post, args);
        ctx.body = item;
    }
    async updatePost (ctx, next) {
        if (!userHasCaps (ctx.session.user, "edit_posts")) {
            throw new Errcode ("no cap [edit_posts] " + ctx.session.user, EC.ERR_USER_NO_CAP);
        }
        var id = ctx.params.id;
        var args = ctx.request.body;
        if (!id || !args) {
            throw new Errcode ("param error! id="+id+", args="+args, EC.ERR_PARAM_ERROR);
        }

        var item = await Dbase.findOne (models.Post, { id });
        if (item) {
            var itemNext = await Dbase.update( models.Post, {...item, ...args}, { id } );
            debug ("update to :", itemNext);
            ctx.body = itemNext;
        } else {
            throw new Errcode ( "no such item "+id, EC.ERR_NO_SUCH_ENTITY );
        }
    }
    async deletePost (ctx, next) {
        if (!userHasCaps (ctx.session.user, "manage_posts")) {
            throw new Errcode ("no cap [manage_posts] " + ctx.session.user, EC.ERR_USER_NO_CAP);
        }
        var id = ctx.params.id;
        var ret = await Dbase.destroy(models.Post, {id});
        ctx.body = ret;
    }

    async getOrders (ctx, next) {
        // GET /orders
        // GET /orders/1
        // GET /orders/<query=xxx>;<page=1>;<order=createAt+>;
        if (!userHasCaps (ctx.session.user, "manage_orders")) {
            throw new Errcode ("no cap [manage_orders] " + ctx.session.user, EC.ERR_USER_NO_CAP);
        }
        var options = this.parseQueryString(ctx.params.qs);
        console.log ("options:", options);
        var items = await Dbase.findAndCountAll(models.Order, options);
        ctx.body = items;
    }
    async createOrder (ctx, next) {
        if (!userHasCaps (ctx.session.user, "edit_orders")) {
            throw new Errcode ("no cap [edit_orders] " + ctx.session.user, EC.ERR_USER_NO_CAP);
        }
        var args = ctx.request.body;
        //if (!args || !args.uuid) {
        //    throw new Errcode ("param error! need order uuid ", EC.ERR_PARAM_ERROR);
        //}
        var item = await Dbase.create(models.Order, args);
        ctx.body = item;
    }
    async updateOrder (ctx, next) {
        if (!userHasCaps (ctx.session.user, "edit_orders")) {
            throw new Errcode ("no cap [edit_orders] " + ctx.session.user, EC.ERR_USER_NO_CAP);
        }
        var id = ctx.params.id;
        var args = ctx.request.body;
        if (!id || !args) {
            throw new Errcode ("param error! id="+id+", args="+args, EC.ERR_PARAM_ERROR);
        }

        var item = await Dbase.findOne (models.Order, { id });
        if (item) {
            var itemNext = await Dbase.update( models.Order, {...item, ...args}, { id } );
            debug ("update to :", itemNext);
            ctx.body = itemNext;
        } else {
            throw new Errcode ( "no such item "+id, EC.ERR_NO_SUCH_ENTITY );
        }
    }
    async deleteOrder (ctx, next) {
        if (!userHasCaps (ctx.session.user, "manage_orders")) {
            throw new Errcode ("no cap [manage_orders] " + ctx.session.user, EC.ERR_USER_NO_CAP);
        }
        var id = ctx.params.id;
        var ret = await Dbase.destroy(models.Order, {id});
        ctx.body = ret;
    }

    async getOrdersV2 (ctx, next) {
        // GET /orders/<json>;
        var options = JSON.parse(decodeURIComponent(ctx.params.qs));
        console.log ("options:", options);
        var items = await Dbase.findAndCountAll(models.Order, options);
        ctx.body = items;
    }
}
