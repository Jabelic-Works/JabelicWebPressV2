---
sitemap:
  loc: /en/articles/2026/2-karabiner-lazy-cmd-shift-bracket
  lastmod: 2026-09-18
  changefreq: monthly
  priority: 0.8
publishedAt: 2026-09-18
title: "Fix Cmd+Shift+[ not working with Karabiner-Elements lazy modifiers"
description: How a tap-to-switch-input-source Command rule blocked Cmd+Shift+[, how to diagnose it, and how Karabiner-Elements lazy modifiers fixed it
tags:
  [
    { name: "blog" },
    { name: "karabiner-elements" },
    { name: "macos" },
    { name: "keyboard" },
  ]
---

# Fix `Cmd+Shift+[` not working with Karabiner-Elements lazy modifiers

## Introduction

On macOS, `Cmd+Shift+]` moved to the next tab in Orca and VS Code, but `Cmd+Shift+[` did nothing when moving to the previous tab.

I was using a US keyboard. `Shift + [` correctly typed `{`, and Karabiner-EventViewer showed all three events: Command, Shift, and `open_bracket`. The applications still did not respond.

The cause was a Karabiner-Elements rule that switched to Eisu or Kana when I tapped the left or right Command key. It emitted Command immediately, which interfered with the later `Cmd+Shift+[` rule. Adding `"lazy": true` to the Command output fixed the shortcut while preserving the tap behavior.

This article explains how I isolated the cause and shows the final configuration.

## Symptoms

The behavior looked like this:

- `Cmd+Shift+]` worked in Orca, but `Cmd+Shift+[` did not
- VS Code failed in the same direction
- `Shift + [` still typed `{`
- Both left and right Command and Shift combinations failed
- Karabiner-EventViewer recognized `command + shift + open_bracket`

Because the same shortcut failed in multiple applications, I looked at macOS and Karabiner-Elements before blaming either application's keybindings.

## What I checked first

### Whether the physical keys were recognized

Karabiner-EventViewer showed the events in the expected order:

```text
right_command down
right_shift down
open_bracket down
open_bracket up
right_command up
right_shift up
```

The `open_bracket` event was present, so this was not a broken key or a US/JIS layout mismatch.

### Whether macOS owned the shortcut

Disabling relevant macOS shortcuts and quitting background utilities did not change the behavior. I also registered `Cmd+Shift+[` temporarily with Carbon's `RegisterEventHotKey`, and the probe received it.

That showed that macOS could deliver the chord and that another global shortcut did not own it.

### What happened without the Karabiner rule

The conversion started working when I temporarily removed this tap-to-Eisu/Kana rule:

```json
{
  "from": {
    "key_code": "left_command",
    "modifiers": { "optional": ["any"] }
  },
  "to": [{ "key_code": "left_command" }],
  "to_if_alone": [{ "key_code": "japanese_eisuu" }],
  "type": "basic"
}
```

This rule broadly captures Command itself and immediately emits Command through `to`. It was interfering with recognition of the later `Cmd+Shift+[` rule.

## What a `lazy` modifier does

According to the official Karabiner-Elements documentation for [`to.lazy`](https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/to/lazy/), a lazy modifier does not send its own key event until another key is pressed with it.

[`to_if_alone`](https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/to-if-alone/) sends an event when the source key is pressed and released by itself. The official documentation recommends combining it with `lazy` when one key must act both as a modifier and as a tap action.

I needed these behaviors:

- Tap left Command: send Eisu
- Tap right Command: send Kana
- Hold Command and press another key: behave as a normal Command modifier
- Press `Cmd+Shift+[` together: convert it to another shortcut for the previous tab

That is exactly the use case for `lazy` and `to_if_alone`.

## Making the Command tap rules lazy

Add `"lazy": true` to the left Command output:

```json
{
  "description": "Left Command: Command / Eisu when tapped",
  "type": "basic",
  "from": {
    "key_code": "left_command",
    "modifiers": { "optional": ["any"] }
  },
  "to": [
    {
      "key_code": "left_command",
      "lazy": true
    }
  ],
  "to_if_alone": [{ "key_code": "japanese_eisuu" }]
}
```

Do the same for right Command:

```json
{
  "description": "Right Command: Command / Kana when tapped",
  "type": "basic",
  "from": {
    "key_code": "right_command",
    "modifiers": { "optional": ["any"] }
  },
  "to": [
    {
      "key_code": "right_command",
      "lazy": true
    }
  ],
  "to_if_alone": [{ "key_code": "japanese_kana" }]
}
```

Command now continues to send Eisu or Kana when tapped, but it is emitted as a modifier only when another key joins the chord.

## Converting `Cmd+Shift+[` to a key the applications can receive

Passing the original chord through unchanged still did not solve the problem in this environment, so I converted it to `Control + F18` with Karabiner-Elements.

```json
{
  "description": "Cmd+Shift+[ to Control+F18 in Orca and VS Code",
  "type": "basic",
  "from": {
    "key_code": "open_bracket",
    "modifiers": {
      "mandatory": ["command", "shift"],
      "optional": ["any"]
    }
  },
  "to": [
    {
      "key_code": "f18",
      "modifiers": ["left_control"]
    }
  ],
  "conditions": [
    {
      "type": "frontmost_application_if",
      "bundle_identifiers": [
        "^com\\.stablyai\\.orca$",
        "^com\\.microsoft\\.VSCode$"
      ]
    }
  ]
}
```

Karabiner-Elements documents `command` and `shift` in `from.modifiers` as matching either the left or right modifier. See the official [`from.modifiers` reference](https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/from/modifiers/) for the full list.

Place this conversion rule before the Command tap rules. The `frontmost_application_if` condition limits the workaround to Orca and VS Code, leaving `Cmd+Shift+[` unchanged in other applications.

## Configuring Orca

I assigned `Control + F18` to the previous-tab action in `~/.orca/keybindings.json`:

```json
{
  "version": 1,
  "keybindings": {},
  "platforms": {
    "darwin": {
      "tab.previousAllTypes": ["Ctrl+F18"]
    },
    "linux": {},
    "win32": {}
  }
}
```

I first tried bare `F18`, but Orca rejected it with `Include at least one modifier key.` That is why the intermediary shortcut is `Control + F18`.

After editing the file, use “Settings → Shortcuts → Keybindings file menu → Reload from disk” in Orca. The settings page should show `Modified 1` and `Conflicts 0`.

## Configuring VS Code

Add the same intermediary shortcut to VS Code's `keybindings.json`:

```json
{
  "key": "ctrl+f18",
  "command": "workbench.action.previousEditor"
}
```

The physical shortcut remains `Cmd+Shift+[`. Karabiner-Elements sends `Control + F18` to the application, and the application moves to the previous tab.

## A useful debugging order

For similar shortcut problems, this order narrows the cause quickly:

1. Confirm that the base character can be typed
2. Inspect the physical input in Karabiner-EventViewer
3. Check whether the failure occurs in multiple applications
4. Check for macOS global shortcut conflicts
5. Disable Karabiner Complex Modifications one at a time
6. Check whether modifier rules using `to_if_alone` also use `lazy`
7. Test the Karabiner output shortcut separately from the application's binding

Seeing the original chord in EventViewer does not guarantee that the event emerging from all Complex Modifications is what the application expects. Treat physical input, Karabiner transformation, and application keybinding as three separate stages.

## Conclusion

Because only `Cmd+Shift+[` failed, keyboard layout and macOS-reserved shortcuts looked like the obvious suspects. The actual cause was a familiar quality-of-life rule: tapping Command to switch between Eisu and Kana affected another Command shortcut.

When a modifier has a second role through `to_if_alone`, making its `to` output lazy lets the tap action and key combinations coexist cleanly. If one Command shortcut fails across multiple applications, inspect the modifier rules in Karabiner-Elements as well as the application settings.
