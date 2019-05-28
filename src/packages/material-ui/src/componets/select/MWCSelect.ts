import {
    Attribute, AttributeType,
    Element,
    EventAttribute,
    Lifecycle,
    Style,
    Template,
    Partial
} from "@springtype/core";
import template from "./MWCSelect.tpl";
import style from "./MWCSelect.tss";
import {MDCRipple} from "@material/ripple/component";


@Element("mwc-select")
@Template(template)
@Style(style)
export class MWCSelect extends HTMLElement implements Lifecycle {

    @Attribute(AttributeType.BOOLEAN)
    disabled = false;

    @Attribute(AttributeType.BOOLEAN)
    ripple = true;

    @Attribute
    label = '';

    @Attribute
    name = '';

    @EventAttribute
    onchange;

    constructor(protected select: HTMLButtonElement) {
        super();
    }

    onFlow(initial: boolean) {
        if (initial && this.select) {
            MDCRipple.attachTo(this.select);
        }
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "mwc-select": Partial<MWCSelect>;
        }
    }
}