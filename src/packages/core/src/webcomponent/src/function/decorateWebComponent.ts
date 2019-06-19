import {BeanImpl} from "../../../di/src/interface/BeanImpl";
import {Bean, BeanReflector} from "../../../di";
import {createWebComponentClass} from "./createWebComponentClass";
import {WebComponentReflector} from "../WebComponentReflector";
import {installInitialMutationObserver} from "./installInitialMutationObserver";

export const decorateWebComponent = (tagName: string, webComponent: BeanImpl<any>) => {
    
    // @Bean by default
    const injectableWebComponent = Bean(webComponent);
    const CustomWebComponent = createWebComponentClass(tagName, injectableWebComponent);
    const registeredCustomWebComponent = window.customElements.get(tagName);

    if (!registeredCustomWebComponent) {

        // register custom element
        window.customElements.define(tagName, CustomWebComponent);

        WebComponentReflector.setTagName(<any>CustomWebComponent, tagName);

        WebComponentReflector.registerByTagName(tagName);
    }

    BeanReflector.addInitializer(CustomWebComponent, (instance: any) => {

        installInitialMutationObserver(instance, tagName);
    });

    return CustomWebComponent;
};