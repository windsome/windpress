import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as reduxFormReducer } from 'redux-form'
import databaseReducer from './lib/database'
import tempdataReducer from './lib/tempdata'
import timelyReducer from './lib/timely'
import loadingReducer from './lib/loading'

export const makeRootReducer = (asyncReducers) => {
    //console.log ("windsome makeRootReducer", oauth2Reducer);
  return combineReducers({
    // Add sync reducers here
    router,
    loading: loadingReducer,
    timely: timelyReducer,
    form: reduxFormReducer,

    database: databaseReducer,
    //tempdata: tempdataReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
