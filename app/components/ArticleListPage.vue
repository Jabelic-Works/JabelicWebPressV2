<script setup lang="ts">
import ArticleCard from "./ArticleCard.vue";

interface ArticleListItem {
  path: string;
  title?: string;
  description?: string;
  tags: Array<{ name: string }>;
}

interface Props {
  title: string;
  articles: ArticleListItem[];
}

const props = defineProps<Props>();
const route = useRoute();
</script>

<template>
  <UContainer as="main" class="py-6 sm:py-8">
    <section class="space-y-4 sm:space-y-6">
      <h1 class="text-xl font-bold text-[var(--jwp-color-text)] md:text-2xl">
        {{ props.title }}
      </h1>

      <div class="grid gap-4 sm:gap-6">
        <ArticleCard
          v-for="article in props.articles"
          :key="article.path"
          :contents="{
            title: article.title ?? '',
            description: article.description,
            tags: article.tags,
            to: article.path,
          }"
          :path="route.path"
        />
      </div>
    </section>
  </UContainer>
</template>
