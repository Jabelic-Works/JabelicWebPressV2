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
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 1%;
  max-width: 100%;
  box-sizing: border-box;
}

/* タブレット以下のサイズ */
@media screen and (max-width: 800px) {
  .container {
    padding-left: 3%;
    padding-right: 3%;
  }
}

/* モバイルサイズ */
@media screen and (max-width: 600px) {
  .container {
    padding-left: 2%;
    padding-right: 2%;
    padding-top: 2%;
  }
}

/* 小さなモバイルサイズ */
@media screen and (max-width: 480px) {
  .container {
    padding-left: 1%;
    padding-right: 1%;
  }
}
</style>
