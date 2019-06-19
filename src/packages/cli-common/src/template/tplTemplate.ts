import {kebabToCamelCase} from "../function";
import {springTypeCorePackageDependency} from "../../../st-create-app/src/definition/dependencies";

export const tplTemplate = (componentName: string, tpl: string = '') => {

    const componentClassName = kebabToCamelCase(componentName);

    tpl = tpl ? tpl : `<div>${componentName}</div>`;

    return `import {ActiveRenderer} from '${springTypeCorePackageDependency}';
import {${componentClassName}} from "./${componentName}";

export default (component: ${componentClassName}) => ${tpl};
`;
};