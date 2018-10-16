import {ApplicationContext, Component} from "../../../di";
import {ApplicationEnvironment} from "../../../di/src/ApplicationContext";
import {WebComponentReflector} from "./WebComponentReflector";
import {CaseTransformer} from "../../../lang";

const CHILD_ELEMENT = Symbol('CHILD_ELEMENT');
const STATE_OBJECT = Symbol('STATE_OBJECT');

export enum ShadowAttachMode {
    OPEN = 'open',
    CLOSED = 'closed'
}

export enum RenderStrategy {
    OnRequest = 'ON_REQUEST',
    onPropsChanged = 'ON_PROPS_CHANGED'
}

export interface WebComponentConfig {
    tag: string;
    shadow?: boolean;
    shadowMode?: ShadowAttachMode;
    props?: Array<string>;
    renderStrategy?: RenderStrategy;
    template?: (view: any) => Node;
}

export class WebComponentLifecycle  {
    constructor() {};

    props?: any = {};
    init?(): void {}
    mount?(): void {};
    remount?(): void {};
    render?(): JSX.Element {
        return ('');
    }
    unmount?(): void {};
    onPropChanged?(name: string, newValue: any, oldValue?: any): void {};
    onPropsChanged?(state: any, name: string|number|symbol, value: any): void {};
    reflow?(): void {};
    mountChildren?(): void {};
    remountChildren?(): void {};
}

export interface AttributeChangeEvent {
    name: string;
    oldValue: any;
    newValue: any;
}

export interface StateChangeEvent {
    props: any;
    name: string|number|symbol;
    value: any;
}

export enum LifecycleEvent {
    BEFORE_INIT = 'BEFORE_INIT',
    SHADOW_ATTACHED = 'SHADOW_ATTACHED',
    BEFORE_MOUNT = 'BEFORE_MOUNT',
    BEFORE_UNMOUNT = 'BEFORE_UNMOUNT',
    BEFORE_PROP_CHANGE = 'BEFORE_PROP_CHANGE',
    BEFORE_PROPS_CHANGE = 'BEFORE_PROPS_CHANGE'
}

export interface IWebComponent<WC> extends Function {
    new(...args: any[]): WC;
}

