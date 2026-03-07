import {
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
  const { data } = await useAsyncData(getArticlesByLocaleKey(locale), async () => {
    const query = queryCollection("articles")
      .where("path", "LIKE", getArticlePathLike(locale))
      .order("publishedAt", "DESC");

    if (options.limit) {
      query.limit(options.limit);
    }

    return query.all();
  });

  const articles = computed(() =>
    (data.value ?? []).map((article) => ({
        ...article,
        tags: article.tags ?? [],
      }))
  );

  return {
    articles,
  };
};
