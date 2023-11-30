<script setup lang="ts">
  import ArticleCard from "~/components/ArticleCard.vue";
  import { useRootElementStore } from "~/store/rootElement";
  const { data } = await useAsyncData("ja/articles", () =>
    queryContent("ja/articles").limit(15).find()
  );
  const articles = ref(data.value?.reverse());
  onMounted(() => {
    console.log(data, articles);
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
  .lang-switch {
    text-align: end;
    margin-right: 3vw;
    margin-top: 3vw;
    margin-bottom: 3vw;
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
