import {
    Attribute, AttributeType,
    Element,
    EventAttribute,
    Lifecycle,
    Style,
    Template,
    Partial
} from "@springtype/core";
import template from "./MWCSwitch.tpl";
import style from "./MWCSwitch.tss";
import {MDCRipple} from "@material/ripple/component";

@Element('mwc-switch')
@Template(template)
@Style(style)
export class MWCSwitch extends HTMLElement implements Lifecycle {

    @Attribute(AttributeType.BOOLEAN)
    checked = false;

    @Attribute(AttributeType.BOOLEAN)
    disabled = false;

    @Attribute
    value = '';

    @Attribute
    name = '';

    @Attribute
    label = '';

    @EventAttribute
    onchange = (evt: Event) => {
    };

    constructor(protected _switch: HTMLInputElement,
                protected ripple: HTMLDivElement) {
        super();

    }

    onFlow(initial: boolean) {
        if (initial && this.ripple) {
            MDCRipple.attachTo(this.ripple);
        }
    }

    onSwitchChange = (evt: Event) => {
        this.checked = this._switch.checked;
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'mwc-switch': Partial<MWCSwitch>;
        }
    }
}