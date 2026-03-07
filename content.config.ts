import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    articles: defineCollection({
      type: "page",
      source: "**/*.md",
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        tags: z
          .array(
            z.object({
              name: z.string(),
            })
          )
          .optional()
          .nullable(),
        sitemap: z
          .object({
            lastmod: z.string().optional(),
            changefreq: z.string().optional(),
            priority: z.union([z.string(), z.number()]).optional(),
          })
          .optional(),
      }),
    }),
  },
});
