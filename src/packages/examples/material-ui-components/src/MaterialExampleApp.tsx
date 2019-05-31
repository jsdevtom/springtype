import {MWCButton, MWCCheckbox, MWCRadio, MWCSelect, MWCTextfield} from "@springtype/material-ui";
import {Theme, UseElement} from "@springtype/core";
import {MWCSwitch} from "@springtype/material-ui/src/componets/switch/MWCSwitch";
import {MWCIcon} from "@springtype/material-ui/src/componets/icon/MWCIcon";

@UseElement(MWCCheckbox, MWCButton, MWCRadio, MWCSelect,MWCSwitch, MWCTextfield, MWCIcon)
@Theme({
    backgroundColor: 'red'
})
export class MaterialExampleApp {
}