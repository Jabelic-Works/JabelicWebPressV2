<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";
import { locales, type Locales } from "~~/shared/i18n/locale";
import { switchLangLabels } from "~~/shared/i18n/constant";
import { getLocaleFromPath, switchLocalePath } from "~~/shared/i18n/routing";

const router = useRouter();
const route = useRoute();

const currentLocale = computed<Locales>(() => getLocaleFromPath(route.path));

const localeItems: SelectItem[] = [
  {
    label: switchLangLabels.en,
    value: locales.en,
  },
  {
    label: switchLangLabels.ja,
    value: locales.ja,
  },
];

const selectUi = {
  base: "bg-[rgba(193,193,193,0.12)] text-[var(--jwp-color-text)] ring-1 ring-[var(--jwp-color-border-strong)]",
  value: "text-[var(--jwp-color-text)]",
  placeholder: "text-[var(--jwp-color-text-muted)]",
  trailingIcon: "text-[var(--jwp-color-text)]",
  content:
    "bg-[var(--jwp-color-header)] text-[var(--jwp-color-text)] ring-1 ring-[var(--jwp-color-border-strong)]",
  item: "text-[var(--jwp-color-text)]",
  itemLabel: "text-inherit",
  itemTrailing: "text-[var(--jwp-color-link-active)]",
} as const;

const isLocale = (value: unknown): value is Locales =>
  value === locales.en || value === locales.ja;

const handleLocaleChange = async (value: unknown) => {
  if (!isLocale(value) || value === currentLocale.value) {
    return;
  }

  await router.push(switchLocalePath(route.path, value));
};
</script>
<template>
  <USelect
    :model-value="currentLocale"
    :items="localeItems"
    value-key="value"
    icon="i-lucide-languages"
    color="neutral"
    variant="subtle"
    size="sm"
    class="w-full"
    :ui="selectUi"
    @update:model-value="handleLocaleChange"
  />
</template>
