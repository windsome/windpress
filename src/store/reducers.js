import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as reduxFormReducer } from 'redux-form'
import oauth2Reducer from './lib/oauth2'
import loginReducer from './lib/user'
import databaseReducer from './lib/database'
import tempdataReducer from './lib/tempdata'
import timelyReducer from './lib/timely'
import loadingReducer from './lib/loading'
import wxoauthReducer from './lib/wxoauth'

export const makeRootReducer = (asyncReducers) => {
    //console.log ("windsome makeRootReducer", oauth2Reducer);
  return combineReducers({
    // Add sync reducers here
    router,
    loading: loadingReducer,
    timely: timelyReducer,
    form: reduxFormReducer,

    database: databaseReducer,
    login: loginReducer,
    oauth2: oauth2Reducer,
    //tempdata: tempdataReducer,
    wxoauth: wxoauthReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
