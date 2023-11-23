export const locales = {
  en: 'en',
  ja: 'ja',
  default: 'en'
} as const
export type Locales = (typeof locales)[keyof typeof locales]
