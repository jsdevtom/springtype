import { st } from "../../core/st/st";
import { INTERNAL } from "../component/interface/icomponent";
import { IElement } from "./interface/ielement";
import { IVirtualNode } from "./interface/ivirtual-node";
import { filterCommentsAndUndefines, tsxToStandardAttributeName } from "./tsx";

const LIST_KEY_ATTRIBUTE_NAME = "key";

const getReferenceList = (childNodes: NodeListOf<IElement>): IElement[] => {
  const referenceList: IElement[] = [];
  for (let child of (childNodes as unknown) as Array<IElement>) {
    referenceList.push(child);
  }
  return referenceList;
};

if (!st.renderer) {
  st.renderer = {
    renderInitial: (virtualNode: IVirtualNode | undefined | Array<IVirtualNode | undefined>, parentDomElement: IElement) => {
      if (Array.isArray(virtualNode) && virtualNode) {
        st.dom.createChildElements(virtualNode, parentDomElement);
      } else if (virtualNode) {
        st.dom.createElement(virtualNode as IVirtualNode | undefined, parentDomElement);
      }
    },

    patch: (domElements: Array<IElement>, virtualElements: Array<IVirtualNode | string | undefined>, parent: IElement) => {
      const refList = getReferenceList((domElements as unknown) as NodeListOf<IElement>);

      // comments and undefines can occur at any place dynamically
      virtualElements = filterCommentsAndUndefines(virtualElements) as Array<IVirtualNode>;

      // length to walk is the bigger number of both lists (reality in DOM vs. virtual DOM)
      let maxLength = domElements.length > virtualElements.length ? refList.length : virtualElements.length;

      // walk through max. possible  differences on this level of the subtree
      for (let i = 0; i < maxLength; i++) {
        // removeChild() called before and end of similarities is logically reached
        let domElement = refList[i];
        let virtualElement = virtualElements[i];

        if (!virtualElement && !domElement) {
          break;
        }

        if (typeof virtualElement === "object") {
          st.renderer.patchElement(parent, domElement, virtualElement as IVirtualNode);
        } else {
          st.renderer.patchTextNode(parent, domElement, (virtualElement as unknown) as string);
        }
      }
    },

    removeElement: (parent: IElement, domElement: IElement) => {
      if (domElement.component) {
        domElement.component.onBeforeDisconnect!();
      }

      parent.removeChild(domElement);

      if (domElement.component) {
        domElement.component.disconnectedCallback!();
      }
    },

    patchElement: (parent: IElement, domElement: IElement, virtualElement: IVirtualNode) => {
      // ignore this element and it's while sub-tree (allows for manually changed DOM sub-trees to be retained)

      if (domElement && domElement.nodeType != 3 /* not Text*/ && domElement.hasAttribute("novdom")) return;

      let created = false;
      let replaced = false;

      if (!virtualElement && domElement) {
        // DOMElement existing but no such VirtualElement: Evict zombie node
        st.renderer.removeElement(parent, domElement);
      } else if (virtualElement && !domElement) {
        // VirtualElement exists but no DOMElement: Append node
        domElement = st.dom.createElement(virtualElement, parent) as IElement;
        created = true;
      } else if (virtualElement && domElement && (domElement.tagName || "").toUpperCase() !== virtualElement.type.toUpperCase()) {
        // DOMElement and VirtualElement existing but tagName differs: Replace node
        // also: DOMElement is a TextNode (typeof tagName == 'undefined') but VirtualElement is not

        // tag name differs, replace node
        st.renderer.removeElement(parent, domElement);

        domElement = st.dom.createElement(virtualElement, parent) as IElement;
        created = true;
      } else {
        // DOMElement and VirtualElement are the same on index and tagName
        // but attributes might differ: May update attributes
        // this.updateAllAttributeEventListeners(virtualElement, domElement);

        // DOMElement might have attributes that differ from VirtualElement attributes
        // Replace attribute value then
        if (domElement.attributes) {
          const attributes: Array<Attr> = Array.from(domElement.attributes);

          for (let a = 0; a < attributes.length; a++) {
            const attributeName = tsxToStandardAttributeName(attributes[a].name);

            if (!attributeName.startsWith("on")) {
              if (!virtualElement.attributes || !virtualElement.attributes[attributeName]) {
                // DOMElement has an attribute that doesn't exist on VirtualElement attributes anymore
                domElement.removeAttribute(attributeName);
              } else if (domElement.getAttribute(attributeName) !== virtualElement.attributes[attributeName]) {
                if (attributeName === LIST_KEY_ATTRIBUTE_NAME) {
                  st.renderer.removeElement(parent, domElement);

                  st.dom.createElement(virtualElement, parent);
                  replaced = true;
                } else {
                  // DOMElement attribute value differs from VirtualElement attribute: Update
                  st.dom.setAttribute(attributeName, virtualElement.attributes[attributeName], domElement);
                }
              }
            }
          }
        }
        // VirtualElement might have additional attributes, DOMElement doesn't have atm
        if (!replaced && virtualElement.attributes) {
          // update attributes
          for (let attributeName in virtualElement.attributes) {
            attributeName = tsxToStandardAttributeName(attributeName);

            if (virtualElement.attributes.hasOwnProperty(attributeName) && !domElement.hasAttribute(attributeName) && !attributeName.startsWith("on")) {
              // DOMElement attribute value differs from VirtualElement attribute: Set
              st.dom.setAttribute(attributeName, virtualElement.attributes[attributeName], domElement);
            }
          }
        }
      }

      // process children (recursion)

      // inner should only be patched if it is not a custom element and has no shadow DOM

      if (domElement && domElement.component) {
        // update slot children
        // @ts-ignore
        domElement.component[INTERNAL].slotChildren = virtualElement.slotChildren;

        // @ts-ignore
        domElement.component.doRender();
        return;
      }

      // optimization: If freshly created, all children are already perfectly rendered
      // so no need to walk through all child nodes
      if (!created && !replaced) {
        // parent elements must be both existing
        if (
          domElement &&
          virtualElement &&
          // and at least the existing DOM subtree
          // or the virtual DOM subtree must be given
          ((domElement.childNodes && domElement.childNodes.length) || (virtualElement.children && virtualElement.children.length))
        ) {
          // recursive call with childNodes and virtualElement childNodes
          st.renderer.patch(((domElement.childNodes as unknown) as Array<IElement>) || (([] as unknown) as Array<IElement>), virtualElement.children as any, domElement);
        }
      }
    },

    patchTextNode: (parent: IElement, domElement: IElement, virtualElementTextContent: string) => {
      // text node content
      if (typeof virtualElementTextContent == "undefined" && domElement) {
        // DOMElement existing but no such VirtualElement: Evict zombie node
        parent.removeChild(domElement);
      } else if (virtualElementTextContent && !domElement) {
        // VirtualElement exists but no DOMElement: Append node
        if (parent.nodeType === Node.TEXT_NODE) {
          parent.textContent += virtualElementTextContent;
        } else {
          st.dom.createTextNode(virtualElementTextContent, parent);
        }
      } else if (virtualElementTextContent && domElement) {
        // TextNode is present on both sides but content might differ
        // update innerText

        if (domElement.nodeType === Node.TEXT_NODE) {
          // DOMElement remains being a TextNode
          // ...but has changed: Reflect the change
          if (domElement.textContent !== virtualElementTextContent) {
            domElement.textContent = virtualElementTextContent;
          }
        } else {
          // VirtualElement is a TextNode now but DOMElement is not: remove and replace
          parent.removeChild(domElement);
          st.dom.createTextNode(virtualElementTextContent, parent);
        }
      }
    },
  };
}
