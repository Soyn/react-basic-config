#React Fiber

## SetState

workflow:
  ----setState
    ---> updater
      ---> enqueueSetState
        ---> insertUpdateIntoFiber（将本次update入队）
        ---> scheduleWork（）

在setState之后回调用updater下的qneueueSetState，主要的更新逻辑就是在enqueueSetState中，为了了解这个过程，要明白在新的fiber架构下，fiber node的数据结构：

```javascript
    // A Fiber is work on a Component that needs to be done or was done. There can
    // be more than one per component.
    export type Fiber = {
        tag: TypeOfWork, // firber node的类型
        type: any, // fiber对应的组件的类型(function/class/module)
        return: Fiber | null, // 指向父节点
        sibling: Fiber | null, // 兄弟节点
        index: number,

        pendingProps: any, // 来自外部的new props
        memoizedProps: any,  // old props

        effectTag: TypeOfSideEffect,  // 副作用，即要应用到dom更新中的操作
        
        updateQueue: UpdateQueue<any> | null, //更新队列

        expirationTime: ExpirationTime,

        alternate: Fiber | null,  // 当前fiber的替身，类似于git从当前branch checkout另一个分支
    };
```

上面是fiber node的部分schema结构，在React以前的栈协商的算法中，是一个从当前节点到字节点递归的过程，一旦这个递归开始，就无法中断，新的fiber结构将递归改成了单链表的循环，可以随时中断恢复，也可以插入优先级更高的task，每一个fiber就是操作系统中线程的概念，react协商算法充当着一个调度器的作用，高优先级的任务优先执行，浏览器空闲的时候插入任务，以前协商算法存在的问题就在于，浏览器的渲染是一个单线程的，react在做diff的时候，如果用户这时候输入的话，主线程还在执行diff，这时候在用户看来就是输入没有及时显示，表现为卡顿，对于react来说，用户输入属于高优先的任务，优先执行，在新的算法中优先执行，这样提升了用户体验。

继续分析上面的代码，在setState之后，我们产生了一个update（更新的单元），我们需要将这个更新单元插入到当前组件的更新队列,

从上面的fiber节点的结构来看，存在一个alternate的替身节点，在当前fiber节点中保存着一个update queue，同样的在alternate的节点上也存在着一个 update queue，这两个queue的一些结构是共享的

```javascript
    function insertUpdateIntoFiber(fiber, update) {
            ......
        // If there's only one queue, add the update to that queue and exit.
        if (queue2 === null) {
            insertUpdateIntoQueue(queue1, update);
            return;
        }

        // If either queue is empty, we need to add to both queues.
        if (queue1.last === null || queue2.last === null) {
            insertUpdateIntoQueue(queue1, update);
            insertUpdateIntoQueue(queue2, update);
            return;
        }

        // If both lists are not empty, the last update is the same for both lists
        // because of structural sharing. So, we should only append to one of
        // the lists.
        insertUpdateIntoQueue(queue1, update);
        // But we still need to update the `last` pointer of queue2.
        queue2.last = update;
    }
```

在将更新队列更新之后，这里就需要调用scheduleWork这个函数了，在这个函数中实际调用的是`scheduleWorkImpl`，这个函数就是向上遍历fiber node组成的单链表，直至root fiber的root节点，也就是host node的节点，然后更新这个根节点expirationTime为当前update fiber的expirationTime，走到这里整个setState的过程就完成了，setState将本次的update插入到队列中，然后一直找到整颗fiber树的root，将本次标记的过期时间标记上去，然后等待事件循环调度到这次更新，所以setState是异步的。

# performSyncWork
```
    --->performSyncWork
      --->performWork
        --->findHighestPriorityRoot
        --->performWorkOnRoot
          ---> renderRoot
            --->workLoop
              --->performUnitOfWork
                ---> beginWork
```

