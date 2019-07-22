import {Attribute, EventAttribute, Lifecycle, Partial, Style, Template, WebComponent} from "@springtype/core";
import template from "./MWCRadio.tpl";
import style from "./MWCRadio.tss";
import {MDCRipple} from "@material/ripple/component";


@WebComponent("mwc-radio")
@Template(template)
@Style(style)
export class MWCRadio extends HTMLElement implements Lifecycle {

    @Attribute
    checked = false;

    @Attribute
    indeterminate = false;

    @Attribute
    disabled = false;

    @Attribute
    ripple = true;

    @Attribute
    value = '';

    @Attribute
    name = '';

    @Attribute
    label = '';

    @EventAttribute
    onchange = (evt: Event) => {
    };

    constructor(protected radio: HTMLButtonElement) {
        super();
    }

    onFlow(initial: boolean) {
        if (initial && this.ripple) {
            MDCRipple.attachTo(this.radio);
        }
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "mwc-radio": Partial<MWCRadio>;
        }
    }
}