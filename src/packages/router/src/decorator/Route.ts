import {BeanImpl, VirtualElement} from "@springtype/core";
import {registerRoute} from "../function/registerRoute";

export function Route(route: string, routeTargetWebComponent: VirtualElement|BeanImpl<any>): any {

    return (targetWebComponent: any) => {

        registerRoute(route, routeTargetWebComponent);

        return targetWebComponent;
    }
}