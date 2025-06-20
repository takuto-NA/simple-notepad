// Language definitions and metadata
export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  rtl?: boolean; // Right-to-left support
  country?: string; // Country code for flag display
}

export interface TranslationData {
  [key: string]: string;
}

export interface Languages {
  [langCode: string]: TranslationData;
}

// Available languages registry
// Add new languages here when creating new translation files
export const availableLanguages: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    country: 'US'
  },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '中文（简体）',
    country: 'CN'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    country: 'ES'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    country: 'FR'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    country: 'JP'
  }
  // Future languages to add:
  // {
  //   code: 'de',
  //   name: 'German', 
  //   nativeName: 'Deutsch',
  //   country: 'DE'
  // },
  // {
  //   code: 'ko',
  //   name: 'Korean',
  //   nativeName: '한국어',
  //   country: 'KR'
  // },
  // {
  //   code: 'ar',
  //   name: 'Arabic',
  //   nativeName: 'العربية',
  //   country: 'SA',
  //   rtl: true
  // },
  // {
  //   code: 'pt',
  //   name: 'Portuguese',
  //   nativeName: 'Português',
  //   country: 'BR'
  // },
  // {
  //   code: 'ru',
  //   name: 'Russian',
  //   nativeName: 'Русский',
  //   country: 'RU'
  // }
];

// Import all translation files
import en from './locales/en';
import zh from './locales/zh';
import es from './locales/es';
import fr from './locales/fr';
import ja from './locales/ja';

// Translation registry
// Add new translations here when creating new language files
export const translations: Languages = {
  en,
  zh,
  es,
  fr,
  ja
  // Future translations to add:
  // de,
  // ko,
  // ar,
  // pt,
  // ru
};

// Helper function to get language info by code
export function getLanguageInfo(code: string): LanguageInfo | undefined {
  return availableLanguages.find(lang => lang.code === code);
}

// Helper function to check if language is supported
export function isLanguageSupported(code: string): boolean {
  return code in translations;
}

// Helper function to get fallback language chain
export function getFallbackChain(code: string): string[] {
  // Primary language
  const primary = [code];
  
  // Language family fallback (e.g., 'zh-CN' -> 'zh')
  const langPrefix = code.split('-')[0];
  if (langPrefix !== code && isLanguageSupported(langPrefix)) {
    primary.push(langPrefix);
  }
  
  // English as universal fallback
  if (code !== 'en' && langPrefix !== 'en') {
    primary.push('en');
  }
  
  return primary.filter(lang => isLanguageSupported(lang));
} 