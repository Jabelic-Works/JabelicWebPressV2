<script setup lang="ts">
import ArticleListPage from "~/components/ArticleListPage.vue";
const { articles } = await useArticlesByLocale("en", { limit: 15 });

useHead({
  title: "",
});
</script>

<template>
  <ArticleListPage
    title="From little acorns, mighty oaks grow"
    :articles="articles"
  />
</template>
