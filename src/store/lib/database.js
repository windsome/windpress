import { Schema, arrayOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import merge from 'lodash/merge'

export { camelizeKeys } from 'humps';
export { normalize } from 'normalizr';

const userSchema = new Schema('users', {
    idAttribute: 'id'
});
const lockSchema = new Schema('locks', {
    idAttribute: 'id'
});
export const Schemas = {
    USER: userSchema,
    USER_ARRAY: arrayOf(userSchema),
    LOCK: lockSchema,
    LOCK_ARRAY: arrayOf(lockSchema)
}

export const DATABASE_MERGE = 'DATABASE_MERGE'
export const DATABASE_REPLACE = 'DATABASE_REPLACE'

export function dataMerge (data) {
    return {
        type: DATABASE_MERGE,
        payload: data
    }
}

export function dataReplace (data) {
    return {
        type: DATABASE_REPLACE,
        payload: data
    }
}

export const actions = {
    dataMerge,
    dataReplace
}

const DATABASE_ACTION_HANDLERS = {
    [DATABASE_MERGE]: (state, action) => { return merge( {}, state, action.payload )},
    [DATABASE_REPLACE]: (state, action) => { return ({ ...state, ...action.payload }) }
}

const initialState = { }
export default function databaseReducer(state = initialState, action) {
    const handler = DATABASE_ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}
