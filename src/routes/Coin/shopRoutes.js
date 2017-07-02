import { injectReducer } from 'store/reducers';
var xdebug = window.myDebug('COIN:shopRoutes');
import jssdkReducer, { fetchSign, wxConfig } from 'store/lib/jssdk';

const signAndConfigJssdk = (url) => {
    return (dispatch, getState) => {
        return dispatch (fetchSign (url)).then ((pkg)=>{
            if (pkg) {
                return dispatch(wxConfig(pkg)).then (retobj => {
                    return retobj;
                });
            } else {
                xdebug ("error! signAndConfigJssdk: fetchSign none!");
                return null;
            }
        })
    }
}


export default (store) => ({
    path: 'shop',
    indexRoute: {
        onEnter: (nextState, replace) => {
            var xState = store.getState();
            var loginUser = xState && xState.cuser && xState.cuser.user;
            if (loginUser && loginUser.visited && loginUser.visited.length == 1) {
                var nextUrl = '/coin/shop/'+loginUser.visited[0];
                xdebug ("has only visit one shop, enter it!");
                replace (nextUrl);
            }
        },
        getComponent(nextState, cb) {
            require.ensure([], (require) => {
                cb(null, require('./containers/ShopCenterContainer').default)
            })
        }
    },
    childRoutes: [
        {
            path: ':userId',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/ArtworkListContainer').default)
                })
            }
        },
        {
            path: ':userId/:postId',
            /*onEnter: (nextState, replace) => {
                xdebug ("shop/:userId/:postId onEnter, inject jssdk! "+location.href);
                injectReducer(store, { key:'jssdk', reducer:jssdkReducer })
                store.dispatch(signAndConfigJssdk (location.href));
            },
            onChange: (prevState, nextState, replace) => {
                xdebug ("shop/:userId/:postId onChange, inject jssdk! "+location.href);
                injectReducer(store, { key:'jssdk', reducer:jssdkReducer })
                store.dispatch(signAndConfigJssdk (location.href));
            },*/
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/ArtworkContainer').default)
                })
            }
        },
        {
            path: ':userId/:postId/detail',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/ArtworkDetailContainer').default)
                })
            }
        },
    ]
})

