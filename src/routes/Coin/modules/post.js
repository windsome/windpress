var xdebug = window.myDebug('COIN:reducer:post');

import { createActions } from 'redux-actions';

export const { createPostRequest, createPostSuccess, createPostFailure, updatePostRequest, updatePostSuccess, updatePostFailure, retrievePostRefresh, retrievePostRequest, retrievePostSuccess, retrievePostFailure, removePostRequest, removePostSuccess, removePostFailure, retrieveMyPostRefresh, retrieveMyPostRequest, retrieveMyPostSuccess, retrieveMyPostFailure, retrieveRootPostRefresh, retrieveRootPostRequest, retrieveRootPostSuccess, retrieveRootPostFailure, retrieveFavorPostRefresh, retrieveFavorPostRequest, retrieveFavorPostSuccess, retrieveFavorPostFailure, setPostEditor, updatePostEditor, searchPostRefresh, searchPostRequest, searchPostSuccess, searchPostFailure, postUpdated, refundPostRequest, refundPostSuccess, refundPostFailure } = createActions('CREATE_POST_REQUEST', 'CREATE_POST_SUCCESS', 'CREATE_POST_FAILURE', 'UPDATE_POST_REQUEST', 'UPDATE_POST_SUCCESS', 'UPDATE_POST_FAILURE', 'RETRIEVE_POST_REFRESH', 'RETRIEVE_POST_REQUEST', 'RETRIEVE_POST_SUCCESS', 'RETRIEVE_POST_FAILURE', 'REMOVE_POST_REQUEST', 'REMOVE_POST_SUCCESS', 'REMOVE_POST_FAILURE', 'RETRIEVE_MY_POST_REFRESH', 'RETRIEVE_MY_POST_REQUEST', 'RETRIEVE_MY_POST_SUCCESS', 'RETRIEVE_MY_POST_FAILURE', 'RETRIEVE_ROOT_POST_REFRESH', 'RETRIEVE_ROOT_POST_REQUEST', 'RETRIEVE_ROOT_POST_SUCCESS', 'RETRIEVE_ROOT_POST_FAILURE', 'RETRIEVE_FAVOR_POST_REFRESH', 'RETRIEVE_FAVOR_POST_REQUEST', 'RETRIEVE_FAVOR_POST_SUCCESS', 'RETRIEVE_FAVOR_POST_FAILURE', 'SET_POST_EDITOR', 'UPDATE_POST_EDITOR', 'SEARCH_POST_REFRESH', 'SEARCH_POST_REQUEST', 'SEARCH_POST_SUCCESS', 'SEARCH_POST_FAILURE', 'POST_UPDATED', 'REFUND_POST_REQUEST', 'REFUND_POST_SUCCESS', 'REFUND_POST_FAILURE');

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
            credentials: 'include',
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
                //xdebug ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    const camelizedJson = camelizeKeys(json)
                    const res = normalize(camelizedJson, Schemas.POST);
                    xdebug ("createPost result:", res);
                    dispatch(createPostSuccess({db:res.entities.orders, result: res.result }));
                    return camelizedJson;
                } else {
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                xdebug('error! createPost fetch() fail: ' + error.message, error);
                dispatch(createPostFailure(error))
                return null;
            });
    }
}

export const updatePost = (args) => {
    var url = "/coinapis/v1/posts/"+args.id;
    return (dispatch) => {
        dispatch(updatePostRequest(args))
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
                    dispatch(updatePostSuccess(json));
                    return json;
                } else {
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                xdebug('error! updatePost fetch() fail: ' + error.message, error);
                dispatch(updatePostFailure(error))
                return error;
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
            credentials: 'include',
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
                    dispatch(removePostSuccess(json));
                } else {
                    //row new Error ("server errcode="+json.errcode + ", message="+json.message);
                    dispatch(removePostFailure(json));
                }
                return json;
            })
            .catch((error) => {
                xdebug('error! removePost fetch() fail: ' + error.message, error);
                dispatch(removePostFailure(error))
                return error;
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
                        const res = normalize(camelizedJson, Schemas.POST_ARRAY);
                        //xdebug ("retrievePosts:", json, res, info);
                        dispatch(retrievePostSuccess({db:res.entities.posts, info, url, result: res.result }));
                        return { db: res.entities.posts, result: res.result }
                    } else {
                        throw new Error ("retrievePosts() no data!");
                    }
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch(error => {
                xdebug('error! retrievePosts fetch() fail: '+error.message, error);
                dispatch(retrievePostFailure(error))
                return null;
            });
    }
}

