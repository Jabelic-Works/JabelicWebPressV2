<script setup lang="ts">
import { useRoute } from "#app";
import { queryContent } from "#imports";
useHead({
  title: "Jabelic Web Press",
});

const route = useRoute();
const { data: article } = await useAsyncData("article", () =>
  queryContent("/articles/your-article").findOne()
);

useHead({
  meta: [
    {
      property: "og:title",
      content: `${article.value?.title} | Jabelic Web Press`,
    },
    { property: "og:type", content: "article" },
    { property: "og:image", content: article.value?.image || "/image/ogp.jpg" },
    { name: "description", content: article.value?.description },
  ],
});
</script>

<template>
  <div class="container">
    <ContentDoc />
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 1%;
}
</style>
