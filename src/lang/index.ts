import { en } from "@/lang/en";
import { sv } from "@/lang/sv";
import { fi } from "./fi";

const languages = {
	fi,
	en,
	sv,
};

type TranslationKey = keyof typeof fi;
export type Language = keyof typeof languages;

export function translate(key: TranslationKey, lang: Language = "fi") {
	return languages[lang][key] ?? languages.fi[key];
}

export function getDefaultLanguage(): Language {
	const navigatorLang = navigator.language.split("-")[0];
	if (navigatorLang in languages) {
		return navigatorLang as Language;
	}
	return "fi";
}
