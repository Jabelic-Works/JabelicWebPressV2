<script setup lang="ts">
  import { locales, type Locales } from "~/shared/i18n/locale";
  import { switchLangLabels } from "~/shared/i18n/constant";

  /** i18n */
  const router = useRouter();
  const route = useRoute();
  const locale = ref<Locales>(
    route.path.includes("/ja") ? locales.ja : locales.en
  );

  watch(locale, async (arg) => {
    switch (arg) {
      /** To English */
      case locales.en:
        if (route.path.includes("ja")) {
          await router.push(route.path.replace("ja", "en"));
        } else {
          await router.push("en" + route.path);
        }
        break;
      /** To Japanese */
      case locales.ja:
        if (route.path.includes("en")) {
          await router.push(route.path.replace("en", "ja"));
        } else {
          await router.push("ja" + route.path);
        }
        break;
      default:
        const _n: never = arg;
        console.error(`${_n} is not a valid`);
        break;
    }
  });
</script>
<template>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
  />
  <form class="switch-form" style="margin-top: auto">
    <label class="material-symbols-outlined" style="vertical-align: -0.4rem">
      language
    </label>
    <select
      id="locale-select"
      v-model.lazy="locale"
      style="margin-left: 0.5rem"
    >
      <option value="en">{{ switchLangLabels.en }}</option>
      <option value="ja">{{ switchLangLabels.ja }}</option>
    </select>
  </form>
</template>
