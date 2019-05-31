import {Attribute, AttributeType, CSSUnit, Element, Lifecycle, Partial, Style, Template} from "@springtype/core";
import template from "./MWCIconButton.tpl";
import style from "./MWCIconButton.tss";
import {MDCRipple} from "@material/ripple/component";

@Element('mwc-icon-button')
@Template(template)
@Style(style)
export class MWCIconButton extends HTMLElement implements Lifecycle {

    @Attribute(AttributeType.STRING)
    'name-on': string;

    @Attribute(AttributeType.STRING)
    'name-off': string;

    @Attribute(AttributeType.BOOLEAN)
    'on': boolean;

    @Attribute(AttributeType.INT)
    size: number = 1;

    @Attribute(AttributeType.STRING)
    'size-unit': CSSUnit = CSSUnit.EM;

    @Attribute(AttributeType.STRING)
    label = '';

    @Attribute(AttributeType.BOOLEAN)
    ripple = true;

    constructor(
        // forward-referenced binding and DI (@see template bind={{...}} on <button>)
        protected iconButton: HTMLElement
    ) {
        super();
    }

    onFlow(initial: boolean) {

        if (initial && this.ripple) {
            MDCRipple.attachTo(this.iconButton);
        }
    }

    toggleOnClick = () => {
        this.on = !this.on;
        MDCRipple.attachTo(this.iconButton);
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'mwc-icon-button': Partial<MWCIconButton>;
        }
    }
}