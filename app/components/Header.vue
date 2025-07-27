<script setup lang="ts">
import { titles } from "~~/shared/i18n/constant";
import SelectLang from "./SelectLang.vue";
import { useRootElementStore } from "~~/store/rootElement";
const router = useRouter();

const rootElementStore = useRootElementStore();
/** 右上メニュー */
type Contents = Array<{
  title: string;
  link: string;
  target: "_blank" | null;
}>;
const contents = computed<Contents>(() =>
  rootElementStore.getWidth < 600
    ? [
        {
          title: "Home",
          link: route.path.includes("ja") ? "/ja" : "/",
          target: null,
        },
        {
          title: "Profile",
          link: route.path.includes("ja") ? "/ja/profile" : "/profile",
          target: null,
        },
      ]
    : [
        {
          title: "Home",
          link: route.path.includes("ja") ? "/ja" : "/",
          target: null,
        },
        {
          title: "Profile",
          link: route.path.includes("ja") ? "/ja/profile" : "/profile",
          target: null,
        },
        {
          title: "GitHub",
          link: "https://github.com/jabelic",
          target: "_blank",
        },
      ]
);

/** カラー */
const appConfig = useAppConfig();
const mainDarkColor = ref(appConfig.theme.colors.main);

/** i18n */
const route = useRoute();
const isShowLangSwitcher = computed(
  () => !route.path.includes("article") && rootElementStore.getWidth > 600
);

const mobileHeaderHeight = ref("3rem");

/** 戻るボタン */
const backTo = () => router.push(route.path.includes("ja") ? "/ja" : "/");
</script>

<template>
  <div class="header-root">
    <span class="left">
      <NuxtLink class="header-title" @click="backTo">
        {{ titles.ja.title }}
      </NuxtLink>
      <SelectLang v-if="isShowLangSwitcher" class="lang-switch" />
    </span>
    <div class="right">
      <NuxtLink
        v-for="content in contents"
        class="header-content set-item-center"
        :to="content.link"
        :target="content.target"
        rel="noopener"
      >
        <span class="">{{ content.title }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.header-root {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 60px;
  background-color: v-bind(mainDarkColor);
  background: linear-gradient(#245941 90%, #7fda2488);
}
.left {
  display: flex;
  align-items: center;
}
.header-title {
  font-size: 18px;
  color: aliceblue;
  margin-right: 1rem;
  transition: color 0.3s;
}
.header-title:hover {
  text-decoration: underline;
}
.header-title:active {
  color: rgba(30, 255, 0, 0.9);
}
.lang-switch {
  margin-left: 1rem;
  margin-top: auto;
}
.right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.header-content {
  font-size: 14px;
  color: aliceblue;
  transition: color 0.3s;
}
.header-content:hover {
  text-decoration: underline;
}
.header-content:active {
  color: rgba(30, 255, 0, 0.9);
}

.set-item-center {
  /** アイテムを中央にそろえる */
  /* display: grid; */
  display: flex;
  /* place-items: center; */
}
@media screen and (max-width: 900px) {
  .left {
    /* grid-column-start: 0;
      grid-column-end: 6;
      grid-template-columns: repeat(10, 1fr); */
  }
  .header-title {
    font-size: 16px;
    /* grid-column-start: 1;
      grid-column-end: 4; */
  }
  .lang-switch {
    font-size: 16px;
    /* grid-column-start: 4;
      grid-column-end: 7; */
  }
  .right {
    /* grid-column-start: 8;
      grid-column-end: 11;
      grid-template-columns: repeat(3, 1fr); */
  }
}
@media screen and (max-width: 800px) {
  .left {
    /* grid-column-start: 0;
      grid-column-end: 7;
      grid-template-columns: repeat(10, 1fr); */
  }
  .header-title {
    font-size: 16px;
    /* grid-column-start: 0;
      grid-column-end: 5; */
  }
  .lang-switch {
    font-size: 16px;
    /* grid-column-start: 5;
      grid-column-end: 9; */
  }
  .right {
    /* grid-column-start: 7;
      grid-column-end: 11;
      grid-template-columns: repeat(3, 1fr); */
  }
}
@media screen and (max-width: 700px) {
  .header-root {
    /* grid-template-columns: repeat(10, 1fr);
      grid-template-rows: v-bind(mobileHeaderHeight) 1fr; */
    height: v-bind(mobileHeaderHeight);
  }
  .left {
    height: v-bind(mobileHeaderHeight);
    /* grid-template-rows: v-bind(mobileHeaderHeight) 1fr;
      grid-column-start: 0;
      grid-column-end: 8;
      grid-template-columns: repeat(10, 1fr); */
  }
  .header-title {
    font-size: 14px;
    /* grid-column-start: 0;
      grid-column-end: 5; */
  }
  .lang-switch {
    font-size: 14px;
    /* grid-column-start: 5;
      grid-column-end: 9; */
  }
  .right {
    height: v-bind(mobileHeaderHeight);
    /* grid-template-rows: v-bind(mobileHeaderHeight) 1fr;
      grid-column-start: 8;
      grid-column-end: 11;
      grid-template-columns: repeat(3, 1fr); */
  }
}
@media screen and (max-width: 600px) {
  .header-root {
    /* display: grid; */
    /* grid-template-columns: repeat(12, 1fr);
      grid-template-rows: v-bind(mobileHeaderHeight) 1fr; */
    height: v-bind(mobileHeaderHeight);
    background-color: v-bind(mainDarkColor);
    background: linear-gradient(#245941 100%, #245941) !important;
  }
  .left {
    height: v-bind(mobileHeaderHeight);
    /* grid-column-start: 0;
      grid-column-end: 8;
      grid-template-columns: repeat(10, 1fr);
      grid-template-rows: v-bind(mobileHeaderHeight) 1fr; */
  }
  .header-title {
    font-size: 14px;
    min-width: 30vw;
    /* grid-column-start: 0;
      grid-column-end: 5; */
  }
  .lang-switch {
    font-size: 10px;
    min-width: 30vw;
    /* grid-column-start: 5;
      grid-column-end: 9; */
  }
  .right {
    height: v-bind(mobileHeaderHeight);
    /* grid-column-start: 8;
      grid-column-end: 13; */
    /* grid-template-columns: repeat(2, 1fr);
      grid-template-rows: v-bind(mobileHeaderHeight) 1fr; */
  }
  .header-content {
    font-size: 10px;
    height: v-bind(mobileHeaderHeight);
    /* grid-template-rows: v-bind(mobileHeaderHeight) 1fr; */
    text-decoration: none;
    color: aliceblue;
    transition: 0.5s;
    align-items: center;
  }
  .header-content:hover {
    background-color: rgba(193, 193, 193, 0.2);
  }
  .header-content:active {
    background-color: rgba(193, 193, 193, 0.5);
  }
}
@media screen and (max-width: 480px) {
  .header-root {
    padding: 0 1rem;
  }
  .header-title {
    font-size: 12px;
  }
}
</style>
