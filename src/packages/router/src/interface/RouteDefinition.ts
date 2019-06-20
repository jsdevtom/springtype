import {BeanImpl, VirtualElement} from "@springtype/core";
import {LocationChangeDecision} from "./LocationChangeDecision";

export interface RouteDefinition {
    element: VirtualElement|BeanImpl<any>;
    guard?: (locationChangeDecision?: LocationChangeDecision) => Promise<boolean>;
    params?: Object;
}