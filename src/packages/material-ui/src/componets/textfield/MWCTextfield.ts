import {
    Attribute, AttributeType,
    Element,
    EventAttribute,
    Lifecycle,
    Style,
    Template,
    Partial, VirtualElement, ActiveRenderer, OnAttributeChange, OnFieldChange, Field
} from '@springtype/core';
import template from './MWCTextfield.tpl';
import style from './MWCTextfield.tss';
import {MDCRipple} from "@material/ripple/component";
import {AttributeChangeEvent} from "@springtype/core/src/webcomponent/src/interface/AttributeChangeEvent";
import {FieldComponent} from "../../../../examples/minesweeper/src/components/field/FieldComponent";

@Element('mwc-textfield')
@Template(template)
@Style(style)
export class MWCTextfield extends HTMLElement implements Lifecycle {

    @Attribute
    variant: 'outlined' | 'filled' = "outlined";

    @Attribute(AttributeType.BOOLEAN)
    disabled = false;

    @Attribute(AttributeType.BOOLEAN)
    'trailing-icon' = false;

    @Attribute
    'icon' = '';

    @Attribute
    label = '';

    @Attribute
    'helper-text' = '';

    @EventAttribute
    onchange = (evt: Event) => {
    };


    @Attribute
    value = '';

    labelWidth: string = '100%';

    isFocused = false;

    constructor(protected inputEL: HTMLInputElement,
                protected labelEL: HTMLLabelElement,
    ) {
        super();
    }

    onFlow(initial: boolean) {
        if (initial && this.labelEL) {
            if (this.value) {
                this.labelWidth = `${this.labelEL.getBoundingClientRect().width + 8}px`;
            } else {
                this.labelWidth = `${this.labelEL.getBoundingClientRect().width * 0.75 + 8}px`;
            }
            if (this.variant == "outlined") {
                // @ts-ignore
                this.flow()
            }
        }
    }

    onInputFocusin = () => {
        this.isFocused = true;
        // @ts-ignore
        this.flow()

    };

    onInputFocusOut = () => {
        this.isFocused = false;
        // @ts-ignore
        this.flow()
    };

    onInputChange = () => {
        this.value = this.inputEL.value;
    };

}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'mwc-textfield': Partial<MWCTextfield>;
        }
    }
}



