function Promise(fn) {
  let state = 'pending';
  let value;
  let deferred;

  function handle(handler) {
    if (state === 'pending') {
      deferred = handler;
      return;
    }

    // need to make resolve async
    setTimeout(function () {
      if (!handler.onResolved) {
        handle.resolve(value);
        return;
      }
      let ret;

      try {
        ret = handler.onResolved(value);
      } catch (e) {
        handler.reject(e);
        return;
      }
      handler.resolve(ret);
    }, 1);
  }

  function resolve(newValue) {

    // when thw then return promise, we r
    if (newValue && typeof newValue.then === 'function') {
      newValue.then(resolve);
      return;
    }
    value = newValue;
    state = 'resolved';

    if (deferred) {
      handle(deferred);
    }
  }

  function reject(reason) {
    state = 'rejected';
    value = reason;

    if(deferred) {
      handle(deferred);
    }
  }
  this.then = function (onResolved) {
    return new Promise(function (resolve) {
      handle({
        onResolved: onResolved,
        resolve: resolve,
      });
    });
  }

  fn(resolve);
}
function doSomething() {
  return new Promise(function (resolve) {
    const value = 42;
    resolve(value);
  })
}
doSomething()
  .then(function (value) {
    console.log("got a value", value);
    return 88;
  })
  .then(function (secondResult) {
    console.log('second result', secondResult);
  })