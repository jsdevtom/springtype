import {WebComponentConfig} from "../interface/WebComponentConfig";
import {CHILD_ELEMENT} from "../constant/CHILD_ELEMENT";
import {transformToElementVector} from "./transformToElementVector";
import {createFieldChangeDetector} from "../../../lang/src/decorator/detect-field-changes/function/createFieldChangeDetector";
import {VirtualElement} from "../../../renderer";
import {ShadowAttachMode} from "../enum/ShadowAttachMode";
import {CSSDeclarationBlockGenerator, CSSInlineStyleGenerator} from "../../../tss";
import {AttributeChangeEvent} from "../interface/AttributeChangeEvent";
import {WebComponentLifecycleEvent} from "../enum/WebComponentLifecycleEvent";
import {RenderStrategy} from "../enum/RenderStrategy";
import {ApplicationContext, ComponentReflector} from "../../../di";
import {APP_THEME} from "../../../tss/src/constant/APP_THEME";
import {PropsChangeEvent} from "../interface/PropsChangeEvent";
import {ComponentImpl} from "../../../di/src/interface/ComponentImpl";
import {getInternalRenderApi} from "../../../renderer/src/function/getInternalRenderApi";

export const createWebComponentClass = (config: WebComponentConfig, injectableWebComponent: ComponentImpl<any>) => {

    // custom web component extends user implemented web component class
    // which extends HTMLElement
    const CustomWebComponent = class extends injectableWebComponent {

        mounted: boolean = false;
        propsField: string;

        constructor(...args: Array<any>) {
            super();

            this.propsField = config.propsField!;

            // call all registered initializer functions for this WebComponent as BeanFactory is not
            // creating instances of WebComponents but document.createElement. Thus, we need to do it here.
            ComponentReflector.callInitializers(ComponentReflector.getInitializers(CustomWebComponent), this);

            if (config.renderStrategy === RenderStrategy.OnFieldChanges) {
                createFieldChangeDetector(
                    this,
                    config.propsField!,
                    true,
                    this.onPropsChanged.bind(this),
                    this.onBeforePropsChange.bind(this)
                );
            }

            if (config.renderStrategy === RenderStrategy.OnRequest) {
                this.observeAttributes = this[config.propsField!] || {};
            }

            if (config.shadow) {

                this.attachShadow({
                    mode: config.shadowAttachMode ? config.shadowAttachMode : ShadowAttachMode.OPEN
                });
            }

            !this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.BEFORE_INIT));

            this.init();
        }

        static get observedAttributes() {

            const attributesToObserve = config.observeAttributes || [];

            // automatically allow for observeAttributes restore
            if (attributesToObserve.indexOf(config.propsField!) === -1) {
                attributesToObserve.push(config.propsField!);
            }
            return attributesToObserve;
        }

        onBeforePropsChange(props: any, name: string | number | symbol, value: any): boolean {
            return this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.BEFORE_PROPS_CHANGE, {
                detail: <PropsChangeEvent>{
                    props,
                    name,
                    value
                }
            }))
        }

        getAttributeReferencedValue(attributeValueId: string): any {

            // de-reference attribute value
            const attributeValue = getInternalRenderApi().attributeValueCache[attributeValueId];
            delete getInternalRenderApi().attributeValueCache[attributeValueId];
            return attributeValue;
        }

        init(): void {

            if (super.init) {
                super.init();
            }
            this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.INIT));
        }

        onPropChanged(name: string, oldValue: string, newValue: string): void {

            if (super.onPropChanged) {
                return super.onPropChanged(name, oldValue, newValue);
            }
        }

        onPropsChanged(props: any, name: string | number | symbol, value: any): void {

            if (this.mounted) {

                // re-render on observeAttributes change
                this.reflow();
            }

            if (super.onPropsChanged) {
                return super.onPropsChanged(props, name, value);
            }
        }

        mount() {

            if (super.mount) {
                super.mount();
            }
            this.mounted = true;

            this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.MOUNT));
        }

        remount() {

            if (super.remount) {
                super.remount();
            }

            this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.REMOUNT));
        }

        mountChildren() {

            if (super.mountChildren) {
                super.mountChildren();
            }
            this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.MOUNT_CHILDREN));
        }

        remountChildren() {

            if (super.remountChildren) {
                super.remountChildren();
            }
            this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.REMOUNT_CHILDREN));
        }


        unmount() {

            if (super.unmount) {
                super.unmount();
            }
            this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.UNMOUNT));
        }

        render(): VirtualElement[] {

            const elements: VirtualElement[] = [];

            // generate and inject styles
            if (config.style) {

                const contextTheme = ApplicationContext.getInstance().get(APP_THEME);

                const theme = {
                    ...contextTheme ? contextTheme : {},
                    ...config.theme ? config.theme : {}
                };

                transformToElementVector(
                    elements,
                    CSSDeclarationBlockGenerator.generate(config.style(this, theme))
                );

                // support for :component selector (self-referenced component styles) works even in shadow DOM
                const componentInlineStyle: any =
                    CSSInlineStyleGenerator.generateComponentStyles(config.style(this, theme));

                for (let styleAttributeName in componentInlineStyle) {

                    if (componentInlineStyle.hasOwnProperty(styleAttributeName)) {
                        this.style[styleAttributeName] = componentInlineStyle[styleAttributeName];
                    }
                }
            }

            if (super.render) {
                transformToElementVector(elements, super.render());
            } else {

                if (typeof config.template == 'function') {
                    // render template by default
                    transformToElementVector(elements, config.template(this));
                }
            }
            this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.RENDER));

            return elements;
        }

        createNativeElement(virtualElement: VirtualElement): Element {
            if (super.createNativeElement) {
                return super.createNativeElement(virtualElement);
            }
            return (<any>window).React.render(virtualElement);
        }

        flow = (initial: boolean = false) => {

            const virtualElements: VirtualElement[] = this.render();

            if (virtualElements) {

                const virtualElement: Element[] = virtualElements
                    .filter(element => !!element)
                    .map((element) => this.createNativeElement(element));

                if (virtualElement.length > 0) {

                    if (config.shadow) {
                        virtualElement.forEach(el => this.shadowRoot.appendChild(el));
                    } else {
                        virtualElement.forEach(el => this.appendChild(el));
                    }

                    Reflect.set(this, CHILD_ELEMENT, virtualElement);

                    if (initial) {
                        this.mountChildren();
                    } else {
                        this.remountChildren();
                    }
                }
            }

            this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.FLOW));
        };

        reflow() {

            if (config.shadow) {
                this.shadowRoot.innerHTML = '';
            } else {
                this.innerHTML = '';
            }

            this.flow();

            this.remount();

            this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.REFLOW));
        }

        attributeChangedCallback(name: string, oldValue: string, newValue: string) {

            const attributeValue = this.getAttributeReferencedValue(newValue);

            // map local attribute field value
            if (name !== config.propsField! || !this[name]) {

                // assign
                this[name] = attributeValue;

            } else {

                // merge
                Object.assign(this[name], attributeValue);
            }

            const cancelled = !this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.BEFORE_PROP_CHANGE, {
                detail: <AttributeChangeEvent>{
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

            const cancelled = !this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.BEFORE_MOUNT));

            if (!cancelled) {

                this.mount();

                this.flow(true);

            }
        }

        disconnectedCallback() {
            const cancelled = !this.dispatchEvent(new CustomEvent(WebComponentLifecycleEvent.BEFORE_UNMOUNT));

            if (!cancelled) {
                return this.unmount();
            }
        }
    };
    return CustomWebComponent;
};