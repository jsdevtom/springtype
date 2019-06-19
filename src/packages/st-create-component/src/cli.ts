import {donationUrl} from "./definition/donationUrl";
import {createComponent} from "./function/createComponent";
import {printBanner} from "../../cli-common";

const commander = require('commander');
const chalk = require('chalk');
const packageJson = require('../../../package.json');

let componentName: string|undefined = undefined;

const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<component-name>')
    .usage(`${chalk.green('<component-name>')} [options]`)
    .action((name: string) => {
        componentName = name;
    })
    .allowUnknownOption()
    .on('--help', () => {
        console.log(`    Only ${chalk.green('<component-name>')} is required.`);
        console.log();
        console.log(
            `    If you have any problems, do not hesitate to file an issue:`
        );
        console.log(
            `      ${chalk.cyan(packageJson.bugs.url)}`
        );
        console.log();
    })
    .parse(process.argv);

(async() => {

    if (typeof componentName === 'undefined') {

        console.error('Please specify the component name to create. It must contain a dash:');
        console.log(
            `  ${chalk.cyan(program.name())} ${chalk.green('<component-name>')}`
        );
        console.log();
        console.log('For example:');
        console.log(`  ${chalk.cyan(program.name())} ${chalk.green('myapp-home-page')}`);
        console.log();
        console.log(
            `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
        );
        process.exit(1);

    } else {

        await createComponent(componentName);

        printBanner(packageJson.homepage, packageJson.bugs.url, donationUrl);
    }
})();
