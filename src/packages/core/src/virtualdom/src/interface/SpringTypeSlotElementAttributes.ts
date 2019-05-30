import {Partial} from "../../../lang";
import {HTMLVirtualElementAttributes} from "./HTMLIntrinsicElements";

export interface SpringTypeSlotElementAttributes extends Partial<HTMLVirtualElementAttributes<SpringTypeSlotElementAttributes>> {


    name: string;

    /**
     * Unwraps the element, so that the child elements are
     * directly placed at the place where the <st-slot> element used to be
     */
    unwrap: boolean;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'st-slot': Partial<SpringTypeSlotElementAttributes>;
        }
    }
}