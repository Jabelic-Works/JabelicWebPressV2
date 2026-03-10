---
sitemap:
  loc: /ja/articles/2026/1-cursor-cspell-run-on-save
  lastmod: 2026-03-10
  changefreq: monthly
  priority: 0.8
publishedAt: 2026-03-10
title: Cursor で複数 worktree の cspell.txt を保存時に自動ソートする
description: Cursor で cspell.txt の保存時に sort -u を実行し、複数 worktree にまたがって辞書ファイルの整列を自動化する方法
tags:
  [
    { name: "blog" },
    { name: "cursor" },
    { name: "cspell" },
    { name: "automation" },
  ]
---

# Cursor で複数 worktree の cspell.txt を保存時に自動ソートする

## はじめに

`cspell.txt` に単語を少しずつ足していく運用をしていると、気づかないうちに並び順が崩れていきます。スペルチェック自体は動くので放置しがちですが、レビュー時に差分が読みづらくなり、重複語の混入にも気づきにくくなります。

そのため、単語を追加したタイミングで自動的に辞書を整列しておくと運用がかなり楽になります。今回は Cursor で `cspell.txt` を保存したときに `sort -u` を自動実行し、さらに複数 worktree にまたがって同じ設定を効かせる方法をまとめます。

## `cspell` とは

