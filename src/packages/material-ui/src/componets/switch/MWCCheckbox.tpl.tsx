import {MWCSwitch} from "./MWCSwitch";
import {VirtualElement, ActiveRenderer} from "@springtype/core";
import classNames from "classnames";
import "@material/switch/dist/mdc.switch.min.css"

export default (view: MWCSwitch) => {

    const classes = classNames({
        'mdc-switch': true,
        'mdc-switch--disabled': view.disabled,
    });

    const inputElement: VirtualElement = <input  inject={{checkbox: view}}  type="checkbox" id="switch" class="mdc-switch__native-control"/>;
    if (view.checked) {
        inputElement.attributes.checked = true;
    }
    if (view.disabled) {
        inputElement.attributes.disabled = true;
    }
    if (view.value) {
        inputElement.attributes.value = view.value;
    }
    if (view.name) {
        inputElement.attributes.name = view.name;
    }

    return <div class="mdc-form-field">
        <div class={classes}>
            <div class="mdc-switch__track"></div>
            <div class="mdc-switch__thumb-underlay">
                <div class="mdc-switch__thumb">
                    {inputElement}
                </div>
            </div>
        </div>
        <label for="switch">{view.label}</label>
    </div>
}