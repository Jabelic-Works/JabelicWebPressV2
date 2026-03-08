<script setup lang="ts">
interface Props {
  tag: {
    name: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  tag: () => ({
    name: "tag",
  }),
});
</script>

<template>
  <UBadge
    color="neutral"
    variant="outline"
    size="sm"
    class="bg-transparent !text-[var(--jwp-color-text)] !ring-[var(--jwp-color-border-strong)] font-[SawarabiMincho]"
  >
    {{ props.tag.name }}
  </UBadge>
</template>
