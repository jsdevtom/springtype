import {kebabToCamelCase} from "../function";
import {springTypeCorePackageDependency} from "../../../st-create-app/src/definition/dependencies";

export const styleTemplate = (componentName: string, style: any = {}) => {

    const componentClassName = kebabToCamelCase(componentName);

    if (!style) {
        style = {};
    }

    if (!style[':host']) {
        style[':host'] = {};
    }

    return `import {TypedStyleSheet} from "${springTypeCorePackageDependency}";
import {${componentClassName}} from "./${componentName}";

export default (component: ${componentClassName}, theme: any): TypedStyleSheet => (${JSON.stringify(style, null, 4)});`;
};