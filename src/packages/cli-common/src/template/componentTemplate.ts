import {kebabToCamelCase} from "../function";
import {springTypeCorePackageDependency} from "../../../st-create-app/src/definition/dependencies";

export const componentTemplate = (componentName: string) => {

    const componentClassName = kebabToCamelCase(componentName);
    return`import {Component, Lifecycle, Template, Style} from "${springTypeCorePackageDependency}";
import tpl from "./${componentName}.tpl";
import style from "./${componentName}.style";

@Component('${componentName}')
@Template(tpl)
@Style(style)
export class ${componentClassName} extends HTMLElement implements Lifecycle {

    
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            '${componentName}': Partial<${componentClassName}>;
        }
    }
}
`;
};
