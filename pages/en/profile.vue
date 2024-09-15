<script lang="ts" setup>
import { type Locales, locales } from "~/shared/i18n/locale";
const route = useRoute();
const locale = computed<Locales>(() =>
  route.path.includes("ja") ? locales.ja : locales.en
);
const profiles = {
  belongings:
    locale.value === locales.ja
      ? "所属: CyberAgent, Inc."
      : "Belongings: CyberAgent, Inc.",
  graduate:
    locale.value === locales.ja
      ? "卒業: 東京都立産業技術大学院大学産業技術研究科産業技術専攻情報アーキテクチャコース, 明治大学総合数理学部現象数理学科"
      : "Graduates: Advanced Institute of Industrial Technology, Tokyo., Bachelor of Science, MEIJI UNIVERSITY, Tokyo.",
  bluesky: {
    title: "bluesky: @jabelic.bsky.social",
    link: "https://bsky.app/profile/jabelic.bsky.social",
  },
  twitter: {
    title: "Twitter: @Jabelic_",
    link: "https://twitter.com/jabelic_",
  },
  gitHub: {
    title: "GitHub: Jabelic",
    link: "https://github.com/jabelic",
  },
  scrapbox: {
    title: "Scrapbox: jabelic-public",
    link: "https://scrapbox.io/jabelic-public",
  },
};
const appConfig = useAppConfig();
const mainColor = ref(appConfig.theme.colors.main);

const trans = ref(true);
setTimeout(() => {
  trans.value = false;
}, 2500);
</script>
<template>
  <div class="transition" :class="{ 'anim-trans': trans }"></div>
  <div class="root">
    <h1>Profile</h1>
    <div class="contents">
      <div class="belongings profile-card">{{ profiles.belongings }}</div>
      <div class="graduate profile-card">{{ profiles.graduate }}</div>
      <NuxtLink
        class="bluesky profile-card"
        :to="profiles.bluesky.link"
        target="_blank"
        rel="noopener"
      >
        {{ profiles.bluesky.title }}</NuxtLink
      >
      <NuxtLink
        class="twitter profile-card"
        :to="profiles.twitter.link"
        target="_blank"
        rel="noopener"
      >
        {{ profiles.twitter.title }}</NuxtLink
      >
      <NuxtLink
        class="github profile-card"
        :to="profiles.gitHub.link"
        target="_blank"
        rel="noopener"
      >
        {{ profiles.gitHub.title }}</NuxtLink
      >
      <NuxtLink
        class="scrapbox profile-card"
        :to="profiles.scrapbox.link"
        target="_blank"
        rel="noopener"
      >
        {{ profiles.scrapbox.title }}</NuxtLink
      >
    </div>
  </div>
</template>
<style scoped>
.root {
  font-family: "SawarabiMincho";
}
h1 {
  padding-left: 3%;
  padding-top: 3%;
  font-size: 20px;
}

.profile-card {
  background-color: black;
  padding: 1%;
  margin: 1%;
  border-radius: 0.5rem;
  transition: 0.5s;
  color: white;
}
.profile-card:active {
  color: rgba(30, 255, 0, 0.9);
}
.profile-card:hover,
.profile-card:active {
  box-shadow: 1px 1px 1px 0px rgba(255, 255, 255, 0.5);
  border: solid 0.1rem v-bind(mainColor);
  border-radius: 0.5rem;
}
.profile-card:hover {
  color: yellow;
}
.profile-card:active {
  color: rgba(30, 255, 0, 0.9);
}
.contents {
  padding-top: 3%;
}
.contents div {
  padding: 3%;
}
.twitter,
.bluesky,
.github,
.scrapbox {
  display: block;
  padding: 3%;
}
</style>
