var xdebug = window.myDebug('COIN:reducer:user');
import { createActions } from 'redux-actions';
const { loginCoinRequest, loginCoinSuccess, loginCoinFailure, logoutRequest, logoutSuccess, logoutFailure, updateUserRequest, updateUserSuccess, updateUserFailure, setUserEditor, retrieveUserRefresh, retrieveUserRequest, retrieveUserSuccess, retrieveUserFailure, userUpdated } = createActions('LOGIN_COIN_REQUEST', 'LOGIN_COIN_SUCCESS', 'LOGIN_COIN_FAILURE', 'LOGOUT_REQUEST', 'LOGOUT_SUCCESS', 'LOGOUT_FAILURE', 'UPDATE_USER_REQUEST', 'UPDATE_USER_SUCCESS', 'UPDATE_USER_FAILURE', 'SET_USER_EDITOR', 'RETRIEVE_USER_REFRESH', 'RETRIEVE_USER_REQUEST', 'RETRIEVE_USER_SUCCESS', 'RETRIEVE_USER_FAILURE', 'USER_UPDATED');

export { setUserEditor };

export const loginByCookie = () => {
    return (dispatch) => {
        dispatch(loginCoinRequest())
        
        return fetch("/coinapis/v1/user/login_cookie", { 
            credentials: 'include',
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
                xdebug ("doLogin", retobj);
                if (!retobj.errcode || retobj.errcode == 0) {
                    dispatch(loginCoinSuccess(retobj))
                } else {
                    dispatch(loginCoinFailure(retobj))
                }
                return retobj;
            })
            .catch((error) => {
                xdebug('error! doLogin fetch() fail: ' + error.message, error);
                dispatch(loginCoinFailure(error))
                return error;
            });
    }
}


export const doLogout = () => {
    return (dispatch) => {
        dispatch(logoutRequest())
        return fetch("/coinapis/v1/user/logout", { 
            credentials: 'include',
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
                xdebug ("doLogout", retobj);
                if (!retobj.errcode || retobj.errcode == 0) {
                    dispatch(logoutSuccess(retobj));
                } else {
                    xdebug ("error! doLogout: ", retobj);
                    dispatch(logoutFailure(retobj))
                }
                return retobj;
            })
            .catch((error) => {
                xdebug('error! doLogout fetch() fail: ' + error.message, error);
                dispatch(logoutFailure(error))
                return error;
            });

    }
}

export const loginByNicename = (userdata) => {
    return (dispatch) => {
        dispatch(loginCoinRequest(userdata))
        
        return fetch("/coinapis/v1/user/login", { 
            credentials: 'include',
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
                xdebug ("doLogin", retobj);
                if (!retobj.errcode || retobj.errcode == 0) {
                    dispatch(loginCoinSuccess(retobj))
                } else {
                    dispatch(loginCoinFailure(retobj))
                }
                return retobj;
            })
            .catch((error) => {
                xdebug('error! doLogin fetch() fail: ' + error.message, error);
                dispatch(loginCoinFailure(error))
                return error;
            });
    }
}

export const updateUser = (id, args) => {
    var url = "/coinapis/v1/users/"+id;
    return (dispatch) => {
        dispatch(updateUserRequest(args))
        return fetch(url, { 
            credentials: 'include',
            method: 'PUT',
            headers: { 
                "Content-Type": "application/json; charset=utf-8"
            },
            //mode: 'cors',
            cache: 'default',
            body: JSON.stringify(args) 
        })
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //xdebug ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    //const camelizedJson = camelizeKeys(json)
                    xdebug ("updateUser:", json);
                    dispatch(updateUserSuccess(args));
                } else {
                    //throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                    dispatch(updateUserFailure(json))
                }
                return json;
            })
            .catch((error) => {
                xdebug('error! updateUser fetch() fail: ' + error.message, error);
                dispatch(updateUserFailure(error))
                return error;
            });
    }
}

import { Schema, arrayOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import merge from 'lodash/merge'
const userSchema = new Schema('users', {
    idAttribute: 'id'
});
export const Schemas = {
    USER: userSchema,
    USER_ARRAY: arrayOf(userSchema),
}

export const searchUsers = (key, page) => {
    page = page && parseInt(page) || 0;
    var url = "/coinapis/v1/searchusers";
    return (dispatch) => {
        if (page == 0) dispatch(retrieveUserRefresh())
        dispatch(retrieveUserRequest(url))
        return fetch(url, { 
            credentials: 'include',
            method: 'POST',
            headers: { 
                "Content-Type": "application/json; charset=utf-8"
            },
            //mode: 'cors',
            cache: 'default',
            body: JSON.stringify({key, page}) 
        })
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //xdebug ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    if (json.data) {
                        const {data, ...info} = json;
                        const camelizedJson = camelizeKeys(json.data)
                        //const nextPageUrl = getNextPageUrl(response)
                        const res = normalize(camelizedJson, Schemas.USER_ARRAY);
                        //xdebug ("retrieveUsers:", json, res, info);
                        dispatch(retrieveUserSuccess({db:res.entities.users, result: res.result, info }));
                        return { db: res.entities.users, result: res.result }
                    } else {
                        throw new Error ("retrieveUsers() no data!");
                    }
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch(error => {
                xdebug('error! retrieveUsers fetch() fail: '+error.message, error);
                dispatch(retrieveUserFailure(error))
                return null;
            });
    }
}