如上是performSyncWork的整个调用关系，这个就是执行副作用，浏览器提供了新的api requestIdleCallback，这个函数就是在一帧（fps为60ms的时候为流畅），如果当前帧执行完成花不了60ms，那么空闲下来的时间就可以用于来执行requestIdleCallback的回调；但是存在这么一种情况，因为我们利用的是每一帧的空闲时间，如果浏览器一直处于繁忙状态的话，就一直执行不了，但是这个行为却不是我们希望的，这个时候在调用requestIdleCallback的时候传入第二个配置参数timeout，如果超过这个时间这个函数还没被调用的话，在下一个空闲的时间就会将这个回调插入；在这个新的API调用下，有几个操作是强烈不建议的：
  - 尽量不要修改dom，因为本身回调是在一帧的空闲时间调用的，这个空闲时间是完成了js计算、布局计算、重绘这些操作，如果修改了dom，那么这一帧做的计算就白做了（影响性能），而且修改dom操作的时间是不可预测的，因此很容易超出当前帧空间的阈值。
  - Promise的resolve（reject）也不建议放在里面，因为promise的回调在idle的回调执行完成后立即执行，会拉长当前帧的消耗。

  回到上面的更新逻辑，这里先调用了findHighestPriorityRoot找到优先级最高的需要更新的root，然后就执行performWorkOnRoot，来更新这个root tree，更新这个root tree的时候会调用renderRoot，这里面会跑一个workLoop，这个workLoop就是执行更新的主要逻辑了。

  workLoop里面又会执行一个叫做`performUnitOfWork`的东西，这个就是将一个work拆成单元，然后执行这个单元：
  在这个方法中会根据FiberNode的tag（即关联组件的类型来更新对应的组件），以`updateClassComponent`为例:

  ```javascript
  ......
  if (current === null) {
      if (workInProgress.stateNode === null) {
        // In the initial pass we might need to construct the instance.
        constructClassInstance(workInProgress, workInProgress.pendingProps);
        mountClassInstance(workInProgress, renderExpirationTime);

        shouldUpdate = true;
      } else {
        // In a resume, we'll already have an instance we can reuse.
        shouldUpdate = resumeMountClassInstance(workInProgress, renderExpirationTime);
      }
    } else {
      shouldUpdate = updateClassInstance(current, workInProgress, renderExpirationTime);
    }
    ......
  ```
  从上面的代码可以看出来，更新一个class组件的时候，这个更新中有三个场景，初次挂载、中断恢复、数据改变导致的组件刷新，分析`updateClassInstance`的代码可以看到在更新组件的时候几个生命周期寒素调用：
  ```javascript
    function updateClassInstance(current, workInProgress, renderExpirationTime) {
   var ctor = workInProgress.type;
    var instance = workInProgress.stateNode;
    resetInputPointers(workInProgress, instance);

    var oldProps = workInProgress.memoizedProps;
    var newProps = workInProgress.pendingProps;
    var oldContext = instance.context;
    var newUnmaskedContext = getUnmaskedContext(workInProgress);
    var newContext = getMaskedContext(workInProgress, newUnmaskedContext);

    var hasNewLifecycles = typeof ctor.getDerivedStateFromProps === 'function' || typeof instance.getSnapshotBeforeUpdate === 'function';

    // Note: During these life-cycles, instance.props/instance.state are what
    // ever the previously attempted to render - not the "current". However,
    // during componentDidUpdate we pass the "current" props.

    // In order to support react-lifecycles-compat polyfilled components,
    // Unsafe lifecycles should not be invoked for components using the new APIs.
    if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillReceiveProps === 'function' || typeof instance.componentWillReceiveProps === 'function')) {
      if (oldProps !== newProps || oldContext !== newContext) {
        callComponentWillReceiveProps(workInProgress, instance, newProps, newContext);
      }
    }
    }
  ```

  从上面的代码我们明显可以看到如果propschange或者context change了会触发componentWillReceiveProps这个函数

  ```javascript
     if (derivedStateFromProps !== null && derivedStateFromProps !== undefined) {
      // Render-phase updates (like this) should not be added to the update queue,
      // So that multiple render passes do not enqueue multiple updates.
      // Instead, just synchronously merge the returned state into the instance.
      newState = newState === null || newState === undefined ? derivedStateFromProps : _assign({}, newState, derivedStateFromProps);
    }
  ```
  这段代码表示，如果再一次更新中多次setState，最后会将多次setState合并成一次。

  在更新当前component完成之后就会将向下遍历child，child再作为更新节点，继续走这个workLoop，从头撸到尾，撸一遍，workLoop完了之后，新的更新之后的组件就拿到了，将这个新的组件数commit，commit完之后，就取下一次的最高优先级的root，再重复走这一过程，直到没有更新的root
  
  performWorkOnRoot之后就将本次root上的更新commit掉，commit的调用关系如下：

   ---> performWorkOnRoot
     ---> completeRoot
       ---> commitRoot
         ---> prepareForCommit
         ---> commitBeforeMutationLifecycles
         ---> commitAllHostEffects
           ---> commit
         ---> commitAllLifeCycles


