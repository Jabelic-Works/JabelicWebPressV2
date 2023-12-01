<script setup lang="ts">
  import ArticleCard from "~/components/ArticleCard.vue";
  import { useRootElementStore } from "~/store/rootElement";
  const { data } = await useAsyncData("ja/articles", () =>
    queryContent("ja/articles").limit(15).find()
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
    <h1>小さく書いて大きく育てる</h1>
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
