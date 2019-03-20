import {Attribute, Style, Element, WebComponentLifecycle, Template, EventAttribute} from "@springtype/springtype-incubator-core";
import template from "./MWCCheckbox.tpl";
import style from "./MWCCheckbox.tss";

@Element('mwc-checkbox')
@Template(template)
@Style(style)
export class MWCCheckbox extends HTMLElement implements WebComponentLifecycle {

    @Attribute
    checked = false;

    @Attribute
    indeterminate = false;

    @Attribute
    disabled = false;

    @Attribute
    value = '';

    @EventAttribute
    onchange = (evt: Event) => {};
}