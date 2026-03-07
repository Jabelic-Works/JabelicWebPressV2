<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { titles } from "~~/shared/i18n/constant";
import {
  getHeaderHomePath,
  getHeaderProfilePath,
  getLocaleFromPath,
  isHomePath,
  isProfilePath,
} from "~~/shared/i18n/routing";
import SelectLang from "./SelectLang.vue";
const route = useRoute();

const currentLocale = computed(() => getLocaleFromPath(route.path));

const navigationItems = computed<NavigationMenuItem[]>(() => [
  {
    label: "Home",
    to: getHeaderHomePath(currentLocale.value),
    active: isHomePath(route.path),
  },
  {
    label: "Profile",
    to: getHeaderProfilePath(currentLocale.value),
    active: isProfilePath(route.path),
  },
  {
    label: "GitHub",
    to: "https://github.com/jabelic",
    target: "_blank",
  },
]);

const headerUi = {
  root: "border-b-0 bg-[linear-gradient(var(--jwp-color-header)_90%,var(--jwp-color-header-glow))] backdrop-blur-none",
  container: "h-[60px] px-4 sm:px-8 gap-3",
  left: "min-w-0 flex items-center",
  center: "hidden sm:flex",
  right: "flex items-center justify-end sm:flex-1",
  title:
    "shrink-0 font-bold text-sm sm:text-lg text-[var(--jwp-color-text)] hover:underline active:text-[var(--jwp-color-link-active)]",
  toggle:
    "sm:hidden -me-1.5 text-[var(--jwp-color-text)] hover:text-[var(--jwp-color-link-hover)] active:text-[var(--jwp-color-link-active)]",
  content: "sm:hidden bg-[var(--jwp-color-header)] text-[var(--jwp-color-text)]",
  overlay: "sm:hidden",
  header:
    "px-4 sm:px-6 h-[60px] flex items-center justify-between gap-3 bg-transparent text-[var(--jwp-color-text)]",
  body: "px-4 sm:px-6 py-4 bg-[linear-gradient(var(--jwp-color-header)_100%,var(--jwp-color-header))] text-[var(--jwp-color-text)]",
} as const;

const desktopNavigationUi = {
  list: "flex items-center gap-2",
  item: "py-2",
  link:
    "group relative flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium text-[var(--jwp-color-text)]",
  linkLabel: "text-inherit",
  linkLeadingIcon: "text-inherit",
  linkTrailingIcon: "text-inherit",
} as const;

const mobileNavigationUi = {
  link:
    "group relative flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium",
  linkLabel: "text-inherit",
  linkLeadingIcon: "text-inherit",
  linkTrailingIcon: "text-inherit",
} as const;


</script>

<template>
  <UHeader
    class="header-root md:h-16 h-14"
    :to="getHeaderHomePath(currentLocale)"
    :ui="headerUi"
  >
    <template #title>
      <p class="text-xl font-bold text-[var(--jwp-color-text)]">
        {{ titles[currentLocale].title }}
      </p>
    </template>

    <template #right>
      <div class="hidden sm:flex items-center gap-3">
        <UNavigationMenu
          :items="navigationItems"
          color="neutral"
          variant="link"
          :ui="desktopNavigationUi"
        />
        <SelectLang class="w-32 mt-auto mb-1" />
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <UNavigationMenu
          :items="navigationItems"
          orientation="vertical"
          color="neutral"
          variant="link"
          :ui="mobileNavigationUi"
          class="data-[orientation=vertical]:w-full"
        />
        <SelectLang class="w-full" />
      </div>
    </template>
  </UHeader>
</template>

<style scoped>
</style>
