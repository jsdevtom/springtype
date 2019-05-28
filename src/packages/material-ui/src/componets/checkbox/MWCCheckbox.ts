import {
    Attribute, AttributeType,
    Element,
    EventAttribute,
    Lifecycle,
    Style,
    Template,
    Partial
} from "@springtype/core";
import template from "./MWCCheckbox.tpl";
import style from "./MWCCheckbox.tss";
import {MDCRipple} from "@material/ripple/component";

@Element('mwc-checkbox')
@Template(template)
@Style(style)
export class MWCCheckbox extends HTMLElement implements Lifecycle {

    @Attribute(AttributeType.BOOLEAN)
    checked = false;

    @Attribute(AttributeType.BOOLEAN)
    indeterminate = false;

    @Attribute(AttributeType.BOOLEAN)
    disabled = false;

    @Attribute
    value = '';

    @Attribute
    name = '';

    @Attribute
    label = '';

    @EventAttribute
    onchange = (evt: Event) => {};

    constructor(protected checkbox: HTMLInputElement) {
        super();

    }

    onFlow(initial: boolean) {
        if (initial && this.indeterminate) {
            this.checkbox.indeterminate = true;
        }
    }

}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'mwc-checkbox': Partial<MWCCheckbox>;
        }
    }
}