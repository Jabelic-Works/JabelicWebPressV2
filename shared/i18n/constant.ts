import type { Locales } from "./locale";

type Titles = {
  [key in Locales]: {
    title: "Jabelic Web Press";
    subTitle: string;
  };
};

export const titles: Titles = {
  en: {
    title: "Jabelic Web Press",
    subTitle: "Start Small, Grow Big Program",
  },
  ja: {
    title: "Jabelic Web Press",
    subTitle: "小さく書いて大きく育てる",
  },
};

export const switchLangLabels: {
  [key in Locales]: string;
} = {
  ja: "日本語",
  en: "English",
};
