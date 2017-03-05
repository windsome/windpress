//import 'whatwg-fetch';

export const OAUTH2_REQUEST = 'OAUTH2_REQUEST'
export const OAUTH2_SUCCESS = 'OAUTH2_SUCCESS'
export const OAUTH2_FAILURE = 'OAUTH2_FAILURE'

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'

export function oauth2Request () {
    return {
        type: OAUTH2_REQUEST
    }
}

export function oauth2Success (value) {
    return {
        type: OAUTH2_SUCCESS,
        payload: value
    }
}

export function oauth2Failure (error) {
    return {
        type: OAUTH2_FAILURE,
        error
    }
}

export const handleOauth2 = (scope) => {
    return (dispatch) => {
        dispatch(oauth2Request())
        
        return fetch("/apis/oauth2/get_state", 
                     { method: 'POST',
                       headers: { 
                           "Content-Type": "application/json; charset=utf-8"
                       },
                       mode: 'cors',
                       cache: 'default',
                       body: JSON.stringify({ scope: scope}) })
            .then(data => data.json())
            .then((retcode) => {
                var redirect_uri = location.href;
                redirect_uri = encodeURIComponent(redirect_uri);
                var next_url = "http://lancertech.net/get-weixin-code.html?appid="+retcode.appid+"&scope="+retcode.scope+"&state="+retcode.state+"&redirect_uri="+redirect_uri;
                console.log ("next_url:", next_url);
                location.href = next_url;
                dispatch(oauth2Success(retcode))
            })
            .catch((error) => {
                console.log('fetch error: ' + error.message);
                dispatch(oauth2Failure({ errcode: -1, msg: error.message }))
            });
    }
}

export function userRequest () {
    return {
        type: USER_REQUEST
    }
}

export function userSuccess (value) {
    return {
        type: USER_SUCCESS,
        payload: value
    }
}

export function userFailure (error) {
    return {
        type: USER_FAILURE,
        error
    }
}

export const doLogin = (cfg) => {
    return (dispatch) => {
        dispatch(userRequest())
        
        return fetch("/apis/oauth2/login", 
                     { method: 'POST',
                       headers: { 
                           "Content-Type": "application/json; charset=utf-8"
                       },
                       mode: 'cors',
                       cache: 'default',
                       body: JSON.stringify({ code: cfg.code, state: cfg.state}) })
            .then(data => data.json())
            .then((retcode) => {
                console.log ("doLogin", retcode);
                dispatch(userSuccess(retcode))
            })
            .catch((error) => {
                console.log('fetch error: ' + error.message);
                dispatch(userFailure({ errcode: -1, msg: error.message }))
            });
    }
}

function shouldLogin(state, location_search) {
    var qsObj = {};
    var qs = location_search.substring(1);
    var qsArr = qs && qs.split('&');
    for (var i = 0; i < qsArr.length; i++) {
        var arr2 = qsArr[i].split('=');
        var name = arr2[0];
        qsObj[name] = arr2[1];
    }
    if (qsObj.code && qsObj.state) {
        // has code & state.
        console.log ("need login, qsObj=", qsObj);
        return qsObj;
        //store.dispatch(doLogin(qsObj));
    }
    return null;
}

export function loginIfNeeded(location_search) {
    return (dispatch, getState) => {
        var qs = shouldLogin (getState(), location_search);
        if (qs) {
            return dispatch(doLogin(qs))
        //} else {
        //    return dispatch (findLockSuccess({ data: lockId }));
        }
    }
}


export const actions = {
    oauth2Request,
    oauth2Success,
    oauth2Failure,
    handleOauth2,
    userRequest,
    userSuccess,
    userFailure,
    doLogin
}

const OAUTH2_ACTION_HANDLERS = {
    [OAUTH2_REQUEST]: (state) => { return ({ ...state, fetching: true, error:null })},
    [OAUTH2_SUCCESS]: (state, action) => { return ({ ...state, oauth2: action.payload, fetching: false, error:null }) },
    [OAUTH2_FAILURE]: (state, action) => { return ({ ...state, oauth2: null, fetching: false, error: action.error }) },
    [USER_REQUEST]: (state) => { return ({ ...state, fetching: true, error:null })},
    [USER_SUCCESS]: (state, action) => { return ({ ...state, oauth2: action.payload, fetching: false, error:null }) },
    [USER_FAILURE]: (state, action) => { return ({ ...state, oauth2: null, fetching: false, error: action.error }) }
}

const initialState = { fetching: false, oauth2: null, error: null }
export default function oauth2Reducer(state = initialState, action) {
    const handler = OAUTH2_ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}
