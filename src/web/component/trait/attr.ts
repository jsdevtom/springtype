import { st } from "../../../core";

export const ATTRS: string = "ATTRS";

export enum AttrType {
  DOM_TRANSPARENT,
  DOM_INTRANSPARENT,
}

export const DEFAULT_ATTR_TYPE = AttrType.DOM_INTRANSPARENT;

export interface IInternalAttrEntry {
  name: string;
  type: AttrType;
}

export class AttrTrait {
  static enableFor(instance: any) {
    const attrs = Object.getPrototypeOf(instance).constructor[ATTRS] || {};

    // add change detection / reflection for all @attrs
    for (let name in attrs) {
      Object.defineProperty(instance, name, {
        get: () => {
          return instance.getAttribute(name);
        },
        set: (value: any) => {
          instance.setAttribute(name, value);
        },
      });
    }
  }

  static getType(instance: any, name: string) {
    const attributeDecorations = Object.getPrototypeOf(instance).constructor[ATTRS] || {};
    if (!attributeDecorations[name]) return DEFAULT_ATTR_TYPE;
    return attributeDecorations[name].type;
  }

  static addAttr(ctor: any, name: string, type: AttrType) {
    // validate
    if (process.env.NODE_ENV === "development") {
      // test and warn for uppercase characters because DOM will lowercase them
      if (type === AttrType.DOM_TRANSPARENT && /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/g.test(name!.toString())) {
        st.warn(`The attribute ${ctor.name}.${name} is DOM_TRANSPARENT and thus has a bad naming. It should be like: ${name.toLowerCase()}`);
      }
    }

    // init cache
    if (!ctor[ATTRS]) {
      ctor[ATTRS] = {};
    }

    // register
    ctor[ATTRS][name] = {
      name,
      type,
    };
  }
}
