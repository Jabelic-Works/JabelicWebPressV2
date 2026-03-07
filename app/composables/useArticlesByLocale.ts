import {
  getArticleLastModifiedTime,
  getArticlePathLike,
  getArticlesByLocaleKey,
  type ArticleLocale,
} from "~~/shared/content/articles";

interface UseArticlesByLocaleOptions {
  limit?: number;
}

export const useArticlesByLocale = async (
  locale: ArticleLocale,
  options: UseArticlesByLocaleOptions = {}
) => {
  const { data } = await useAsyncData(getArticlesByLocaleKey(locale), () =>
    queryCollection("articles").where("path", "LIKE", getArticlePathLike(locale)).all()
  );

  const articles = computed(() => {
    const sorted = [...(data.value ?? [])]
      .map((article) => ({
        ...article,
        tags: article.tags ?? [],
      }))
      .sort(
        (a, b) =>
          getArticleLastModifiedTime(b.sitemap?.lastmod) -
          getArticleLastModifiedTime(a.sitemap?.lastmod)
      );

    return options.limit ? sorted.slice(0, options.limit) : sorted;
  });

  return {
    articles,
  };
};
