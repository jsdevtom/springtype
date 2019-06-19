const chalk = require('chalk');

export const validateComponentName = (componentName: string) => {

    const allowedCharacters = /[a-z0-9-]/gi;
    const containsDash = componentName.indexOf('-') > -1;
    let containsIrregularCharacter = false;

    if (!allowedCharacters.test(componentName)) {
        containsIrregularCharacter = true;
    }

    if (!containsDash) {
        console.error(
            chalk.red(
                `The component ${chalk.green(
                    componentName
                )} does not have any dash (-).\n` +
                `Every custom component name should contain a dash and be structured like that:\n\n`
            ) +
            chalk.cyan('myapp-component-name') +
            chalk.red('\n\nPlease choose an component name with this pattern.')
        );
        process.exit(1);
    }

    if (containsIrregularCharacter) {
        console.error(
            chalk.red(
                `The component ${chalk.green(
                    componentName
                )} has invalid characters.\n` +
                `A custom component name should only contain lowercase characters, numbers and dash symbols.\n\n`
            )
        );
        process.exit(1);
    }
};