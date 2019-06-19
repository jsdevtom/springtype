import {BeanReflector} from "./BeanReflector";
import {InjectionProfile} from './enum/InjectionProfile';
import {InjectionStrategy} from "./enum/InjectionStrategy";
import {BeanImpl} from "./interface/BeanImpl";
import {resolveInjectionArgumentValue} from "./function/resolveInjectionArgumentValue";
import {ArgumentsInjectionMetadata} from "./interface/ArgumentsInjectionMetadata";
import {ConstructorArgumentInitializer} from "./interface/ConstructorArgumentInitializer";

const PRIMITIVE_TYPE_NAMES = ['Number', 'Array', 'String', 'Boolean', 'RegExp', 'Date'];

export class BeanFactory {

    registry = {};
    singletonInstances = {};

    getBean<T extends BeanImpl<any>>(
        beanCtor: T,
        injectionProfile: InjectionProfile = InjectionProfile.DEFAULT,
        injectionStrategy: InjectionStrategy = InjectionStrategy.SINGLETON): any {

        const originalCtor = beanCtor;

        // validate bean reference
        beanCtor = this._getBean(beanCtor);

        if (!beanCtor || !BeanReflector.isBean(beanCtor)) {

            return this.solveUnresolvableBean(
                originalCtor
            );
        }

        const classSymbol = BeanReflector.getSymbol(beanCtor);
        const beanConfig = BeanReflector.getConfig(beanCtor);

        if (injectionProfile === InjectionProfile.TEST &&
            beanConfig &&
            beanConfig.mockedBy &&
            BeanReflector.isBean(beanConfig.mockedBy)) {

            beanCtor = this._getBean(beanConfig.mockedBy);

            BeanReflector.setIsMockBean(beanCtor);
        }

        // only in case of singleton instance retrieval,
        // try to fetch from cache, otherwise directly head to new instance creation
        if (injectionStrategy === InjectionStrategy.SINGLETON) {

            const singletonInstance = this.getSingletonBeanInstance(classSymbol);

            if (singletonInstance) {
                return singletonInstance;
            }
        }

        // injectionStrategy === InjectionStrategy.FACTORY || singleton instance not found

        const beanInstance = new beanCtor(
            ...this.resolveConstructorArguments(beanCtor, injectionProfile)
        );

        this.initializeBeanInstance(beanInstance, BeanReflector.getInitializers(beanCtor));

        if (injectionStrategy === InjectionStrategy.SINGLETON) {
            this.setSingletonBeanInstance(classSymbol, beanInstance);
        }
        return beanInstance;
    }

    setBean(beanCtor: BeanImpl<any>) {
        Reflect.set(this.registry, BeanReflector.getSymbol(beanCtor), beanCtor);
    }

    _getBean(beantCtor: BeanImpl<any>) {
        return Reflect.get(this.registry, BeanReflector.getSymbol(beantCtor)) || null;
    }
    
    initializeBeanInstance(instance: any, initializers: Array<Function>) {

        initializers.forEach((initializer) => {
            initializer(instance);
        });
    }

    getSingletonBeanInstance(
        classSymbol: symbol
    ): any {
        return Reflect.get(this.singletonInstances, classSymbol);
    }

    setSingletonBeanInstance(
        classSymbol: symbol,
        beanInstance: any
    ): void {
        Reflect.set(this.singletonInstances, classSymbol, beanInstance);
    }

