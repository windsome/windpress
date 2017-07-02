var xdebug = window.myDebug('PAY:reducer:pay');
import _ from 'lodash';
import { createActions } from 'redux-actions';

export const { jsPayOrders, sandboxKeyRequest, sandboxKeySuccess, sandboxKeyFailure, notifyRequest, notifySuccess, notifyFailure, retrieveOrderRequest, retrieveOrderSuccess, retrieveOrderFailure } = createActions('JS_PAY_ORDERS', 'SANDBOX_KEY_REQUEST', 'SANDBOX_KEY_SUCCESS', 'SANDBOX_KEY_FAILURE', 'NOTIFY_REQUEST', 'NOTIFY_SUCCESS', 'NOTIFY_FAILURE', 'RETRIEVE_ORDER_REQUEST', 'RETRIEVE_ORDER_SUCCESS', 'RETRIEVE_ORDER_FAILURE');

//export jsPayOrders;
/*
export const checkOrderStatus = (order) => {
    return (dispatch) => {
        dispatch(notifyRequest());
        return fetch('/coinapis/v1/orders/'+order.id, { 
            method: 'GET',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            //mode: 'cors',
            cache: 'default',
        })
            .then(response => response.json())
            .then(retobj => {
                if ((!retobj.errcode || retobj.errcode === 0)
                    && retobj.count > 0 && retobj.data.size() == 1) {
                    dispatch(notifySuccess(retobj.data[0]))
                } else {
                    dispatch(notifyFailure(retobj));
                }
            })
    }
}
*/
const _sleep = (timeout) => {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve();
        }, timeout);
    });
}
async function checkOrderTimeout (order, timeout, dispatch) {
    if (!!!timeout) timeout = 5;
    var isOK = false;
    var nOrder = null;
    //try {
        for (var i = 0; i < timeout; i++) {
            await _sleep (1000);
            let response = await fetch('/coinapis/v1/orders/'+order.id, { 
                method: 'GET',
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                //mode: 'cors',
                cache: 'default',
            });
            //let response = await fetch(url);
            let retobj = await response.json();
            if ((!retobj.errcode || retobj.errcode === 0)
                && retobj.count > 0 && retobj.data.length == 1) {
                nOrder = retobj.data[0];
            } else {
                xdebug ("error! checkOrderTimeout:", JSON.stringify(retobj));
            }

            if (nOrder) {
                if (nOrder.status == 2) {
                    xdebug ("pay success!");
                    dispatch(notifySuccess(nOrder));
                    isOK = true;
                    break;
                }
            }
        }
    //} catch (error) {
    //    nOrder = error;
    //}
    if (!isOK)
        dispatch(notifyFailure({errcode: -1, message: '订单状态 '+(nOrder&&nOrder.status||'空'), order: nOrder}));
    return isOK;
}
export const checkOrderStatus = (order, timeout) => {
    return (dispatch) => {
        xdebug ("checkOrderStatus");
        dispatch(notifyRequest());
        return checkOrderTimeout (order, timeout, dispatch);
    }
}

export const WxBridge = (args) => {
    xdebug("WxBridge支付参数："+JSON.stringify(args));
    return new Promise((resolve, reject) => {
        WeixinJSBridge.invoke('getBrandWCPayRequest', args, (res) => {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                xdebug("支付成功，等待服务器返回");
                // 这里可以跳转到订单完成页面向用户展示
                //dispatch(checkOrderStatus (trade, 5));
                resolve(true);
            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                xdebug("支付失败："+JSON.stringify(res));
                //dispatch(notifyFailure());
                reject({errcode: -1, message: '用户取消了'});
            } else {
                xdebug("支付失败："+JSON.stringify(res));
                //dispatch(notifyFailure());
                reject({errcode: -1, message: res.err_desc || res.err_msg});
            }
        });
    });
}
export const invokePayment = (trade, openid) => {
    if (!trade || !openid) {
        xdebug ("parameter error! trade=", trade, ", openid=", openid);
        return;
    }
    return (dispatch) => {
        var postName = trade.desc && trade.desc.name || '未命名';
        var postContent = trade.desc && trade.desc.content || '';
        var body = postName + " "+trade.count+" 注";
        var attach = postName + " " + postContent;
        attach = attach.substr(0, 127);
        var order = {
            body: body,
            attach: attach,
            out_trade_no: trade.uuid,
            total_fee: trade.fee,
            sub_openid: openid,
            trade_type: 'JSAPI'
        };
        xdebug ("invokePayment order:", order);
//        try{
        return fetch('/wcapis/v1/get_pay_request_params', { 
            method: 'POST',
            headers: { 
                "Content-Type": "application/json; charset=utf-8"
            },
            //mode: 'cors',
            cache: 'default',
            body: JSON.stringify(order) 
        })
            .then(response => response.json())
            .then(payargs => {
                if (!payargs) {
                    xdebug ("error! payargs null!");
                    dispatch(notifyFailure({errcode: -1, message: "unkown error!"}));
                    return false;
                } else if (payargs.errcode && payargs.errcode !== 0) {
                    xdebug ("error! payargs:", payargs.message);
                    dispatch(notifyFailure(payargs));
                    return false;
                } else {
                    // no error.
                    return WxBridge (payargs).then((ret)=>{
                        xdebug ("WxBridge return "+ret);
                        return ret;
                    });
                }
            }).catch (e => {
                xdebug ("error caught:", e.message);
                dispatch(notifyFailure(e));
                return false;
            })
//        } catch (e) {
//            xdebug ("error:", e.message);
//        }
    }    
}

