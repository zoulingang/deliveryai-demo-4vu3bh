[English](./README.md) | [简体中文](./README.zh-CN.md) | **日本語** | [Español](./README.md#espanol)

# 沸点火鍋 注文デモ

火鍋レストラン向けのモバイル注文デモです。テーブル登録、グループ注文、料理の進捗確認、会計までの流れを体験できます。

> 本プロジェクトはコンセプトデモであり、正式な製品ではありません。

## 機能

- テーブル登録
- カテゴリ別のメニュー閲覧と検索
- 料理オプション：規格、辛さ、注文者（「激辛」スープは確認ダイアログあり）
- グループ注文用の共有カート
- 調理・配膳の進捗表示
- サービス呼び出し：スープ追加、ドリンク、食器、会計
- デモコンソール：売り切れ、サービス応答、注文ステータスをシミュレーション
- 会計・支払い完了のシミュレーション
- 中国語 / 英語
- シニアモード（大きな文字）
- ライト・ダーク・システム連動テーマ
- 6 通貨表示（CNY、USD、EUR、JPY、HKD、TWD）、CNY 基準価格を固定レートで換算

テーマ、通貨、シニアモードの設定は `localStorage` に保存されます。

## 技術スタック

React 18、TypeScript、Vite、Tailwind CSS、Radix UI、i18next、Playwright、Express（デモサーバー）

## 動作環境

- Node.js 18 以上（CI は 20 を使用）
- npm 9 以上

## はじめに

```bash
npm install
npm run dev
```

`http://localhost:5173` で起動します（ポートが使用中の場合、Vite が別のポートを選びます）。

## コマンド

```bash
npm run dev          # 開発サーバー
npm run lint         # Lint
npm run build        # 型チェックと dist/ へのビルド
npx playwright test  # E2E テスト（開発サーバーを自動起動）
```

Playwright は `/opt/chromium.org/chromium/chrome` の Chromium を使用します。`PLAYWRIGHT_CHROMIUM_PATH` で変更できます。

## デモサーバー

`server/` はポート 3001 で `GET /ping` を提供する最小構成の Express アプリです。

```bash
cd server && npm install && npm run dev
```

## プレビューモード

テーブル登録済み・カートに 1 品入った状態でメニューを直接開きます：

```text
http://localhost:5173/?preview=menu
```

## デプロイ

`main` へのプッシュで `.github/workflows/deploy-pages.yml` が `dist/` をビルドし、GitHub Pages にデプロイします。`base: './'` のため任意のサブパスで動作します。

## Docker でのデプロイ

`Dockerfile` は Node 20 でサイトをビルドし、nginx で `dist/` をポート 80 から配信します。`nginx.conf` は未知のパスを `index.html` にフォールバックし、`/assets/` 配下のハッシュ付きファイルを 1 年間キャッシュします。

```bash
docker build -t feidian-hotpot .
docker run -d --name feidian-hotpot -p 8080:80 feidian-hotpot
```

起動後 `http://localhost:8080` を開きます。停止と削除は `docker rm -f feidian-hotpot` です。

イメージにはフロントエンドのみが含まれ、`server/` のデモサーバーは含まれません。

## プロジェクト構成

```text
.
├── .github/workflows/  # GitHub Pages デプロイ
├── docs/specs/         # 要件メモ
├── e2e/                # Playwright テスト
├── openspec/           # OpenSpec 提案と仕様
├── server/             # Express デモサーバー
├── src/
│   ├── assets/         # 画像
│   ├── components/     # 画面と UI コンポーネント
│   ├── data/           # メニューデータ
│   ├── hooks/          # テーマ、通貨、シニアモード
│   ├── lib/            # ユーティリティ、通貨フォーマット
│   ├── state/          # 注文状態
│   ├── App.tsx         # ルートコンポーネント
│   ├── i18n.ts         # 中国語 / 英語の文言
│   └── index.css       # グローバルスタイル
├── Dockerfile          # コンテナイメージのビルド
├── index.html
├── nginx.conf          # イメージ用の nginx 設定
├── playwright.config.ts
├── tailwind.config.js
└── vite.config.ts
```
