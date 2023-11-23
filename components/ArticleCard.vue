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
    tags: Array<{ title: string }> | null;
    to: string;
    // id: string | number;
  }

  // NOTE: importした型を直接genericsに当てられない https://github.com/vuejs/core/issues/4294
  const props = withDefaults(defineProps<Props>(), {
    contents: () => ({
      title: "default",
      description: "",
      tags: null,
      to: "/",
      // id: "",
    }),
  });
  const appConfig = useAppConfig();
  const mainDarkColor = ref(appConfig.theme.colors.main);
  const mainColor = ref(appConfig.theme.colors.main);
</script>

<template>
  <NuxtLink :to="props.contents.to">
    <section class="card">
      <div class="card-content">
        <h1 class="card-title">{{ props.contents.title }}</h1>
        <p class="card-text">{{ props.contents.description }}</p>
      </div>
      <div v-if="props.contents.tags" class="card-tags">
        <span v-for="tag in props.contents.tags" class="card-tag">
          <Tag :tag="tag" />
        </span>
      </div>
    </section>
  </NuxtLink>
</template>

<style scoped>
  .card {
    background: black;
    border: 0.1rem solid;
    border-color: rgba(8, 102, 0, 0);
    border-radius: 5px;
    border-radius: 0.5rem;
    transition: 0.5s;
  }
  .card:hover,
  .card:active {
    border: solid 0.1rem v-bind(mainColor);
    border-color: v-bind(mainDarkColor);
    color: yellow;
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
    color: white;
  }
  .card-title:hover {
    color: yellow;
  }
  .card-title:active {
    color: rgba(30, 255, 0, 0.9);
  }
  .card-text {
    color: #777;
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
    color: #0bd;
    color: rgba(30, 255, 0, 0.9);
    margin: 0 10px;
    transition: 0.5s;
  }
  .card-link a:hover {
    color: #0090aa;
    color: rgba(30, 255, 0, 0.9);
  }
  @media screen and (max-width: 600px) {
    .card-title {
      font-size: 14px;
      margin-top: 10px;
      margin-bottom: 20px;
      text-align: start;
      color: white;
    }
    .card-title:active {
      color: rgba(30, 255, 0, 0.9);
    }
  }
</style>
