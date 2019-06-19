// import es5 adapter for backward-compatibility
import {polyfillCustomElementsAPI} from "../polyfill/polyfillCustomElementsAPI";
import {WebComponentImpl} from "./../interface/WebComponentImpl";
import {decorateWebComponent} from "../function/decorateWebComponent";
import {error} from '../../../logger';

polyfillCustomElementsAPI();

export function Component<WC extends WebComponentImpl<any>>(tagName: string): any {
    
    return (webComponent: WC) => {

        if (!tagName) {
            error("The @Component ", webComponent, " has no tag name! It should look like: @Component('foo-bar-element')");
        }

        // must contain a kebab-dash
        if (tagName.indexOf('-') === -1) {
            error("The @Component ", webComponent, " tag name is not prefixed. It should look like: app-your-element-name, but it is: " + tagName);
        }

        return decorateWebComponent(tagName, webComponent);
    }
}