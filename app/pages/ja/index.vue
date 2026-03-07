<script setup lang="ts">
import ArticleCard from "~/components/ArticleCard.vue";
const { articles } = await useArticlesByLocale("ja");

useHead({
  title: "",
});
</script>

<template>
  <main>
    <h1 class="text-xl font-bold md:text-2xl">小さく書いて大きく育てる</h1>
    <div v-for="article in articles" :key="article.path" class="article">
      <ArticleCard
        :contents="{
          title: article.title ?? '',
          description: article.description,
          tags: article.tags,
          to: article.path,
        }"
        :path="$route.path"
      />
    </div>
  </main>
</template>

<style scoped>
h1 {
  border-bottom: none !important;
  font-size: 24px;
}
h2 > a {
  border-bottom: none !important;
}
.article {
  margin-left: 3%;
  margin-right: 3%;
  margin-top: 3%;
}
h1 {
  margin-left: 3%;
  margin-right: 3%;
}

@media screen and (max-width: 800px) {
  h1 {
    font-size: 24px;
    padding-top: 3%;
  }
}
@media screen and (max-width: 600px) {
  h1 {
    font-size: 20px;
    padding-top: 3%;
  }
  h3 {
    font-size: 14px;
    padding-top: 3%;
  }
}
</style>
