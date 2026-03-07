import { locales, type Locales } from "./locale";

export const getLocaleFromPath = (path: string): Locales =>
  path === "/ja" || path.startsWith("/ja/") ? locales.ja : locales.en;

export const getHeaderHomePath = (locale: Locales) =>
  locale === locales.ja ? "/ja" : "/";

export const getHeaderProfilePath = (locale: Locales) =>
  locale === locales.ja ? "/ja/profile" : "/profile";

export const isHomePath = (path: string) =>
  path === "/" || path === "/en" || path === "/ja";

export const isProfilePath = (path: string) =>
  path === "/profile" || path === "/en/profile" || path === "/ja/profile";

export const switchLocalePath = (path: string, locale: Locales) => {
  const currentLocale = getLocaleFromPath(path);

  if (currentLocale === locale) {
    return path;
  }

  if (locale === locales.ja) {
    if (path === "/" || path === "/en") {
      return "/ja";
    }

    if (path.startsWith("/en/")) {
      return path.replace(/^\/en/, "/ja");
    }

    return `/ja${path}`;
  }

  if (path === "/ja") {
    return "/en";
  }

  if (path.startsWith("/ja/")) {
    return path.replace(/^\/ja/, "/en");
  }

  return path === "/" ? "/en" : `/en${path}`;
};
