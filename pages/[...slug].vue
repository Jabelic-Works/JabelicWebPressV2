<script setup lang="ts">
import { useRoute } from "#app";
import { queryContent } from "#imports";
useHead({
  title: "Jabelic Web Press",
});

const route = useRoute();
const content = await queryContent(route.fullPath).findOne();

useHead({
  meta: [
    { property: "og:title", content: `${content.title} | Jabelic Web Press` },
    { property: "og:type", content: "article" },
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
