import {InjectionStrategy} from "./enum/InjectionStrategy";
import {BeanImpl} from "./interface/BeanImpl";
import {BeanConfig} from "./interface/BeanConfig";
import {ArgumentsInjectionMetadata} from "./interface/ArgumentsInjectionMetadata";
import {createDefaultArgumentsInjectionMetadata} from "./function/createDefaultArgumentsInjectionMetadata";
import {InjectionReference} from "./type/InjectionReference";
import {BeanInitializer} from "./interface/BeanInitializer";
import {ConstructorArgumentInitializer} from "./interface/ConstructorArgumentInitializer";
import {ConstructorArgumentInitializerFunction} from "./interface/ConstructorArgumentInitializerFunction";
import {INJECT_DECORATOR_METADATA_KEY} from "./function/registerBean";

const BEAN = 'BEAN';
const BEAN_CONFIG = 'BEAN_CONFIG';
const BEAN_CONSTRUCTOR_PARAMETER_METADATA = 'BEAN_CONSTRUCTOR_PARAMETER_METADATA';
const BEAN_INITIALIZERS = 'BEAN_INITIALIZERS';
const BEAN_IS_MOCK_FLAG = 'BEAN_IS_MOCK_FLAG';
const BEAN_NAME = 'BEAN_NAME';
const CONSTRUCTOR_ARGUMENT_INITIALIZERS = 'CONSTRUCTOR_ARGUMENT_INITIALIZERS';
const RESOLVED_CONSTRUCTOR_ARGUMENTS = 'RESOLVED_CONSTRUCTOR_ARGUMENTS';

/**
 * This class uses the Reflect.metadata standard API (polyfilled)
 * to fetch and store compile-time and runtime reflected metadata.
 *
 * Calls to Reflect.getMetadata() point to TypeScript compiler generated
 * metadata. All other Reflect.* calls deal with runtime metadata (from decorators, BeanFactory).
 */
export class BeanReflector {

    static setIsMockBean(beanCtor: BeanImpl<any>): void {
        Reflect.set(beanCtor, BEAN_IS_MOCK_FLAG, true);
    }

    static getIsMockBean(beanCtor: BeanImpl<any>): boolean {
        return !!Reflect.get(beanCtor, BEAN_IS_MOCK_FLAG);
    }

    static getMethodArgumentTypes(beanCtor: BeanImpl<any>, propertyName: string) {
        return Reflect.getMetadata('design:paramtypes', beanCtor, propertyName) || [];
    }

    static getConstructorArgumentTypes(beanCtor: BeanImpl<any>): Array<BeanImpl<any>> {
        return Reflect.getMetadata('design:paramtypes', beanCtor) || [];
    }

    static register(
        beanCtor: BeanImpl<any>,
        parameterInjectionMetadata: ArgumentsInjectionMetadata,
        beanConfig?: BeanConfig<BeanImpl<any>>,
    ): void {

        Reflect.set(beanCtor, BEAN_CONFIG, beanConfig);
        Reflect.set(beanCtor, BEAN, Symbol(beanCtor.name));
        Reflect.set(beanCtor, BEAN_NAME, beanCtor.name);
        Reflect.set(beanCtor, BEAN_CONSTRUCTOR_PARAMETER_METADATA, parameterInjectionMetadata);
    }

    static registerDerived(
        originalBeanCtor: BeanImpl<any>,
        derivedBeanCtor: BeanImpl<any>,
    ) {

        Reflect.set(derivedBeanCtor, BEAN, BeanReflector.getSymbol(originalBeanCtor));
        Reflect.set(derivedBeanCtor, BEAN_NAME, BeanReflector.getName(originalBeanCtor));
        Reflect.set(derivedBeanCtor, BEAN_CONFIG, BeanReflector.getConfig(originalBeanCtor));
        Reflect.set(derivedBeanCtor, BEAN_CONSTRUCTOR_PARAMETER_METADATA,
            BeanReflector.getConstructorArgumentsInjectionMetadata(originalBeanCtor));
    }

    static getConstructorArgumentsInjectionMetadata(
        beanCtor: BeanImpl<any>
    ): ArgumentsInjectionMetadata {
        return Reflect.get(beanCtor, BEAN_CONSTRUCTOR_PARAMETER_METADATA);
    }

