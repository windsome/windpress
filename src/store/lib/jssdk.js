//import wx from 'utils/jweixin-1.2.0';
//var wx = require ('utils/jweixin-1.2.0')
import { createActions } from 'redux-actions';

export const { signRequest, signSuccess, signFailure, wxcfgRequest, wxcfgSuccess, wxcfgFailure } = createActions('SIGN_REQUEST', 'SIGN_SUCCESS', 'SIGN_FAILURE', 'WXCFG_REQUEST', 'WXCFG_SUCCESS', 'WXCFG_FAILURE');

export const wxConfig = (pkg) => {
    return (dispatch) => {
        return new Promise ( (resolve, reject) => {
            dispatch(wxcfgRequest())
            wx.config({
                beta:true,
                //debug: true,
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
            // jssdk注册成功后执行
            wx.ready(() => {
                console.log ("request jssdk ok");
                dispatch(wxcfgSuccess(wx))
                resolve (wx);
            });
            // jssdk注册失败时执行
            wx.error(error => {
                console.log ("request jssdk fail");
                dispatch(wxcfgFailure(error))
                resolve (null);
            });
        }).catch (error => {
            console.log ("error! wxConfig fail!", error);
            return null;
        })
    }
}
export const fetchSign = (url) => {
    return (dispatch) => {
        dispatch(signRequest())

        return fetch('/wcapis/v1/get_sign_package', { 
            method: "POST", 
            headers: {"Content-Type": "application/json"}, 
            body: JSON.stringify({ url:url }) 
        })
            .then(data => data.json())
            .then(pkg => {
                dispatch(signSuccess(pkg));
                return pkg;
            })
            .catch(error => {
                console.log('fetch error: ' + error.message);
                dispatch(signFailure(error))
                return null;
            });
    }
}

export const signAndConfigJssdk = (url) => {
    return (dispatch, getState) => {
        return dispatch (fetchSign (url)).then ((pkg)=>{
            if (pkg) {
                return dispatch(wxConfig(pkg)).then (retobj => {
                    return retobj;
                });
            } else {
                console.log ("error! signAndConfigJssdk: fetchSign none!");
                return null;
            }
        }).catch (error => {
            console.log ("error! signAndConfigJssdk: exception:", error);
            return null;
        })
    }
}

export const hideMenuItems = (items) => {
    return (dispatch) => {
        wx && wx.hideMenuItems({
            menuList: items
            // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        });
    }
}

export const showMenuItems = (items) => {
    return (dispatch) => {
        wx && wx.showMenuItems({
            menuList: items
            // 要显示的菜单项，所有menu项见附录3
        });
    }
}

const ACTION_HANDLERS = {
    ['SIGN_REQUEST']: (state) => ({ ...state, sign: { fetching: true, error: null, pkg: null } }),
    ['SIGN_SUCCESS']: (state, action) => ({ ...state, sign: { fetching: false, error: null, pkg: action.payload } }),
    ['SIGN_FAILURE']: (state, action) => ({ ...state, sign: { fetching: false, error: action.payload, pkg: null } }),

    ['WXCFG_REQUEST']: (state) => ({ ...state, cfg: { fetching: true, error: null, wxjs: null } }),
    ['WXCFG_SUCCESS']: (state, action) => ({ ...state, cfg: { fetching: false, error: null, wxjs: action.payload } }),
    ['WXCFG_FAILURE']: (state, action) => ({ ...state, cfg: { fetching: false, error: action.payload, wxjs: null } }),
}

const initialState = { sign: { fetching: false, url: null, pkg: null, wxjs: null, wxerror: null }, cfg: {} }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}
