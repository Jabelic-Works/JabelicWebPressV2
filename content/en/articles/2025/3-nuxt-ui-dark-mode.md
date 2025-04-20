---
sitemap:
  loc: /en/articles/2025/nuxt-ui-dark-mode
  lastmod: 2025-05-15
  changefreq: monthly
  priority: 0.8
title: Dark Mode Implementation in Nuxt UI
description: Details and configuration methods for dark mode implementation in the Nuxt UI framework
tags: [{ name: "blog" }, { name: 'nuxt' }, { name: 'tailwind' }]
---

# Dark Mode Implementation in Nuxt UI

This article explains the mechanism and proper configuration of dark mode implementation in Nuxt UI.

## Tailwind CSS dark Prefix

In Tailwind CSS, the `dark:` prefix is used to specify dark mode compatible styles. It is marked up as follows:

```html
<div class="bg-white dark:bg-gray-800 text-black dark:text-white">
  Dark mode compatible text
</div>
```

This code will have white background with black text in light mode, and dark gray background with white text in dark mode.

In Tailwind CSS standard configuration, the `dark:` prefix is only effective when the `dark` class is applied to the `html` or `body` element. Specifically, markup like `<html class="dark">` is required.

## Dark Mode Support in Nuxt UI

Nuxt UI is a component library in the Nuxt ecosystem, and all components support dark mode by default. These components internally utilize the `dark:` prefix of Tailwind CSS.

```vue
<template>
  <UButton color="primary">Button</UButton>
  <UCard>
    <template #header>Header</template>
    Card content
  </UCard>
</template>
```

The above components will automatically switch styles according to the application's dark mode state, provided the appropriate configuration is in place.

## Configuration in nuxt.config

Proper configuration in `nuxt.config.ts` is necessary for dark mode to function correctly.

```typescript
export default defineNuxtConfig({
  // ...
  colorMode: {
    preference: "light",  // Default mode
    fallback: "light",    // Fallback for SSR
    classSuffix: "",      // Class suffix
    storage: "localStorage" // Storage location
  },
  ui: {
    colorMode: true    // Enable color mode support
  }
  // ...
})
```

### ui.colorMode Setting

The `ui.colorMode` accepts a boolean value:

- `true`: Nuxt UI components will respond to color mode (default)
- `false`: Nuxt UI components will not respond to color mode

Nuxt UI works in conjunction with the Nuxt ColorMode module and determines how to detect dark mode based on the ColorMode module settings.

### classSuffix Parameter

The `colorMode.classSuffix` parameter is particularly important. This parameter determines the suffix of the class name applied to the `html` element in dark mode.

- `classSuffix: ''` → `<html class="dark">`
- `classSuffix: '-mode'` → `<html class="dark-mode">`

Since Tailwind CSS's `dark:` prefix looks for the `dark` class by default, `classSuffix` needs to be set to an empty string (`''`). If another value (e.g., `'-mode'`) is set, the `dark-mode` class will be applied in dark mode, but Tailwind's `dark:` prefix will not function.

#### Details of classSuffix Parameter

There are mainly two ways to use this parameter:

1. **When set to an empty string (`""`):**
   - Result: Becomes `<html class="dark">` in dark mode
   - Benefit: Tailwind CSS's `dark:` prefix works as is
   - Use case: Standard configuration when compatibility with regular Tailwind is needed

2. **When a suffix (e.g., `"-mode"`) is specified:**
   - Result: Becomes `<html class="dark-mode">` in dark mode
   - Benefit: Easier to target specific modes in custom CSS
   - Use case: When writing custom CSS that corresponds to multiple color modes

The empty string is recommended for the following reasons:

1. Tailwind CSS's dark mode functionality looks for the `dark` class by default
2. Many other frameworks and libraries also correspond to the `dark` class similarly
3. It's a simple and standard implementation method that is easy to understand

If using a custom suffix, Tailwind's configuration must also be changed:

```js
// tailwind.config.js
module.exports = {
  darkMode: ['class', '.dark-mode'], // Specify selector as well as class
  // ...
}
```

## Color Settings and Dark Mode

In Nuxt UI, dark mode-specific colors can be set in `app.config.ts`.

```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    primary: {
      // Colors for light mode
      50: '#f0f9ff',
      100: '#e0f2fe',
      // ...other shades
      500: '#0ea5e9', // Main color
      // ...
    },
    // Dark mode color settings
    dark: {
      primary: {
        // Colors for dark mode
        50: '#082f49',
        100: '#0c4a6e',
        // ...other shades
        500: '#38bdf8', // Main color in dark mode
        // ...
      }
    }
  }
})
```

With this configuration, `primary-500` is `#0ea5e9` in light mode and `#38bdf8` in dark mode. The appropriate color is automatically applied according to the color mode.

## How to Toggle Dark Mode

To actually toggle dark mode, use the `useColorMode()` composable:

```vue
<script setup>
const colorMode = useColorMode()

function toggleDarkMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button @click="toggleDarkMode">
    Toggle: {{ colorMode.value }}
  </button>
</template>
```

In this code, each time the button is clicked, the current color mode is checked, and light mode and dark mode are toggled alternately.

## Correct Configuration Example

```typescript
colorMode: {
  preference: "light",
  fallback: "light",
  classSuffix: "", // Empty string is important
  storage: "localStorage",
},
ui: {
  colorMode: true, // Enable color mode support
},
```

This configuration ensures:

1. In dark mode, it becomes `<html class="dark">`, and Tailwind's `dark:` prefix works correctly
2. Nuxt UI components respond to color mode

## Incorrect Configuration Example and Issues

```typescript
colorMode: {
  preference: "light",
  fallback: "light",
  classSuffix: "-mode", // Problem
  storage: "localStorage",
},
ui: {
  colorMode: true,
},
```

Issue with this configuration:

With `classSuffix: "-mode"`, it becomes `<html class="dark-mode">` in dark mode, so Tailwind's `dark:` prefix doesn't work

## References

- [Nuxt UI - Theming](https://ui.nuxt.com/getting-started/theme)
- [Nuxt ColorMode](https://color-mode.nuxtjs.org/)
- [Tailwind CSS - Dark Mode](https://tailwindcss.com/docs/dark-mode) 