    static setConstructorArgumentsInjectionMetadata(
        targetClassInstanceOrCtor: Function,
        parameterIndex: number,
        injectionReference: InjectionReference,
        injectionStrategy: InjectionStrategy): void {


        // fetch (probably existing) meta data
        const parameterInjectionMetaData: ArgumentsInjectionMetadata = Reflect.getOwnMetadata(
            INJECT_DECORATOR_METADATA_KEY, targetClassInstanceOrCtor, targetClassInstanceOrCtor.name
        ) || createDefaultArgumentsInjectionMetadata();

        // enhance meta data for parameter
        parameterInjectionMetaData.arguments[parameterIndex] = {
            index: parameterIndex,
            injectionReference,
            injectionStrategy
        };

        // (re-)define injection reference meta data
        Reflect.defineMetadata(
            INJECT_DECORATOR_METADATA_KEY,
            parameterInjectionMetaData,
            targetClassInstanceOrCtor,
            targetClassInstanceOrCtor.name);
    }

    static setMethodArgumentsInjectionMetadata(
        targetClassInstanceOrCtor: Object,
        parameterIndex: number,
        propertyKey: string | symbol,
        injectionReference: InjectionReference,
        injectionStrategy: InjectionStrategy
    ): void {

        // fetch (probably existing) meta data
        const parameterInjectionMetaData: ArgumentsInjectionMetadata = BeanReflector.getMethodArgumentsInjectionMetadata(
            targetClassInstanceOrCtor, propertyKey
        ) || createDefaultArgumentsInjectionMetadata();

        // enhance meta data for parameter
        parameterInjectionMetaData.arguments[parameterIndex] = {
            index: parameterIndex,
            injectionReference,
            injectionStrategy
        };

        // (re-define) injection reference for parameter index
        Reflect.defineMetadata(INJECT_DECORATOR_METADATA_KEY, parameterInjectionMetaData, targetClassInstanceOrCtor, propertyKey);
    }

    static getMethodArgumentsInjectionMetadata(
        targetClassInstanceOrCtor: Object,
        propertyKey: string | symbol,
    ): ArgumentsInjectionMetadata {
        return Reflect.getOwnMetadata(
            INJECT_DECORATOR_METADATA_KEY, targetClassInstanceOrCtor, propertyKey
        );
    }

    static getSymbol(targetCtor: BeanImpl<any>): any {
        return Reflect.get(targetCtor, BEAN);
    }

    static getName(targetCtor: BeanImpl<any>): string {
        return Reflect.get(targetCtor, BEAN_NAME);
    }

    static getConfig(targetCtor: BeanImpl<any>): BeanConfig<BeanImpl<any>> {
        return Reflect.get(targetCtor, BEAN_CONFIG);
    }

    /* When constructor arguments (injections) are resolved, the result is cached for later use */
    static setResolvedConstructorArguments(targetCtor: BeanImpl<any>, constructorArguments: Array<BeanImpl<any>>): void {
        Reflect.set(targetCtor, RESOLVED_CONSTRUCTOR_ARGUMENTS, constructorArguments);
    }

    static getResolvedConstructorArguments(targetCtor: BeanImpl<any>): Array<BeanImpl<any>> {
        return Reflect.get(targetCtor, RESOLVED_CONSTRUCTOR_ARGUMENTS);
    }

    static isBean(beanCtor: BeanImpl<any>): boolean {
        return !!BeanReflector.getSymbol(beanCtor);
    }

    static getInitializers(targetCtor: BeanImpl<any>): Array<BeanInitializer> {
        return Reflect.get(targetCtor, BEAN_INITIALIZERS) || [];
    }

    static addInitializer(targetCtor: BeanImpl<any>, initializer: BeanInitializer): void {
        const initializers = BeanReflector.getInitializers(targetCtor);
        initializers.push(initializer);
        Reflect.set(targetCtor, BEAN_INITIALIZERS, initializers);
    }

    static callInitializers(initializers: Array<BeanInitializer>, instance: any): void {
        initializers.forEach(initializer => initializer(instance));
    }

    static getConstructorArgumentInitializers(targetCtor: BeanImpl<any>): Array<ConstructorArgumentInitializer> {
        return Reflect.get(targetCtor, CONSTRUCTOR_ARGUMENT_INITIALIZERS) || [];
    }

    static addConstructorArgumentInitializer(
        targetCtor: BeanImpl<any>,
        initializer: ConstructorArgumentInitializerFunction,
        argumentIndex: number
    ): void {
        const initializers = BeanReflector.getConstructorArgumentInitializers(targetCtor);
        initializers.push({
            initializer,
            argumentIndex
        });
        Reflect.set(targetCtor, CONSTRUCTOR_ARGUMENT_INITIALIZERS, initializers);
    }
}