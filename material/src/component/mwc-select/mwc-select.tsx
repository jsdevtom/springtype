import "@material/select/dist/mdc.select.min.css";
import { st } from "../../../../src/core/st";
import { attr, customElement } from "../../../../src/web/customelement";
import { ISelectItem } from "./ISelectItem";
import tpl from "./mwc-select.tpl";

export type VariantType = false | "fixed" | "prominent" | "fixed-prominent" | "short" | "fixed-short";

@customElement("mwc-select", {
  tpl,
  shadowMode: "none",
})
export class MwcSelect extends st.element {
  @attr()
  "mwc-items": ISelectItem[] = [];
  @attr()
  "mwc-label": string;

  onConnect() {
    console.log("MwcSelect", this["mwc-label"]);
  }

  onMwcSelected = (evt: any) => {
    evt.preventDefault();
    const test = this["mwc-items"].find(value => value.id == evt.target.value);
    this.dispatchEvent(new CustomEvent("select", { detail: test }));
  };
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "mwc-select": Partial<MwcSelect>;
    }
  }
}
