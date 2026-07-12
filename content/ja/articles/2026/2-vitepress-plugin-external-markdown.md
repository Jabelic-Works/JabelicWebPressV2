---
sitemap:
  loc: /ja/articles/2026/2-vitepress-plugin-external-markdown
  lastmod: 2026-06-18
  changefreq: monthly
  priority: 0.8
publishedAt: 2026-06-18
title: VitePress で srcDir 外の Markdown と assets をページ化する plugin を作った
description: monorepo 内の packages 配下にある README や CHANGELOG、同梱 assets を VitePress のページとして扱うために、vitepress-plugin-external-markdown を作った経緯と設計方針
tags:
  [
    { name: "blog" },
    { name: "vitepress" },
    { name: "markdown" },
    { name: "typescript" },
  ]
---

# VitePress で srcDir 外の Markdown と assets をページ化する plugin を作った

## はじめに

monorepo で開発していると、package ごとの `README.md` や `CHANGELOG.md` をそのまま documentation site に出したくなることがあります。

また、対象は README だけとは限りません。各 app が持っている `docs/` 配下の Markdown、Codex や Claude などの coding agent 向けに書いた rules / skills / knowledge の Markdown、運用手順や設計メモなど、VitePress の `srcDir` の外に置いておきたい文書は意外とあります。

たとえば、次のような構成です。

```text
repo/
  docs/
    .vitepress/
      config.ts
    src/
      index.md
  packages/
    core/
      README.md
      CHANGELOG.md
    editor/
      README.md
  apps/
    console/
      docs/
        operations.md
  .codex/
    skills/
      review/
        SKILL.md
```

このとき、`packages/core/README.md` や `apps/console/docs/operations.md` は、それぞれ package や app の近くに置いておきたいです。README は npm や GitHub からも読まれますし、app 固有の docs は app の変更と一緒に編集したい。agent 向けの skills や rules も、実際に tool が読む場所から docs site の都合だけで動かしたくはありません。

一方で、VitePress の page routing は基本的に VitePress project root / `srcDir` 配下の Markdown tree を前提にしています。`docs/src/` の外にある `packages/*/*.md` を、そのまま独立した VitePress page として扱うのは簡単ではありません。

