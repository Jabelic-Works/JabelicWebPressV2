<script setup lang="ts">
import { useRootElementStore } from "~~/store/rootElement";
import ArticleCard from "~/components/ArticleCard.vue";
const { articles } = await useArticlesByLocale("en", { limit: 15 });

useHead({
  title: "",
});
const route = useRoute();
const rootElementStore = useRootElementStore();
const isShowLangSwitcher = computed(
  () => !route.path.includes("article") && rootElementStore.getWidth <= 600
);
</script>

<template>
  <main>
    <h1>From little acorns, mighty oaks grow</h1>
    <div v-if="isShowLangSwitcher" class="lang-switch">
      <SelectLang />
    </div>
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
.lang-switch {
  text-align: end;
  margin-right: 3vw;
  margin-top: 3vw;
  margin-bottom: 3vw;
  display: none;
}
@media screen and (max-width: 600px) {
  .lang-switch {
    margin-right: 3%;
    margin-top: 3%;
    margin-bottom: 3%;
    display: block;
  }
}
</style>
