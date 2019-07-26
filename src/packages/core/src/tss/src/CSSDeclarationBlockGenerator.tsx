import {CaseTransformer} from "../../lang";
import {VirtualElement} from "../../virtualdom";
import {ActiveRenderer} from "../../renderer";

export class CSSDeclarationBlockGenerator {

    static generate(declaration: any): VirtualElement|string {

        const generateDeclaration = (declaration: any, mediaQuery: boolean = false): string => {

            let styles = '';

            // support for template-string based stylesheets
            if (typeof declaration === 'string') {
                return declaration;
            }

            for (let selector in declaration) {

                if (declaration.hasOwnProperty(selector)) {

                    if (selector.indexOf('@') === 0) {

                        styles = `${styles}\n\n${selector} {${generateDeclaration(declaration[selector], true)}    \n}\n\n`;

                    } else {

                        let styleMapping = '';

                        for (let property in declaration[selector]!) {

                            if (declaration[selector]!.hasOwnProperty(property)) {

                                if (typeof declaration[selector] === 'string') {

                                    // support for template-string based block styles
                                    styleMapping = declaration[selector] as string;

                                } else {

                                    let styleValue = (declaration[selector] as any)[property];

                                    // uniform to array (multiple values for one CSS property)
                                    if (!Array.isArray(styleValue)) {
                                        styleValue = [styleValue];
                                    }

                                    for (let i=0; i<styleValue.length; i++) {

                                        styleMapping = `${styleMapping}\n    ${mediaQuery ? '    ': ''}${
                                            CaseTransformer.camelToKebabCase(property) // selector
                                            }: ${styleValue[i]};`;
                                    }
                                }
                            }
                        }
                        styles = `${styles} \n\n${mediaQuery ? '    ': ''}${selector} {\n${mediaQuery ? '        ': '    '}${styleMapping}\n${mediaQuery ? '    ': ''}}`;
                    }
                }
            }
            return styles;
        };

        return <style type="text/css">

            {
                generateDeclaration(declaration)
            }

        </style> as VirtualElement;
    }
}