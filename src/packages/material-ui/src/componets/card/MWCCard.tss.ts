import {HOST_SELECTOR} from "@springtype/core";
import {TypedStyleSheet} from "@springtype/core";
import {MWCCard} from "./MWCCard";

export default (view: MWCCard): TypedStyleSheet => ({

    [HOST_SELECTOR]: {
        outline: 'none'
    },
    '.mdc-card':{
        'height': `${view.height}px`,
        'width': `${view.width}px`,
    }
});


