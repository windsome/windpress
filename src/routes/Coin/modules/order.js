var xdebug = window.myDebug('COIN:reducer:order');
import _ from 'lodash';
import { createActions } from 'redux-actions';

const { createOrderRequest, createOrderSuccess, createOrderFailure, updateOrderRequest, updateOrderSuccess, updateOrderFailure, retrieveOrderRequest, retrieveOrderSuccess, retrieveOrderFailure, removeOrderRequest, removeOrderSuccess, removeOrderFailure } = createActions('CREATE_ORDER_REQUEST', 'CREATE_ORDER_SUCCESS', 'CREATE_ORDER_FAILURE', 'UPDATE_ORDER_REQUEST', 'UPDATE_ORDER_SUCCESS', 'UPDATE_ORDER_FAILURE', 'RETRIEVE_ORDER_REQUEST', 'RETRIEVE_ORDER_SUCCESS', 'RETRIEVE_ORDER_FAILURE', 'REMOVE_ORDER_REQUEST', 'REMOVE_ORDER_SUCCESS', 'REMOVE_ORDER_FAILURE');

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
                    const res = normalize(camelizedJson, Schemas.ORDER);
                    xdebug ("create:", res);
                    dispatch(createOrderSuccess({db:res.entities.orders, result: res.result }));
                    return res.entities.orders[res.result];
                } else {
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                console.log('fetch() unknown error: ' + error.message, error);
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
                    dispatch(updateOrderSuccess(camelizedJson));
                } else {
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                console.log('fetch() unknown error: ' + error.message, error);
                dispatch(updateOrderFailure(error))
            });
    }
}

export const removeOrder = (id) => {
    var url = "/coinapis/v1/orders/"+id;
    return (dispatch) => {
        dispatch(removeOrderRequest(id))
        
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
                    dispatch(removeOrderSuccess(camelizedJson));
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                console.log('fetch() unknown error: ' + error.message, error);
                dispatch(removeOrderFailure(error))
            });
    }
}

export const retrieveOrders = (postId, args) => {
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
                //console.log ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    // must be a array.
                    var total = json.count;
                    const camelizedJson = camelizeKeys(json.data)
                    //const nextPageUrl = getNextPageUrl(response)
                    const res = normalize(camelizedJson, Schemas.ORDER_ARRAY);
                    xdebug ("retrieveOrders:", res);
                    dispatch(retrieveOrderSuccess({db:res.entities.orders, total, postId, result: res.result }));
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                console.log('fetch() unknown error: ' + error.message, error);
                dispatch(retrieveOrderFailure(error))
            });
    }
}

export const retrieveOrdersLatest = (postId) => {
    return (dispatch) => {
        var opts = {
            where: {
                postId,
                status: 0,
            },
            order: [ ['id', 'DESC'] ]
        };
        dispatch (retrieveOrders(postId, encodeURIComponent(JSON.stringify(opts))));
    }
}

export const retrieveOrdersBigThan = (postId, lastOrderId) => {
    return (dispatch) => {
        var opts = {
            where: {
                postId,
                status: 0,
                id : {
                    $gt: lastOrderId
                }
            },
            order: [ ['id', 'DESC'] ]
        };
        dispatch (retrieveOrders(postId, encodeURIComponent(JSON.stringify(opts))));
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
        var old = state.retrieve && state.retrieve[action.payload.postId];
        var result = old && old.result || [];
        var nresult = _.sortedUniq (_.concat (result, action.payload.result).sort((a,b)=>(a-b))).reverse();
        //xdebug ("old:", old, "nresult:", nresult, ", state:", state);
        return ({ ...state, db: {...state.db, ...action.payload.db}, retrieve: { ...state.retrieve, fetching: false, error: null, [action.payload.postId]: {total:action.payload.total, result: nresult} } })
    },
    ['RETRIEVE_ORDER_FAILURE']: (state, action) => ({ ...state, retrieve: { ...state.retrieve, fetching: false, error: action.payload } }),
}

const initialState = { db: {} }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

