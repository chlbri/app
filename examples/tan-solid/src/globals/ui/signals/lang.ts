import { createSignal } from 'solid-js';
import { createDebounce } from './debounce';

export const LANG_STORE_KEY = 'lang';
export const LANGS = ['fr', 'en', 'es'] as const;
export type Lang = (typeof LANGS)[number];

const createLang = () => {
  let __lang = (localStorage.getItem(LANG_STORE_KEY) ||
    navigator.language.substring(0, 2)) as Lang;

  const check = !__lang || !LANGS.includes(__lang as any);
  if (check) __lang = 'en';

  const [lang, _setLang] = createSignal(__lang);

  const setLang = (newLang: Lang) => {
    localStorage.setItem(LANG_STORE_KEY, newLang);
    _setLang(newLang);
  };

  const debounce = createDebounce(setLang, 350);

  return [lang, debounce] as const;
};

export const [lang, setLang] = createLang();
