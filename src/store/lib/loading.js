import { createActions } from 'redux-actions';

export const { pageLoadRequest, pageLoadSuccess, pageLoadFailure } = createActions('PAGE_LOAD_REQUEST', 'PAGE_LOAD_SUCCESS', 'PAGE_LOAD_FAILURE');

const ACTION_HANDLERS = {
    ['PAGE_LOAD_REQUEST']: (state, action) => ({ ...state, pageLoading: true }),
    ['PAGE_LOAD_SUCCESS']: (state, action) => ({ ...state, pageLoading: false }),
    ['PAGE_LOAD_FAILURE']: (state, action) => ({ ...state, pageLoading: false }),
}

const initialState = { pageLoading:false }
export default function Reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

