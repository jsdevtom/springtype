import {BeanReflector} from "../BeanReflector";
import {ApplicationContext} from "../ApplicationContext";
import {InjectionProfile} from "../enum/InjectionProfile";
import {InjectionReference} from "../type/InjectionReference";
import {ArgumentsInjectionMetadata} from "../interface/ArgumentsInjectionMetadata";

export function resolveInjectionArgumentValue(
    argumentsInjectionMetaData: ArgumentsInjectionMetadata,
    index: number,
    isTestBean: boolean
) {

    let injectionValue: any;

    if (!argumentsInjectionMetaData.arguments[index]) return;

    const injectionReference: InjectionReference =
        argumentsInjectionMetaData.arguments[index].injectionReference;

    if (typeof injectionReference !== 'undefined') {

        if (typeof injectionReference === 'function') {

            if (BeanReflector.isBean(injectionReference)) {

                // it is not a InjectBeanFactory, just use the instance
                injectionValue = ApplicationContext.getInstance().getBean(
                    injectionReference,
                    isTestBean ? InjectionProfile.TEST : InjectionProfile.DEFAULT,
                    argumentsInjectionMetaData.arguments[index].injectionStrategy,
                );

            } else {

                // case: function is not a InjectBeanFactory NOR registered bean -> inject function reference
                injectionValue = injectionReference;
            }

        } else {

            // use the value directly (any value case)
            injectionValue = injectionReference;
        }
    }
    return injectionValue;
}