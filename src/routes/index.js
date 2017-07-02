/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

// We only need to import the modules necessary for initial render
import CoinRoute from './Coin'
import PayRoute from './Pay'

export const createRoutes = (store) => ({
    path: '/',
    indexRoute: {
        onEnter: (nextState, replace) => {
            replace ('/coin/');
        }
    },

    childRoutes: [
        CoinRoute(store),
        PayRoute(store),
    ]
})

export default createRoutes