export const retrieveOwnerPublishedPosts = (owner, page) => {
    return (dispatch) => {
        page = page && parseInt(page) || 0;
        if (page == 0) dispatch(retrievePostRefresh())
        if (owner)
            return dispatch (retrievePosts ("owner="+owner+";status=2;order=id-;page="+page));
        else
            return dispatch (retrievePosts ("status=2;order=id-;page="+page));
    }
}

export const retrieveMyPosts = (page) => {
    page = page && parseInt(page) || 0;
    var url = "/coinapis/v1/myposts/order=id-;page="+page;
    return (dispatch) => {
        if (page == 0) dispatch(retrieveMyPostRefresh());
        dispatch(retrieveMyPostRequest())
        // /wpapis/v1/roles or /wpapis/v1/roles/*
        return fetch(url, {credentials: 'include'})
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
                        const res = normalize(camelizedJson, Schemas.POST_ARRAY);
                        xdebug ("retrieveMyPosts:", res);
                        dispatch(retrieveMyPostSuccess({db:res.entities.posts, result: res.result, info }));
                        return { db: res.entities.posts, result: res.result }
                    } else {
                        throw new Error ("retrieveMyPosts() no data!");
                    }
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                xdebug('error! retrieveMyPosts fetch() fail: '+error.message, error);
                dispatch(retrieveMyPostFailure(error))
                return null;
            });
    }
}

export const retrieveRootPosts = (page) => {
    page = page && parseInt(page) || 0;
    var url = "/coinapis/v1/rootposts/order=id-;page="+page;
    return (dispatch) => {
        if (page == 0) dispatch(retrieveRootPostRefresh())
        dispatch(retrieveRootPostRequest())
        // /wpapis/v1/roles or /wpapis/v1/roles/*
        return fetch(url, {credentials: 'include'})
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //xdebug ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    if (json.data) {
                        var {data, ...info} = json;
                        const camelizedJson = camelizeKeys(json.data)
                        //const nextPageUrl = getNextPageUrl(response)
                        const res = normalize(camelizedJson, Schemas.POST_ARRAY);
                        xdebug ("retrieveRootPosts:", res);
                        dispatch(retrieveRootPostSuccess({db:res.entities.posts, result: res.result, info }));
                        return { db: res.entities.posts, result: res.result }
                    } else {
                        throw new Error ("retrieveRootPosts() no data!");
                    }
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode+", message="+json.message);
                }
            })
            .catch((error) => {
                xdebug('error! retrieveRootPosts fetch() fail: '+error.message, error);
                dispatch(retrieveRootPostFailure(error))
                return null;
            });
    }
}

export const retrieveFavorPosts = (page) => {
    page = page && parseInt(page) || 0;
    var url = "/coinapis/v1/posts/favor=1;status=2;order=id-;page="+page;
    return (dispatch) => {
        if (page == 0) dispatch(retrieveFavorPostRefresh())
        dispatch(retrieveFavorPostRequest())
        // /wpapis/v1/roles or /wpapis/v1/roles/*
        return fetch(url, {credentials: 'include'})
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //xdebug ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    if (json.data) {
                        var {data, ...info} = json;
                        const camelizedJson = camelizeKeys(json.data)
                        //const nextPageUrl = getNextPageUrl(response)
                        const res = normalize(camelizedJson, Schemas.POST_ARRAY);
                        xdebug ("retrieveFavorPosts:", res);
                        dispatch(retrieveFavorPostSuccess({db:res.entities.posts, result: res.result, info }));
                        return { db: res.entities.posts, result: res.result }
                    } else {
                        throw new Error ("retrieveFavorPosts() no data!");
                    }
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode+", message="+json.message);
                }
            })
            .catch((error) => {
                xdebug('error! retrieveFavorPosts fetch() fail: '+error.message, error);
                dispatch(retrieveFavorPostFailure(error))
                return null;
            });
    }
}

export const searchPosts = (key, page) => {
    page = page && parseInt(page) || 0;
    var url = "/coinapis/v1/searchposts";
    return (dispatch) => {
        if (page == 0) dispatch(searchPostRefresh());
        dispatch(searchPostRequest())
        // /wpapis/v1/roles or /wpapis/v1/roles/*
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
                        const res = normalize(camelizedJson, Schemas.POST_ARRAY);
                        xdebug ("searchPosts:", res);
                        dispatch(searchPostSuccess({db:res.entities.posts, result: res.result, info }));
                        return { db: res.entities.posts, result: res.result }
                    } else {
                        throw new Error ("searchPosts() no data!");
                    }
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                xdebug('error! searchPosts fetch() fail: '+error.message, error);
                dispatch(searchPostFailure(error))
                return null;
            });
    }
}

