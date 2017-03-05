//import 'whatwg-fetch';
const _debug = false;
export const REQUEST_SIGN = 'REQUEST_SIGN'
export const RECIEVE_SIGN = 'RECIEVE_SIGN'
export const WX_CONFIG_OK = 'WX_CONFIG_OK'
export const WX_CONFIG_FAIL = 'WX_CONFIG_FAIL'

export function requestSign (url) {
    return {
        type: REQUEST_SIGN,
        url
    }
}

let availableId = 0;
export function recieveSign (value) {
    return {
        type: RECIEVE_SIGN,
        payload: {
            value,
            id: availableId++
        }
    }
}

export function wxConfigOk () {
    return {
        type: WX_CONFIG_OK
    }
}

export function wxConfigFail (err) {
    return {
        type: WX_CONFIG_FAIL,
        error : err
    }
}

function wxConfig (dispatch, pkg) {
    if (_debug) console.log ("wxConfig:", wx);
        wx.config({
            beta:true,
            debug: true,
            appId: pkg.appId,
            timestamp: pkg.timestamp,
            nonceStr: pkg.nonceStr,
            signature: pkg.signature,
            jsApiList: [
                // 所有要调用的 API 都要加到这个列表中
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard',
                'openWXDeviceLib',
                'getWXDeviceTicket',
                'configWXDeviceWiFi'
            ]
        });
    if (_debug) console.log ("after config.");
        // jssdk注册成功后执行
        wx.ready(function () {
            console.log ("request jssdk ok");
            dispatch(wxConfigOk())
        });
        // jssdk注册失败时执行
        wx.error(function(err){
            console.log ("request jssdk fail");
            dispatch(wxConfigFail(err))
        });
    if (_debug) console.log ("after wxConfig");
}
export const fetchSign = (url) => {
    return (dispatch) => {
        dispatch(requestSign(url))

        return fetch('/apis/jsapi/get_sign_package', { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ url:url }) })
            .then(data => data.json())
            .then((pkg) => {
                dispatch(recieveSign(pkg));
                wxConfig (dispatch,pkg);
            })
            .catch((error) => {
                console.log('fetch error: ' + error.message);
                dispatch(recieveSign({}))
            });
    }
}

export const actions = {
    requestSign,
    recieveSign,
    fetchSign,
}

const SIGN_ACTION_HANDLERS = {
    [REQUEST_SIGN]: (state, action) => { return ({ ...state, fetching:true, url:action.url, pkg: null })},
    [RECIEVE_SIGN]: (state, action) => { return ({ ...state, fetching:false, url:state.url, pkg: action.payload })},
    [WX_CONFIG_OK]: (state, action) => { return ({ ...state, wxjs:wx })},
    [WX_CONFIG_FAIL]: (state, action) => { return ({ ...state, wxjs:null, wxerror:action.error })}
}

const initialState = { fetching: false, url: null, pkg: null, wxjs: null, wxerror: null }
export default function signReducer(state = initialState, action) {
    const handler = SIGN_ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}
