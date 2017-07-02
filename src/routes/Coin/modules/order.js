var xdebug = window.myDebug('COIN:reducer:order');
import _ from 'lodash';
import { createActions } from 'redux-actions';

const { createOrderRequest, createOrderSuccess, createOrderFailure, updateOrderRequest, updateOrderSuccess, updateOrderFailure, retrieveOrderRequest, retrieveOrderSuccess, retrieveOrderFailure, removeOrderRequest, removeOrderSuccess, removeOrderFailure, retrieveMyOrderRequest, retrieveMyOrderSuccess, retrieveMyOrderFailure, retrieveMyLuckyOrderRequest, retrieveMyLuckyOrderSuccess, retrieveMyLuckyOrderFailure } = createActions('CREATE_ORDER_REQUEST', 'CREATE_ORDER_SUCCESS', 'CREATE_ORDER_FAILURE', 'UPDATE_ORDER_REQUEST', 'UPDATE_ORDER_SUCCESS', 'UPDATE_ORDER_FAILURE', 'RETRIEVE_ORDER_REQUEST', 'RETRIEVE_ORDER_SUCCESS', 'RETRIEVE_ORDER_FAILURE', 'REMOVE_ORDER_REQUEST', 'REMOVE_ORDER_SUCCESS', 'REMOVE_ORDER_FAILURE', 'RETRIEVE_MY_ORDER_REQUEST', 'RETRIEVE_MY_ORDER_SUCCESS', 'RETRIEVE_MY_ORDER_FAILURE', 'RETRIEVE_MY_LUCKY_ORDER_REQUEST', 'RETRIEVE_MY_LUCKY_ORDER_SUCCESS', 'RETRIEVE_MY_LUCKY_ORDER_FAILURE');

import { Schema, arrayOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'

const orderSchema = new Schema('orders', {
    idAttribute: 'id'
});
export const Schemas = {
    ORDER: orderSchema,
    ORDER_ARRAY: arrayOf(orderSchema),
}

export const createOrder = (args) => {
    var url = "/coinapis/v1/orders";
    return (dispatch) => {
        dispatch(createOrderRequest(args))
        
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
                    const res = normalize(camelizedJson, Schemas.ORDER);
                    xdebug ("createOrder result:", JSON.stringify(res));
                    dispatch(createOrderSuccess({db:res.entities.orders, result: res.result }));
                    return camelizedJson;
                    //return res.entities.orders[res.result];
                } else {
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                xdebug('error! createOrder fetch() fail: '+error.message, error);
                dispatch(createOrderFailure(error))
                throw error;
            });
    }
}

export const updateOrder = (args) => {
    var url = "/coinapis/v1/orders";
    return (dispatch) => {
        dispatch(updateOrderRequest(args))
        
        // /wpapis/v1/roles or /wpapis/v1/roles/*
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
                    dispatch(updateOrderSuccess(json));
                } else {
                    //throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                    dispatch(updateOrderFailure(json))
                }
                return json;
            })
            .catch((error) => {
                xdebug('error! updateOrder fetch() fail: '+error.message, error);
                dispatch(updateOrderFailure(error))
                return error;
            });
    }
}

export const removeOrder = (id) => {
    var url = "/coinapis/v1/orders/"+id;
    return (dispatch) => {
        dispatch(removeOrderRequest(id))
        
        // /wpapis/v1/roles or /wpapis/v1/roles/*
        return fetch(url, { 
            credentials: 'include',
            method: 'DELETE',
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
                    //const camelizedJson = camelizeKeys(json)
                    dispatch(removeOrderSuccess(json));
                } else {
                    //throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                    dispatch(removeOrderFailure(json))
                }
                return json;
            })
            .catch((error) => {
                xdebug('error! removeOrder fetch() fail: '+error.message, error);
                dispatch(removeOrderFailure(error))
                return error;
            });
    }
}