export const retrieveSomePosts = (ids) => {
    var url = "/coinapis/v1/posts/id=["+ids.toString()+"]";
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
                        const res = normalize(camelizedJson, Schemas.POST_ARRAY);
                        //xdebug ("retrieveUsers:", json, res, info);
                        dispatch(postUpdated({db:res.entities.posts, result: res.result, info }));
                        return { db: res.entities.posts, result: res.result }
                    } else {
                        throw new Error ("retrieveSomePosts() no data!");
                    }
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch(error => {
                xdebug('error! retrieveSomePosts fetch() fail: '+error.message, error);
                return null;
            });
    }
}

export const refundPost = (postId) => {
    var url = "/coinapis/v1/post_refund/"+postId;
    return (dispatch) => {
        dispatch(refundPostRequest())
        // /wpapis/v1/roles or /wpapis/v1/roles/*
        return fetch(url, { 
            credentials: 'include',
            method: 'POST',
            headers: { 
                "Content-Type": "application/json; charset=utf-8"
            },
            //mode: 'cors',
            cache: 'default',
            body: JSON.stringify({}) 
        })
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //xdebug ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    dispatch(refundPostSuccess({ json }));
                    return json;
                } else {
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                xdebug('error! refundPosts fetch() fail: '+error.message, error);
                dispatch(refundPostFailure(error))
                return null;
            });
    }
}


