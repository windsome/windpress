import merge from 'lodash/merge'

export const TEMPDATA_SET = 'TEMPDATA_SET'

export function tempdataSet (data) {
    return {
        type: TEMPDATA_SET,
        payload: data
    }
}

export const actions = {
    tempdataSet
}

const TEMPDATA_ACTION_HANDLERS = {
    [TEMPDATA_SET]: (state, action) => ({ data: action.payload })
    //[TEMPDATA_SET]: (state, action) => { return merge( {}, action.payload )}
    //[TEMPDATA_SET]: (state, action) => { console.log ("reach here?", action); return ({ ...state, data: action.payload }) }
}

const initialState = { }
export default function tempdataReducer(state = initialState, action) {
    const handler = TEMPDATA_ACTION_HANDLERS[action.type]
    /*console.log ("oldState", state, JSON.stringify(state), action, JSON.stringify(action), handler);
    var newState = handler ? handler(state, action) : state;
    console.log ("newState", newState, JSON.stringify(newState), action, JSON.stringify(action));
    return newState;*/
    return handler ? handler(state, action) : state
}
