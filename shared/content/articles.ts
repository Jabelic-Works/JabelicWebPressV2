export const articleLocales = ["ja", "en"] as const;

export type ArticleLocale = (typeof articleLocales)[number];

const articlePathPrefixes: Record<ArticleLocale, string> = {
  ja: "/ja/articles/",
  en: "/en/articles/",
};

export const getArticleByPathKey = (path: string) => `article:${path}`;

export const getArticlesByLocaleKey = (locale: ArticleLocale) =>
  `articles:${locale}`;

export const getArticlePathLike = (locale: ArticleLocale) =>
  `${articlePathPrefixes[locale]}%`;
