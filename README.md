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

### Raycastの初期設定を行う

