import {Route} from "@springtype/router";
import {ButtonPage} from "./page/buttonPage";

@Route('', ButtonPage)
@Route('button',ButtonPage)
export class TestApp {
}