import {Bean} from "@springtype/core";
import {UnresolvableBean} from "../helper/UnresolvableBean";
import {MultiplierMock} from "../mock/MultiplierMock";

@Bean({
    mockedBy: MultiplierMock
})
export class Multiplier {

    constructor(unresolvable: UnresolvableBean, mul?: Multiplier) {

        // even this is injected, no matter if UnresolvableBean is @Bean annotated or not
        if (!unresolvable) {

            //log.log('Fine, unresolvable class name is injected as', unresolvable);

            //unresolvable.test();
        }

    }

    multiply(a: number, b: number) {

        return a * b;
    }
}