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
import {MWCCard} from "@springtype/material-ui/src/componets/card/MWCCard";

@UseElement(MWCCheckbox, MWCButton, MWCRadio, MWCSelect,MWCSwitch, MWCTextfield, MWCIcon, MWCIconButton, MWCCard)
@Theme({
    backgroundColor: 'red'
})
export class MaterialExampleApp {
}