import { st } from "../../../../../src/core";
import { customElement } from "../../../../../src/web/customelement";
import { tsx } from "../../../../../src/web/vdom";

@customElement()
export class HomePage extends st.element {
  static ROUTE = "";

  constructor() {
    super();

    console.log("new HomePage instance");
  }

  render() {
    return (
      <div>
        HomePage <br />
        {/* manually typed link, also no API used for routing */}
        <a href="/#/blog/">Blog</a>
      </div>
    );
  }

  onConnect() {
    console.log("onConnect HomePage");
  }

  renderStyle() {

    console.log('this', this);

    return `body {
      background: #ff0000
    }`
  }
}
