---
sitemap:
  loc: /ja/articles/2025/4-i18n-at
  lastmod: 2025-10-03
  changefreq: monthly
  priority: 0.8
publishedAt: 2025-10-03
title: i18n-atというライブラリを書いた
description: "Next.js App Routerにコロケーション・ファーストと型安全性をもたらすi18nライブラリの開発背景と設計思想"
tags:
  [
    { name: "blog" },
    { name: "i18n" },
    { name: "typescript" },
    { name: "nextjs" },
  ]
---

# i18n-at というライブラリを書いた

## はじめに

Web アプリケーションの i18n 対応は、大変面倒です。昨今では様々な i18n ライブラリがあります。しかし、従来の i18n ライブラリには課題がありました。翻訳ファイルを一元管理することで、ファイルが肥大化し、使わない翻訳データも含めて一括取得するためパフォーマンスが悪化します。

そこで、これらの課題を解決するために[**i18n-at**](https://github.com/jabelic-works/i18n-at)という軽量なライブラリを開発しました。本記事では Next.js に限って、開発の背景、設計思想について述べていきます。

## 従来の i18n ライブラリの課題

### ❌ 一元管理による問題

従来の i18n ライブラリでは、すべての翻訳データを一箇所のファイルにまとめて管理することが一般的でした。

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

// コンポーネントでの使用
function Dashboard() {
  const { t } = useTranslation();

  // ❌ 文字列リテラル - エラーが起きやすく型安全性がない
  return (
    <div>
      <h1>{t("dashboard.title")}</h1>
      <p>{t("dashboard.welcome", { name: "User" })}</p>
    </div>
  );
}
```

このアプローチには以下の問題点がありました：

1. **ファイルの肥大化**: アプリケーション全体の翻訳を一箇所に集約するため、ファイルサイズが巨大になる
2. **パフォーマンスの悪化**: 使用しない翻訳データも含めて一括で読み込むため、初期ロード時のオーバーヘッドが大きい
3. **型安全性の欠如**: 翻訳キーのタイポはランタイムでしか発見できない
4. **IDE サポートの不備**: 翻訳定義へのジャンプができない
5. **メンテナンスの困難さ**: コンポーネントと翻訳が離れた場所にあるため、管理が煩雑
6. **デッドコード検出の困難**: 巨大な翻訳ファイルの中から未使用の翻訳を見つけにくい
7. **リファクタリング時の問題**: コンポーネントを移動しても翻訳は手動で同期する必要がある

## コロケーション・ファーストという解決策

これらの課題を解決するため、i18n-at では**コロケーション・ファースト**というアプローチを採用しました。翻訳データをコンポーネントと同じ場所で定義し、使用するという考え方です。CSS ファイルなどに似ています。

```typescript
// ✅ コンポーネントと同じ場所でメッセージを定義
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

  // ✅ 完全な型安全性とIDEジャンプ
  return (
    <div>
      <h1>{t(m.dashboard.title)}</h1>
      <p>{t(m.dashboard.welcome, { name: "User" })}</p>
    </div>
  );
}
```

このアプローチにより、以下のメリットが得られます：

### ⚡ パフォーマンスの向上

翻訳データがコンポーネントごとに分散配置されるため、必要な翻訳データだけをロードできます。これにより：

- **初期ロードの高速化**: 使用するコンポーネントの翻訳のみを読み込む
- **バンドルサイズの最適化**: 未使用の翻訳データはバンドルに含まれない
- **Code Splitting との親和性**: コンポーネント単位で翻訳も自動的に分割される

従来の一元管理では、アプリケーション起動時にすべての翻訳データを読み込む必要がありましたが、コロケーションにより必要最小限のデータのみを扱えます。

### 🔍 IDE コードジャンプ

F12 キーでメッセージ定義に直接ジャンプできます。翻訳ファイルを探し回る必要がありません。

### 🛡️ 100%型安全

TypeScript がコンパイル時にすべてのエラーを検出します：

```typescript
const { t, m } = useI18n(messages);

// ✅ 有効 - TypeScriptがメッセージの存在を確認
t(m.dashboard.title);

// ❌ TypeScriptエラー - タイポを即座に検出
t(m.dashboard.titl); // Property 'titl' does not exist

// ❌ TypeScriptエラー - 必須パラメータの不足
t(m.dashboard.welcome); // Missing 'name' parameter

