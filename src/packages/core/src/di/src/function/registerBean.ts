import {BeanConfig} from "../interface/BeanConfig";
import {BeanReflector} from "../BeanReflector";
import {ApplicationContext} from "../ApplicationContext";
import {BeanImpl} from "../interface/BeanImpl";
import {ArgumentsInjectionMetadata} from "../interface/ArgumentsInjectionMetadata";

export const INJECT_DECORATOR_METADATA_KEY = "@Inject";

export function registerBean<T extends BeanImpl<any>>(beanCtor: T, beanConfig?: BeanConfig<T>) {

    // @Inject decorators that may be defined inside of the class definition
    // this @Bean decorator is bound to, are processed first.
    // This call collects it's meta data so the BeanFactory can
    // handle the constructor parameter value injection correctly.
    const parameterInjectionMetaData: ArgumentsInjectionMetadata = Reflect.getOwnMetadata(
        INJECT_DECORATOR_METADATA_KEY, beanCtor, beanCtor.name
    );

    BeanReflector.register(beanCtor, parameterInjectionMetaData, beanConfig);

    // a generic intermediate class is conjured, inheriting the class
    // the decorator is bound to. This keeps the prototype chain and later
    // instanceof checks sane. It is necessary, because we want to
    // *replace* the constructor with one that resolves it's arguments by itself (injection)
    // and is capable of even handling @Inject decorators in it constructor arguments (wohoo)
    const InjectionClassProxy = class extends beanCtor {
        constructor(...args: Array<any>) {
            super(...ApplicationContext.getInstance().resolveConstructorArguments(beanCtor));
        }
    };

    BeanReflector.registerDerived(beanCtor, InjectionClassProxy);

    ApplicationContext.getInstance().setBean(InjectionClassProxy);

    // just replace the original class declaration by our generic one
    return InjectionClassProxy;
}