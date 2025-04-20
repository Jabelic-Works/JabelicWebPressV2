---
sitemap:
  loc: /ja/articles/2025/nuxt-ui-dark-mode
  lastmod: 2025-05-15
  changefreq: monthly
  priority: 0.8
title: Nuxt UIのダークモード実装
description: Nuxt UIフレームワークにおけるダークモード実装の詳細と設定方法
tags: [{ name: "blog" }, { name: 'nuxt' }, { name: 'tailwind' }]
---

# Nuxt UIのダークモード実装

Nuxt UIにおけるダークモード実装の仕組みと正しい設定方法について述べる。

## Tailwind CSSのdarkプレフィックス

Tailwind CSSでは、ダークモード対応のスタイルを指定するために`dark:`プレフィックスを使用する。これは以下のようにマークアップされる。

```html
<div class="bg-white dark:bg-gray-800 text-black dark:text-white">
  ダークモード対応テキスト
</div>
```

このコードはライトモードでは白背景に黒文字、ダークモードでは暗いグレー背景に白文字となる。

Tailwind CSSの標準設定では、`dark:`プレフィックスは`html`または`body`要素に`dark`クラスが付与されている場合のみ有効となる。具体的には`<html class="dark">`のようなマークアップが必要である。

## Nuxt UIのダークモード対応

Nuxt UIはNuxtエコシステムのコンポーネントライブラリであり、全てのコンポーネントがデフォルトでダークモードに対応している。これらのコンポーネントはTailwind CSSの`dark:`プレフィックスを内部的に活用している。

```vue
<template>
  <UButton color="primary">ボタン</UButton>
  <UCard>
    <template #header>ヘッダー</template>
    カードの内容
  </UCard>
</template>
```

上記のコンポーネントは適切な設定がなされていれば、アプリケーションのダークモード状態に応じて自動的にスタイルが切り替わる。

## nuxt.configでの設定

ダークモードを正しく機能させるためには、`nuxt.config.ts`に適切な設定が必要である。

```typescript
export default defineNuxtConfig({
  // ...
  colorMode: {
    preference: "light",  // デフォルトモード
    fallback: "light",    // SSR用フォールバック
    classSuffix: "",      // クラスサフィックス
    storage: "localStorage" // 設定保存場所
  },
  ui: {
    colorMode: true    // カラーモード対応の有効化
  }
  // ...
})
```

### ui.colorMode設定

`ui.colorMode`はブール値を受け付ける：

- `true`: Nuxt UIコンポーネントがカラーモードに対応する（デフォルト）
- `false`: Nuxt UIコンポーネントがカラーモードに対応しない

Nuxt UIはNuxtのColorModeモジュールと連携し、ColorModeモジュールの設定に基づいてダークモードの検出方法を決定する。

### classSuffixパラメータ

`colorMode.classSuffix`パラメータが特に重要である。このパラメータはダークモード時に`html`要素に付与されるクラス名の接尾辞を決定する。

- `classSuffix: ''` → `<html class="dark">`
- `classSuffix: '-mode'` → `<html class="dark-mode">`

Tailwind CSSの`dark:`プレフィックスはデフォルトで`dark`クラスを探すため、`classSuffix`は空文字列（`''`）に設定する必要がある。別の値（例：`'-mode'`）を設定すると、ダークモード時には`dark-mode`クラスが適用されるが、Tailwindの`dark:`プレフィックスが機能しなくなる。

#### classSuffixパラメータの詳細

このパラメータには主に以下の2つの使用方法がある：

1. **空文字列（`""`）に設定する場合**
   - 結果: ダークモード時に`<html class="dark">`になる
   - メリット: Tailwind CSSの`dark:`プレフィックスがそのまま機能する
   - 用途: 通常のTailwindとの互換性が必要な場合の標準的な設定

2. **接尾辞（例：`"-mode"`）を指定する場合**
   - 結果: ダークモード時に`<html class="dark-mode">`になる
   - メリット: カスタムCSSで特定のモードを対象としやすくなる
   - 用途: 複数のカラーモードに対応したカスタムCSSを書く場合

空文字列が推奨される理由は以下の通りである：

1. Tailwind CSSのダークモード機能はデフォルトで`dark`クラスを探す
2. 他のフレームワークやライブラリも同様に`dark`クラスに対応していることが多い
3. シンプルで標準的な実装方法であり、理解しやすい

カスタム接尾辞を使う場合は、Tailwindの設定も変更する必要がある：

```js
// tailwind.config.js
module.exports = {
  darkMode: ['class', '.dark-mode'], // クラスと同様にセレクタも指定
  // ...
}
```

## カラー設定とダークモード

Nuxt UIでは、`app.config.ts`でダークモード専用のカラーを設定できる。

```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    primary: {
      // ライトモード用のカラー
      50: '#f0f9ff',
      100: '#e0f2fe',
      // ...他の階調
      500: '#0ea5e9', // メインカラー
      // ...
    },
    // ダークモード用のカラー設定
    dark: {
      primary: {
        // ダークモード用のカラー
        50: '#082f49',
        100: '#0c4a6e',
        // ...他の階調
        500: '#38bdf8', // ダークモード時のメインカラー
        // ...
      }
    }
  }
})
```

この設定により、ライトモードでは`primary-500`は`#0ea5e9`、ダークモードでは`#38bdf8`となる。カラーモードに応じて自動的に適切なカラーが適用される。

## ダークモードの切り替え方法

ダークモードを実際に切り替えるためには、`useColorMode()`コンポーザブルを使用する：

```vue
<script setup>
const colorMode = useColorMode()

function toggleDarkMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button @click="toggleDarkMode">
    切替: {{ colorMode.value }}
  </button>
</template>
```

このコードでは、ボタンがクリックされるたびに現在のカラーモードを確認し、ライトモードとダークモードを交互に切り替える。

## 正しい設定例

```typescript
colorMode: {
  preference: "light",
  fallback: "light",
  classSuffix: "", // 空文字列が重要
  storage: "localStorage",
},
ui: {
  colorMode: true, // カラーモード対応を有効化
},
```

この設定により：

1. ダークモード時に`<html class="dark">`となり、Tailwindの`dark:`プレフィックスが正しく機能する
2. Nuxt UIコンポーネントがカラーモードに対応する

## 誤った設定例と問題点

```typescript
colorMode: {
  preference: "light",
  fallback: "light",
  classSuffix: "-mode", // 問題点
  storage: "localStorage",
},
ui: {
  colorMode: true,
},
```

この設定の問題点：

`classSuffix: "-mode"`により、ダークモード時に`<html class="dark-mode">`となるため、Tailwindの`dark:`プレフィックスが機能しない

## 参考

- [Nuxt UI - Theming](https://ui.nuxt.com/getting-started/theme)
- [Nuxt ColorMode](https://color-mode.nuxtjs.org/)
- [Tailwind CSS - Dark Mode](https://tailwindcss.com/docs/dark-mode)
