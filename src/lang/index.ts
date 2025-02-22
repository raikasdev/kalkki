import { en } from '@/lang/en';
import { fi } from './fi';
import { sv } from '@/lang/sv';

const languages = {
  fi,
  en,
  sv
};

type TranslationKey = keyof typeof fi;
export type Language = keyof typeof languages;

export function translate(key: TranslationKey, lang: Language = 'fi') {
  return languages[lang][key] ?? languages['fi'][key];
}