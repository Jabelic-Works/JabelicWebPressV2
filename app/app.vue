<script setup lang="ts">
import Header from "~/components/Header.vue";
import { APP_NAME } from "~~/shared/app/global";
import { useElementSize } from "@vueuse/core";
import { useRootElementStore } from "~~/store/rootElement";
const el = ref(null);
const { height: elHeight, width: elWidth } = useElementSize(el);
const store = useRootElementStore();
watch(elHeight, (arg) => {
  store.setHeight(arg);
});
watch(elWidth, (arg) => {
  store.setWidth(arg);
});
</script>
<template>
  <div ref="el">
    <Html lang="ja">
      <Head>
        <Title>{{ APP_NAME }}</Title>
        <Meta name="description" content="Jabelic Web Press" />
      </Head>
      <Header />
      <NuxtPage />
    </Html>
  </div>
</template>
