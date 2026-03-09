<script setup lang="ts">
  interface Props {
    width?: string;
    height?: string;
  }
  const props = withDefaults(defineProps<Props>(), {
    width: "3vw",
    height: "3vw",
  });
  const nuxtApp = useNuxtApp();
  const loading = ref(false);
  nuxtApp.hook("page:start", () => {
    loading.value = true;
  });
  nuxtApp.hook("page:finish", () => {
    loading.value = false;
  });
</script>

<template>
  <div
    class="grid place-items-center"
    :style="{ width: props.width, height: props.height }"
  >
    <img
      v-if="!loading"
      src="/icon-72x72.png"
      type="image/png"
      width="1px"
      height="1px"
      class="rounded-full"
      :style="{ width: props.width, height: props.height }"
    />
  </div>
</template>
