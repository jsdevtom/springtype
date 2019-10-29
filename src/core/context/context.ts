import { IOnStateChangeHandler } from "../../web/component/interface/ion-state-change";
import { ChangeType } from "../cd/interface/change-type";
import { DEFAULT_EMPTY_PATH, PropChangeManager } from "../cd/prop-change-manager";
import { isPrimitive } from "../lang/is-primitive";
import { GlobalCache } from "../st/interface/i$st";
import { st } from "../st/st";

/* internal API */

const DEFAULT_CONTEXT_VALUE = {};
const HANDLER_OWNING_INSTANCE: any = Symbol("HANDLER_OWNING_INSTANCE");

const callChangeHandlers = (onChangeHandlers: Array<IOnStateChangeHandler>, name: string, type: ChangeType, value: any, prevValue: any, path: string = DEFAULT_EMPTY_PATH) => {
  for (let onChnageHandler of onChangeHandlers) {
    onChnageHandler({
      name,
      type,
      path,
      value,
      prevValue,
    });
  }
};

const initContextCacheEntry = (contextName: string, initialValue: any) => {
  if (!st[GlobalCache.CONTEXT][contextName]) {
    st[GlobalCache.CONTEXT][contextName] = {
      value: undefined,
      onChangeHandlers: [],
    };

    // set initial value in context cache
    st[GlobalCache.CONTEXT][contextName].value = initialValue;

    PropChangeManager.onChange(
      st[GlobalCache.CONTEXT][contextName],
      "value",
      ChangeType.DEEP,
      (value: any, prevValue: any) => {
        callChangeHandlers(st[GlobalCache.CONTEXT][contextName].onChangeHandlers, contextName, ChangeType.REFERENCE, value, prevValue);
      },
      (path: string, value: any, prevValue: any) => {
        callChangeHandlers(st[GlobalCache.CONTEXT][contextName].onChangeHandlers, contextName, ChangeType.DEEP, value, prevValue, path);
      },
    );
  }
};

/* public API */

/**
 * Registers a change handler for a global context object to be called on reference or deep change.
 * @param contextName App-wide unique name of the context
 * @param onChange Handler function, called on change
 * @param instance Optional instance reference to allow for correct GC. Should be used with @Share
 */
export const addContextChangeHandler = (st.addContextChangeHandler = (contextName: string, onChange: IOnStateChangeHandler, instance?: any) => {
  if (typeof onChange == "function") {
    if (instance) {
      (onChange as any)[HANDLER_OWNING_INSTANCE] = instance;
    }
    st[GlobalCache.CONTEXT][contextName].onChangeHandlers.push(onChange);
  }
});

/**
 * Initializes a global context object
 * @param contextName App-wide unique name of the context
 * @param initialValue Initial value. Must be an Object or Array
 * @param onChange Handler function to be applied when the context object gets changed by reference or deeply
 * @param instance Optional instance reference to allow for correct GC. Should be used with @Share
 */
st.initContext = function initContext<S = {}>(contextName: string, initialValue: S, onChange?: IOnStateChangeHandler, instance?: any) {
  if (isPrimitive(initialValue)) {
    throw new Error(`A context cannot be a primitive value like ${initialValue}. Wrap the value of ${contextName.toString()} in an object.`);
  }
  initContextCacheEntry(contextName, initialValue);
  addContextChangeHandler(contextName, onChange!, instance);

  return st[GlobalCache.CONTEXT][contextName].value;
};

/**
 * Removes single change handlers for cases where the functional API is used.
 * @param contextName Name reference of the context
 * @param [onChange] Handler function reference. Must equal (===) the orginal function registered
 */
export const removeContextChangeHandler = (st.removeContextChangeHandler = (contextName: string, onChange?: IOnStateChangeHandler) => {
  let index = st[GlobalCache.CONTEXT][contextName].onChangeHandlers.indexOf(onChange!);
  if (index > -1) {
    st[GlobalCache.CONTEXT][contextName].onChangeHandlers.splice(index, 1);
  }
});

/**
 * Used for class instance GC. Removes all change handlers that belong to a GC'd instance.
 * @param instance Custom element instance or generic class instance
 */
export const removeContextChangeHandlersOfInstance = (instance: any) => {
  if (st[GlobalCache.CONTEXT]) {
    for (let contextName in st[GlobalCache.CONTEXT]) {
      st[GlobalCache.CONTEXT][contextName].onChangeHandlers = st[GlobalCache.CONTEXT][contextName].onChangeHandlers.filter((onChange: any) => {
        if (onChange && onChange[HANDLER_OWNING_INSTANCE] && onChange[HANDLER_OWNING_INSTANCE] === instance) {
          return false;
        }
        return true;
      });
    }
  }
};

/**
 * Returns a context object (preferred to be initialized first using `initContext(...)`, else uses an empty object)
 * @param contextName App-wide unique name of the context
 * @param onChange Handler function to be applied when the context object gets changed by reference or deeply
 * @param instance Optional instance reference to allow for correct GC. Should be used with @Share
 */
st.getContext = function getContext<S = {}>(contextName: string, onChange?: IOnStateChangeHandler, instance?: any): S {
  initContextCacheEntry(contextName, DEFAULT_CONTEXT_VALUE);
  addContextChangeHandler(contextName, onChange!, instance);
  return st[GlobalCache.CONTEXT][contextName].value;
};