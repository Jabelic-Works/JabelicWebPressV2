---
sitemap:
  loc: /ja/articles/2026/2-karabiner-lazy-cmd-shift-bracket
  lastmod: 2026-09-19
  changefreq: monthly
  priority: 0.8
publishedAt: 2026-09-18
title: "Karabiner-Elementsで⌘⇧[だけ効かない問題をlazy修飾キーで直す"
description: Command単押しで英数・かなを切り替えるKarabiner設定と⌘⇧[が競合したときの切り分け方と、lazy修飾キーを使った解決方法
tags:
  [
    { name: "blog" },
    { name: "karabiner-elements" },
    { name: "macos" },
    { name: "keyboard" },
  ]
---

# Karabiner-Elementsで`⌘⇧[`だけ効かない問題をlazy修飾キーで直す

## はじめに

macOS上のOrcaとVS Codeで、次のタブへ進む`⌘⇧]`は動くのに、前のタブへ戻る`⌘⇧[`だけが反応しなくなりました。

キーボードはUS配列です。`Shift + [`で`{`は入力でき、Karabiner-EventViewerにもCommand、Shift、`open_bracket`の3イベントが正しく表示されます。それでもアプリでは何も起きませんでした。

原因は、左右のCommandキーを単独で押したときに英数・かなへ切り替えるKarabiner-Elementsのルールでした。Commandを通常の修飾キーとして即時出力していたため、後続の`⌘⇧[`用ルールと干渉していました。Commandの出力に`"lazy": true`を付けることで、英数・かなの単押し操作を残したまま解決できました。

この記事では、原因を特定した手順と最終的な設定をまとめます。

## 症状

発生していた症状は次の通りです。

- Orcaで`⌘⇧]`は動くが、`⌘⇧[`は動かない
- VS Codeでも同じ方向だけ動かない
- `Shift + [`による`{`の入力はできる
- 左右どちらのCommandとShiftを使っても再現する
- Karabiner-EventViewerは`command + shift + open_bracket`を認識する

複数のアプリで同じ現象が起きたため、各アプリのキーバインドより手前にあるmacOSまたはKarabiner-Elementsを疑いました。

## 最初に確認したこと

### 物理キーは認識されているか

Karabiner-EventViewerでは、実際に次の順序でイベントが届いていました。

```text
right_command down
right_shift down
open_bracket down
open_bracket up
right_command up
right_shift up
```

`open_bracket`が欠けているわけではないため、キーボードの故障やUS/JIS配列の取り違えではありません。

### macOSがショートカットを奪っていないか

macOSのシステムショートカットや常駐アプリを止めても変化はありませんでした。さらに、macOSのCarbon APIにある`RegisterEventHotKey`で`⌘⇧[`を一時登録するとイベントを受信できました。

ここでいうCarbonは、AppleがmacOS向けに提供してきたC API群のことです。`RegisterEventHotKey`はCarbon Event ManagerのAPIで、キーコードと修飾キーをグローバルホットキーとして登録し、押されたときに`kEventHotKeyPressed`イベントを受け取れます。今回はアプリを実装するためではなく、macOSのイベント配送を切り分ける小さな診断プログラムとして使いました。

実際の確認コードは、概ね次のようなものです。US配列の`[`に対応するキーコード33と、Command、Shiftを登録してイベントを1回待ちます。

```c
#include <Carbon/Carbon.h>

EventHotKeyRef hotKey = NULL;
EventHotKeyID id = { 'TEST', 1 };
EventTypeSpec type = { kEventClassKeyboard, kEventHotKeyPressed };

OSStatus status = RegisterEventHotKey(
    33,
    cmdKey | shiftKey,
    id,
    GetApplicationEventTarget(),
    0,
    &hotKey
);

EventRef event = NULL;
OSStatus received = ReceiveNextEvent(1, &type, 30.0, true, &event);
```

`RegisterEventHotKey`が`noErr`を返し、`ReceiveNextEvent`でもイベントを受信できたため、macOSは`⌘⇧[`を認識してテストプロセスへ配送できると確認できました。ただし、この結果だけで他のアプリが同じ組み合わせを使っていないと断定したり、Karabinerによる変換後のイベントまで正しいと証明したりはできません。物理キーとmacOSの配送経路は動いている、という範囲の確認です。

Carbonは現在のmacOSアプリ開発で中心となるAPIではありません。Appleも新しいアプリでは[Carbon APIからAppKitやFoundationなどへ移行する](https://developer.apple.com/documentation/Apple-Silicon/porting-your-macos-apps-to-apple-silicon)よう案内しています。今回は数十行の使い捨て診断プログラムで特定のホットキーを確認できるため、このAPIを利用しました。

### Karabinerのルールを外すとどうなるか

次の「Command単押しで英数・かな」ルールを一時的に外すと、`⌘⇧[`から別キーへの変換が動きました。

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

`from`がCommandそのものを広く受け取り、`to`がCommandを即座に出力する構成です。このルールが`⌘⇧[`の認識を妨げていました。

## `lazy`修飾キーとは

Karabiner-Elementsの[`to.lazy`公式ドキュメント](https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/to/lazy/)によると、`lazy`を付けた修飾キーは、別のキーが一緒に押されるまで自身のキーイベントを送信しません。

また、[`to_if_alone`](https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/to-if-alone/)は、対象キーが単独で押されて離されたときにイベントを送ります。公式ドキュメントでも、修飾キーの単押しとキーコンビネーションを両立させる用途で`lazy`との組み合わせが紹介されています。

今回必要だった動きは次の通りです。

- 左Commandだけを押して離す: 英数キーを送る
- 右Commandだけを押して離す: かなキーを送る
- Commandを押しながら別のキーを押す: 通常のCommand修飾キーとして扱う
- `⌘⇧[`を押す: 前のタブ用の別ショートカットへ変換する

これは`lazy`と`to_if_alone`の用途に一致します。

## Command単押しルールを`lazy`化する

左Commandの`to`に`"lazy": true`を追加します。

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

右Command側も同様です。

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

これにより、Command単押しでは従来通り英数・かなが送られ、他のキーと組み合わせたときだけCommandが修飾キーとして出力されます。

## `⌘⇧[`をアプリが受け取れるキーへ変換する

今回の環境では、元の`⌘⇧[`を直接アプリへ渡すだけでは改善しなかったため、Karabiner-Elementsで`Control + F18`へ変換しました。

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

Karabiner-Elementsでは、`from.modifiers`の`command`と`shift`はそれぞれ左右どちらの修飾キーにも一致します。詳しい仕様は[`from.modifiers`の公式ドキュメント](https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/from/modifiers/)で確認できます。

この変換ルールは、Command単押しルールより前に配置します。また、`frontmost_application_if`でOrcaとVS Codeだけに限定し、他のアプリの`⌘⇧[`には影響させません。

## Orca側の設定

Orcaの`~/.orca/keybindings.json`では、前のタブを`Control + F18`へ割り当てました。

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

最初は`F18`単体を割り当てましたが、Orcaは修飾キーのないショートカットを受け付けず、`Include at least one modifier key.`と表示しました。そのため、中継キーを`Control + F18`にしています。

ファイルを編集した後は、Orcaの「設定 → ショートカット → キーバインドファイルメニュー → ディスクから再読み込み」を実行します。設定画面で`Modified 1`、`Conflicts 0`になれば読み込みは成功です。

## VS Code側の設定

VS Codeの`keybindings.json`にも同じ中継キーを登録します。

```json
{
  "key": "ctrl+f18",
  "command": "workbench.action.previousEditor"
}
```

これで、物理キーボードでは今まで通り`⌘⇧[`を押しつつ、アプリには`Control + F18`が届き、前のタブへ移動します。

## 切り分けで役立った順序

今回のような問題では、次の順序で確認すると原因を絞りやすくなります。

1. 文字単体を入力できるか確認する
2. Karabiner-EventViewerで物理キーの入力を確認する
3. 複数アプリで再現するか確認する
4. macOSがそのキーをグローバルホットキーとして配送できるか確認する
5. KarabinerのComplex Modificationsを一つずつ外す
6. `to_if_alone`を持つ修飾キールールに`lazy`があるか確認する
7. Karabinerの出力キーとアプリ側の受信キーを分けて検証する

EventViewerに元のキーが見えているだけでは、すべてのComplex Modificationsを通過した後のイベントが期待通りとは限りません。入力、Karabinerによる変換、アプリのキーバインドという3段階に分けることが重要でした。

## おわりに

`⌘⇧[`だけが効かないため、最初はキーボード配列やmacOSの予約ショートカットを疑いました。しかし実際には、日常的に使っていたCommand単押しの英数・かな切り替えルールが、別のCommandショートカットへ影響していました。

`to_if_alone`で修飾キーに別の役割を持たせている場合、`to`側を`lazy`修飾キーにすることで単押しとキーコンビネーションをきれいに両立できます。特定のCommandショートカットだけが複数アプリで反応しないときは、アプリの設定だけでなく、Karabiner-Elementsの修飾キールールも確認してみてください。
