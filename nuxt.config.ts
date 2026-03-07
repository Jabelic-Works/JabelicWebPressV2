// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    // oxc-parser のネイティブバインディング問題を回避
    // compileTemplate: false,
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3132",
    },
  },
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@nuxt/content",
    "@vueuse/nuxt",
    "@nuxtjs/sitemap",
    "@nuxt/ui",
  ],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: "vitesse-dark",
          langs: ["typescript", "javascript", "vue", "json", "markdown"],
        },
      },
    },
    experimental: {
      sqliteConnector: "native",
    },
  },
  sitemap: {
    enabled: true,
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3132",
  },
  css: ["~/assets/style/index.css"],
  ui: {
    // フォントは既存のローカル font-face と CSS トークンで管理する
    fonts: false,
    // 現状は既存サイトのダーク基調を維持し、色モード切り替えは後続で扱う
    colorMode: false,
  },
  app: {
    head: {
      title: "Jabelic Web Press",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "google-site-verification",
          content: "PqjcnHGVY0iCG5PQuhptEM7RD1m2BAa1aELatIIPceQ",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Jabelic Web Press" },
        { property: "og:image", content: "image/ogp.jpg" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/icon-16x16.png" }, // これを追記する
      ],
      htmlAttrs: {
        lang: "ja",
        prefix: "og: https://ogp.me/ns#",
      },
    },
  },
});
