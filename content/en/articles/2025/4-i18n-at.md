---
sitemap:
  loc: /en/articles/2025/4-i18n-at
  lastmod: 2025-10-03
  changefreq: monthly
  priority: 0.8
publishedAt: 2025-10-03
title: A Library 'i18n-at'
description: "Development background and design philosophy of i18n-at, an i18n library bringing co-location-first and type-safety to Next.js App Router"
tags:
  [
    { name: "blog" },
    { name: "i18n" },
    { name: "typescript" },
    { name: "nextjs" },
  ]
---

# I Created a Library Called i18n-at

## Introduction

Implementing i18n support for web applications is quite cumbersome. While there are various i18n libraries available today, traditional i18n libraries have had challenges. By managing translation files centrally, files become bloated, and performance degrades as unused translation data is loaded in bulk.

To address these issues, I developed [**i18n-at**](https://github.com/jabelic-works/i18n-at), a lightweight library. This article focuses on Next.js and discusses the development background and design philosophy.

## Challenges with Traditional i18n Libraries

### ❌ Problems with Centralized Management

Traditional i18n libraries typically manage all translation data in a single centralized location.

```typescript
// locales/en.json
{
  "dashboard.title": "Dashboard",
  "dashboard.welcome": "Welcome, {name}!"
}

// locales/ja.json
{
  "dashboard.title": "ダッシュボード",
  "dashboard.welcome": "{name} さん、ようこそ！"
}

// Component usage
function Dashboard() {
  const { t } = useTranslation();

  // ❌ String literals - error-prone and no type safety
  return (
    <div>
      <h1>{t("dashboard.title")}</h1>
      <p>{t("dashboard.welcome", { name: "User" })}</p>
    </div>
  );
}
```

This approach has the following issues:

1. **File Bloat**: Consolidating all application translations in one place results in massive file sizes
2. **Performance Degradation**: Loading all translation data at once, including unused translations, causes significant initial load overhead
3. **Lack of Type Safety**: Typos in translation keys are only discovered at runtime
4. **Poor IDE Support**: Cannot jump to translation definitions
5. **Difficult Maintenance**: Managing translations separate from components is cumbersome
6. **Hard to Detect Dead Code**: Difficult to find unused translations in massive translation files
7. **Refactoring Issues**: Moving components requires manually syncing translations

## Co-location-First as a Solution

To solve these challenges, i18n-at adopts a **co-location-first** approach. This means defining and using translation data in the same location as components. It's similar to CSS files.

```typescript
// ✅ Define messages in the same location as the component
export const { messages } = defineMessages({
  en: {
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome, {$name}!",
    },
  },
  ja: {
    dashboard: {
      title: "ダッシュボード",
      welcome: "{$name} さん、ようこそ！",
    },
  },
});

function Dashboard() {
  const { t, m } = useI18n(messages);

  // ✅ Complete type safety and IDE jumping
  return (
    <div>
      <h1>{t(m.dashboard.title)}</h1>
      <p>{t(m.dashboard.welcome, { name: "User" })}</p>
    </div>
  );
}
```

This approach provides the following benefits:

### ⚡ Performance Improvements

Translation data is distributed across components, allowing you to load only the necessary translations:

- **Faster Initial Load**: Only load translations for components in use
- **Bundle Size Optimization**: Unused translation data is not included in the bundle
- **Code Splitting Compatibility**: Translations are automatically split at the component level

With traditional centralized management, all translation data must be loaded at application startup. Co-location allows you to handle only the minimum necessary data.

### 🔍 IDE Code Jumping

Press F12 to jump directly to message definitions. No need to search through translation files.

### 🛡️ 100% Type Safety

TypeScript detects all errors at compile time:

```typescript
const { t, m } = useI18n(messages);

// ✅ Valid - TypeScript confirms the message exists
t(m.dashboard.title);

// ❌ TypeScript Error - Detects typos immediately
t(m.dashboard.titl); // Property 'titl' does not exist

// ❌ TypeScript Error - Missing required parameter
t(m.dashboard.welcome); // Missing 'name' parameter

// ✅ Valid - All parameters provided
t(m.dashboard.welcome, { name: "Alice" });
```

### 🎯 Easy Maintenance

Messages are near their usage point, making maintenance significantly easier:

- When components change, translations move with them
- When components are deleted, translations are automatically cleaned up
- When refactoring message structure, TypeScript guides you through all usage sites

### 🧹 Dead Code Detection

Unused messages are immediately obvious:

```typescript
export const { messages } = defineMessages({
  en: {
    dashboard: {
      title: "Dashboard",
      subtitle: "Your overview", // ← Not used? Easy to spot!
      welcome: "Welcome, {$name}!",
    },
  },
});

// Only title and welcome are used - subtitle is clearly unused
function Dashboard() {
  const { t, m } = useI18n(messages);
  return (
    <div>
      <h1>{t(m.dashboard.title)}</h1>
      <p>{t(m.dashboard.welcome, { name: "User" })}</p>
    </div>
  );
}
```

## Technical Implementation Details

### Type Inference with TypeScript

The key feature of i18n-at is maximizing TypeScript's type inference. The structure defined in `defineMessages` is preserved as types, enabling complete type checking at usage time:

```typescript
const { messages } = defineMessages({
  en: { greeting: "Hello, {$name}!" },
  ja: { greeting: "こんにちは、{$name}！" },
});

// TypeScript automatically infers types
const { t, m } = useI18n(messages);

// ✅ m.greeting is recognized as string type
// ✅ name parameter is detected as required by types
t(m.greeting, { name: "Taro" });

// ❌ Compile error for missing parameter
t(m.greeting);

// ❌ Compile error for non-existent key
t(m.hello);
```

No need to prepare separate type definition files - types are automatically generated from message definitions.

### API Design Conscious of Next.js App Router

Provides APIs optimized for both Server Components and Client Components:

```typescript
// Usage in Server Components
import { getI18n } from "i18n-at";
import { messages } from "./messages";

export default function ServerPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { t, m } = getI18n(messages, locale);
  return (
    <div>
      <h1>{t(m.dashboard.title)}</h1>
      <p>{t(m.dashboard.welcome, { name: "User" })}</p>
    </div>
  );
}

// Client Components require a Provider
// app/dashboard/page.tsx
import { I18nClientProvider } from "i18n-at";
import DashboardClient from "./DashboardClient";

export default function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <I18nClientProvider locale={locale}>
      <DashboardClient />
    </I18nClientProvider>
  );
}

// app/dashboard/DashboardClient.tsx
("use client");
import { useI18n } from "i18n-at";
import { messages } from "./messages";

export default function DashboardClient() {
  const { t, m } = useI18n(messages);
  return (
    <div>
      <h1>{t(m.dashboard.title)}</h1>
      <p>{t(m.dashboard.welcome, { name: "User" })}</p>
    </div>
  );
}
```

**Important**: When using `useI18n` in Client Components, you must wrap them with `I18nClientProvider` in the parent component. This is a design conscious of Next.js App Router's client-server boundary. While unnecessary for Server Components, Client Components need to receive current locale information via Context. The Provider can wrap only the necessary parts, so it can be used at the page or component level rather than the entire app.

### Coexistence with Existing Projects

Designed to enable gradual migration:

```typescript
// New component - using i18n-at
function NewComponent() {
  const { messages } = defineMessages({
    en: { title: "New Feature" },
    ja: { title: "新機能" },
  });
  const { t, m } = useI18n(messages);

  return <h1>{t(m.title)}</h1>;
}

// Existing component - keeping the traditional approach
function LegacyComponent() {
  const { t } = useTranslation();
  return <h1>{t("legacy.title")}</h1>;
}
```

## Achievements and Future Plans

### Current Achievements

- Published as an NPM package (`npm install i18n-at`)
- Realized a new i18n approach balancing type safety and co-location
- Full support for Next.js App Router's Server/Client Components
- Comprehensive documentation and sample code

### Future Plans

Currently considering the following feature enhancements:

1. **Support for Other Frameworks**: Support for Vue.js, Svelte, etc.
2. **Further Performance Optimization**: Improvements in lazy loading and memoization

## Conclusion

i18n-at was developed to solve the challenges of traditional i18n libraries and significantly improve both developer experience and performance. The co-location-first and type-safe design makes translation management more intuitive, reliable, and fast.

With traditional centralized management approaches, file bloat and performance degradation were unavoidable issues. Co-location fundamentally solves these problems by handling only the necessary translation data.

In software development, internationalization is an unavoidable requirement. However, there's no reason it should degrade developer experience or performance. I hope that tools like i18n-at can make translation management enjoyable and efficient for more developers.

The library is published on [GitHub](https://github.com/jabelic-works/i18n-at), and feedback and contributions are welcome. If you're interested, please give it a try.
