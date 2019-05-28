import {MWCButton, MWCCheckbox, MWCRadio, MWCSelect} from "@springtype/material-ui";
import {setTheme, Theme, UseElement} from "@springtype/core";

@UseElement(MWCCheckbox, MWCButton, MWCRadio, MWCSelect)
@Theme({
    backgroundColor: 'red'
})
export class MaterialExampleApp {


    constructor() {

    }
}