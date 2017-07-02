import { injectReducer } from 'store/reducers';
var xdebug = window.myDebug('COIN:routes');

export default (store) => ({
    childRoutes: [
        {
            path: 'message',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/MineContainer').default)
                })
            }
        },
        {
            path: 'myvote',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/MyVoteContainer').default)
                })
            }
        },
        {
            path: 'myluck',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/MyLuckContainer').default)
                })
            }
        },
        {
            path: 'myown',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/MyArtListContainer').default)
                })
            }
        },
        {
            path: 'create',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/ArtworkEditorContainer').default)
                })
            }
        },
        {
            path: 'edit',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/ArtworkEditorContainer').default)
                })
            }
        },
        {
            path: 'edit/:id',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/ArtworkEditorContainer').default)
                })
            }
        },
        {
            path: 'myaddr',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/MyAddressContainer').default)
                })
            }
        },
        {
            path: 'rootposts',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/RootArtListContainer').default)
                })
            }
        },
        {
            path: 'myrefunds',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/MyRefundListContainer').default)
                })
            }
        },
        {
            path: 'rootusers',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/UserListContainer').default)
                })
            }
        },
        {
            path: 'rootrefunds',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/RootRefundListContainer').default)
                })
            }
        },
        {
            path: 'sandbox',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./containers/SandboxContainer').default)
                })
            }
        },
    ]
})

