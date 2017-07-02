var xdebug = window.myDebug('COIN:indexRoutes');
import { injectReducer } from 'store/reducers';
import { signAndConfigJssdk } from 'store/lib/jssdk';
import parseUserAgent from 'utils/userAgent';
import { loginByCookie } from './modules/user';
import { push, replace, go } from 'react-router-redux'

import AuthedRoutes from './authedRoutes'
import ShopRoutes from './shopRoutes'

export default (store) => ({
    path: 'coin',
    onEnter: (nextState, replace, callback) => {
        injectReducer(store, { key:'cuser', reducer: require('./modules/user').default })
        injectReducer(store, { key:'cpost', reducer:require('./modules/post').default })
        injectReducer(store, { key:'corder', reducer:require('./modules/order').default })
        injectReducer(store, { key:'crefund', reducer:require('./modules/refund').default })
        injectReducer(store, { key:'qrcode', reducer:require('./modules/qrcode').default })
        injectReducer(store, { key:'pay', reducer:require('routes/Pay/modules/pay').default })
        injectReducer(store, { key:'jssdk', reducer:require('store/lib/jssdk').default })

        wx && wx.hideAllNonBaseMenuItem();

        store.dispatch(loginByCookie ()).then (ret => {
            store.dispatch(signAndConfigJssdk (location.href));
            callback ();
        }).catch(error => {
            xdebug ("error! signAndConfigJssdk in onEnter() fail! error=", error);
            callback ();
        });
    },
    onChange: (prevState, nextState, replace, callback) => {
        wx && wx.hideAllNonBaseMenuItem();

        var ua = parseUserAgent();
        if (ua && ua.wechat) {
            xdebug ("onChange, inject jssdk! "+location.href);
            store.dispatch(signAndConfigJssdk (location.href)).then (ret => {
                callback ();
            }).catch(error => {
                xdebug ("error! signAndConfigJssdk in onChange() fail! error=", error);
                callback ();
            });
        } else {
            callback ();
        }
    },
    indexRoute: {
        onEnter: (nextState, replace) => {
            xdebug ("indexRoute onEnter()");
            replace ('/coin/shop');
        }
    },
    childRoutes: [
        {
            path: 'listall',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/ArtworkListContainer').default)
                })
            }
        },
        {
            path: 'search',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/SearchContainer').default)
                })
            }
        },
        {
            path: 'artwork/:postId',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/ArtworkContainer').default)
                })
            }
        },
        {
            path: 'artworkdetail/:postId',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/ArtworkDetailContainer').default)
                })
            }
        },
        {
            path: 'message',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    //injectReducer(store, { key:'cuser', reducer: require('./modules/user').default })
                    cb(null, require('./containers/MineContainer').default)
                })
            }
        },
        {
            path: 'qrcode',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    //injectReducer(store, { key:'cuser', reducer:require('./modules/user').default })
                    cb(null, require('./containers/QrcodeContainer').default)
                })
            }
        },
        {
            path: 'weinre',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/WeinreContainer').default)
                })
            }
        },
        {
            onEnter: (nextState, replace) => {
                // if authorized, go to dash page, else goto login
                var xState = store.getState();
                var loginUser = xState && xState.cuser && xState.cuser.user;
                var userId = loginUser && loginUser.id;

                console.log ("COIN: login onEnter, nextState:", xState, ", nextPathname:", nextState.location.pathname, ", userId="+userId);
                if (userId) {
                    replace ('/coin');
                }
            },
            childRoutes: [
                {
                    path: 'login',
                    getComponent(nextState, cb) {
                        require.ensure([], (require) => {
                            cb(null, require('./containers/LoginContainer').default)
                        })
                    }
                },
            ]
        },
        {
            onEnter: (nextState, replace) => {
                // if authorized, go to admin page, else goto login
                var xState = store.getState();
                var loginUser = xState && xState.cuser && xState.cuser.user;
                var userId = loginUser && loginUser.id;

                console.log ("COIN: onEnter AuthedRoutes, prevState:", xState, ", nextState", nextState, ", userId:", userId, ", nextPathname:", nextState.location.pathname);
                if (!userId) {
                    // not login, we will do weixin oauth or enter /login
                    var ua = parseUserAgent();
                    if (ua && ua.wechat) {
                        xdebug ("error! should not reach here!!!in Wechat browser, we should already login upstairs.");
                    } else {
                        xdebug ("not in Wechat browser, we will redirect to /login.");
                        replace ({
                            pathname: '/coin/login', 
                            state: { nextPathname: nextState.location.pathname }
                        });
                    }
                }
            },
            childRoutes: [
                AuthedRoutes(store)
            ]
        },
        ShopRoutes (store)
    ]
})