const ACTION_HANDLERS = {
    ['CREATE_POST_REQUEST']: (state, action) => ({ ...state, create: { fetching: true, error: null } }),
    ['CREATE_POST_SUCCESS']: (state, action) => ({ ...state, db: {...state.db, ...action.payload.db}, create: { fetching: false, error: null, result: action.payload.result } }),
    ['CREATE_POST_FAILURE']: (state, action) => ({ ...state, create: { fetching: false, error: action.payload } }),
    ['UPDATE_POST_REQUEST']: (state, action) => ({ ...state, update: { fetching: true, error: null } }),
    ['UPDATE_POST_SUCCESS']: (state, action) => ({ ...state, update: { fetching: false, result: action.payload } }),
    ['UPDATE_POST_FAILURE']: (state, action) => ({ ...state, update: { fetching: false, error: action.payload } }),
    ['REMOVE_POST_REQUEST']: (state, action) => ({ ...state, remove: { fetching: true, error: null, result: null } }),
    ['REMOVE_POST_SUCCESS']: (state, action) => ({ ...state, remove: { fetching: false, error: null, result: action.payload } }),
    ['REMOVE_POST_FAILURE']: (state, action) => ({ ...state, remove: { fetching: false, error: action.payload, result: null } }),
    ['RETRIEVE_POST_REFRESH']: (state, action) => ({ ...state, retrieve: { fetching: false, error: null, result: [] } }),
    ['RETRIEVE_POST_REQUEST']: (state, action) => ({ ...state, retrieve: { ...state.retrieve, fetching: true, error: null } }),
    ['RETRIEVE_POST_SUCCESS']: (state, action) => {
        //xdebug ("action:", action);
        var result = state.retrieve && state.retrieve.result || [];
        result = result.concat(action.payload.result);
        var nresult = result.filter((item, pos) => {
            return result.indexOf(item) == pos;
        });
        return ({ ...state, db: {...state.db, ...action.payload.db}, retrieve: { ...state.retrieve, fetching: false, error: null, ...action.payload.info, result: nresult } })
    },
    ['RETRIEVE_POST_FAILURE']: (state, action) => ({ ...state, retrieve: { ...state.retrieve, fetching: false, error: action.payload } }),
    ['RETRIEVE_MY_POST_REFRESH']: (state, action) => ({ ...state, retrieveMine: { fetching: false, error: null, result: [] } }),
    ['RETRIEVE_MY_POST_REQUEST']: (state, action) => ({ ...state, retrieveMine: { ...state.retrieveMine, fetching: true, error: null } }),
    ['RETRIEVE_MY_POST_SUCCESS']: (state, action) => {
        var result = state.retrieveMine && state.retrieveMine.result || [];
        result = result.concat(action.payload.result);
        var nresult = result.filter((item, pos) => {
            return result.indexOf(item) == pos;
        });
        return ({ ...state, db: {...state.db, ...action.payload.db}, retrieveMine: { ...state.retrieveMine, fetching: false, error: null, ...action.payload.info, result: nresult } })
    },
    ['RETRIEVE_MY_POST_FAILURE']: (state, action) => ({ ...state, retrieveMine: { ...state.retrieveMine, fetching: false, error: action.payload } }),
    ['RETRIEVE_ROOT_POST_REFRESH']: (state, action) => ({ ...state, retrieveRoot: { fetching: false, error: null, result: [] } }),
    ['RETRIEVE_ROOT_POST_REQUEST']: (state, action) => ({ ...state, retrieveRoot: { ...state.retrieveRoot, fetching: true, error: null } }),
    ['RETRIEVE_ROOT_POST_SUCCESS']: (state, action) => { 
        var result = state.retrieveRoot && state.retrieveRoot.result || [];
        result = result.concat(action.payload.result);
        var nresult = result.filter((item, pos) => {
            return result.indexOf(item) == pos;
        });
        return ({ ...state, db: {...state.db, ...action.payload.db}, retrieveRoot: { ...state.retrieveRoot, fetching: false, error: null, ...action.payload.info, result: nresult } })
    },
    ['RETRIEVE_ROOT_POST_FAILURE']: (state, action) => ({ ...state, retrieveRoot: { ...state.retrieveRoot, fetching: false, error: action.payload } }),
    ['RETRIEVE_FAVOR_POST_REFRESH']: (state, action) => ({ ...state, retrieveFavor: { fetching: false, error: null, result: [] } }),
    ['RETRIEVE_FAVOR_POST_REQUEST']: (state, action) => ({ ...state, retrieveFavor: { ...state.retrieveFavor, fetching: true, error: null } }),
    ['RETRIEVE_FAVOR_POST_SUCCESS']: (state, action) => { 
        var result = state.retrieveFavor && state.retrieveFavor.result || [];
        result = result.concat(action.payload.result);
        var nresult = result.filter((item, pos) => {
            return result.indexOf(item) == pos;
        });
        return ({ ...state, db: {...state.db, ...action.payload.db}, retrieveFavor: { ...state.retrieveFavor, fetching: false, error: null, ...action.payload.info, result: nresult } })
    },
    ['RETRIEVE_FAVOR_POST_FAILURE']: (state, action) => ({ ...state, retrieveFavor: { ...state.retrieveFavor, fetching: false, error: action.payload } }),
    ['SET_POST_EDITOR']: (state, action) => ({ ...state, create: {}, update: {}, editor: {...action.payload} }),
    ['UPDATE_POST_EDITOR']: (state, action) => ({ ...state, editor: {...state.editor, ...action.payload} }),
    ['SEARCH_POST_REFRESH']: (state, action) => ({ ...state, search: { fetching: false, error: null, result: [] } }),
    ['SEARCH_POST_REQUEST']: (state, action) => ({ ...state, search: { ...state.search, fetching: true, error: null } }),
    ['SEARCH_POST_SUCCESS']: (state, action) => {
        var result = state.search && state.search.result || [];
        result = result.concat(action.payload.result);
        var nresult = result.filter((item, pos) => {
            return result.indexOf(item) == pos;
        });
        return ({ ...state, db: {...state.db, ...action.payload.db}, search: { ...state.search, fetching: false, error: null, ...action.payload.info, result: nresult } })
    },
    ['SEARCH_POST_FAILURE']: (state, action) => ({ ...state, search: { ...state.search, fetching: false, error: action.payload } }),
    ['POST_UPDATED']: (state, action) => ({ ...state, db: {...state.db, ...action.payload.db} }),
    ['REFUND_POST_REQUEST']: (state, action) => ({ ...state, refund: { fetching: true, error: null, result: null } }),
    ['REFUND_POST_SUCCESS']: (state, action) => ({ ...state, refund: { fetching: false, error: null, result: action.payload } }),
    ['REFUND_POST_FAILURE']: (state, action) => ({ ...state, refund: { fetching: false, error: action.payload, result: null } }),
}

const initialState = { db: {}, retrieve:{}, retrieveMine:{}, retrieveRoot:{}, retrieveFavor:{}, search:{}, create: {}, editor: {}, refund: {} }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