そこで、外部 Markdown を VitePress が扱える場所へ生成する plugin として [`vitepress-plugin-external-markdown`](https://www.npmjs.com/package/vitepress-plugin-external-markdown) を作りました。

## やりたかったこと

やりたいことは、最初はかなり素朴でした。

- `packages/*/README.md` を docs site に取り込みたい
- `packages/*/CHANGELOG.md` や `packages/*/docs/*.md` も対象にしたい
- `apps/*/docs/*.md` のような app ごとの docs も対象にしたい
- Codex や Claude 向けの rules / skills / knowledge も docs portal に載せたい
- Markdown の置き場所は package 側のままにしたい
- docs site の都合で source file の配置を変えたくない
- 生成された page の sidebar も同じ設定から作りたい
- package 名、route、表示名、frontmatter、並び順を一箇所で制御したい

単に sidebar を自動生成したいわけではありません。必要だったのは、VitePress の `srcDir` 外にある Markdown を、VitePress が通常の page として扱える形に materialize する仕組みでした。

## symlink はやめた

最初に考えたのは symlink です。

`packages/*/README.md` を `docs/src/generated/...` に symlink すれば、VitePress からは `srcDir` 配下の Markdown に見えるのではないか、という発想です。

しかし、これはうまくいきませんでした。`vitepress dev` で 404 になったり、build 時の挙動も安定しませんでした。VitePress の page routing や dev server の watch と symlink の相性に期待するより、VitePress が素直に扱える実体ファイルを生成したほうがよさそうでした。

そのため、この plugin では symlink mode は採用していません。

採用したのは copy 生成です。

```text
external Markdown files
  -> generated Markdown under srcDir
  -> normal VitePress routes
```

外部 Markdown を読み取り、VitePress の `srcDir` 配下に generated Markdown file として書き出します。生成されたファイルは、VitePress から見ると普通の Markdown page です。

## 生成先は srcDir 配下にする

生成先は必ず `srcDir` 配下に置きます。

たとえば次のような構成です。

```text
docs/
  src/
    generated/
      packages/
        core.md
        core/changelog.md
        editor.md
```

この場合、route は次のようになります。

| Source file                  | Generated file                                  | Route                                |
| ---------------------------- | ----------------------------------------------- | ------------------------------------ |
| `packages/core/README.md`    | `docs/src/generated/packages/core.md`           | `/generated/packages/core`           |
| `packages/core/CHANGELOG.md` | `docs/src/generated/packages/core/changelog.md` | `/generated/packages/core/changelog` |
| `packages/editor/README.md`  | `docs/src/generated/packages/editor.md`         | `/generated/packages/editor`         |

generated file は repository に commit しない前提です。通常は `.gitignore` に追加します。

```gitignore
docs/src/generated/
```

生成物は source ではなく build/dev のための中間生成物として扱います。

## resolver を single source of truth にする

この plugin で一番大事にしたのは、生成ファイルと navigation metadata がズレないことです。

外部 Markdown を page にするとき、決めるべき情報は意外と多くあります。

- slug
- title
- sidebar text
- generated file name
- route link
- sort order
- frontmatter
- sidebar に含めるか
- nav に含めるか

これらを別々の設定で管理すると、すぐにズレます。たとえば Markdown は `/generated/packages/core` に生成されているのに、sidebar は `/packages/core` を指している、というような状態です。

そこで、`resolveMarkdown` を single source of truth にしました。

```ts
resolveMarkdown(ctx) {
  const slug = ctx.relativePath
    .replace(/\/README\.md$/u, '')
    .replace(/\/index\.md$/u, '')
    .replace(/\.md$/u, '')
    .toLowerCase()

  return {
    slug,
    title: ctx.title,
    text: ctx.title,
    order: ctx.relativePath,
    sidebar: true,
    frontmatter: {
      editLink: false,
    },
  }
}
```

この resolver から generated Markdown の file name や route link を決め、同じ resolver から sidebar item や nav item も作ります。

使う側は、同じ options object を Vite plugin と sidebar helper に渡します。

```ts
import { defineConfig } from 'vitepress'
import {
  externalMarkdown,
  getExternalMarkdownSidebar,
} from 'vitepress-plugin-external-markdown'

const externalMarkdownOptions = {
  root: new URL('..', import.meta.url).pathname,
  srcDir: 'src',
  sources: [
    {
      name: 'packages',
      baseDir: '../packages',
      pattern: '**/*.md',
    },
  ],
  outDir: 'generated/packages',
  routeBase: '/generated/packages/',
  resolveMarkdown(ctx) {
    const slug = ctx.relativePath
      .replace(/\/README\.md$/u, '')
      .replace(/\/index\.md$/u, '')
      .replace(/\.md$/u, '')
      .toLowerCase()

    return {
      slug,
      title: ctx.title,
      text: ctx.title,
      order: ctx.relativePath,
      sidebar: true,
    }
  },
}

export default defineConfig({
  srcDir: 'src',
  vite: {
    plugins: [externalMarkdown(externalMarkdownOptions)],
  },
  themeConfig: {
    sidebar: {
      '/generated/packages/': [
        {
          text: 'Packages',
          items: getExternalMarkdownSidebar(externalMarkdownOptions),
        },
      ],
    },
  },
})
```

plugin と helper が同じ options を使うので、生成物と navigation metadata が同じルールから作られます。

## clean はかなり慎重にした

copy 生成する以上、generated directory を clean してから再生成したくなります。

しかし、filesystem の clean は危険です。`outDir` の設定を間違えたときに project root や `srcDir` そのものを消すような plugin にはしたくありません。

そのため、clean 前にいくつかの安全確認を入れています。

- `outDir` が `srcDir` 配下に解決されること
- `outDir` が `srcDir` 自体ではないこと
- `outDir` が project root ではないこと
- `outDir` が空文字ではないこと
- marker file がある managed directory か、まだ存在しない directory であること

generated directory には marker file を置きます。

```text
.vitepress-plugin-external-markdown
```

すでに存在する directory を clean する場合、この marker file がない directory は unmanaged とみなして拒否します。手作業で置いた Markdown や別の tool の生成物を巻き込まないためです。

また、duplicate slug や duplicate output file path も hard error にしています。

```text
Duplicate external markdown slug: guide
- ../packages/foo/docs/guide.md
- ../packages/bar/docs/guide.md
```

slug の衝突は route の衝突なので、warning で流すよりも早く止めたほうが安全です。

## frontmatter は merge する

source Markdown に frontmatter があることもありますし、resolver 側で frontmatter を足したいこともあります。

たとえば、package 側の README には title や description が書かれている一方で、docs site 側では `editLink: false` や `outline` を制御したい、というケースです。

この plugin では、source frontmatter と resolver frontmatter を merge します。衝突した場合は resolver の値を優先します。

生成される Markdown では、frontmatter は file の先頭にまとめて書き出し、body 側には元の frontmatter を残しません。

これにより、source Markdown の情報を活かしつつ、docs site としての metadata は中央から制御できます。

## relative link rewrite はまだやらない

外部 Markdown を別の directory に copy すると、Markdown 内の相対リンクや画像パスは壊れる可能性があります。

```md
![logo](./assets/logo.png)
[Guide](./docs/guide.md)
```

これは重要な問題ですが、Markdown 本文の link rewrite は今も対応していません。

理由は、link rewrite は想像以上に方針が分かれるからです。Markdown link なのか image なのか、VitePress route として解決したいのか、static asset として解決したいのか、GitHub 上の README とも両立したいのか、考えるべきことが多くあります。

最初からここまで含めると、core design がぼやけます。

そのため、まずは次のことに集中しました。

- 外部 Markdown を正しく探索する
- `srcDir` 配下に安全に materialize する
- deterministic な metadata を作る
- duplicate を検出する
- safe clean する
- resolver-based API を固める

relative link rewrite は、必要になってから別 option として設計する方針にしています。

## 同梱 assets は copy できるようにした

一方で、Markdown の近くに置いた画像や static file を一緒に materialize したい需要はかなり自然です。

たとえば外部 docs が次のような構成になっている場合です。

```text
docs-content/
  guide.md
  images/
    overview.png
  public/
    logo.png
```

`guide.md` の本文は書き換えず、必要な assets だけを `srcDir` 配下に copy できるように `copyAssets` option を追加しました。

```ts
const externalMarkdownOptions = {
  srcDir: 'src',
  sources: [
    {
      baseDir: '../docs-content',
      pattern: '**/*.md',
    },
  ],
  outDir: 'generated/docs',
  routeBase: '/generated/docs/',
  copyAssets: [
    {
      baseDir: '../docs-content',
      pattern: 'images/**/*',
      outDir: 'generated/docs',
    },
    {
      baseDir: '../docs-content',
      pattern: 'public/**/*',
      outDir: '.',
    },
  ],
}
```

この設定では、たとえば次のように生成されます。

```text
docs/src/generated/docs/images/overview.png
docs/src/public/logo.png
```

`copyAssets` は Markdown 生成とは独立しています。指定した `baseDir` と `pattern` に一致した local filesystem 上の file を、`srcDir/outDir` 配下に copy するだけです。

Markdown 本文の link は書き換えません。remote asset fetch もしません。VitePress 全般の public 管理機能にもしません。

あくまで、この plugin の core design である「外部 source を `srcDir` 配下へ materialize する」範囲に閉じています。

asset copy でも安全性は Markdown 生成と同じ方針にしています。

- `copyAssets.outDir` は `srcDir` 配下に限る
- managed directory には marker file を置く
- marker file がない非空 directory は clean しない
- 複数 source が同じ output path に解決されたら hard error にする

特に最後の duplicate asset output path は重要でした。後勝ちで上書きすると、間違った画像や static file を公開してしまう可能性があります。Markdown の duplicate output を error にするなら、asset copy でも同じ扱いにすべきです。

## dev watch は入れたが、基本設計は単純に保った

`vitepress dev` では、source Markdown や copy 対象 asset が変わったときに generated file も更新されてほしいです。

そのため、source Markdown と asset copy 対象の変更を watch して regenerate し、VitePress に full reload を投げる動きも入れています。

ただし、設計の中心はあくまで単純です。

```text
external Markdown source
  -> generated Markdown under srcDir
  -> normal VitePress routes
  -> sidebar/nav/items from the same resolver
```

watch はこの flow を dev server 中にも繰り返すための仕組みです。virtual route を作ったり、VitePress の routing に深く入り込んだりはしていません。

## docs site 自体でも使っている

この plugin の docs は VitePress で作っています。

そして、その docs 自体もこの plugin を使って構成しています。Markdown source は `docs-content/` に置き、VitePress の `docs/src/` 配下へ generated page として materialize します。

さらに、docs 内で使う SVG asset も `copyAssets` で copy しています。

```text
docs-content/ja/examples.md
docs-content/ja/assets/copied-asset-flow.svg
  -> docs/src/ja/examples.md
  -> docs/src/ja/assets/copied-asset-flow.svg
```

自分自身の docs site で使うことで、単体テストだけでは見えにくい「VitePress build の中で本当に動くか」「生成された Markdown から相対 asset が解決できるか」も確認できるようにしました。

## OSS package として整えた

せっかく plugin として切り出すなら、使い捨て script ではなく、普通に npm package として使えるところまで整えました。

入れたものは次のあたりです。

- TypeScript
- unit test
- oxlint
- oxformat
- VitePress docs
- GitHub Pages
- npm package publish
- staged publishing 対応

lint では `let` も基本的に禁止しています。これは好みもありますが、今回のような file generation 系の code では、値を途中で書き換えないほうが読みやすい場面が多いです。再代入が必要なときだけ、意図して局所的に使えばよいと考えています。

unit test は特に重要でした。

この plugin は filesystem を触ります。`outDir` の安全確認、frontmatter merge、duplicate slug、generated file path の脱出防止などは、手元で動いたから大丈夫という種類のものではありません。狭い範囲でも test があるほうが安心できます。

## npm publish まわりで学びがあった

npm publish も、やってみると細かい学びがありました。

最初は GitHub Actions から npm Trusted Publishing で publish する workflow を作りました。`NPM_TOKEN` を GitHub Secrets に置かず、GitHub OIDC で npm に認証する形です。

さらに、セキュリティを考えると staged publishing も入れたくなりました。通常の `npm publish` は workflow が成功するとそのまま live registry に出ます。一方で staged publishing では、CI は package を staging area に置くだけで、maintainer が内容を確認して approve してから公開されます。

ただし、staged publishing はすでに npm registry に存在する package が前提です。未公開 package の初回 release は stage できません。

ただ、ここは少し詰まりました。OIDC と staged publishing の組み合わせは、少なくとも今回の運用では期待どおりに通せませんでした。

最終的には、staged publishing には npm token を使う形にしています。

そのため、実際の運用は次の形にしました。

1. 初回だけ direct `npm publish`
2. package が npm に存在するようになったら `npm stage publish`
3. staged package を確認して 2FA で approve する

初回 publish では、npm account 側の 2FA 設定や permission でも少し詰まりました。このあたりは一度通してみないと分からない部分でした。

## 使い方

install は通常の VitePress plugin と同じです。

```sh
pnpm add -D vitepress-plugin-external-markdown
```

package は npm に公開しています。

https://www.npmjs.com/package/vitepress-plugin-external-markdown

repository は GitHub にあります。

https://github.com/Jabelic-Works/vitepress-plugin-external-markdown

## おわりに

今回作った `vitepress-plugin-external-markdown` は、VitePress の routing に無理に割り込む plugin ではありません。

外部 Markdown を VitePress が普通に扱える Markdown file として `srcDir` 配下に生成し、その生成物と navigation metadata を同じ resolver から作るだけです。

やっていることは地味ですが、monorepo の package docs、app docs、agent 向け knowledge を docs site に集約するには、この素直さがちょうどよいと感じています。

symlink や virtual route で VitePress の外側から無理に差し込むより、VitePress が得意な形に materialize する。今回の設計判断はそこに尽きます。

今後は、必要に応じて relative link rewrite や remote Markdown source の対応も考えたいです。ただ、まずは local filesystem の Markdown と明示的に指定した assets を、安全に、deterministic に、VitePress page として扱えるところまでを小さく作れたので、最初の version としてはよい形になったと思います。
