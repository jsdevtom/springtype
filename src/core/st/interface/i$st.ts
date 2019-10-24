import { ICustomElementInstances, ICustomHTMLElement } from "../../../web/customelement/interface";
import { ICustomElementRegistry } from "../../../web/customelement/interface/icustom-element-registry";
import { IOnStateChangeHandler } from "../../../web/customelement/interface/ion-state-change";
import { IRouter } from "../../../web/router/interface";
import { ITSS } from "../../../web/tss/interface";
import { IDOM, IGetDomRef, IRenderer, ISetDomRef, IVirtualChildren, IVirtualNode, IVirtualNodeType } from "../../../web/vdom/interface";
import { IOnDeepChangeHandler } from "../../cd/interface";
import { ChangeType } from "../../cd/interface/change-type";
import { IOnChangeHandler } from "../../cd/interface/ion-change-handler";
import { IDI } from "../../di/interface";
import { Ii18n, It } from "../../i18n/interface";
import { IlogFunction } from "../../log/interface";
import { IContextCacheEntries } from "./../../context/interface/icontext-cache-entries";

/**
 * public $st and internal st API
 */
export interface I$st {
  // adds/replaces the root DOM node in <body> with a new instance of the custom element given
  render: (customElementClassRef: any, attributes?: Partial<typeof customElementClassRef>) => void;

  // enables trace mode (internal framework log messages)
  debug: boolean;

  // DOM routing API
  router: IRouter;

  // Dependency injection API
  di: IDI;

  // Internationalization (i18n), translation API
  i18n: Ii18n;
  t: It;

  // TSS stylesheet renderer and theme / <style> template manager
  tss: ITSS;

  // TSX transformator function
  tsx: (type: IVirtualNodeType, attributes: JSX.HTMLAttributes & JSX.SVGAttributes & Record<string, any> | null, ...children: Array<IVirtualChildren>) => Array<IVirtualNode>|IVirtualNode|undefined;

  // DOM mutation abstraction
  dom: IDOM;

  // initial and patch (differential) rendering
  renderer: IRenderer;

  // Change detection API

  // change detection for objects and arrays (deep changes)
  onChange: (object: any, onChange: IOnDeepChangeHandler, options: any) => any;

  // change detection with support for (deep changes + reference set changes)
  onStateChange: (instance: any, name: string | symbol, type: ChangeType, onChange: IOnChangeHandler, onDeepChange?: IOnDeepChangeHandler) => any;

  // DOM reference API
  // set and get DOM references from within @customElement classes using @ref
  getDomRef: IGetDomRef;
  setDomRef: ISetDomRef;

  // custom element base class implemenetation to inherit from
  element: ICustomHTMLElement;

  // logging API
  info: IlogFunction;
  warn: IlogFunction;
  error: IlogFunction;

  // context API
  getContext<S = {}>(contextName: string, onChange?: IOnStateChangeHandler, instance?: any): S;

  initContext<S = {}>(contextName: string, initialValue: S, onChange?: IOnStateChangeHandler, instance?: any): S;

  addContextChangeHandler: (contextName: string, onChange: IOnStateChangeHandler, instance?: any) => void;

  removeContextChangeHandler: (contextName: string, onChange?: IOnStateChangeHandler) => void;

  // global cache API
  CONTEXT: IContextCacheEntries;
  CUSTOM_ELEMENT_INSTANCES: ICustomElementInstances;
  CUSTOM_ELEMENT_REGISTRY: ICustomElementRegistry;
}

export enum GlobalCache {
  CUSTOM_ELEMENT_INSTANCES = "CUSTOM_ELEMENT_INSTANCES",
  CONTEXT = "CONTEXT",
  CUSTOM_ELEMENT_REGISTRY = "CUSTOM_ELEMENT_REGISTRY",
}