    resolveConstructorArguments<T extends BeanImpl<any>>(
        beanCtor: T,
        injectionProfile: InjectionProfile = InjectionProfile.DEFAULT,
    ): Array<any> {

        beanCtor = this._getBean(beanCtor);

        const isTestBean = BeanReflector.getIsMockBean(beanCtor);

        const cachedConstructorArguments = BeanReflector.getResolvedConstructorArguments(beanCtor);

        if (cachedConstructorArguments) {
            return cachedConstructorArguments;
        }

        // fetch constructor parameter types from reflection metadata
        const constructorParameterTypes: Array<BeanImpl<any>> = BeanReflector.getConstructorArgumentTypes(
            beanCtor
        );

        // and do the default round-trip to get all instances by type
        const constructorArguments = this.getBeans(
            constructorParameterTypes,
            beanCtor,
            injectionProfile
        );

        const constructorArgumentsParameterInjectionMetdata: ArgumentsInjectionMetadata =
            BeanReflector.getConstructorArgumentsInjectionMetadata(beanCtor);


        // but if there are special @Inject decorations,
        // we head to resolve them and use these values instead
        if (constructorArgumentsParameterInjectionMetdata &&
            constructorArgumentsParameterInjectionMetdata.arguments &&
            constructorArgumentsParameterInjectionMetdata.arguments.length) {

            const overrideInjectParamValues = constructorArgumentsParameterInjectionMetdata.arguments;

            for (let i = 0; i < overrideInjectParamValues.length; i++) {

                if (typeof overrideInjectParamValues[i] !== 'undefined') {

                    constructorArguments[overrideInjectParamValues[i].index] =

                        resolveInjectionArgumentValue(
                            constructorArgumentsParameterInjectionMetdata,
                            overrideInjectParamValues[i].index,
                            isTestBean
                        );
                }
            }
        }

        const constructorArgumentInitializers = BeanReflector.getConstructorArgumentInitializers(beanCtor);

        if (constructorArgumentInitializers.length) {

            constructorArgumentInitializers.forEach((initializer: ConstructorArgumentInitializer) => {

                constructorArguments[initializer.argumentIndex] = initializer.initializer(
                    constructorArguments[initializer.argumentIndex]
                );
            });
        }

        // cache
        BeanReflector.setResolvedConstructorArguments(beanCtor, constructorArguments);

        return constructorArguments;
    }

    getBeans<T extends BeanImpl<any>>(
        types: Array<BeanImpl<any>>,
        forBeanCtor: T,
        injectionProfile: InjectionProfile = InjectionProfile.DEFAULT,
    ): Array<BeanImpl<any>> {

        if (types && types.length > 0) {

            const beans: Array<any> = [];

            types.forEach((_beanCtor: BeanImpl<any>) => {

                const beanCtor = this._getBean(_beanCtor);

                // the bean to inject (beanCtor) matches the bean to inject in (forBeanCtor)
                if (forBeanCtor === beanCtor) {

                    beans.push(
                        this.solveCyclicDependency(beanCtor)
                    );
                } else if (!beanCtor) {

                    // bean unresolvable -> inject undefined
                    beans.push(
                        this.solveUnresolvableBean(
                            _beanCtor
                        )
                    );

                } else {

                    const singletonBeanInstanceFromRegistry = this.getSingletonBeanInstance(
                        BeanReflector.getSymbol(beanCtor)
                    );

                    if (singletonBeanInstanceFromRegistry) {

                        beans.push(singletonBeanInstanceFromRegistry)

                    } else {

                        beans.push(
                            // follow down the rabbit hole
                            this.getBean(beanCtor, injectionProfile)
                        );
                    }
                }
            });
            return beans;
        }
        return [];
    }

    solveUnresolvableBean<T extends BeanImpl<any>>(
        beanCtor: T
    ): any {

        // inject interfaces as empty objects
        if (beanCtor.prototype.constructor === Object) {
            return {};
        } else {

            const typeName = (<any>beanCtor).name;

            if (!typeName.match(/HTML.*Element/) && !typeName.match(/SVG.*Element/) && PRIMITIVE_TYPE_NAMES.indexOf(typeName) === -1) {
                console.warn(`The bean referenced for injection is missing a @Bean decorator: ${typeName}`);
            }
            return undefined;
        }
    }

    solveCyclicDependency<T extends BeanImpl<any>>(beanCtor: T): T {

        console.warn(`Cyclic dependency detected in @Bean: ${BeanReflector.getName(beanCtor)}`);

        return beanCtor;
    }
}