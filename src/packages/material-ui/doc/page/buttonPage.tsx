import {Element, Lifecycle, Partial, Template, UseElement, VirtualElement} from "@springtype/core";
import {MWCButton, MWCCheckbox} from "../..";

const template = (view: ButtonPage): VirtualElement => {

    return <div>
        <div>
            <div>
                <mwc-checkbox label={'outlined'} onclick={view.clickOutlined}/>
            </div>
            <div>
                <mwc-checkbox label={'raised'} onclick={view.clickRaised}/>
            </div>
            <div>
                <mwc-checkbox label={'unelevated'} onclick={view.clickUnelevated}/>
            </div>
            <div>
                <mwc-checkbox label={'dense'} onclick={view.clickDense}/>
            </div>
            <div>
                <mwc-checkbox label={'disabled'} onclick={view.clickDisabled}/>
            </div>
            <div>
                <mwc-checkbox label={'ripple'} checked={true} onclick={view.clickRipple}/>
            </div>
            <div>
                <mwc-checkbox label={'trailing-icon'}/>
            </div>
        </div>
        <mwc-button label={"mwc button"}
                    outlined={view.outlined}
                    raised={view.raised}
                    unelevated={view.unelevated}
                    dense={view.dense}
                    disabled={view.disabled}
                    ripple={view.ripple}
        />
    </div>
};

@UseElement(MWCButton)
@UseElement(MWCCheckbox)
@Element('button-page')
@Template(template)
export class ButtonPage extends HTMLElement implements Lifecycle {

    public outlined: boolean = false;
    public raised: boolean = false;
    public unelevated: boolean = false;
    public dense: boolean = false;
    public disabled: boolean = false;
    public ripple: boolean = true;

    constructor() {
        super();
    }

    clickOutlined = (evt: any) => {
        this.outlined = !!evt.target.checked;
        this.doConnect();
    };

    clickRaised = (evt: any) => {
        this.raised = !!evt.target.checked;
        this.doConnect();
    };
    clickUnelevated = (evt: any) => {
        this.unelevated = !!evt.target.checked;
        this.doConnect();
    };
    clickDense = (evt: any) => {
        this.dense = !!evt.target.checked;
        this.doConnect();
    };
    clickDisabled = (evt: any) => {
        this.disabled = !!evt.target.checked;
        this.doConnect();
    };

    clickRipple = (evt: any) => {
        this.doConnect();
        this.ripple = !evt.target.checked;
    };
}


declare global {
    namespace JSX {
        interface IntrinsicElements {
            'button-page': Partial<ButtonPage>;
        }
    }
}