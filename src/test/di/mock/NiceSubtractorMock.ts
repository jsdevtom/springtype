import {Bean} from "@springtype/core";
import {AbstractSubtractor} from "../helper/AbstractSubtractor";

@Bean
export class NiceSubtractorMock extends AbstractSubtractor {

    subtract(a: number, b: number): number {

        console.log('nice test!');

        return super.subtract(a, b);
    }
}