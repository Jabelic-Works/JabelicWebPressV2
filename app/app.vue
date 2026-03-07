<script setup lang="ts">
import Header from "~/components/Header.vue";
import { APP_NAME } from "~~/shared/app/global";
import { getLocaleFromPath } from "~~/shared/i18n/routing";

const route = useRoute();
const htmlLang = computed(() => getLocaleFromPath(route.path));
</script>
<template>
  <Html :lang="htmlLang" class="dark">
    <Head>
      <Title>{{ APP_NAME }}</Title>
      <Meta name="description" content="Jabelic Web Press" />
    </Head>
    <Body>
      <UApp>
        <Header />
        <NuxtPage />
      </UApp>
    </Body>
  </Html>
</template>
