# フィードバック送信設定ガイド

## GitHub Personal Access Token作成

1. GitHubにログイン
2. Settings → Developer settings → Personal access tokens → Tokens (classic)
3. "Generate new token (classic)"をクリック
4. 設定項目：
   - **Note**: `AromaWise Feedback`
   - **Expiration**: `No expiration` または `1 year`
   - **Scopes**: `public_repo` にチェック

5. トークンをコピー（一度しか表示されません）

## Vercel環境変数設定

1. Vercelダッシュボード → aromawise-app → Settings → Environment Variables
2. 以下の変数を追加：

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=Fumiyasu01/aromawise-app
```

## 自動再デプロイ

環境変数設定後、Vercelが自動で再デプロイします。

## テスト方法

1. アプリでフィードバック送信
2. GitHubリポジトリのIssuesタブを確認
3. 新しいIssueが作成されているか確認

## フィードバックIssue例

```
タイトル: [フィードバック] 使いやすさ - 5⭐

本文:
## フィードバック詳細

**評価**: 5/5 ⭐
**カテゴリ**: 使いやすさ
**日時**: 2024-06-14 15:30:25

## コメント
とても使いやすいアプリです！オイルの検索機能が便利で、
推奨システムも的確です。ありがとうございます。

## 技術情報
- **URL**: https://aromawise-app.vercel.app/
- **ブラウザ**: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)
- **タイムスタンプ**: 2024-06-14T06:30:25.123Z

---
*このフィードバックはAromaWiseアプリから自動送信されました*
```

## ラベル自動設定

以下のラベルが自動で付与されます：
- `feedback` (すべてのフィードバック)
- `general` / `usability` / `content` / `features` / `bug` / `suggestion`

## 管理方法

1. **新しいフィードバック確認**: Issues → フィルタ `is:open label:feedback`
2. **優先度設定**: ラベルで `priority-high`, `priority-medium`, `priority-low`
3. **対応完了**: Issueをクローズ
4. **返信**: Issue内でコメント（ユーザーには届きませんが記録として）