// TODO: AOT: https://github.com/skatejs/skatejs/tree/master/packages/ssr
export function WebComponent<WC extends IWebComponent<any>>(config: WebComponentConfig): any {

    if (!config.props) config.props = [];

    if (!config.tag) {
        throw new Error("@WebComponent annotation must contain a tag name like: { tag: 'foo-bar-element', ... }");
    }

    return (target: WC) => {

        // @Component by default
        target = Component(target);

        // custom web component extends user implemented web component class
        // which extends HTMLElement
        let CustomWebComponent = class extends target {

            protected mounted: boolean = false;

            constructor(...args: Array<any>) {

                super();

                // TODO: Register with route and GC ourselves on Route Change?! -> timer out of control

                if (config.renderStrategy === RenderStrategy.onPropsChanged) {

                    this.props = new Proxy(this.props || {}, {
                        set: (props: any, name: string|number|symbol, value: any): boolean => {

                            console.log('props change');

                            if (props[name] !== value) {

                                props[name] = value;

                                const cancelled = !this.dispatchEvent(new CustomEvent(LifecycleEvent.BEFORE_PROPS_CHANGE,  {
                                    detail: <StateChangeEvent> {
                                        props,
                                        name,
                                        value
                                    }
                                }));

                                if (!cancelled) {
                                    this.onPropsChanged(props, name, value);
                                }
                            }
                            return true;
                        }
                    });

                    Object.defineProperty(this, 'state', {
                        writable: false
                    });


                } else {

                    this.props = this.props || {};
                }

                if (config.shadow) {

                    this.attachShadow({
                        mode: config.shadowMode ? config.shadowMode : ShadowAttachMode.OPEN
                    });
                }

                !this.dispatchEvent(new CustomEvent(LifecycleEvent.BEFORE_INIT));

                this.init();
            }

            static get observedAttributes() {

                const attributesToObserve = config.props || [];

                // automatically allow for props restore
                if (attributesToObserve.indexOf('state') === -1) {
                    attributesToObserve.push('state');
                }
                return attributesToObserve;
            }

            private getAttributeLocalState(prop: string, stateHeapPtr: string): any {

                const attributeStateValue = (<any>window).React.propsHeapCache[stateHeapPtr];

                delete (<any>window).React.propsHeapCache[stateHeapPtr];

                return attributeStateValue;
            }

            init(): void {

                if (super.init) {
                    super.init();
                }
            }

            onPropChanged(name: string, oldValue: string, newValue: string): void {

                if (super.onPropChanged) {
                    return super.onPropChanged(name, oldValue, newValue);
                }
            }

            onPropsChanged(state: any, name: string|number|symbol, value: any): void {

                if (this.mounted) {

                    // re-render on props change
                    this.reflow();
                }

                if (super.onPropsChanged) {
                    return super.onPropsChanged(state, name, value);
                }
            }

            mount() {

                console.log('on mount', this);

                if (super.mount) {
                    return super.mount();
                }
                this.mounted = true;
            }

            remount() {

                if (super.remount) {
                    return super.remount();
                }
            }

            mountChildren() {

                if (super.mountChildren) {
                    return super.mountChildren();
                }
            }

            remountChildren() {

                if (super.remountChildren) {
                    return super.remountChildren();
                }
            }


            unmount() {

                if (super.unmount) {
                    return super.unmount();
                }
            }

            render(initial: boolean): any {

                // TODO: Event fire
                console.log('re-render', this, this.props);

                if (super.render) {
                    return super.render();
                } else {

                    if (typeof config.template == 'function') {

                        // render template by default
                        return config.template(this);
                    }
                    return ('');
                }
            }

            protected flow(initial: boolean = false) {

                const element: HTMLElement = this.render(initial);

                if (element) {

                    if (config.shadow) {
                        this.shadowRoot.appendChild(element);
                    } else {
                        this.appendChild(element);
                    }
                    Reflect.set(this, CHILD_ELEMENT, element);

                    if (initial) {
                        this.mountChildren();
                    } else {
                        this.remountChildren();
                    }
                }
            }

            protected reflow() {

                if (config.shadow) {
                    this.shadowRoot.innerHTML = '';
                } else {
                    this.innerHTML = '';
                }

                this.flow();

                this.remount();
            }

            attributeChangedCallback(name: string, oldValue: string, newValue: string) {

                const attributeValue = this.getAttributeLocalState(name, newValue);

                // map local attribute field value

                if (name !== 'state' || !this[name]) {

                    // assign
                    this[CaseTransformer.kebabToCamelCase(name)] = attributeValue;

                } else {

                    // merge
                    Object.assign(this[name], attributeValue);
                }
                console.log('setting wc attr', name, newValue);

                const cancelled = !this.dispatchEvent(new CustomEvent(LifecycleEvent.BEFORE_PROP_CHANGE,  {
                    detail: <AttributeChangeEvent> {
                        name: name,
                        oldValue,
                        newValue
                    }
                }));

                if (!cancelled) {
                    this.onPropChanged(name, oldValue, newValue);
                }
            }

            connectedCallback() {

                const cancelled = !this.dispatchEvent(new CustomEvent(LifecycleEvent.BEFORE_MOUNT));

                if (!cancelled) {

                    this.mount();

                    this.flow(true);

                } else {

                    console.warn('');
                }
            }

            disconnectedCallback() {

                const cancelled = !this.dispatchEvent(new CustomEvent(LifecycleEvent.BEFORE_UNMOUNT));

                if (!cancelled) {

                    return this.unmount();
                }
            }
        };

        try {

            // register custom element
            window.customElements.define(config.tag, CustomWebComponent);

            WebComponentReflector.setTagName(<any>CustomWebComponent, config.tag);

        } catch(e) {

            if (ApplicationContext.getInstance().getEnvironment() === ApplicationEnvironment.DEV) {

                // hot reload based error for web component registration (window.customElements.define(...))
                if (e.message.indexOf('this name has already been used with this registry') > -1) {
                    window.location.href = '/';
                }
            }
            throw e;
        }
        return CustomWebComponent;
    }
}