commit之前的perform的工作就是将所有的更新计算出来，对应fiberNode上的更新使用effectTag这个东西表示，在commit阶段，就将这些更新apply上去，类似于git的提交，commit之前的工作是计算diff的内容，将diff add之后即生成了firberNode的结构来结构化数据（类似于git中的blob, tree这些结构），然后将这些commit之后才算将diff应用到git中。如上的调用是react commit的阶段：
  `commitBeforeMutationLifecycles`主要是调用了`getSnapshotBeforeUpdate`这个方法，保存了当前FiberNode的一份快照（放在虚拟dom的`__reactInternalSnapshotBeforeUpdate`属性上）

  `commitAllHostEffects`commit分成了两步，第一步是执行host的插入、更新、删除、ref的卸载，部分代码如下:
```javascript
    ......
     var effectTag = nextEffect.effectTag;

      if (effectTag & ContentReset) {
        commitResetTextContent(nextEffect);  //将content清空
      }

      if (effectTag & Ref) {
        var current = nextEffect.alternate;
        if (current !== null) {
          commitDetachRef(current);  // 将ref置null
        }
      }
      ......
```
剩下的代码就是一些更新的操作，如Placement、Update、Deletion、PlacementAndUpdate，部分代码如下：

```javascript
      // The following switch statement is only concerned about placement,
      // updates, and deletions. To avoid needing to add a case for every
      // possible bitmap value, we remove the secondary effects from the
      // effect tag and switch on that value.
      var primaryEffectTag = effectTag & (Placement | Update | Deletion);
      switch (primaryEffectTag) {
        case Placement:
          {
            commitPlacement(nextEffect);
            // Clear the "placement" from effect tag so that we know that this is inserted, before
            // any life-cycles like componentDidMount gets called.
            // TODO: findDOMNode doesn't rely on this any more but isMounted
            // does and isMounted is deprecated anyway so we should be able
            // to kill this.
            nextEffect.effectTag &= ~Placement;
            break;
          }
        case PlacementAndUpdate:
          {
            // Placement
            commitPlacement(nextEffect);
            // Clear the "placement" from effect tag so that we know that this is inserted, before
            // any life-cycles like componentDidMount gets called.
            nextEffect.effectTag &= ~Placement;

            // Update
            var _current = nextEffect.alternate;
            commitWork(_current, nextEffect);
            break;
          }
        case Update:
          {
            var _current2 = nextEffect.alternate;
            commitWork(_current2, nextEffect);
            break;
          }
        case Deletion:
          {
            commitDeletion(nextEffect);
            break;
          }
      }
```
  这里的commit就是真正的将diff apply到dom上，到这里就完成可setState的一次更新。