# Post to Slack via Raycast

Raycast経由でSlackに投稿するextensionです。  
Slackを投稿するときについつい他の人の投稿を見てしまうあなたにオススメ。  
Slackを読む時間と書く時間を完全に分離します。

## Preparation

### Slack Appを作成しTokenを取得する

[この記事](https://zenn.dev/kou_pg_0131/articles/slack-api-post-message)を参考にRaycastにて使用するAppを作成し`User OAuth Token`を取得する。

### 投稿したいSlackのチャンネルのIDを取得する

投稿したいSlackチャンネルの`チャンネル情報`のページの最下部にチャンネルIDが記載されているのでコピーする。

![](assets/readme-1.png)

### git clone

任意のフォルダで`git clone`してプロジェクトのルートディレクトリに移動し`npm install && npm run build`をする  
もしデバッグをしたい場合は`npm run dev`

### Raycastの初期設定を行う

上記のtoken, チャンネルIDを入力する

# Issues
よく分からない問題があるので解決してくれる人募集中です！

- Hotkey割り当てがうまくいかない
- 投稿後にウィンドウが閉じない
- argumentsの挙動が微妙

# Documents

- [Raycast API](https://developers.raycast.com/api-reference/)
- [Slack API](https://api.slack.com/)
    - [今回使っているメッセージ投稿のAPI](https://api.slack.com/methods/chat.postMessage)