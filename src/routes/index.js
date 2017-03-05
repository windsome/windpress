/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

// We only need to import the modules necessary for initial render
import EmptyLayout from '../layouts/EmptyLayout/EmptyLayout'
import CoinRoute from './Coin'

export const createRoutes = (store) => ({
    path: '/',
    indexRoute: {
        onEnter: (nextState, replace) => {
            replace ('/coin/');
        }
    },

    childRoutes: [
        CoinRoute(store),
    ]
})

export default createRoutes
