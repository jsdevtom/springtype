import {validateComponentName} from "./validateComponentName";
import {componentTemplate, styleTemplate, tplTemplate, validateIsSpringTypeProject} from "../../../cli-common";

const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const chalk = require('chalk');

export const createComponent = async (componentName: string, tpl: string = '', style: any = {}) => {

    return new Promise((resolve, reject) => {

        validateComponentName(componentName);
        validateIsSpringTypeProject();

        console.log(`Creating component ${chalk.green(componentName)}.`);
        console.log();

        const isPage = componentName.indexOf('page') > -1;
        const rootDir = process.cwd();

        fs.ensureDirSync(path.join(rootDir, 'src'));

        const subDir = isPage ? 'page' : 'component';

        // src/component or src/page
        fs.ensureDirSync(path.join(rootDir, 'src', subDir));

        // src/component/component-name or src/page/component-name-page
        fs.ensureDirSync(path.join(rootDir, 'src', subDir, componentName));

        // write component.tsx
        fs.writeFileSync(
            path.join(rootDir, 'src', subDir, componentName, componentName + '.tsx'),
            componentTemplate(componentName) + os.EOL
        );

        // create component.tpl.tsx
        fs.writeFileSync(
            path.join(rootDir, 'src', subDir, componentName, componentName + '.tpl.tsx'),
            tplTemplate(componentName, tpl) + os.EOL
        );

        // create component.style.tsx
        fs.writeFileSync(
            path.join(rootDir, 'src', subDir, componentName, componentName + '.style.tsx'),
            styleTemplate(componentName, style) + os.EOL
        );

        resolve();
    });
};