export const retrieveOrders = (postId, args, toMerge = true) => {
    var url = "/coinapis/v2/orders/"+(args||"");
    return (dispatch) => {
        dispatch(retrieveOrderRequest())
        // /wpapis/v1/roles or /wpapis/v1/roles/*
        return fetch(url, { method: 'GET',
                            headers: { 
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            //mode: 'cors',
                            cache: 'default'
                          })
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //xdebug ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    var total = json.count;
                    if (json.data) {
                        const camelizedJson = camelizeKeys(json.data)
                        //const nextPageUrl = getNextPageUrl(response)
                        const res = normalize(camelizedJson, Schemas.ORDER_ARRAY);
                        xdebug ("retrieveOrders:", res);
                        dispatch(retrieveOrderSuccess({db:res.entities.orders, total, postId, date:json.date, result: res.result, toMerge }));
                        return {db: res.entities.orders, result: res.result};
                    } else {
                        dispatch(retrieveOrderSuccess({db: {}, total, postId, date:json.date, result: [], toMerge }));
                        return {db: {}, result: []};
                    }
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                xdebug('error! retrieveOrders fetch() fail: '+error.message, error);
                dispatch(retrieveOrderFailure(error))
                return null;
            });
    }
}

export const retrieveOrdersLater = (postId, date) => {
    return (dispatch) => {
        var opts = {
            where: {
                postId,
                status: {$in: [1, 2]},
            },
            order: [ ['id', 'DESC'] ]
        };
        var toMerge = true;
        if (date) {
            opts.where.updatedAt = {$gt: date};
        } else {
            // no date, not merge!!
            toMerge = false;
        }
        return dispatch (retrieveOrders(postId, encodeURIComponent(JSON.stringify(opts)), toMerge));
    }
}

export const retrieveMyOrders = (page) => {
    page = page || 0;
    var url = "/coinapis/v1/myorders/order=id-;page="+page;
    return (dispatch) => {
        dispatch(retrieveMyOrderRequest())
        // /wpapis/v1/roles or /wpapis/v1/roles/*
        return fetch(url, { method: 'GET',
                            credentials: 'include',
                            headers: { 
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            //mode: 'cors',
                            cache: 'default'
                          })
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //xdebug ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    var total = json.count;
                    const camelizedJson = camelizeKeys(json.data)
                    //const nextPageUrl = getNextPageUrl(response)
                    const res = normalize(camelizedJson, Schemas.ORDER_ARRAY);
                    xdebug ("retrieveMyOrders:", res);
                    dispatch(retrieveMyOrderSuccess({db:res.entities.orders, total, page, result: res.result }));
                    return {db:res.entities.orders, total, page, result: res.result };
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                xdebug('error! retrieveMyOrders fetch() fail: '+error.message, error);
                dispatch(retrieveMyOrderFailure(error))
                return null;
            });
    }
}

export const retrieveMyLuckyOrders = (page) => {
    page = page || 0;
    var url = "/coinapis/v1/mylucky/order=id-;page="+page;
    return (dispatch) => {
        dispatch(retrieveMyLuckyOrderRequest())
        // /wpapis/v1/roles or /wpapis/v1/roles/*
        return fetch(url, { method: 'GET',
                            credentials: 'include',
                            headers: { 
                                "Content-Type": "application/json; charset=utf-8"
                            },
                            //mode: 'cors',
                            cache: 'default'
                          })
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //xdebug ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    var total = json.count;
                    const camelizedJson = camelizeKeys(json.data)
                    //const nextPageUrl = getNextPageUrl(response)
                    const res = normalize(camelizedJson, Schemas.ORDER_ARRAY);
                    xdebug ("retrieveMyLuckyOrders:", res);
                    dispatch(retrieveMyLuckyOrderSuccess({db:res.entities.orders, total, page, result: res.result }));
                    return {db:res.entities.orders, total, page, result: res.result };
                } else {
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                xdebug('error! retrieveMyLuckyOrders fetch() fail: '+error.message, error);
                dispatch(retrieveMyLuckyOrderFailure(error))
                return null;
            });
    }
}

