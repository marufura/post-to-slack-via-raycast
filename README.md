# Post to Slack via Raycast

Raycast経由でSlackに投稿するextensionです。  
Slackを投稿するときについつい他の人の投稿を見てしまうあなたにオススメ。  
Slackを読む時間と書く時間を完全に分離します。

## Preparation

### Slack Appを作成しTokenを取得する

[この記事](https://zenn.dev/kou_pg_0131/articles/slack-api-post-message)を参考にRaycastにて使用するAppを作成し`User OAuth Token`を取得する。
ただし権限は以下のようにする。

```
chat:write
files:write
```

### 投稿したいSlackのチャンネルのIDを取得する

投稿したいSlackチャンネルの`チャンネル情報`のページの最下部にチャンネルIDが記載されているのでコピーする。

![](assets/readme-1.png)

### git clone

- 任意のフォルダで`git clone`
- raycastで`Import Extension`コマンドを実行しプロジェクトのルートディレクトリを追加
- プロジェクトのルートディレクトリに移動して `npm install && npm run build`
    - もしデバッグをしたい場合は`npm run dev`

### Raycastの初期設定を行う

raycastで`Post To Slack`と入力  
コマンドを実行しようとすると上記のtoken, チャンネルIDを設定する画面になるので入力する


# Documents

- [Raycast API](https://developers.raycast.com/api-reference/)
- [Slack API](https://api.slack.com/)
    - [postMessage API](https://api.slack.com/methods/chat.postMessage)