// ✅ 有効 - すべてのパラメータが提供されている
t(m.dashboard.welcome, { name: "Alice" });
```

### 🎯 簡単なメンテナンス

メッセージが使用箇所の近くにあるため、メンテナンスが格段に楽になります：

- コンポーネントが変更されれば、翻訳も一緒に移動
- コンポーネントが削除されれば、翻訳も自動的にクリーンアップ
- メッセージ構造をリファクタリングする際は、TypeScript がすべての使用箇所を案内

### 🧹 デッドコード検出

未使用のメッセージは一目で分かります：

```typescript
export const { messages } = defineMessages({
  en: {
    dashboard: {
      title: "Dashboard",
      subtitle: "Your overview", // ← 使われていない？すぐに分かる！
      welcome: "Welcome, {$name}!",
    },
  },
});

// titleとwelcomeのみ使用 - subtitleが明らかに未使用
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

## 技術的な実装の工夫

### TypeScript による型推論

i18n-at の最大の特徴は、TypeScript の型推論を最大限活用していることです。`defineMessages`で定義したメッセージの構造がそのまま型として保持されるため、使用時に完全な型チェックが可能になります：

```typescript
const { messages } = defineMessages({
  en: { greeting: "Hello, {$name}!" },
  ja: { greeting: "こんにちは、{$name}！" },
});

// TypeScriptが自動的に型を推論
const { t, m } = useI18n(messages);

// ✅ m.greeting は string 型として認識される
// ✅ name パラメータが必須であることも型で検出
t(m.greeting, { name: "太郎" });

// ❌ パラメータ不足でコンパイルエラー
t(m.greeting);

// ❌ 存在しないキーでコンパイルエラー
t(m.hello);
```

型定義ファイルを別途用意する必要がなく、メッセージ定義から自動的に型が生成されます。

### Next.js App Router を意識した API 設計

Server Components と Client Components それぞれに最適化された API を提供：

```typescript
// Server Componentsでの使用
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

// Client Componentsでの使用には Provider が必要
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

**重要**: Client Components で `useI18n` を使う場合は、親コンポーネントで `I18nClientProvider` でラップする必要があります。これは Next.js App Router のクライアント・サーバー境界を意識した設計で、Server Components では不要ですが、Client Components では現在のロケール情報を Context 経由で受け取る必要があるためです。Provider は必要な箇所だけをラップすれば良いので、アプリ全体ではなくページやコンポーネント単位で使用できます。

### 既存プロジェクトとの共存

段階的な移行を可能にする設計にしました：

```typescript
// 新しいコンポーネント - i18n-atを使用
function NewComponent() {
  const { messages } = defineMessages({
    en: { title: "New Feature" },
    ja: { title: "新機能" },
  });
  const { t, m } = useI18n(messages);

  return <h1>{t(m.title)}</h1>;
}

// 既存のコンポーネント - 従来の方法のまま
function LegacyComponent() {
  const { t } = useTranslation();
  return <h1>{t("legacy.title")}</h1>;
}
```

## 成果と今後の展望

### 現在の成果

- NPM パッケージとして公開済み（`npm install i18n-at`）
- 型安全性とコロケーションを両立した新しい i18n アプローチの実現
- Next.js App Router の Server/Client Components の完全サポート
- 包括的なドキュメントとサンプルコードの提供

### 今後の展望

現在、以下の機能拡張を検討しています：

1. **他フレームワークへの対応**: Vue.js、Svelte などへの対応
2. **さらなるパフォーマンス最適化**: 遅延ローディングやメモ化の改善

## おわりに

i18n-at は、従来の i18n ライブラリの課題を解決し、開発者体験とパフォーマンスの両方を大幅に向上させることを目的として開発しました。コロケーション・ファーストと型安全性という設計により、翻訳管理がより直感的で信頼性が高く、かつ高速なものになります。

従来の一元管理アプローチでは、ファイルの肥大化とパフォーマンスの悪化が避けられない問題でした。コロケーションにより、必要な翻訳データのみを扱うことで、これらの問題を根本から解決できます。

ソフトウェア開発において、国際化は避けて通れない要求事項です。しかし、それが開発体験やパフォーマンスを悪化させる理由にはなりません。i18n-at のようなツールが、より多くの開発者にとって翻訳管理を楽しく、効率的なものにできればと考えています。

ライブラリは[GitHub](https://github.com/jabelic-works/i18n-at)で公開しており、フィードバックや貢献を歓迎しています。興味のある方は、ぜひお試しください。
