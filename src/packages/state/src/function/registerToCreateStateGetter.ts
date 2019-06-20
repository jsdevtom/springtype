import {createStateGetter} from "./createStateGetter";
import {BeanReflector} from "@springtype/core";

export const registerToCreateStateGetter = (prototype: any, stateFieldName: string) => {
    BeanReflector.addInitializer(prototype, (instance: any) => {
        createStateGetter(instance, stateFieldName);
    })
};