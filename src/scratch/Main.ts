import {Gain} from "./GainSameName";
import {BeanFactory} from "../package/di";

let gain: Gain = BeanFactory.getBean("Gain", Gain);
let gainSameName: Gain = BeanFactory.getBean("Gain", Gain);

console.log('Gain via DI', gain);