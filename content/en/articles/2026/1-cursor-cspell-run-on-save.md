---
sitemap:
  loc: /en/articles/2026/1-cursor-cspell-run-on-save
  lastmod: 2026-03-10
  changefreq: monthly
  priority: 0.8
publishedAt: 2026-03-10
title: Auto-sort cspell.txt on save across multiple worktrees in Cursor
description: How to run sort -u on cspell.txt when saving in Cursor and apply it across multiple worktrees with user settings
tags:
  [
    { name: "blog" },
    { name: "cursor" },
    { name: "cspell" },
    { name: "automation" },
  ]
---

# Auto-sort `cspell.txt` on save across multiple worktrees in Cursor

## Introduction

If you keep adding words to `cspell.txt`, the file will gradually lose its ordering. Spell checking still works, so it is easy to leave it alone, but the diffs become harder to review and duplicate words become easier to miss.

That is why it is helpful to sort the dictionary automatically whenever you update it. In this article, I will show how to run `sort -u` every time `cspell.txt` is saved in Cursor, and how to make the same rule work across multiple worktrees.

## What `cspell` is

`cspell` is a spell checker designed for codebases. It looks at words appearing in comments, identifiers, Markdown, and similar text, then reports likely spelling mistakes. The official [Getting Started](https://cspell.org/docs/getting-started) and [Configuration](https://cspell.org/docs/Configuration) pages are good references if you want the overall picture.

Its configuration can live in the `cspell` field of `package.json` or in `cspell.json` style config files. In that configuration, you can either list accepted words directly in `words`, or load text files such as `cspell.txt` as custom dictionaries via the [Custom Dictionaries](https://cspell.org/docs/dictionaries/custom-dictionaries) mechanism.

In other words, `package.json` and `cspell.json` are where the configuration lives, while `cspell.txt` is the project dictionary referenced by that configuration. In many projects, valid terms such as domain language are not part of a general-purpose dictionary, so maintaining an additional dictionary quickly becomes useful.

The smallest practical setup looks something like this:

```json
{
  "name": "your-project",
  "cspell": {
    "version": "0.2",
    "dictionaryDefinitions": [
      {
        "name": "project-words",
        "path": "./cspell.txt",
        "addWords": true
      }
    ],
    "dictionaries": ["project-words"]
  }
}
```

```text
# cspell.txt
productname
worktree
```

In this example, the `cspell` configuration lives in `package.json`, and `cspell.txt` is loaded as a custom dictionary. If your project already manages a `.txt` dictionary file like this, it is usually clearer to keep project-specific words there instead of duplicating the same entries in `words`.

This article focuses on the case where a project already manages a text dictionary file such as `cspell.txt`, and explains how to keep that file automatically sorted on save.

## What I wanted

The goal itself is simple. I wanted to run the following command automatically whenever `cspell.txt` is saved.

```sh
LC_ALL=C sort -u "${file}" -o "${file}"
```

Each part has a purpose:

- `sort`: sorts lines
- `-u`: removes duplicate lines
- `-o "${file}"`: writes the result back to the same file
- `LC_ALL=C`: helps keep the ordering stable across environments

For something at this scale, you could always run this command manually, but having it run on save is much more comfortable.

## Workspace settings are fine for a single repository

If you only work on one repository, putting the rule in `.vscode/settings.json` is often enough. The setting stays local to that repository and does not affect anything else.

However, things change when you use multiple worktrees on a daily basis.

## User settings are more practical for multiple worktrees

Imagine a structure like this:

```text
/Users/you/dev/your-project/cspell.txt
/Users/you/worktrees/your-project/feature-a/cspell.txt
/Users/you/worktrees/your-project/feature-b/cspell.txt
```

In that case, it is much easier to define the rule once in Cursor user settings than to repeat the same `.vscode/settings.json` setup in every worktree. When you create a new worktree, the automation works immediately without any extra setup.

## A common VS Code setup may not work in Cursor as-is

If you search for “run command on save in VS Code,” you will often find examples using `emeraldwalk.RunOnSave`.

In my environment, however, I could not install that extension directly in Cursor. Even if an extension is common on the VS Code Marketplace, it may not always be available through Cursor in the same way.

## `pucelle.run-on-save` worked well in Cursor

I ended up using [`pucelle.run-on-save`](https://github.com/pucelle/vscode-run-on-save). Add the following settings to Cursor user settings at `~/Library/Application Support/Cursor/User/settings.json`.

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

With this setup, `sort -u` runs only when saving `cspell.txt` files under the target project.

## What the `match` pattern means

In this setup, `match` is what scopes the save hook to the files you actually want:

```text
[\\/]your-project(?:[\\/][^\\/]+)?[\\/]cspell\.txt$
```

This pattern is intended to match these two cases:

- `.../your-project/cspell.txt`
- `.../your-project/<worktree-name>/cspell.txt`

In other words, it covers both the repository root `cspell.txt` and a `cspell.txt` placed one directory deeper under a worktree path.

At the same time, it intentionally does not match much deeper directory structures. If your team uses a different layout, you can adjust the regular expression to fit it.

You could use a much broader pattern like `cspell\\.txt$`, and it would work. But then the rule might also fire for unrelated projects.

Save hooks are convenient, but broad rules can create confusing side effects later. Limiting the rule to the projects you actually want is safer.

## Setup steps

The full setup process looks like this:

1. Install [`pucelle.run-on-save`](https://github.com/pucelle/vscode-run-on-save) in Cursor
2. Add the configuration to `~/Library/Application Support/Cursor/User/settings.json`
3. Reload the window if needed with `Developer: Reload Window`
4. Add one unsorted word to `cspell.txt`
5. Save the file and confirm it gets reordered automatically

## How this differs from pre-commit hooks

This setup mainly improves local developer experience. If you want to guarantee sorted dictionaries across the whole team, you can also enforce the rule in a pre-commit hook or with `lint-staged`.

A practical split is:

- auto-sort on save: keeps your local workflow comfortable
- pre-commit enforcement: keeps the team-wide state consistent

## Conclusion

For files like `cspell.txt`, automatically sorting them whenever you add new words noticeably reduces maintenance cost. If you work with multiple worktrees, moving the rule into Cursor user settings is especially effective.

It is a small automation, but small automations like this make shared dictionary files much easier to maintain. If you use Cursor with multiple worktrees, this is a worthwhile improvement.
