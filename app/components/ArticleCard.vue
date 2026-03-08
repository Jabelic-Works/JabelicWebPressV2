<script setup lang="ts">
import Tag from "./Tag.vue";

interface Props {
  contents: ArticleCard;
  path: string;
}

interface ArticleCard {
  title?: string;
  description?: string;
  tags: Array<{ name: string }>;
  to: string;
}

const props = withDefaults(defineProps<Props>(), {
  contents: () => ({
    title: "default",
    description: "",
    tags: [],
    to: "/",
  }),
});

const cardUi = {
  root:
    "group overflow-hidden bg-[var(--jwp-color-surface)] text-[var(--jwp-color-text)] ring-[rgba(8,102,0,0)] transition-colors duration-100 hover:ring-[var(--jwp-color-border-strong)] active:ring-[var(--jwp-color-border-strong)]",
  body: "p-4 sm:p-5",
} as const;
</script>

<template>
  <NuxtLink :to="props.contents.to" class="block !mt-0 !text-inherit no-underline">
    <UCard variant="outline" :ui="cardUi">
      <div class="space-y-4">
        <div class="space-y-3">
          <h2
            class="m-0 !pt-0 text-left text-lg font-medium text-[var(--jwp-color-text)] transition-colors duration-100 group-hover:text-[var(--jwp-color-link)] group-active:text-[var(--jwp-color-link-active)] sm:text-xl"
          >
            {{ props.contents.title }}
          </h2>
          <p class="text-sm leading-6 text-[var(--jwp-color-text-muted)]">
            {{ props.contents.description }}
          </p>
        </div>

        <div v-if="props.contents.tags.length" class="flex flex-wrap gap-2 pt-1">
          <span v-for="tag in props.contents.tags" :key="tag.name">
          <Tag :tag="tag" />
        </span>
        </div>
      </div>
    </UCard>
  </NuxtLink>
</template>
