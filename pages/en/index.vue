<script setup lang="ts">
  import { useRootElementStore } from "~/store/rootElement";
  import ArticleCard from "~/components/ArticleCard.vue";
  const { data } = await useAsyncData("en/articles", () =>
    queryContent("en/articles").limit(15).find()
  );

  const articles = ref<any[] | undefined>(data.value?.reverse());
  onBeforeMount(() => {
    articles.value = data.value?.reverse();
  });
  onBeforeUpdate(() => {
    articles.value = data.value?.reverse();
  });

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
    <div v-if="isShowLangSwitcher" class="lang-switch">
      <SelectLang />
    </div>
    <div v-for="article in articles" :key="article._path" class="article">
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
