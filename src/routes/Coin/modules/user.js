import { createActions } from 'redux-actions';
import cookie from 'react-cookie';
const { loginRequest, loginSuccess, loginFailure, cookieLoaded, logoutRequest, logoutSuccess, logoutFailure } = createActions('LOGIN_REQUEST', 'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'COOKIE_LOADED', 'LOGOUT_REQUEST', 'LOGOUT_SUCCESS', 'LOGOUT_FAILURE');

export const userFromCookie = () => {
    return (dispatch) => {
        var user = cookie.load('user');
        return dispatch(cookieLoaded(user));
    }
}

export const doLogout = () => {
    return (dispatch) => {
        dispatch(logoutRequest())
        return fetch("/coinapis/v1/user/logout", { 
            method: 'POST',
            headers: { 
                "Content-Type": "application/json; charset=utf-8"
            },
            //mode: 'cors',
            cache: 'default',
            body: JSON.stringify({}) 
        })
            .then(data => data.json())
            .then((retobj) => {
                console.log ("doLogout", retobj);
                if (retobj.errcode == 0) {
                    cookie.remove('user', { path: '/' });
                    dispatch(logoutSuccess(retobj));
                } else {
                    dispatch(logoutFailure(retobj))
                }
            })
            .catch((error) => {
                console.log('fetch error: ' + error.message);
                dispatch(logoutFailure({ errcode: -1, message: error.message }))
            });

    }
}

export const doLogin = (userdata) => {
    return (dispatch) => {
        dispatch(loginRequest(userdata))
        
        return fetch("/coinapis/v1/user/login", { 
            method: 'POST',
            headers: { 
                "Content-Type": "application/json; charset=utf-8"
            },
            //mode: 'cors',
            cache: 'default',
            body: JSON.stringify(userdata) 
        })
            .then(data => data.json())
            .then((retobj) => {
                console.log ("doLogin", retobj);
                if (retobj.errcode == 0) {
                    cookie.save('user', retobj, { path: '/' });
                    dispatch(loginSuccess(retobj))
                } else {
                    dispatch(loginFailure(retobj))
                }
            })
            .catch((error) => {
                console.log('fetch error: ' + error.message);
                dispatch(loginFailure({ errcode: -1, message: error.message }))
            });
    }
}

export const loginByOpenid = (openid) => {
    return (dispatch) => {
        dispatch(loginRequest())
        
        return fetch("/coinapis/v1/user/login_openid", { 
            method: 'POST',
            headers: { 
                "Content-Type": "application/json; charset=utf-8"
            },
            //mode: 'cors',
            cache: 'default',
            body: JSON.stringify({openid}) 
        })
            .then(data => data.json())
            .then((retobj) => {
                if (retobj.errcode == 0) {
                    cookie.save('user', retobj, { path: '/' });
                    dispatch(loginSuccess(retobj))
                } else {
                    dispatch(loginFailure(retobj))
                }
                return retobj;
            })
            .catch((error) => {
                console.log('fetch error: ' + error.message);
                dispatch(loginFailure({ errcode: -1, message: error.message }))
                return { errcode: -1, message: error.message };
            });
    }
}

const ACTION_HANDLERS = {
    ['LOGIN_REQUEST']: (state, action) => { 
        //console.debug ("infos:",state.info);
        return ({ ...state, fetching: true, user: null, error: null })
    },
    ['LOGIN_SUCCESS']: (state, action) => { 
        return ({ ...state, fetching: false, user: action.payload, error: null });
    },
    ['LOGIN_FAILURE']: (state, action) => {
        return ({ ...state, fetching: false, user: null, error: action.payload });
    },
    ['COOKIE_LOADED']: (state, action) => ({ ...state, user: action.payload, cookieLoaded: true }),
    ['LOGOUT_REQUEST']: (state, action) => ({ ...state, isOuting: true }),
    ['LOGOUT_SUCCESS']: (state, action) => ({ ...state, user: null, error: null, cookieLoaded: false, isOuting: false }),
    ['LOGOUT_FAILURE']: (state, action) => ({ ...state, error: action.payload, isOuting: false}),

}

const initialState = { fetching: false, user: null, error: null, cookieLoaded:false, isOuting:false }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    //console.debug ("action:", action);
    return handler ? handler(state, action) : state
}

