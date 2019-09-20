import { InjectionStrategy } from "../di/enum/InjectionStrategy";
import { warn } from "../log/log";
import { st } from "../st/ST";
import {
	Formatters,
	Ii18n,
	ITranslation,
	ITranslationValues,
	Translations
} from "./interface/Ii18n";

export class I18n implements Ii18n {
	static valueInterpolationRegexp = /{{(.+?)}}/g;

	formatters: Formatters = {};

	translations: Translations = {};

	currentLanguage: string = "en_US";

	static init(): void {
		if (!st.i18n) {
			// initialize sub-global
			st.i18n = new I18n();

			// register with DI only if enabled
			// allows to inject I18n in constructors
			if (st.di) {
				st.di.setClassName(I18n, "I18n");
				st.di.registerSingletonInstance(st.i18n);
				st.di.setInjectionStrategyConfig(I18n, InjectionStrategy.SINGLETON);
			}
		}
	}

	/**
	 * Resolves a translation key deep in a translation object
	 * @param key Translation key such as: "module_a.foo"
	 * @param translationJSON Translation JSON object data like: { "module_a": { "foo": "Foo!"} }
	 */
	static resolve(key: string, translationJSON: ITranslation): string {
		const splits = key.split(".");
		let translation;

		const walk = (translationJSONSubTree: any, i: number): any => {
			if (!translationJSONSubTree) return;

			translation = translationJSONSubTree[splits[i]];

			if (translation && i == splits.length - 1) {
				if (typeof translation != "string") {
					warn(
						`🔥The translation found for key "${key}" in translations for language: ${st.i18n.currentLanguage} is an object not a string!`
					);
					return `🔥t(${st.i18n.currentLanguage}/${key}) object ❓`;
				}
				return translation;
			} else {
				return walk(translation, ++i);
			}
		};
		return walk(translationJSON, 0);
	}

	static applyValuesAndFormatters(
		translation: string,
		values: ITranslationValues
	): string {
		const matches: Array<string> | null = translation.match(
			I18n.valueInterpolationRegexp
		);

		if (matches) {
			for (let i = 0; i < matches.length; i++) {
				const match = matches[i];
				const valueNameAndFormatterName = match
					.replace("{{", "")
					.replace("}}", "")
					.replace(/ /g, "")
					.split(",");
				const valueName = valueNameAndFormatterName[0];
				const formatterName = valueNameAndFormatterName[1];
				let value;

				if (valueName && values[valueName]) {
					value = values[valueName];

					if (formatterName) {
						if (typeof st.i18n.formatters[formatterName] == "function") {
							value = st.i18n.formatters[formatterName](value);
						} else {
							console.log("formatterName", formatterName, valueName);
							warn(
								`🔥The formatter ${formatterName} for translation value {{ ${valueName}, ${formatterName} }} wasn't found!`
							);
						}
					}
				} else {
					warn(
						`🔥The translation value {{ ${valueName} }} is not set in translation values!`
					);
					value = `🔥${valueName}❓`;
				}
				translation = translation.replace(match, value);
			}
		}
		return translation;
	}

	/**
	 * Translates a key to the translation by:
	 * 1. resolving the translation value in the translation JSON data for the currently active language
	 * 2. Applying translation values for wildcards
	 * 3. Applying transformator functions for the values
	 * @param key Translation key
	 * @param [values] An optional object of data values to replace wildcards with
	 */
	t = (key: string, values?: ITranslationValues): string => {
		// TODO: Parse key for :, call formatter functions
		// TODO: Apply all values
		let translation = I18n.resolve(
			key,
			st.i18n.translations[st.i18n.currentLanguage]
		);

		if (!translation) {
			warn(
				`🔥No translation found for key "${key}" in translations for language: ${st.i18n.currentLanguage}!`
			);
			return `🔥t(${st.i18n.currentLanguage}/${key})❓`;
		} else {
			return I18n.applyValuesAndFormatters(translation, values || {});
		}
	};

	addTranslation = (language: string, translation: ITranslation): Ii18n => {
		st.i18n.initLanguage(language);

		st.i18n.translations[language] = {
			...st.i18n.translations[language],
			...translation
		};
		return st.i18n;
	};

	initLanguage = (language: string): void => {
		if (!st.i18n.translations[language]) {
			st.i18n.translations[language] = {};
		}
	};

	setLanguage = (language: string): Ii18n => {
		st.i18n.initLanguage(language);
		st.i18n.currentLanguage = language;
		return st.i18n;
	};

	addFormatter = (identifier: string, formatter: Function): Ii18n => {
		st.i18n.formatters[identifier] = formatter;
		return st.i18n;
	};
}
I18n.init();

export const t = st.i18n.t;
