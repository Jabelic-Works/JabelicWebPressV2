<script setup lang="ts">
  import ArticleCard from "~/components/ArticleCard.vue";
  import { useRootElementStore } from "~/store/rootElement";
  const { data } = await useAsyncData("articles", () =>
    queryContent("articles").limit(15).find()
  );
  const articles = ref(data.value?.reverse());
  onMounted(() => {
    console.log(data, articles);
  });

  useHead({
    title: "",
  });
  const router = useRouter();
  router.replace("/en");
  const route = useRoute();
  const rootElementStore = useRootElementStore();
  const isShowLangSwitcher = computed(
    () => !route.path.includes("article") && rootElementStore.getWidth <= 600
  );
</script>

<template>
  <main>
    <div v-if="isShowLangSwitcher" class="lang-switch">
      <SelectLang />
    </div>
    <div
      v-if="articles"
      v-for="article in articles"
      :key="article._path"
      class="article"
    >
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
</style>
