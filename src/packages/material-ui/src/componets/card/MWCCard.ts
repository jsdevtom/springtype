import {Attribute, AttributeType, Element, Lifecycle, Partial, Style, Template} from "@springtype/core";
import template from "./MWCCard.tpl";
import style from "./MWCCard.tss";

@Element('mwc-card')
@Template(template)
@Style(style)
export class MWCCard extends HTMLElement implements Lifecycle {

    @Attribute(AttributeType.INT)
    height = 350;

    @Attribute(AttributeType.INT)
    width = 350;


    constructor() {
        super();

    }


}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'mwc-card': Partial<MWCCard>;
        }
    }
}