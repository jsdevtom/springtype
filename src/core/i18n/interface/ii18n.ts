import { ITranslations } from "./itranslations";
import { It } from "./it";
import { IAddTranslation } from "./iadd-translation";
import { ISetLanguage } from "./iset-language";

export interface Ii18n {
	translations: ITranslations;
	registeredTComponents: Array<any>;
	currentLanguage: string;
	initLanguage: (language: string) => void;
	addTranslation: IAddTranslation;
	t: It;
	setLanguage: ISetLanguage;
	registerTComponent: (tComponent: any) => void;
	unregisterTComponent: (tComponent: any) => void;
}