`cspell` は、コードベース向けのスペルチェッカーです。コメント、識別子、Markdown などに含まれる単語を見て、スペルミスらしきものを検出してくれます。詳しくは公式の [Getting Started](https://cspell.org/docs/getting-started) や [Configuration](https://cspell.org/docs/Configuration) を見ると全体像をつかみやすいです。

設定は `package.json` の `cspell` フィールドや `cspell.json` 系の設定ファイルに置けます。そこでは `words` に単語を直接書くこともできますし、[Custom Dictionaries](https://cspell.org/docs/dictionaries/custom-dictionaries) の仕組みを使って `cspell.txt` のような単語リストファイルを辞書として読み込むこともできます。

つまり、`package.json` や `cspell.json` は主に設定の置き場です。一方で、`cspell.txt` はその設定から参照されるプロジェクト辞書の 1 例、と理解するのが正確です。実際のプロジェクトでは、プロダクト名、略語、固有名詞、社内用語など、一般的な辞書には載っていないものの正しい単語が多く登場するため、こうした追加辞書を運用することがよくあります。

この記事では、その中でも `cspell.txt` のようなテキスト辞書ファイルをすでに運用している前提で、「そのファイルを保存時に自動整列する」方法に絞って説明します。

## やりたかったこと

やりたいこと自体はシンプルで、`cspell.txt` を保存したときに次のコマンドを自動実行したいだけです。

```sh
LC_ALL=C sort -u "${file}" -o "${file}"
```

このコマンドにはそれぞれ意味があります。

- `sort`: 行をソートする
- `-u`: 重複行を取り除く
- `-o "${file}"`: 結果を元のファイルに上書きする
- `LC_ALL=C`: 環境差分の少ない順序にそろえやすくする

単語を足したあとで毎回手動実行してもよいですが、保存時に走るようにしておくほうが圧倒的に楽です。

## 単一 repo なら workspace 設定でもよい

単一 repo しか触らないなら、`.vscode/settings.json` に保存時実行の設定を書くやり方でも十分です。repo ごとに閉じた設定なので、他プロジェクトに影響しないという利点もあります。

ただし、複数 worktree を日常的に使っていると話が変わります。

## 複数 worktree では user 設定のほうが便利

たとえば次のような構成で作業しているとします。

```text
/Users/you/dev/your-project/cspell.txt
/Users/you/worktrees/your-project/feature-a/cspell.txt
/Users/you/worktrees/your-project/feature-b/cspell.txt
```

この場合、worktree ごとに `.vscode/settings.json` を持たせるより、Cursor の user 設定に一度だけルールを書いたほうが運用しやすいです。新しい worktree を切っても追加設定なしでそのまま保存時フックが効くからです。

## VS Code の定番設定が Cursor ではそのまま使えないことがある

保存時に任意コマンドを走らせる方法として、VS Code 周辺では `emeraldwalk.RunOnSave` を使った例をよく見かけます。

しかし今回の環境では、この拡張を Cursor にそのまま導入できませんでした。VS Code Marketplace では有名な拡張でも、Cursor 側の拡張配布経路との違いで素直に入らない場合があります。

ここは「Cursor では絶対に使えない」と断言したいわけではなく、少なくとも今回の環境では別の選択肢が必要だった、という位置づけで理解しておくのがよいと思います。

## Cursor では `pucelle.run-on-save` で実現できた

最終的には `pucelle.run-on-save` を使うことで実現できました。設定は Cursor の user 設定、つまり `~/Library/Application Support/Cursor/User/settings.json` に追加します。

```json
{
  "runOnSave.defaultRunIn": "backend",
  "runOnSave.commands": [
    {
      "match": "[\\\\/]your-project(?:[\\\\/][^\\\\/]+)?[\\\\/]cspell\\.txt$",
      "command": "LC_ALL=C sort -u \"${file}\" -o \"${file}\"",
      "async": false,
      "doNotDisturb": true
    }
  ]
}
```

ここでの `your-project` は例なので、実際には自分のプロジェクトのディレクトリ名に置き換えてください。

これで対象プロジェクト配下の `cspell.txt` を保存したときだけ、自動で `sort -u` が走ります。

## `match` の意味

今回の設定で一番大事なのは `match` です。

```text
[\\/]your-project(?:[\\/][^\\/]+)?[\\/]cspell\.txt$
```

この正規表現は、次の 2 パターンを想定しています。

- `.../your-project/cspell.txt`
- `.../your-project/<worktree-name>/cspell.txt`

つまり、repo 直下の `cspell.txt` と、1 階層深い worktree 配下の `cspell.txt` の両方を拾います。

逆に、これ以上深い階層まで広く拾わないようにもしています。もし運用上さらに深い場所の `cspell.txt` も対象にしたいなら、正規表現はチームのディレクトリ構成に合わせて調整すればよいです。

## なぜ `match` を絞るのか

単に `cspell\\.txt$` だけでも動きますが、それだと他プロジェクトの `cspell.txt` にまで反応する可能性があります。保存時処理は便利な反面、どこにでも効く設定にすると後から意図しない副作用になりやすいです。

そのため、対象プロジェクト群だけに絞るほうが安全です。

## 導入手順

実際の手順としては次の通りです。

1. Cursor に `pucelle.run-on-save` をインストールする
2. `~/Library/Application Support/Cursor/User/settings.json` に設定を追加する
3. 必要なら `Developer: Reload Window` で再読み込みする
4. `cspell.txt` に未ソートの単語を 1 つ追加して保存する
5. 自動で並び替われば設定完了

ポイントは、すでにソート済みのファイルを保存しても見た目の変化が出ないことがある点です。初回確認では、あえて未ソートの単語を追加してから保存したほうがよいです。

## 詰まりやすいポイント

### 拡張が入っていない、または有効化されていない

設定だけ書いても、対応する拡張が入っていなければ当然発火しません。拡張導入後にうまく動かない場合は、Cursor を再読み込みしてみると改善することがあります。

### `match` が狭すぎる

保存時フックが repo 直下では動くのに worktree 側で動かない場合、ほとんどは `match` が想定パスを拾えていません。フルパスに対する正規表現だという前提で、実際のパスを書き出して確認するとよいです。

### `match` が広すぎる

逆に `match` を広く書きすぎると、別プロジェクトの `cspell.txt` にまで効いてしまいます。保存時実行は便利ですが、対象範囲は明示的に絞ったほうが安心です。

### すでにソート済みで変化が見えない

`sort -u` は未ソートや重複がなければ見た目の変更を起こしません。そのため、「動いていない」のではなく「もともと並んでいた」だけということも多いです。

## pre-commit フックとの住み分け

今回の設定はあくまでローカルの開発体験をよくするためのものです。チーム全体で必ず整列状態を守りたいなら、別途 `pre-commit` フックや `lint-staged` で担保するのもよいです。

実際には、次の住み分けが分かりやすいです。

- 保存時自動整列: 自分の手元で快適に保つ
- pre-commit: チーム全体で最終的に崩れないようにする

## おわりに

`cspell.txt` のような辞書ファイルは、追加のたびに機械的に整列しておくと運用コストが大きく下がります。特に複数 worktree を使う開発スタイルでは、user 設定に寄せた保存時自動化がかなり効きます。

地味な改善ではありますが、こういう小さな自動化は辞書ファイルの保守性を確実に上げてくれます。Cursor で複数 worktree を使っているなら、一度入れておく価値は高いと思います。
