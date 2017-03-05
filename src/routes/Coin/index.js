import { injectReducer } from 'store/reducers';
var xdebug = window.myDebug('COIN:routes');
import { handleWxoauth } from 'store/lib/wxoauth';
import { urlParams } from 'utils/urlParams';
import { loginByOpenid } from './modules/user';

const getOpenidAndLogin = (code) => {
    return (dispatch, getState) => {
        return dispatch (handleWxoauth (code)).then (()=>{
            var wxoauth = getState().wxoauth;
            return dispatch(loginByOpenid(wxoauth.openid));
        })
    }
}

const parseUserAgent = () => {
    // Wechat UserAgent: "Mozilla/5.0(iphone;CPU iphone OS 5_1_1 like Mac OS X) AppleWebKit/534.46(KHTML,like Geocko) Mobile/9B206 MicroMessenger/5.0"
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/micromessenger\/([\d.]+)/)) ? Sys.wechat = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    xdebug ("UserAgent:", navigator.userAgent, ", parsed:", Sys);
    return Sys;
}


export default (store) => ({
    path: 'coin',
    /*getComponent(nextState, cb) {
        require.ensure([], (require) => {
            console.log ("reach HomeLayout");
            const Layout = require('./containers/HomeLayoutContainer').default
            cb(null, Layout)
        })
    },*/
    onEnter: (nextState, replace) => {
        // if authorized, go to dash page, else goto login
        var xState = store.getState();
        var ua = parseUserAgent();
        if (ua.wechat) {
            xdebug ("in Wechat browser, auto sign in with openid.");
            var wxoauth = xState && xState.wxoauth;
            if (!(wxoauth && wxoauth.user)) {
                // not login.
                var qs = urlParams(location.search);
                if (qs.state && qs.code) {
                    injectReducer(store, { key:'cuser', reducer: require('./modules/user').default })
                    // redirect from wechat oauth, need to get openid, weixin oauth step2.
                    store.dispatch (getOpenidAndLogin (qs.code)).then ((ret)=>{
                        xdebug ("getOpenidAndLogin ok:", ret);
                    }).catch((error)=>{
                        xdebug ("getOpenidAndLogin fail:", error);
                    });
                } else {
                    // redirect to weixin oauth page to retrieve code.
                    var state = Math.random().toString(36).substr(2, 6); 
                    var redirect_uri = encodeURIComponent(location.href);
                    var appId = 'wx1a6eca02cffc398c';
                    var scope = 'snsapi_base';
                    var weixin_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appId+'&redirect_uri='+redirect_uri
                        +'&response_type=code&scope='+scope+'&state='+state
                        +'#wechat_redirect';
                    xdebug ("weixin_url:", weixin_url);
                    location.replace(weixin_url);
                    //window.location = weixin_url;
                }
            }
        } else {
            xdebug ("not in Wechat browser, we will login with other method.")
        }
    },
    indexRoute: {
        getComponent(nextState, cb) {
            require.ensure([], (require) => {
                //const reducer = require('./modules/charts').default;
                //injectReducer(store, { key:'charts', reducer:reducer })
                injectReducer(store, { key:'cpost', reducer:require('./modules/post').default })
                cb(null, require('./containers/ArtworkListContainer').default)
            }, 'coin')
        }
    },
    childRoutes: [
        {
            path: 'search',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/SearchContainer').default)
                })
            }
        },
        {
            path: 'message',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    injectReducer(store, { key:'cuser', reducer: require('./modules/user').default })
                    cb(null, require('./containers/MineContainer').default)
                })
            }
        },
        {
            path: 'artwork/:id',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    injectReducer(store, { key:'cuser', reducer: require('./modules/user').default })
                    injectReducer(store, { key:'cpost', reducer:require('./modules/post').default })
                    injectReducer(store, { key:'corder', reducer:require('./modules/order').default })
                    cb(null, require('./containers/ArtworkContainer').default)
                })
            }
        },
        {
            path: 'artworkdetail/:id',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    injectReducer(store, { key:'cpost', reducer:require('./modules/post').default })
                    cb(null, require('./containers/ArtworkDetailContainer').default)
                })
            }
        },
        {
            path: 'create',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    injectReducer(store, { key:'cpost', reducer:require('./modules/post').default })
                    cb(null, require('./containers/ArtworkEditorContainer').default)
                })
            }
        },
    ]
})

