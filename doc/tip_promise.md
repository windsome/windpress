## 可以被取消的promise，fetch
[isMounted is an Antipattern](https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html)
[create a cancelable fetch](https://github.com/facebook/react/issues/5465#issuecomment-157888325)
```
const cancelablePromise = makeCancelable(
  new Promise(r => component.setState({...}}))
);

cancelablePromise
  .promise
  .then(() => console.log('resolved'))
  .catch((reason) => console.log('isCanceled', reason.isCanceled));

cancelablePromise.cancel(); // Cancel the promise

Where makeCancelable is defined by @istarkov as:

const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) =>
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};
```

