import type { ModuleOptions as NuxtUiModuleOptions } from "@nuxt/ui";

declare module "nuxt/schema" {
  interface NuxtConfig {
    ui?: NuxtUiModuleOptions;
  }

  interface NuxtOptions {
    ui?: NuxtUiModuleOptions;
  }
}

export {};
