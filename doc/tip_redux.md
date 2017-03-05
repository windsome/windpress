# 使用redux-form时，使用initialValues作为初始值，但初始值在redux-form组件中改变后并不更新？
原因是创建redux-form时需要增加enableReinitialize:true选项  
```
export default reduxForm({
    form: 'lock',  // a unique identifier for this form
    enableReinitialize: true // if you change initialValues, you need do it to take effect.
})(EditLockForm)
```
*重要问题，我始终没弄明白redux-form例子“Initialize From State”并没有设置该属性却表现正常能够动态改变初始值，为什么它可以？

# 使用redux时，如果有几个action是前后发生，并且后一个依赖前一个结果的。(how to chain actions?)
注意下面gaearon的发言。这几个action都是返回Promise，并且dispatch(函数型action)返回的是其中内部函数的返回结果，内部函数返回一个Promise，所以可以调用.then()继续进行下一步处理。

<https://github.com/reactjs/redux/issues/1676>
Hi! This is an issue tracker and not a support forum. We’d appreciate you asking on StackOverflow the next time because the answers here get lost, unlike on SO.

That said, if you create your store with Redux Thunk middleware, you can write async action creators like this:

```
// If you use Redux Thunk...
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
const store = createStore(reducer, applyMiddleware(thunk))

// You can define asynchronous action creators that return functions.
// We call such action creators "thunks":

export function getUser(id) {
  // Redux Thunk will inject dispatch here:
  return dispatch => {
    // Reducers may handle this to set a flag like isFetching
    dispatch({ type: 'GET_USER_REQUEST', id })

    // Perform the actual API call
    return fetchUser().then(
      response => {
        // Reducers may handle this to show the data and reset isFetching
        dispatch({ type: 'GET_USER_SUCCESS', id,  response })
      },
      error => {
        // Reducers may handle this to reset isFetching
        dispatch({ type: 'GET_USER_FAILURE', id,  error })
        // Rethrow so returned Promise is rejected
        throw error
      }
    )
  }
}

// Thunks can be dispatched, if Redux Thunk is applied,
// just like normal action creators:
store.dispatch(getUser(42));

// The return value of dispatch() when you dispatch a thunk *is*
// the return value of the inner function. This is why it's useful
// to return a Promise (even though it is not strictly necessary):
store.dispatch(getUser(42)).then(() =>
  console.log('Fetched user and updated UI!')
)

// Here is another thunk action creator.
// It works exactly the same way.
export function getPost(id) {
  return dispatch => {
    dispatch({ type: 'GET_POST_REQUEST', id })
    return fetchPost().then(
      response => dispatch({ type: 'GET_POST_SUCCESS', id,  response }),
      error => {
        dispatch({ type: 'GET_POST_FAILURE', id,  error })
        throw error
      }
    )
  }
}

// Now we can combine them
export function getUserAndTheirFirstPost(userId) {
  // Again, Redux Thunk will inject dispatch here.
  // It also injects a second argument called getState() that lets us read the current state.
  return (dispatch, getState) => {
    // Remember I told you dispatch() can now handle thunks?
    return dispatch(getUser(userId)).then(() => {
      // Assuming this is where the fetched user got stored
      const fetchedUser = getState().usersById[userId]
      // Assuming it has a "postIDs" field:
      const firstPostID = fetchedUser.postIDs[0]
      // And we can dispatch() another thunk now!
      return dispatch(getPost(firstPostID))
    })
  }
}

// And we can now wait for the combined thunk:
store.dispatch(getUserAndTheirFirstPost(43)).then(() => {
  console.log('fetched a user and their first post')
})

// We can do this anywhere we have access to dispatch().
// For example, we can use this.props.dispatch, or put action
// creators right into the props by passing them to connect, like this:
// export default connect(mapStateToProps, { getUserAndTheirFirstPost })
```
