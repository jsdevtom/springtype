import {Attribute, Component, Style} from "../decorator";
import {Lifecycle} from "../..";
import {VirtualElement} from "../../../virtualdom";
import {Partial} from "../../../lang";
import {ActiveRenderer} from "../../../renderer";

@Component('st-error-message')
@Style(() => ({
    'p': {
        color: '#ff0000'
    }
}))
export class ErrorMessage extends HTMLElement implements Lifecycle {

    @Attribute
    message: string = "Unknown error.";

    render() {
        return <p>{this.message}</p> as VirtualElement;
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'st-error-message': Partial<ErrorMessage>;
        }
    }
}