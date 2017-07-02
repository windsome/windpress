var xdebug = window.myDebug('COIN:reducer:qrcode');
import { createActions } from 'redux-actions';
const { retrieveQrcodeRequest, retrieveQrcodeSuccess, retrieveQrcodeFailure } = createActions('RETRIEVE_QRCODE_REQUEST', 'RETRIEVE_QRCODE_SUCCESS', 'RETRIEVE_QRCODE_FAILURE');

export const retrieveQrcode = (info) => {
    var url = "/wcapis/v1/get_temp_qrcode";
    return (dispatch) => {
        dispatch(retrieveQrcodeRequest())
        return fetch(url, { 
            credentials: 'include',
            method: 'POST',
            headers: { 
                "Content-Type": "application/json; charset=utf-8"
            },
            //mode: 'cors',
            cache: 'default',
            body: JSON.stringify(info),
        })
            .then(response => response.json().then(json => ({ json, response})) )
            .then(({ json, response }) => {
                //xdebug ("retrieve:", json);
                if (!response.ok) {
                    throw new Error ("fetch() error: "+response.statusText+", ret="+JSON.stringify(json));
                }
                if (response.ok && (!json.errcode || json.errcode == 0)) {
                    dispatch(retrieveQrcodeSuccess(json.qrcode));
                } else {
                    dispatch(retrieveQrcodeFailure(json));
                }
            })
            .catch(error => {
                xdebug('error! retrieveQrcodes fetch() fail: '+error.message, error);
                dispatch(retrieveQrcodeFailure(error))
                return null;
            });
    }
}

const ACTION_HANDLERS = {
    ['RETRIEVE_QRCODE_REQUEST']: (state, action) => ({ ...state, fetching: true, error: null, qrcode: null }),
    ['RETRIEVE_QRCODE_SUCCESS']: (state, action) => ({ ...state, fetching: false, error: null, qrcode: action.payload }),
    ['RETRIEVE_QRCODE_FAILURE']: (state, action) => ({ ...state, fetching: false, error: action.payload, qrcode: null }),
}

const initialState = { fetching: false, qrcode: null, error: null }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    //console.debug ("action:", action);
    return handler ? handler(state, action) : state
}

