import {BeanImpl} from "./BeanImpl";

export interface BeanConfig<T extends BeanImpl<any>> {

    // reference to the bean that should be used in test
    mockedBy?: T;
}