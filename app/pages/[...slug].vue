<script setup lang="ts">
import { useRoute } from "#app";
import { getArticleByPathKey } from "~~/shared/content/articles";

const route = useRoute();
const articlePath = computed(() => route.path);
const articleKey = computed(() => getArticleByPathKey(articlePath.value));
const { data: article } = await useAsyncData(
  articleKey,
  () => queryCollection("articles").path(articlePath.value).first(),
  {
    watch: [articlePath],
  }
);

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Article not found",
  });
}

useSeoMeta({
  title: () => `${article.value?.title} | Jabelic Web Press`,
  description: () => article.value?.description ?? "Jabelic Web Press",
  ogTitle: () => `${article.value?.title} | Jabelic Web Press`,
  ogType: "article",
  ogImage: () => article.value?.image || "/image/ogp.jpg",
  ogDescription: () => article.value?.description ?? "Jabelic Web Press",
});
</script>

<template>
  <div class="container">
    <ContentRenderer v-if="article" :value="article" />
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 1%;
  max-width: 100%;
  box-sizing: border-box;
}

/* タブレット以下のサイズ */
@media screen and (max-width: 800px) {
  .container {
    padding-left: 3%;
    padding-right: 3%;
  }
}

/* モバイルサイズ */
@media screen and (max-width: 600px) {
  .container {
    padding-left: 2%;
    padding-right: 2%;
    padding-top: 2%;
  }
}

/* 小さなモバイルサイズ */
@media screen and (max-width: 480px) {
  .container {
    padding-left: 1%;
    padding-right: 1%;
  }
}
</style>
