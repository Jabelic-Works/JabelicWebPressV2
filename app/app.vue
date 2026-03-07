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
  <Html lang="ja" class="dark">
    <Head>
      <Title>{{ APP_NAME }}</Title>
      <Meta name="description" content="Jabelic Web Press" />
    </Head>
    <Body>
      <UApp>
        <div ref="el">
          <Header />
          <NuxtPage />
        </div>
      </UApp>
    </Body>
  </Html>
</template>
