function Promise(fn) {
  let state = 'pending';
  let value;
  let deferred;


  this.then = function (onResolved) {
    handle(onResolved);
  }

  function handle(onResolved) {
    if (state === 'pending') {
      deferred = onResolved;
      return;
    }
    onResolved(value);
  }
  function resolve(newValue) {
    value = newValue;
    state = 'resolved';

    if (deferred) {
      handle(deferred);
    }
  }

  fn(resolve)
}
function doSomething() {
  return new Promise(function (resolve) {
    const value = 42;
    resolve(value);
  })
}
doSomething().then(function (value) {
  console.log("got a value", value);
})