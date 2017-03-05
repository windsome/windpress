var xdebug = window.myDebug('COIN:reducer:post');

import { createActions } from 'redux-actions';

const { createPostRequest, createPostSuccess, createPostFailure, updatePostRequest, updatePostSuccess, updatePostFailure, retrievePostRequest, retrievePostSuccess, retrievePostFailure, removePostRequest, removePostSuccess, removePostFailure } = createActions('CREATE_POST_REQUEST', 'CREATE_POST_SUCCESS', 'CREATE_POST_FAILURE', 'UPDATE_POST_REQUEST', 'UPDATE_POST_SUCCESS', 'UPDATE_POST_FAILURE', 'RETRIEVE_POST_REQUEST', 'RETRIEVE_POST_SUCCESS', 'RETRIEVE_POST_FAILURE', 'REMOVE_POST_REQUEST', 'REMOVE_POST_SUCCESS', 'REMOVE_POST_FAILURE');

import { Schema, arrayOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import merge from 'lodash/merge'

const postSchema = new Schema('posts', {
    idAttribute: 'id'
});
export const Schemas = {
    POST: postSchema,
    POST_ARRAY: arrayOf(postSchema),
}

export const createPost = (args) => {
    var url = "/coinapis/v1/posts";
    return (dispatch) => {
        dispatch(createPostRequest(args))
        
        // /wpapis/v1/roles or /wpapis/v1/roles/*
        return fetch(url, { 
            method: 'POST',
            headers: { 
                "Content-Type": "application/json; charset=utf-8"
            },
            //mode: 'cors',
            cache: 'default',
            body: JSON.stringify(args) 
        })
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //console.log ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    const camelizedJson = camelizeKeys(json)
                    const result = normalize(camelizedJson, Schemas.POST);
                    xdebug ("create:", result);
                    dispatch(createPostSuccess({db:res.entities.orders, result: res.result }));
                } else {
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                console.log('fetch() unknown error: ' + error.message, error);
                dispatch(createPostFailure(error))
            });
    }
}

export const updatePost = (args) => {
    var url = "/coinapis/v1/posts";
    return (dispatch) => {
        dispatch(updatePostRequest(args))
        
        // /wpapis/v1/roles or /wpapis/v1/roles/*
        return fetch(url, { 
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
                //console.log ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    const camelizedJson = camelizeKeys(json)
                    dispatch(updatePostSuccess(camelizedJson));
                } else {
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                console.log('fetch() unknown error: ' + error.message, error);
                dispatch(updatePostFailure(error))
            });
    }
}

export const removePost = (id) => {
    var url = "/coinapis/v1/posts/"+id;
    return (dispatch) => {
        dispatch(removePostRequest(id))
        
        // /wpapis/v1/roles or /wpapis/v1/roles/*
        return fetch(url, { 
            method: 'DELETE',
            cache: 'default',
        })
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //console.log ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    const camelizedJson = camelizeKeys(json)
                    dispatch(removePostSuccess(camelizedJson));
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                console.log('fetch() unknown error: ' + error.message, error);
                dispatch(removePostFailure(error))
            });
    }
}

export const retrievePosts = (args) => {
    var url = "/coinapis/v1/posts/"+(args||"");
    return (dispatch) => {
        dispatch(retrievePostRequest(url))
        // /wpapis/v1/roles or /wpapis/v1/roles/*
        return fetch(url)
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //console.log ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    var total = json.count;
                    const camelizedJson = camelizeKeys(json.data)
                    //const nextPageUrl = getNextPageUrl(response)
                    const res = normalize(camelizedJson, Schemas.POST_ARRAY);
                    xdebug ("retrievePosts:", res);
                    dispatch(retrievePostSuccess({db:res.entities.posts, total, url, result: res.result }));
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                console.log('fetch() unknown error: ' + error.message, error);
                dispatch(retrievePostFailure(error))
            });
    }
}

const ACTION_HANDLERS = {
    ['CREATE_POST_REQUEST']: (state, action) => ({ ...state, create: { ...state.create, fetching: true, error: null } }),
    ['CREATE_POST_SUCCESS']: (state, action) => ({ ...state, db: {...state.db, ...action.payload.db}, create: { ...state.create, fetching: false, error: null, result: action.payload.result } }),
    ['CREATE_POST_FAILURE']: (state, action) => ({ ...state, create: { ...state.create, fetching: false, error: action.payload } }),
    ['UPDATE_POST_REQUEST']: (state, action) => ({ ...state, update: { ...state.update, fetching: true, error: null } }),
    ['UPDATE_POST_SUCCESS']: (state, action) => ({ ...state, update: { ...state.update, ...action.payload, fetching: false } }),
    ['UPDATE_POST_FAILURE']: (state, action) => ({ ...state, update: { ...state.update, fetching: false, error: action.payload } }),
    ['REMOVE_POST_REQUEST']: (state, action) => ({ ...state, remove: { ...state.remove, fetching: true, error: null } }),
    ['REMOVE_POST_SUCCESS']: (state, action) => ({ ...state, remove: { ...state.remove, ...action.payload, fetching: false } }),
    ['REMOVE_POST_FAILURE']: (state, action) => ({ ...state, remove: { ...state.remove, fetching: false, error: action.payload } }),
    ['RETRIEVE_POST_REQUEST']: (state, action) => ({ ...state, retrieve: { ...state.retrieve, fetching: true, error: null } }),
    ['RETRIEVE_POST_SUCCESS']: (state, action) => ({ ...state, db: {...state.db, ...action.payload.db}, retrieve: { ...state.retrieve, fetching: false, error: null, total:action.payload.total, result: action.payload.result } }),
    ['RETRIEVE_POST_FAILURE']: (state, action) => ({ ...state, retrieve: { ...state.retrieve, fetching: false, error: action.payload } }),
}

const initialState = { db: {} }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

