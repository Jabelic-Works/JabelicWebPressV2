<script setup lang="ts">
import { useRoute } from "#app";
import { getArticleByPathKey } from "~~/shared/content/articles";

const route = useRoute();
const articlePath = computed(() => route.path);
const articleKey = computed(() => getArticleByPathKey(articlePath.value));
const { data: article } = await useAsyncData(
  articleKey,
  () => queryCollection("articles").path(articlePath.value).first(),
  {
    watch: [articlePath],
  }
);

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Article not found",
  });
}

useSeoMeta({
  title: () => `${article.value?.title} | Jabelic Web Press`,
  description: () => article.value?.description ?? "Jabelic Web Press",
  ogTitle: () => `${article.value?.title} | Jabelic Web Press`,
  ogType: "article",
  ogImage: () => article.value?.image || "/image/ogp.jpg",
  ogDescription: () => article.value?.description ?? "Jabelic Web Press",
});
</script>

<template>
  <main
    class="min-h-[calc(100svh-var(--ui-header-height))] bg-[var(--jwp-color-background)] py-2 sm:py-4 lg:py-6"
  >
    <UContainer>
      <ContentRenderer
        v-if="article"
        :value="article"
        tag="article"
        class="mx-auto w-full max-w-4xl"
      />
    </UContainer>
  </main>
</template>
