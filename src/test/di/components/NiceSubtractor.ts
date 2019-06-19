import {AbstractSubtractor} from "../helper/AbstractSubtractor";
import {Bean} from "@springtype/core";
import {NiceSubtractorMock} from "../mock/NiceSubtractorMock";

@Bean({
    mockedBy: NiceSubtractorMock
})
export class NiceSubtractor extends AbstractSubtractor {

    subtract(a: number, b: number): number {

        console.log('nice!');

        return super.subtract(a, b);
    }
}