# シンプルメモ帳

Tauri + TypeScript + Tailwind CSSで作成された真にシンプルなメモ帳アプリです。

## 📱 体験版をお試し

**[Web体験版を今すぐ試す](https://takuto-na.github.io/simple-notepad/)** （ブラウザで即座に利用可能）

- ✅ テキスト編集の全機能を体験
- ⚠️ ファイル保存は「ダウンロード」として動作
- 📥 気に入ったらデスクトップ版をダウンロード

## 設計理念

- **単一性**: １つのウィンドウに１つのメモのみ
- **最小限UI**: 書く領域を最大化し、UIは最小限に
- **実用性重視**: 装飾より実用的な機能を優先

## 機能

### ✅ ファイル操作
- 新規作成（Ctrl+N）
- ファイルを開く（Ctrl+O）
- 保存（Ctrl+S）
- 名前を付けて保存（Ctrl+Shift+S）
- ドラッグ&ドロップでファイル読み込み

### ✅ 編集機能
- 元に戻す/やり直し（Ctrl+Z、Ctrl+Y）
- タブ挿入とShift+Tabでのタブ削除
- 文字検索（Ctrl+F）
- 文字置換（Ctrl+H）

### ✅ 表示機能
- 行番号表示の切り替え
- 文字サイズ変更（12px-20px）
- ワードラップの切り替え
- 詳細なステータスバー（行/列位置、文字数、文字コード）

### ✅ ユーザビリティ
- 手動ダークモード切り替え（Ctrl+D）
- 豊富なキーボードショートカット
- 未保存変更の保護
- 文字コード・改行コード選択

## キーボードショートカット

| 機能 | ショートカット |
|------|-------------|
| 新規作成 | `Ctrl+N` |
| ファイルを開く | `Ctrl+O` |
| 保存 | `Ctrl+S` |
| 名前を付けて保存 | `Ctrl+Shift+S` |
| 元に戻す | `Ctrl+Z` |
| やり直し | `Ctrl+Y` |
| 検索 | `Ctrl+F` |
| 置換 | `Ctrl+H` |
| ダークモード切り替え | `Ctrl+D` |
| 検索バーを閉じる | `Escape` |

## 除外した機能

- ❌ 複数メモの管理機能
- ❌ タブ機能  
- ❌ 自動保存
- ❌ クラウド同期
- ❌ リッチテキスト編集

## 開発環境のセットアップ

### 🖥️ PC/Mac環境

#### 必要な環境

- Node.js (18.0以上)
- Rust (最新版)
- pnpm

#### インストール方法

```bash
# 依存関係のインストール
pnpm install

# 🌐 Web版開発（体験版）
pnpm dev                # Web版開発サーバー
pnpm build:web          # Web版ビルド
pnpm preview:web        # Web版プレビュー

# 🖥️ デスクトップ版開発
pnpm dev:tauri          # Tauriアプリ開発
pnpm build:tauri        # デスクトップアプリビルド
```

### 🍓 Raspberry Pi環境

#### システム要件

- **推奨**: Raspberry Pi 4 (4GB RAM以上)
- **OS**: Raspberry Pi OS Bullseye以降
- **ストレージ**: 2GB以上の空き容量

#### セットアップ手順

```bash
# 1. システムアップデート
sudo apt update && sudo apt upgrade -y

# 2. Node.js 18のインストール
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Rustのインストール
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# 4. 必要な依存関係のインストール
sudo apt install -y libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

# 5. pnpmのインストール
npm install -g pnpm

# 6. プロジェクトの準備
cd scripts/GUI/tauri/memo
pnpm install

# 7. ラズパイ用設定（メモリ使用量削減）
export NODE_OPTIONS="--max_old_space_size=1024"

# 8. 開発サーバー起動（軽量モード）
pnpm tauri dev

# 9. 本番ビルド（時間がかかります）
pnpm tauri build --target armv7-unknown-linux-gnueabihf
```

#### ラズパイ向け最適化設定

```bash
# メモリ最適化のため、以下を ~/.bashrc に追加
echo 'export NODE_OPTIONS="--max_old_space_size=1024"' >> ~/.bashrc
echo 'export CARGO_BUILD_JOBS=1' >> ~/.bashrc  # シングルコアビルド
source ~/.bashrc
```

#### パフォーマンス改善Tips

1. **SSD使用**: microSDより高速なUSB SSDを使用
2. **冷却**: 長時間作業時はファンを推奨
3. **メモリ**: 4GB以上のモデルを推奨
4. **軽量ブラウザ**: Chromiumより軽量なブラウザエンジン使用

## 技術スタック

- **フロントエンド**: TypeScript, HTML, CSS
- **UIフレームワーク**: Tailwind CSS
- **デスクトップフレームワーク**: Tauri
- **バックエンド**: Rust
- **データ保存**: 明示的ファイル保存のみ

## プラットフォーム対応

| プラットフォーム | 対応状況 | 備考 |
|-----------------|----------|------|
| Windows | ✅ 完全対応 | |
| macOS | ✅ 完全対応 | |
| Linux (x64) | ✅ 完全対応 | |
| **Raspberry Pi** | ✅ 対応 | Pi 3以降推奨 |
| ARM64 Linux | ✅ 対応 | |

## ファイル構成

```
├── src/
│   ├── main.ts          # メインのTypeScriptファイル
│   └── styles.css       # Tailwind CSS + カスタムスタイル
├── index.html           # メインHTMLファイル
├── src-tauri/           # Tauriのバックエンド（Rust）
├── package.json         # Node.jsの依存関係
├── tailwind.config.js   # Tailwind CSSの設定
└── .gitignore          # Git無視ファイル設定
```

## データの保存について

- **基本方針**: 明示的な保存のみ（自動保存なし）
- **緊急時**: アプリクラッシュ時のみ一時保存
- **起動時**: 空の新規ドキュメントで開始
- **終了時**: 未保存の変更があれば確認ダイアログ

## 自動ビルドとデプロイ

### 🚀 GitHub Actions による自動化

```bash
# mainブランチにpushすると自動実行
git push origin main

# → Web版が GitHub Pages に自動デプロイ
# → https://takuto-na.github.io/simple-notepad/

# リリースタグをpushすると自動実行  
git tag v1.0.0
git push origin v1.0.0

# → デスクトップ版が3プラットフォーム分ビルド
# → GitHub Releases にアップロード
```

### 🛠️ 手動ビルド

```bash
# Web版（体験版）
pnpm build:web          # → dist-web/ に生成

# デスクトップ版
pnpm build:tauri        # → src-tauri/target/release/bundle/ に生成
```

### Raspberry Pi

```bash
# ARM64向けビルド（Pi 4推奨）
pnpm tauri build --target aarch64-unknown-linux-gnu

# ARM32向けビルド（Pi 3対応）
pnpm tauri build --target armv7-unknown-linux-gnueabihf
```

ビルドされたアプリケーションは `src-tauri/target/release/bundle/` に生成されます。

## トラブルシューティング

### Raspberry Pi での問題

**メモリ不足エラー:**
```bash
export NODE_OPTIONS="--max_old_space_size=1024"
export CARGO_BUILD_JOBS=1
```

**WebView起動エラー:**
```bash
sudo apt install gstreamer1.0-plugins-bad-videoparsers
```

**ビルド時間の短縮:**
- SSDの使用
- `CARGO_BUILD_JOBS=1` でシングルコアビルド

## UI設計原則

- **最大編集領域**: 画面の90%以上をテキスト編集に使用
- **非侵入的メニュー**: 必要時のみ表示されるコンパクトなメニュー
- **キーボード優先**: 全機能をキーボードで操作可能
- **視覚的静寂**: 不要な色、アニメーション、装飾の排除
