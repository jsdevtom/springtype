import {MWCButton, MWCCheckbox, MWCRadio, MWCSelect} from "@springtype/material-ui";
import {setTheme, Theme, UseElement} from "@springtype/core";
import {MWCSwitch} from "@springtype/material-ui/src/componets/switch/MWCSwitch";

@UseElement(MWCCheckbox, MWCButton, MWCRadio, MWCSelect,MWCSwitch)
@Theme({
    backgroundColor: 'red'
})
export class MaterialExampleApp {


    constructor() {

    }
}