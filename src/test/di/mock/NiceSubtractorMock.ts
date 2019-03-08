import {Component} from "../../../package/core/src/index";
import {AbstractSubtractor} from "../helper/AbstractSubtractor";

@Component
export class NiceSubtractorMock extends AbstractSubtractor {

    subtract(a: number, b: number): number {

        console.log('nice test!');

        return super.subtract(a, b);
    }
}