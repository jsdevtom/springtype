import {HOST_SELECTOR, TypedStyleSheet} from "@springtype/core";
import {MWCCheckbox} from "./MWCCheckbox";

export default (view: MWCCheckbox): TypedStyleSheet => ({

    [HOST_SELECTOR]: {
        outline: 'none'
    }
});


