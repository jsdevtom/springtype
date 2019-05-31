import {
    MWCButton,
    MWCCheckbox,
    MWCIcon,
    MWCIconButton,
    MWCRadio,
    MWCSelect,
    MWCSwitch,
    MWCTextfield
} from "@springtype/material-ui";
import {Theme, UseElement} from "@springtype/core";

@UseElement(MWCCheckbox, MWCButton, MWCRadio, MWCSelect,MWCSwitch, MWCTextfield, MWCIcon, MWCIconButton)
@Theme({
    backgroundColor: 'red'
})
export class MaterialExampleApp {
}