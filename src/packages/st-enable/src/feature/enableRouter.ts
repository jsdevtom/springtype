import {installDependencies} from "../function/installDependencies";

const chalk = require('chalk');

const dependency = '@springtype/router';

export const enableRouter = async(): Promise<void> => {

    await installDependencies([dependency]);

    console.log(`${chalk.green('Successfully enabled module: ')} ${chalk.cyan(dependency)}`);
    console.log('');
    console.log('Now you can render:');
    console.log();
    console.log(`    ${chalk.gray('<st-router-outlet>')}`);
    console.log();
    console.log(`in a root component of your app to define where routed pages shall be displayed.`);
    console.log();
    console.log(`...make sure to add:`);
    console.log();
    console.log(`    ${chalk.gray('@UseComponent(RouterOutlet)')}`);
    console.log();
    console.log(`in on the component that renders the router outlet.`);
    console.log();
    console.log(`To route to specific components, use:`);
    console.log();
    console.log(`    ${chalk.gray('@Component("app-default-page")')}`);
    console.log(`    ${chalk.gray('@Route("*")')}`);
    console.log('');
    console.log('because @Route added to a page component tells SpringType which route belongs to what page.');
    console.log();
};