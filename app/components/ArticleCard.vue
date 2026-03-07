<script setup lang="ts">
  //   import { Locales, locales } from "~~/src/shared/i18n/locale";
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
    // id: string | number;
  }

  // NOTE: importした型を直接genericsに当てられない https://github.com/vuejs/core/issues/4294
  const props = withDefaults(defineProps<Props>(), {
    contents: () => ({
      title: "default",
      description: "",
      tags: [],
      to: "/",
      // id: "",
    }),
  });
</script>

<template>
  <NuxtLink :to="props.contents.to">
    <section class="card">
      <div class="card-content">
        <h1 class="card-title">{{ props.contents.title }}</h1>
        <p class="card-text">{{ props.contents.description }}</p>
      </div>
      <div v-if="props.contents.tags.length" class="card-tags">
        <span v-for="tag in props.contents.tags" class="card-tag">
          <Tag :tag="tag" />
        </span>
      </div>
    </section>
  </NuxtLink>
</template>

<style scoped>
  h1 {
    border-bottom: none !important;
  }
  h2 > a {
    border-bottom: none !important;
  }
  .card {
    background: var(--jwp-color-surface);
    border: 0.1rem solid;
    border-color: rgba(8, 102, 0, 0);
    border-radius: 5px;
    border-radius: 0.5rem;
    transition: 0.5s;
  }
  .card:hover,
  .card:active {
    border: solid 0.1rem var(--jwp-color-border-strong);
    border-color: var(--jwp-color-border-strong);
    color: var(--jwp-color-link);
  }
  .card-content {
    padding: 2%;
  }
  .card-title {
    font-size: 20px;
    margin: 0;
    padding-top: 1rem;
    margin-bottom: 20px;
    text-align: start;
    color: var(--jwp-color-text);
  }
  .card-title:hover {
    color: var(--jwp-color-link);
  }
  .card-title:active {
    color: var(--jwp-color-link-active);
  }
  .card-text {
    color: var(--jwp-color-text-muted);
    font-size: 14px;
    line-height: 1.5;
  }
  .card-tags {
    padding-left: 1rem;
  }
  .card-tag {
    margin-left: 0.3rem;
    margin-right: 0.3rem;
  }
  .card-link {
    text-align: center;
    border-top: 1px solid #eee;
    padding: 20px;
  }
  .card-link a {
    text-decoration: none;
    color: var(--jwp-color-link-active);
    margin: 0 10px;
    transition: 0.5s;
  }
  .card-link a:hover {
    color: var(--jwp-color-link);
  }
  @media screen and (max-width: 600px) {
    .card-title {
      font-size: 14px;
      margin-top: 10px;
      margin-bottom: 20px;
      text-align: start;
      color: var(--jwp-color-text);
    }
    .card-title:active {
      color: var(--jwp-color-link-active);
    }
  }
</style>
