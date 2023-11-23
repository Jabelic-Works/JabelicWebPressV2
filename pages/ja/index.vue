<script setup lang="ts">
  import ArticleCard from "~/components/ArticleCard.vue";
  const { data: articles } = await useAsyncData("ja/articles", () =>
    queryContent("ja/articles").limit(15).find()
  );

  useHead({
    title: "",
  });
  console.log(articles);
</script>

<template>
  <main>
    <h1>小さく書いて大きく育てる</h1>
    <div v-for="article in articles" :key="article._path" class="article">
      <!-- <nuxt-link :to="article._path"
        >{{ article.title }} {{ article.description }}</nuxt-link
      > -->
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
