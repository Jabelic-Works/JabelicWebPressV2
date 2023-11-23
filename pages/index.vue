<script setup lang="ts">
  import ArticleCard from "~/components/ArticleCard.vue";
  const { data: articles } = await useAsyncData("articles", () =>
    queryContent("articles").limit(15).find()
  );

  useHead({
    title: "",
  });
  const router = useRouter();
  router.replace("/en");
</script>

<template>
  <main>
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
</style>