export const retrieveUsersByIds = (ids, page) => {
    ids = ids || [];
    page = page && parseInt(page) || 0;
    var url = "/coinapis/v1/users/id=["+ids.toString()+"];page="+page;
    return (dispatch) => {
        if (page == 0) dispatch(retrieveUserRefresh())
        dispatch(retrieveUserRequest(url))
        return fetch(url, { 
            credentials: 'include',
            method: 'GET',
            headers: { 
                "Content-Type": "application/json; charset=utf-8"
            },
            //mode: 'cors',
            cache: 'default',
        })
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //xdebug ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    if (json.data) {
                        const {data, ...info} = json;
                        const camelizedJson = camelizeKeys(json.data)
                        //const nextPageUrl = getNextPageUrl(response)
                        const res = normalize(camelizedJson, Schemas.USER_ARRAY);
                        //xdebug ("retrieveUsers:", json, res, info);
                        dispatch(retrieveUserSuccess({db:res.entities.users, result: res.result, info }));
                        return { db: res.entities.users, result: res.result }
                    } else {
                        throw new Error ("retrieveUsers() no data!");
                    }
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch(error => {
                xdebug('error! retrieveUsers fetch() fail: '+error.message, error);
                dispatch(retrieveUserFailure(error))
                return null;
            });
    }
}

export const retrieveSomeUsers = (ids) => {
    var url = "/coinapis/v1/users/id=["+ids.toString()+"]";
    return (dispatch) => {
        return fetch(url, { 
            credentials: 'include',
            method: 'GET',
            headers: { 
                "Content-Type": "application/json; charset=utf-8"
            },
            //mode: 'cors',
            cache: 'default',
        })
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //xdebug ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    if (json.data) {
                        const {data, ...info} = json;
                        const camelizedJson = camelizeKeys(json.data)
                        //const nextPageUrl = getNextPageUrl(response)
                        const res = normalize(camelizedJson, Schemas.USER_ARRAY);
                        //xdebug ("retrieveUsers:", json, res, info);
                        dispatch(userUpdated({db:res.entities.users, result: res.result, info }));
                        return { db: res.entities.users, result: res.result }
                    } else {
                        throw new Error ("retrieveOneUser() no data!");
                    }
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch(error => {
                xdebug('error! retrieveOneUser fetch() fail: '+error.message, error);
                return null;
            });
    }
}

const ACTION_HANDLERS = {
    ['LOGIN_COIN_REQUEST']: (state, action) => { 
        //console.debug ("infos:",state.info);
        return ({ ...state, fetching: true, user: null, error: null })
    },
    ['LOGIN_COIN_SUCCESS']: (state, action) => { 
        return ({ ...state, fetching: false, user: action.payload, error: null });
    },
    ['LOGIN_COIN_FAILURE']: (state, action) => {
        return ({ ...state, fetching: false, user: null, error: action.payload });
    },
    ['LOGOUT_REQUEST']: (state, action) => ({ ...state, isOuting: true }),
    ['LOGOUT_SUCCESS']: (state, action) => ({ ...state, user: null, error: null, isOuting: false }),
    ['LOGOUT_FAILURE']: (state, action) => ({ ...state, error: action.payload, isOuting: false}),
    ['UPDATE_USER_REQUEST']: (state, action) => ({ ...state, update: { fetching: true, error: null, result: null } }),
    ['UPDATE_USER_SUCCESS']: (state, action) => ({ ...state, user: {...state.user, ...action.payload}, update: { fetching: false, error: null, result: action.payload } }),
    ['UPDATE_USER_FAILURE']: (state, action) => ({ ...state, update: { fetching: false, error: action.payload, result: null } }),
    ['SET_USER_EDITOR']: (state, action) => ({ ...state, update: { fetching: false, error: null, result: null } }),
    ['RETRIEVE_USER_REFRESH']: (state, action) => ({ ...state, retrieve: { fetching: false, error: null, result: [] } }),
    ['RETRIEVE_USER_REQUEST']: (state, action) => ({ ...state, retrieve: { ...state.retrieve, fetching: true, error: null } }),
    ['RETRIEVE_USER_SUCCESS']: (state, action) => {
        //xdebug ("action:", action);
        var result = state.retrieve && state.retrieve.result || [];
        result = result.concat(action.payload.result);
        var nresult = result.filter((item, pos) => {
            return result.indexOf(item) == pos;
        });
        return ({ ...state, db: {...state.db, ...action.payload.db}, retrieve: { ...state.retrieve, fetching: false, error: null, ...action.payload.info, result: nresult } })
    },
    ['RETRIEVE_USER_FAILURE']: (state, action) => ({ ...state, retrieve: { ...state.retrieve, fetching: false, error: action.payload } }),
    ['USER_UPDATED']: (state, action) => ({ ...state, db: {...state.db, ...action.payload.db} }),
}

const initialState = { db: {}, fetching: false, user: null, error: null, isOuting:false, update: {}, retrieve: {} }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    //console.debug ("action:", action);
    return handler ? handler(state, action) : state
}

