import {HOST_SELECTOR} from "@springtype/core";
import {MWCSwitch} from "./MWCSwitch";
import {TypedStyleSheet} from "@springtype/core";

export default (view: MWCSwitch): TypedStyleSheet => ({

    [HOST_SELECTOR]: {
        outline: 'none'
    },
    '.mdc-switch + label': {
        'margin-left': '10px'
    }
});


