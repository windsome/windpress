/*
  see https://mp.weixin.qq.com/wiki 微信网页授权
  1, 第一步：用户同意授权，获取code
  2, 第二步：通过code换取网页授权access_token, 如果网页授权的作用域为snsapi_base，则本步骤中获取到网页授权access_token的同时，也获取到了openid，snsapi_base式的网页授权流程即到此为止。
  3, 第三步：刷新access_token（scope=snsapi_userinfo需要）
  4, 第四步：拉取用户信息(需scope为 snsapi_userinfo)


  参考链接(请在微信客户端中打开此链接体验): 

  scope为snsapi_base:
  https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx520c15f417810387&redirect_uri=https%3A%2F%2Fchong.qq.com%2Fphp%2Findex.php%3Fd%3D%26c%3DwxAdapter%26m%3DmobileDeal%26showwxpaytitle%3D1%26vb2ctag%3D4_2030_5_1194_60&response_type=code&scope=snsapi_base&state=123#wechat_redirect 

  scope为snsapi_userinfo:
  https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf0e81c3bee622d60&redirect_uri=http%3A%2F%2Fnba.bluewebgame.com%2Foauth_response.php&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect 

 */
import { createActions } from 'redux-actions';

export const { wxoauthRequest, wxoauthSuccess, wxoauthFailure } = createActions('WXOAUTH_REQUEST', 'WXOAUTH_SUCCESS', 'WXOAUTH_FAILURE');

export const handleWxoauth = (code) => {
    return (dispatch) => {
        dispatch(wxoauthRequest())
        
        return fetch("/apis/wxoauth/openid", 
                     { method: 'POST',
                       headers: { 
                           "Content-Type": "application/json; charset=utf-8"
                       },
                       mode: 'cors',
                       cache: 'default',
                       body: JSON.stringify({ code: code}) })
            .then(data => data.json())
            .then((retcode) => {
                dispatch(wxoauthSuccess(retcode))
            })
            .catch((error) => {
                console.log('fetch error: ' + error.message);
                dispatch(wxoauthFailure({ errcode: -1, msg: error.message }))
            });
    }
}


const ACTION_HANDLERS = {
    ['WXOAUTH_REQUEST']: (state) => ({ ...state, fetching: true, error: null, user: null }),
    ['WXOAUTH_SUCCESS']: (state, action) => ({ ...state, fetching: false, error: null, user: action.payload }),
    ['WXOAUTH_FAILURE']: (state, action) => ({ ...state, fetching: false, error: action.payload, user: null }),
}

const initialState = { fetching: false, user: null, error: null }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}
