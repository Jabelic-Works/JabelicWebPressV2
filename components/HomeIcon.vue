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
  <div class="home-icon">
    <img
      v-if="!loading"
      src="/icon-72x72.png"
      type="image/png"
      width="1px"
      height="1px"
    />
  </div>
</template>

<style scoped>
  .home-icon {
    display: grid;
    place-items: center;
    width: v-bind(props.width); /* ※縦横を同値に */
    height: v-bind(props.height); /* ※縦横を同値に */
  }
  img {
    border-radius: 50%; /* 角丸半径を50%にする(=円形にする) */
    width: v-bind(props.width); /* ※縦横を同値に */
    height: v-bind(props.height); /* ※縦横を同値に */
  }
</style>
