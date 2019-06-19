// MUST be imported here
import "reflect-metadata";

import {BeanImpl} from "../interface/BeanImpl";
import {BeanConfig} from "../interface/BeanConfig";
import {registerBean} from "../function/registerBean";

export function Bean<T extends BeanImpl<any>>(beanConfigOrCtor?: BeanConfig<T>|T): T|any {

    // called with @Bean - no beanConfig object
    if (!(typeof beanConfigOrCtor === 'function')) {

        return (target: T) => {
            return registerBean(target, <BeanConfig<T>> beanConfigOrCtor);
        }

    } else {

        // called with @Bean() or @Bean({ ... })
        return registerBean(<T> beanConfigOrCtor);
    }
}