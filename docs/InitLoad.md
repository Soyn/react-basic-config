# InitLoad Component In React
![React-DOM Init Render](./imgs/reactRootLoad.png)

如上是初始化组件的时候的调用，来分析每一个调用的函数的实现：

```javascript
function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
    // ......
    var root = container._reactRootContainer;
    if (!root) {
        // Initial mount
        root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
        if (typeof callback === 'function') {
            var originalCallback = callback;
            callback = function () {
                var instance = DOMRenderer.getPublicRootInstance(root._internalRoot);
                originalCallback.call(instance);
            };
        }
        // Initial mount should not be batched.
        DOMRenderer.unbatchedUpdates(function () {
        if (parentComponent != null) {
            root.legacy_renderSubtreeIntoContainer(parentComponent, children, callback);
        } else {
            root.render(children, callback);
        }
        });
    }

    //......
}
```
    上面的代码是将react组件渲染到DOM Container上，这里会创建一个ReactRoot节点，来看看ReactRoot是什么东西：
```javascript
    function createFiberRoot(containerInfo, isAsync, hydrate) {
    // Cyclic construction. This cheats the type system right now because
    // stateNode is any.
    var uninitializedFiber = createHostRootFiber(isAsync);
    var root = {
        current: uninitializedFiber,
        containerInfo: containerInfo,
        pendingChildren: null,
        pendingCommitExpirationTime: NoWork,
        finishedWork: null,
        context: null,
        pendingContext: null,
        hydrate: hydrate,
        remainingExpirationTime: NoWork,
        firstBatch: null,
        nextScheduledRoot: null
    };
    uninitializedFiber.stateNode = root;
    return root;
    }
```
    如上就是RectRoot的东西，其中`uninitializedFiber`就是一个fiber node:
```javascript
    function FiberNode(tag, pendingProps, key, mode) {
        // Instance
        this.tag = tag;  // typeofwork表示不同类型的fiber节点
        this.stateNode = null;

        // Fiber
        this['return'] = null;
        this.child = null;
        this.sibling = null;

        this.ref = null;

        this.pendingProps = pendingProps;
        this.memoizedProps = null;
        this.updateQueue = null;
        this.memoizedState = null;

        this.mode = mode;

        // Effects
        this.effectTag = NoEffect; // side effect类型，表示更新的类型
        this.nextEffect = null;  // 单链表结构，方便遍历fiber树上有副作用的节点

        this.firstEffect = null;
        this.lastEffect = null;

        this.expirationTime = NoWork;  // 标记更新的effect的优先级，数字越小优先级越高

        this.alternate = null; // 在fiber更新的时候克隆出来的镜像fiber，对fiber的修改会标记在这个fiber上
    }
```
    如上是一个fiber node的数据结构，在初始化Node的时候，在root节点上会创建一个type为host的fiber node，标记这个节点是一个host节点，将相关的属性放在

```javascript

    function ReactWork() {
        this._callbacks = null;
        this._didCommit = false;
        // TODO: Avoid need to bind by replacing callbacks in the update queue with
        // list of Work objects.
        this._onCommit = this._onCommit.bind(this);
    }
    ReactWork.prototype.then = function (onCommit) {
        if (this._didCommit) {
            onCommit();
            return;
        }
        var callbacks = this._callbacks;
        if (callbacks === null) {
            callbacks = this._callbacks = [];
        }
        callbacks.push(onCommit);
    };
    ReactWork.prototype._onCommit = function () {
        if (this._didCommit) {
            return;
        }
        this._didCommit = true;
        var callbacks = this._callbacks;
        if (callbacks === null) {
            return;
        }
        // TODO: Error handling.
        for (var i = 0; i < callbacks.length; i++) {
            var _callback2 = callbacks[i];
            !(typeof _callback2 === 'function') ? invariant(false, 'Invalid argument passed as callback. Expected a function. Instead received: %s', _callback2) : void 0;
            _callback2();
        }
    };
```
    将root节点挂好后，后面就是调用root上的render方法，这里面会创建一个ReactWork,这个ReactWork会挂一些callback，最后在commit的时候把callback调用一遍。