const ACTION_HANDLERS = {
    ['CREATE_ORDER_REQUEST']: (state, action) => ({ ...state, create: { ...state.create, fetching: true, error: null } }),
    ['CREATE_ORDER_SUCCESS']: (state, action) => ({ ...state, db: {...state.db, ...action.payload.db}, create: { ...state.create, fetching: false, error: null, result: action.payload.result } }),
    ['CREATE_ORDER_FAILURE']: (state, action) => ({ ...state, create: { ...state.create, fetching: false, error: action.payload } }),
    ['UPDATE_ORDER_REQUEST']: (state, action) => ({ ...state, update: { ...state.update, fetching: true, error: null } }),
    ['UPDATE_ORDER_SUCCESS']: (state, action) => ({ ...state, update: { ...state.update, ...action.payload, fetching: false } }),
    ['UPDATE_ORDER_FAILURE']: (state, action) => ({ ...state, update: { ...state.update, fetching: false, error: action.payload } }),
    ['REMOVE_ORDER_REQUEST']: (state, action) => ({ ...state, remove: { ...state.remove, fetching: true, error: null } }),
    ['REMOVE_ORDER_SUCCESS']: (state, action) => ({ ...state, remove: { ...state.remove, ...action.payload, fetching: false } }),
    ['REMOVE_ORDER_FAILURE']: (state, action) => ({ ...state, remove: { ...state.remove, fetching: false, error: action.payload } }),
    ['RETRIEVE_ORDER_REQUEST']: (state, action) => ({ ...state, retrieve: { ...state.retrieve, fetching: true, error: null } }),
    ['RETRIEVE_ORDER_SUCCESS']: (state, action) => {
        var toMerge = action.payload && action.payload.toMerge;
        var old = state.retrieve && state.retrieve[action.payload.postId];
        var oldResult = old && old.result || [];
        var nresult = action.payload.result;
        if (toMerge) nresult = _.sortedUniq (_.concat (oldResult, action.payload.result).sort((a,b)=>(a-b))).reverse();
        //xdebug ("old:", old, "nresult:", nresult, ", state:", state);
        return ({ ...state, db: {...state.db, ...action.payload.db}, retrieve: { ...state.retrieve, fetching: false, error: null, date: action.payload.date, [action.payload.postId]: {total:action.payload.total, result: nresult} } })
    },
    ['RETRIEVE_ORDER_FAILURE']: (state, action) => ({ ...state, retrieve: { ...state.retrieve, fetching: false, error: action.payload } }),
    ['RETRIEVE_MY_ORDER_REQUEST']: (state, action) => ({ ...state, retrieveMine: { ...state.retrieveMine, fetching: true, error: null } }),
    ['RETRIEVE_MY_ORDER_SUCCESS']: (state, action) => {
        var old = state.retrieveMine && state.retrieveMine.result || [];
        var nresult = _.sortedUniq (_.concat (old, action.payload.result).sort((a,b)=>(a-b))).reverse();
        xdebug ("action:", action);
        //xdebug ("old:", old, "nresult:", nresult, ", state:", state);
        return ({ ...state, db: {...state.db, ...action.payload.db}, retrieveMine: { ...state.retrieveMine, fetching: false, error: null, total:action.payload.total, page:action.payload.page, result: nresult } })
    },
    ['RETRIEVE_MY_ORDER_FAILURE']: (state, action) => ({ ...state, retrieveMine: { ...state.retrieveMine, fetching: false, error: action.payload } }),
    ['RETRIEVE_MY_LUCKY_ORDER_REQUEST']: (state, action) => ({ ...state, retrieveMyLucky: { ...state.retrieveMyLucky, fetching: true, error: null } }),
    ['RETRIEVE_MY_LUCKY_ORDER_SUCCESS']: (state, action) => {
        var old = state.retrieveMyLucky && state.retrieveMyLucky.result || [];
        var nresult = _.sortedUniq (_.concat (old, action.payload.result).sort((a,b)=>(a-b))).reverse();
        return ({ ...state, db: {...state.db, ...action.payload.db}, retrieveMyLucky: { ...state.retrieveMyLucky, fetching: false, error: null, total:action.payload.total, page:action.payload.page, result: nresult } })
    },
    ['RETRIEVE_MY_LUCKY_ORDER_FAILURE']: (state, action) => ({ ...state, retrieveMyLucky: { ...state.retrieveMyLucky, fetching: false, error: action.payload } }),
}

const initialState = { db: {}, retrieve: {}, retrieveMine: {}, retrieveMyLucky: {} }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

