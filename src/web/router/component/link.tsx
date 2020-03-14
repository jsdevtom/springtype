import {st} from "../../../core";
import {attr, component, state} from "../../component";
import {ILifecycle} from "../../component/interface";
import {AttrType} from "../../component/trait/attr";
import {equalObjects} from "../../../core/lang";
import {tsx} from "../../vdom";


export interface ILinkAttrs {
    path: string;
    params?: any;
    href?: string;
    target?: string;
    activeClass?: string;
}


@component({tag: 'a'})
export class Link extends st.component<ILinkAttrs> implements ILifecycle {
    static ACTIVE_LINK_SLOT = 'ACTIVE_LINK_SLOT';
    static INACTIVE_LINK_SLOT = 'INACTIVE_LINK_SLOT';

    @attr
    path: string = '';

    @attr
    params?: any;

    @attr(AttrType.DOM_TRANSPARENT)
    target?: string = '';

    @attr(AttrType.DOM_TRANSPARENT)
    href?: string = 'javascript:void(0)';

    @attr
    activeClass?: string;

    @state
    match: boolean = false;

    onClick = () => {
        st.route = {
            path: this.path,
            params: this.params
        }
    };

    onAfterElCreate() {
        // register callback for future route changes
        this.match = this.isMatch();
        st.router.addOnAfterMatchHandler(() => this.onAfterMatchHandler);
    }

    onAfterMatchHandler() {
        this.match = this.isMatch();
        this.updateActiveClass();
    }

    updateActiveClass = () => {
        const activeClassName = this.activeClass || st.router.activeLinkClass;
        if (!Array.isArray(this.class)) {
            this.class = [this.class];
        }

        const filteredClasses = this.class.filter((className: string) => className !== activeClassName);
        if (this.match) {
            filteredClasses.push(activeClassName);
        }

        this.class = filteredClasses;

    };

    isMatch(): boolean {
        if (st.route) {
            const matcher = st.router.match[this.path];
            if (matcher && equalObjects(matcher.params, this.params || {})) {
                if (matcher.isExact || matcher.isPartial) {
                    return true;
                }
            }
        }
        return false;
    }

    render() {
        return <fragment>
            {this.renderChildren()}
            {this.match
                ? this.renderSlot(Link.ACTIVE_LINK_SLOT)
                : this.renderSlot(Link.INACTIVE_LINK_SLOT)
            }
        </fragment>
    }

    onDisconnect() {
        st.router.removeOnAfterMatchHandler(this.onAfterMatchHandler);
    }

}
