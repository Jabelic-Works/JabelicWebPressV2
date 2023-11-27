<script setup lang="ts">
import { useRootElementStore } from "~/store/rootElement";
import ArticleCard from "~/components/ArticleCard.vue";
const { data: articles } = await useAsyncData("en/articles", () =>
  queryContent("en/articles").limit(15).find()
);

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
    <h1>Start Small, Grow Big Program</h1>
    <div v-for="article in articles" :key="article._path" class="article">
      <div v-if="isShowLangSwitcher" class="lang-switch">
        <SelectLang />
      </div>
      <ArticleCard
        :contents="{
          title: article.title ?? '',
          description: article.description,
          tags: article.tags,
          to: `${article._path}`,
        }"
        :path="$route.path"
      />
    </div>
    <!-- <ContentDoc /> -->
  </main>
</template>

<style scoped>
.article {
  margin-left: 3%;
  margin-right: 3%;
  margin-top: 3%;
}
h1 {
  margin-left: 3%;
  margin-right: 3%;
}
</style>
