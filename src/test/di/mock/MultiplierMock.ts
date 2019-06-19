import {UnresolvableBean} from "../helper/UnresolvableBean";
import {Bean} from "@springtype/core";

@Bean
export class MultiplierMock {

    constructor(unresolvable: UnresolvableBean) {

        // even this is injected, no matter if UnresolvableBean is @Bean annotated or not
        if (!unresolvable) {

            //log.log('Fine, unresolvable class name is injected as', unresolvable);

            //unresolvable.test();
        }

    }

    multiply(a: number, b: number) {

        console.log('test multiply');
        return a * b;
    }
}