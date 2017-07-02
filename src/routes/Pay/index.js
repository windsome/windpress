var xdebug = window.myDebug('Pay:routes');
import { injectReducer } from 'store/reducers';
import { signAndConfigJssdk } from 'store/lib/jssdk';
import { loginByCookie } from '../Coin/modules/user';
import parseUserAgent from 'utils/userAgent';

export default (store) => ({
    //path: 'pay',
    onEnter: (nextState, replace, callback) => {
        injectReducer(store, { key:'cuser', reducer: require('../Coin/modules/user').default })
        injectReducer(store, { key:'jssdk', reducer:require('store/lib/jssdk').default })
        // if authorized, go to dash page, else goto login
        store.dispatch(loginByCookie ()).then (ret => {
            store.dispatch(signAndConfigJssdk (location.href));
            callback ();
        }).catch(error => {
            xdebug ("error! loginByCookie fail! error=", error);
            callback ();
        });
    },
    onChange: (prevState, nextState, replace, callback) => {
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
    childRoutes: [
        {
            path: 'pay',
            childRoutes: [
                {
                    path: 'jspay',
                    onEnter: (nextState, replace) => {
                        var ua = parseUserAgent();
                        if (!(ua && ua.wechat)) {
                            replace ('/pay/onlywechat');
                        }
                    },
                    getComponent(nextState, cb) {
                        require.ensure([], (require) => {
                            injectReducer(store, { key:'pay', reducer:require('./modules/pay').default })
                            cb(null, require('./containers/JsPayContainer').default)
                        })
                    }
                },
                {
                    path: 'onlywechat',
                    getComponent(nextState, cb) {
                        require.ensure([], (require) => {
                            cb(null, require('./containers/OnlyWechatContainer').default)
                        })
                    }
                },
            ]
        },
        {
            path: 'paytest',
            childRoutes: [
                {
                    path: 'jspay',
                    getComponent(nextState, cb) {
                        require.ensure([], (require) => {
                            injectReducer(store, { key:'pay', reducer:require('./modules/pay').default })
                            cb(null, require('./containers/JsPayContainer').default)
                        })
                    }
                },
            ]
        },
    ]
})

