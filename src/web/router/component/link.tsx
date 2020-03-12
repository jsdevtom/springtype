import {st} from "../../../core";
import {attr, component} from "../../component";
import {ILifecycle} from "../../component/interface";
import {AttrType} from "../../component/trait/attr";

export interface ILinkAttrs {
    path: string;
    params?: any;
    href?: string;
    target?: string;
    activeClass?: string;
}

export const LINK_ACTIVE_CLASS = 'active';

@component({tag: 'a'})
export class Link extends st.component<ILinkAttrs> implements ILifecycle {


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

    onClick = () => {
        st.route = {
            path: this.path,
            params: this.params
        }
    };

    onAfterElCreate() {
        // register callback for future route changes
        st.router.addOnAfterMatchHandler(this.updateActiveClass);
    }

    updateActiveClass = () => {
       const activeClassName = this.activeClass || LINK_ACTIVE_CLASS;
        if (!Array.isArray(this.class)) {
            this.class = [this.class];
        }

        const filteredClasses = this.class.filter((className: string) => className !== activeClassName);
        if (st.route) {
            const matcher = st.router.match[this.path];
            if (matcher && matcher.isExact) {
                filteredClasses.push(activeClassName);
            }
        }
        this.class = filteredClasses;

    };

    render() {
        return this.renderChildren();
    }

    onDisconnect() {
        st.router.removeOnAfterMatchHandler(this.updateActiveClass);
    }
}
