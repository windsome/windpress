import { createActions } from 'redux-actions';

export const { intervalStart, intervalStop } = createActions('INTERVAL_START', 'INTERVAL_STOP');

export const startInterval = (key, cb, interval) => {
    return (dispatch) => {
        var intervalId = setInterval (cb, interval * 1000);
        return dispatch(intervalStart({ key, interval, intervalId }))
    }
}

export const stopInterval = (obj) => {
    if (!obj || !obj.key) return;
    return (dispatch) => {
        obj.intervalId && clearInterval (obj.intervalId);
        return dispatch(intervalStop(obj))
    }
}

const ACTION_HANDLERS = {
    ['INTERVAL_START']: (state, action) => ({ ...state, [action.payload.key]: action.payload }),
    ['INTERVAL_STOP']: (state, action) => {
        console.log ("action:", action);
        return ({ ...state, [action.payload.key]: null })
    },
}

const initialState = {  }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    //console.log ("timely action:",action);
    return handler ? handler(state, action) : state
}

