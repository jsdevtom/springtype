import {Attribute, AttributeType, Element, Lifecycle, Partial, Style, Template} from "@springtype/core";
import template from "./MWCIcon.tpl";
import style from "./MWCIcon.tss";
import {CSSUnit} from "@springtype/core";

@Element('mwc-icon')
@Template(template)
@Style(style)
export class MWCIcon extends HTMLElement implements Lifecycle {

    @Attribute(AttributeType.STRING)
    name: string;

    @Attribute(AttributeType.INT)
    size: number = 1;

    @Attribute(AttributeType.STRING)
    'size-unit': CSSUnit = CSSUnit.EM;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'mwc-icon': Partial<MWCIcon>;
        }
    }
}