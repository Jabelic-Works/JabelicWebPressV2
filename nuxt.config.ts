// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxt/content", "@vueuse/nuxt"],
  css: ["~/assets/style/index.css"],
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
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/icon-16x16.png" }, // これを追記する
      ],
    },
  },
});
