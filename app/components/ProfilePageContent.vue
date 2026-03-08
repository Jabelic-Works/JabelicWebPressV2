<script setup lang="ts">
import { getLocaleFromPath } from "~~/shared/i18n/routing";
import { profileCopy, profileLinks } from "~~/shared/profile/content";

const route = useRoute();
const locale = computed(() => getLocaleFromPath(route.path));
const copy = computed(() => profileCopy[locale.value]);

const cardUi = {
  root:
    "group overflow-hidden bg-[var(--jwp-color-surface)] text-[var(--jwp-color-text)] ring-[rgba(8,102,0,0)] transition-colors duration-100 hover:ring-[var(--jwp-color-border-strong)] active:ring-[var(--jwp-color-border-strong)]",
  body: "p-4 sm:p-5",
} as const;

const trans = ref(true);
setTimeout(() => {
  trans.value = false;
}, 2500);
</script>

<template>
  <main class="min-h-[calc(100svh-var(--ui-header-height))] bg-[var(--jwp-color-background)]">
    <div class="transition" :class="{ 'anim-trans': trans }"></div>

    <UContainer class="py-6 sm:py-8">
      <section class="space-y-4 sm:space-y-6">
        <h1 class="text-xl font-bold text-[var(--jwp-color-text)] md:text-2xl">
          {{ copy.heading }}
        </h1>

        <div class="grid gap-4 sm:gap-6">
          <UCard variant="outline" :ui="cardUi">
            <p class="text-sm leading-6 text-[var(--jwp-color-text)] sm:text-base">
              {{ copy.belongings }}
            </p>
          </UCard>

          <UCard variant="outline" :ui="cardUi">
            <p class="text-sm leading-6 text-[var(--jwp-color-text)] sm:text-base">
              {{ copy.graduate }}
            </p>
          </UCard>

          <NuxtLink
            v-for="link in profileLinks"
            :key="link.to"
            :to="link.to"
            target="_blank"
            rel="noopener"
            class="block !mt-0 !text-inherit no-underline"
          >
            <UCard variant="outline" :ui="cardUi">
              <div class="flex items-center justify-between gap-3">
                <p
                  class="text-sm leading-6 text-[var(--jwp-color-text)] transition-colors duration-100 group-hover:text-[var(--jwp-color-link)] group-active:text-[var(--jwp-color-link-active)] sm:text-base"
                >
                  {{ link.label }}
                </p>
                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="shrink-0 text-[var(--jwp-color-link-active)]"
                />
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </section>
    </UContainer>
  </main>
</template>
