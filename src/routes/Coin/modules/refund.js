var xdebug = window.myDebug('COIN:reducer:refund');
import _ from 'lodash';
import { createActions } from 'redux-actions';

const { retrieveRefundRequest, retrieveRefundSuccess, retrieveRefundFailure, retrieveMyRefundRequest, retrieveMyRefundSuccess, retrieveMyRefundFailure, retrieveRootRefundRequest, retrieveRootRefundSuccess, retrieveRootRefundFailure, removeRefundRequest, removeRefundSuccess, removeRefundFailure } = createActions('RETRIEVE_REFUND_REQUEST', 'RETRIEVE_REFUND_SUCCESS', 'RETRIEVE_REFUND_FAILURE', 'RETRIEVE_MY_REFUND_REQUEST', 'RETRIEVE_MY_REFUND_SUCCESS', 'RETRIEVE_MY_REFUND_FAILURE', 'RETRIEVE_ROOT_REFUND_REQUEST', 'RETRIEVE_ROOT_REFUND_SUCCESS', 'RETRIEVE_ROOT_REFUND_FAILURE', 'REMOVE_REFUND_REQUEST', 'REMOVE_REFUND_SUCCESS', 'REMOVE_REFUND_FAILURE');

import { Schema, arrayOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'

const refundSchema = new Schema('refunds', {
    idAttribute: 'id'
});
export const Schemas = {
    REFUND: refundSchema,
    REFUND_ARRAY: arrayOf(refundSchema),
}

export const retrieveMyRefunds = (page) => {
    page = page || 0;
    var url = "/coinapis/v1/myrefunds/order=id-;page="+page;
    return (dispatch) => {
        dispatch(retrieveMyRefundRequest())
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
                    const res = normalize(camelizedJson, Schemas.REFUND_ARRAY);
                    xdebug ("retrieveMyRefunds:", res);
                    dispatch(retrieveMyRefundSuccess({db:res.entities.refunds, total, page, result: res.result }));
                    return {db:res.entities.refunds, total, page, result: res.result };
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                xdebug('error! retrieveMyRefunds fetch() fail: '+error.message, error);
                dispatch(retrieveMyRefundFailure(error))
                return {};
            });
    }
}

export const retrieveRootRefunds = (page) => {
    page = page || 0;
    var url = "/coinapis/v1/rootrefunds/order=id-;page="+page;
    return (dispatch) => {
        dispatch(retrieveRootRefundRequest())
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
                    xdebug ("retrieveRootRefunds:", res);
                    dispatch(retrieveRootRefundSuccess({db:res.entities.orders, total, page, result: res.result }));
                    return {db:res.entities.orders, total, page, result: res.result };
                } else {
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                xdebug('error! retrieveRootRefunds fetch() fail: '+error.message, error);
                dispatch(retrieveRootRefundFailure(error))
                return {};
            });
    }
}

const ACTION_HANDLERS = {
    ['REMOVE_REFUND_REQUEST']: (state, action) => ({ ...state, remove: { ...state.remove, fetching: true, error: null } }),
    ['REMOVE_REFUND_SUCCESS']: (state, action) => ({ ...state, remove: { ...state.remove, ...action.payload, fetching: false } }),
    ['REMOVE_REFUND_FAILURE']: (state, action) => ({ ...state, remove: { ...state.remove, fetching: false, error: action.payload } }),
    ['RETRIEVE_REFUND_REQUEST']: (state, action) => ({ ...state, retrieve: { ...state.retrieve, fetching: true, error: null } }),
    ['RETRIEVE_REFUND_SUCCESS']: (state, action) => {
        var toMerge = action.payload && action.payload.toMerge;
        var old = state.retrieve && state.retrieve[action.payload.postId];
        var oldResult = old && old.result || [];
        var nresult = action.payload.result;
        if (toMerge) nresult = _.sortedUniq (_.concat (oldResult, action.payload.result).sort((a,b)=>(a-b))).reverse();
        //xdebug ("old:", old, "nresult:", nresult, ", state:", state);
        return ({ ...state, db: {...state.db, ...action.payload.db}, retrieve: { ...state.retrieve, fetching: false, error: null, date: action.payload.date, [action.payload.postId]: {total:action.payload.total, result: nresult} } })
    },
    ['RETRIEVE_REFUND_FAILURE']: (state, action) => ({ ...state, retrieve: { ...state.retrieve, fetching: false, error: action.payload } }),
    ['RETRIEVE_MY_REFUND_REQUEST']: (state, action) => ({ ...state, retrieveMine: { ...state.retrieveMine, fetching: true, error: null } }),
    ['RETRIEVE_MY_REFUND_SUCCESS']: (state, action) => {
        var old = state.retrieveMine && state.retrieveMine.result || [];
        var nresult = _.sortedUniq (_.concat (old, action.payload.result).sort((a,b)=>(a-b))).reverse();
        xdebug ("action:", action);
        //xdebug ("old:", old, "nresult:", nresult, ", state:", state);
        return ({ ...state, db: {...state.db, ...action.payload.db}, retrieveMine: { ...state.retrieveMine, fetching: false, error: null, total:action.payload.total, page:action.payload.page, result: nresult } })
    },
    ['RETRIEVE_MY_REFUND_FAILURE']: (state, action) => ({ ...state, retrieveMine: { ...state.retrieveMine, fetching: false, error: action.payload } }),
    ['RETRIEVE_ROOT_REFUND_REQUEST']: (state, action) => ({ ...state, retrieveRoot: { ...state.retrieveRoot, fetching: true, error: null } }),
    ['RETRIEVE_ROOT_REFUND_SUCCESS']: (state, action) => {
        var old = state.retrieveRoot && state.retrieveRoot.result || [];
        var nresult = _.sortedUniq (_.concat (old, action.payload.result).sort((a,b)=>(a-b))).reverse();
        xdebug ("action:", action);
        //xdebug ("old:", old, "nresult:", nresult, ", state:", state);
        return ({ ...state, db: {...state.db, ...action.payload.db}, retrieveRoot: { ...state.retrieveRoot, fetching: false, error: null, total:action.payload.total, page:action.payload.page, result: nresult } })
    },
    ['RETRIEVE_ROOT_REFUND_FAILURE']: (state, action) => ({ ...state, retrieveRoot: { ...state.retrieveRoot, fetching: false, error: action.payload } }),
}

const initialState = { db: {}, retrieve: {}, retrieveMine: {}, retrieveRoot: {} }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

