<script setup lang="ts">
import ArticleListPage from "~/components/ArticleListPage.vue";
const { articles } = await useArticlesByLocale("ja");
</script>

<template>
  <ArticleListPage title="小さく書いて大きく育てる" :articles="articles" />
</template>