export const acquireSandboxKey = () => {
    return (dispatch) => {
        dispatch(sandboxKeyRequest());
        return fetch('/wcapis/v1/get_sign_key', { 
            method: 'POST',
            headers: { 
                "Content-Type": "application/json; charset=utf-8"
            },
            //mode: 'cors',
            cache: 'default',
            body: JSON.stringify({}) 
        })
            .then(response => response.json())
            .then(retobj => {
                if (retobj.return_code === 'SUCCESS') {
                    dispatch(sandboxKeySuccess(retobj.sandbox_signkey))
                    return retobj.sandbox_signkey;
                } else {
                    dispatch(sandboxKeyFailure(retobj));
                    return null;
                }
            }).catch (error => {
                dispatch(sandboxKeyFailure(error));
                return null;
            })
    }    
}

import { Schema, arrayOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'

const orderSchema = new Schema('orders', {
    idAttribute: 'id'
});
export const Schemas = {
    ORDER: orderSchema,
    ORDER_ARRAY: arrayOf(orderSchema),
}
export const retrieveOrder = (id) => {
    var url = "/coinapis/v1/orders/"+id;
    return (dispatch) => {
        dispatch(retrieveOrderRequest(id))
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
                    //const res = normalize(camelizedJson, Schemas.ORDER_ARRAY);
                    xdebug ("retrieveOrder:", JSON.stringify(camelizedJson));
                    dispatch(retrieveOrderSuccess(camelizedJson));
                    return camelizedJson;
                } else {
                    //dispatch(createFailureFolder(json))
                    throw new Error ("server errcode="+json.errcode + ", message="+json.message);
                }
            })
            .catch((error) => {
                console.log('fetch() unknown error: ' + error.message, error);
                dispatch(retrieveOrderFailure(error))
                return null;
            });
    }
}


const ACTION_HANDLERS = {
    ['JS_PAY_ORDERS']: (state, action) => ({ ...state, orders: action.payload }),
    ['SANDBOX_KEY_REQUEST']: (state, action) => ({ ...state, sandbox: {fetching:true, error: null} }),
    ['SANDBOX_KEY_SUCCESS']: (state, action) => ({ ...state, sandbox: {...state.sandbox, fetching:false, error: null, key: action.payload} }),
    ['SANDBOX_KEY_FAILURE']: (state, action) => ({ ...state, sandbox: {...state.sandbox, fetching:false, error: action.payload} }),
    ['NOTIFY_REQUEST']: (state, action) => ({ ...state, notify: {fetching:true, error: null, order: null} }),
    ['NOTIFY_SUCCESS']: (state, action) => ({ ...state, notify: {fetching:false, error: null, order: action.payload} }),
    ['NOTIFY_FAILURE']: (state, action) => ({ ...state, notify: {fetching:false, error: action.payload, order: null} }),
    ['RETRIEVE_ORDER_REQUEST']: (state, action) => ({ ...state, retrieve: {fetching:true, error: null, id: action.payload} }),
    ['RETRIEVE_ORDER_SUCCESS']: (state, action) => ({ ...state, retrieve: {...state.retrieve, fetching:false, error: null}, orders: action.payload }),
    ['RETRIEVE_ORDER_FAILURE']: (state, action) => ({ ...state, retrieve: {...state.retrieve, fetching:false, error: action.payload} }),
}

const initialState = { orders: [], retrive: {fetching: false, error: null}, notify: {fetching: false, error: null}, sandbox: {fetching: false, error: null} }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

