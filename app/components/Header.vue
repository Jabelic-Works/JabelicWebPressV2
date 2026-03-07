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
  root: "bg-[linear-gradient(var(--jwp-color-header)_90%,var(--jwp-color-header-glow))]",
  container: "mx-2 max-w-screen",
  right: "sm:flex-1",
  title:
    "text-sm sm:text-lg !text-white hover:!text-white hover:underline active:!text-white",
  toggle:
    "sm:hidden -me-1.5 !text-white hover:!text-white active:!text-white",
  content: "sm:hidden bg-[var(--jwp-color-header)] !text-white",
  overlay: "sm:hidden",
  header:
    "h-[60px] bg-transparent !text-white",
  body: "px-4 sm:px-6 py-4 bg-[linear-gradient(var(--jwp-color-header)_100%,var(--jwp-color-header))] !text-white",
} as const;

const desktopNavigationUi = {
  list: "gap-2",
  link:
    "!text-white hover:!text-white hover:underline active:!text-white data-[state=open]:!text-white aria-[current=page]:!text-white",
  linkLabel: "!text-white",
  linkLeadingIcon: "!text-white",
  linkTrailingIcon: "!text-white",
} as const;

const mobileNavigationUi = {
  link:
    "py-2 !text-white hover:!text-white hover:bg-[rgba(193,193,193,0.2)] active:bg-[rgba(193,193,193,0.5)] active:!text-white data-[state=open]:!text-white aria-[current=page]:!text-white",
  linkLabel: "!text-white",
  linkLeadingIcon: "!text-white",
  linkTrailingIcon: "!text-white",
} as const;


</script>

<template>
  <UHeader
    class="md:h-16 h-14"
    :to="getHeaderHomePath(currentLocale)"
    :ui="headerUi"
  >
    <template #title>
      <p>
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
