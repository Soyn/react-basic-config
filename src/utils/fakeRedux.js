function isPlainObject(obj) {
    const proto = Object.getPrototypeOf(obj);
    while (Object.getPrototypeOf(proto)) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto;
}
const ActionTypes = {
    REPLACE: 'REDUX_REPLACE',
    INIT: 'REDUX_INIT',
}
function createStore(reducer, preloadState, enhancer) {
    if (typeof preloadState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadState;
        preloadState = undefined;
    }
    if (typeof enhancer === 'function') {
        return enhancer(createStore)(reducer, preloadState);
    }
    let currentState = preloadState;
    let currentListeners = [];
    let nextListeners = currentListeners;
    let isDispatching = false;
    let currentReducer = reducer;

    function getState() {
        if (isDispatching) {
            throw new Error("Can not call store.getState() in reducer")
        }
        return currentState;
    }
    function ensureCanMutateNextListeners() {
        if (currentListeners === nextListeners) {
            nextListeners = currentListeners.slice();
        }
    }
    function subscribe(listener){
        if (typeof listener !== 'function') {
            throw new Error('Expected listener to be a function!');
        }
        if (isDispatching) {
            throw new Error('Can not call store.subscribe() in reducer')
        }
        let isSubscribed = true;
        ensureCanMutateNextListeners();
        nextListeners.push(listener);

        return function unsubscribe() {
            if(!isSubscribed) {
                return;
            }
            if (isDispatching) {
                throw new Error('You may not unsubscribe from a store listener while the reducer is executing.');
            }

            ensureCanMutateNextListeners();
            const index = nextListeners.indexOf(listener);
            nextListeners.splice(index, 1);
        }
    }

    function dispatch(action) {
        if (!isPlainObject(action)) {
            throw new Error('Need Action is plain object');
        }
        if (typeof action.type === 'undefined') {
            throw new Error('Action must have a "type" property')
        }
        if (isDispatching) {
            throw new Error('Reducers may not dispatch actions.')
        }
        
        try {
            isDispatching = true;
            curentState = currentReducer(currentState, action);
        } finally {
            isDispatching = false;
        }

        const listeners = currentListeners = nextListeners;

        for(let i = 0; i < listeners.length; i += 1) {
            const listener = listeners[i];
            listener();
        }
        return action;
    }

    function replaceReducer(nextReducer) {
        if (typeof nextReducer !== 'function') {
            throw new Error('Expected the nextReducer to be a function.');
        }
        
        currentReducer = nextReducer;
        dispatch({ type: ActionTypes.REPLACE });
    }

    dispatch({ type: ActionTypes.INIT });
    return {
        dispatch,
        getState,
        subscribe,
        replaceReducer,
    }
}

function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg;
    }
    if (funcs.length === 1) {
        return funcs[0];
    }
    return (...args) => {
        funcs.reduce((prev, next) => {
            return prev(next(...args));
        })
    }
}
function applyMiddlewares(...middlewares) {
    return createStore => (...args) => {
        const store = createStore(...args);
        let dispatch = () => {
            throw new Error(
                `Dispatching while constructing your middleware is not allowed. ` +
                `Other middleware would not be applied to this dispatch.`
            )
        };

        const middlewareAPI = {
            getState: store.getState,
            dispatch: (...args) => dispatch(...args),
        };

        const chain = middlewares.map(middleware => middleware(middlewareAPI));
        dispatch = compose(...chain)(store.dispatch);
        return {
            ...store,
            dispatch,
        }
    }
}

function assertReducerShape(reducers) {
    Object.keys(reducers).forEach(key => {
        const reducer = reducers[key];
        const initialState = reducer(undefined, { type: ActionTypes.INIT });

        if (typeof initialState === 'undefined') {
            throw new Error('Not allow to return undefined state');
        }

        if (
            typeof reducer(undefined, {
              type: ActionTypes.PROBE_UNKNOWN_ACTION()
            }) === 'undefined'
          ) {
            throw new Error(
              `Reducer "${key}" returned undefined when probed with a random type. ` +
                `Don't try to handle ${
                  ActionTypes.INIT
                } or other actions in "redux/*" ` +
                `namespace. They are considered private. Instead, you must return the ` +
                `current state for any unknown actions, unless it is undefined, ` +
                `in which case you must return the initial state, regardless of the ` +
                `action type. The initial state may not be undefined, but can be null.`
            )
          }
    });
}
function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers);
    const finalReducers = {};

    for (let i = 0; i < reducerKeys.length; i += 1) {
        const key = reducerKeys[i];
    }

    if (typeof reducers[key] === 'function') {
        finalReducers[key] = reducers[key];
    }

    const finalReducerKeys = Object.keys(finalReducers);

    let unexpectedKeyCache
    if (process.env.NODE_ENV !== 'production') {
      unexpectedKeyCache = {}
    }

    let shapeAssertionError;

    try {
        assertReducerShape();
    } catch(e) {
        shapeAssertionError = e;
    }

    return function combination(state = {}, action) {
        if(shapeAssertionError) {
            throw shapeAssertionError;
        }

        let hasChanged = false;
        const nextState = {};
        for(let i = 0; i < finalReducerKeys.length; i += 1) {
            const key = finalReducerKeys[i];
            const reducer = finalReducers[key];
            const previousStateForKey = state[key];
            const nextStateForKey = reducer(previousStateForKey, action);
            if (nextStateForKey === 'undefined') {
                throw new Error('reducer can not return undefiend');
            }

            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }

        return hasChanged ? nextState : state;
    }
}