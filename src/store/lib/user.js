import { createActions } from 'redux-actions';
import cookie from 'react-cookie';
const { loginRequest, loginSuccess, loginFailure, cookieLoaded, logoutRequest, logoutDone, logoutFailure } = createActions('LOGIN_REQUEST', 'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'COOKIE_LOADED', 'LOGOUT_REQUEST', 'LOGOUT_DONE', 'LOGOUT_FAILURE');

export const userFromCookie = () => {
    return (dispatch) => {
        var user = cookie.load('user');
        dispatch(cookieLoaded(user));
    }
}

export const doLogout = () => {
    return (dispatch) => {
        dispatch(logoutRequest())
        return fetch("/wpapis/v1/user/logout", { 
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
                    dispatch(logoutDone());
                } else {
                    dispatch(logoutFailure({ errcode: retobj.errcode, msg: retobj.msg }))
                }
            })
            .catch((error) => {
                console.log('fetch error: ' + error.message);
                dispatch(logoutFailure({ errcode: -1, msg: error.message }))
            });

    }
}

export const doLogin = (userdata) => {
    return (dispatch) => {
        dispatch(loginRequest(userdata))
        
        return fetch("/wpapis/v1/user/login", { 
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
                    dispatch(loginFailure({ errcode: retobj.errcode, msg: retobj.msg }))
                }
            })
            .catch((error) => {
                console.log('fetch error: ' + error.message);
                dispatch(loginFailure({ errcode: -1, msg: error.message }))
            });
    }
}

export function loginIfNeeded(userdata, current) {
    return (dispatch, getState) => {
        var needLogin = true;
        var msg = '';
        var errcode = 0;
        if (!userdata || !userdata.username) {
            needLogin = false;
            msg = 'user info not supplied';
            errcode = 1;
        } else if (current && (current.username != userdata.username)) {
            needLogin = false;
            msg = 'already login';
            errcode = 2;
        }

        if (needLogin) {
            return dispatch (doLogin(userdata))
        } else {
            return dispatch (loginFailure({ errcode: errcode, msg: msg }))
        }
    }
}

const ACTION_HANDLERS = {
    ['LOGIN_REQUEST']: (state, action) => { 
        //console.debug ("infos:",state.info);
        return ({ ...state, fetching: true, user: null, errcode: 0, msg: null })
    },
    ['LOGIN_SUCCESS']: (state, action) => { 
        return ({ ...state, fetching: false, user: action.payload, errcode: 0, msg: null });
    },
    ['LOGIN_FAILURE']: (state, action) => {
        return ({ ...state, fetching: false, user: null, errcode: (action.payload && action.payload.errcode), msg: (action.payload && action.payload.msg) });
    },
    ['COOKIE_LOADED']: (state, action) => ({ ...state, user: action.payload, cookieLoaded:true }),
    ['LOGOUT_REQUEST']: (state, action) => ({ ...state, isOuting:true }),
    ['LOGOUT_DONE']: (state, action) => ({ fetching: false, user: null, errcode: 0, msg: null, cookieLoaded:false, isOuting:false }),
    ['LOGOUT_FAILURE']: (state, action) => ({ ...state, errcode: (action.payload && action.payload.errcode), msg: (action.payload && action.payload.msg), isOuting:false }),

}

const initialState = { fetching: false, user: null, errcode: 0, msg: null, cookieLoaded:false, isOuting:false }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    //console.debug ("action:", action);
    return handler ? handler(state, action) : state
}

