import {createFieldChangeDetector} from "./createFieldChangeDetector";
import {ChangeDetectionInterceptor} from "../interface/ChangeDetectionInterceptor";
import {BeanReflector} from "../../../di";

export const registerForChangeDetection = (
    prototype: any,
    fieldName: string|symbol,
    memorize: boolean,
    onChange: ChangeDetectionInterceptor = (instance: any, name: string|number|symbol, value: any) => {},
    onBeforeChange: ChangeDetectionInterceptor = (instance: any, name: string|number|symbol, value: any) => true,
) => {

    BeanReflector.addInitializer(prototype, (instance: any) => {
        createFieldChangeDetector(instance, fieldName, memorize, onChange, onBeforeChange);
    });
};