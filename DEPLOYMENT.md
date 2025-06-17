# 📦 デプロイメントガイド

このプロジェクトは**単一リポジトリで2つの展開**を実現します：

## 🌐 Web体験版（GitHub Pages）

### 自動デプロイ設定

1. **GitHub Pages を有効化**
   ```
   リポジトリ設定 → Pages → Source → GitHub Actions
   ```

2. **workflow permissions 設定**
   ```
   リポジトリ設定 → Actions → General → Workflow permissions
   ☑️ Read and write permissions
   ☑️ Allow GitHub Actions to create and approve pull requests
   ```

3. **自動デプロイ**
   ```bash
   git push origin main  # → 自動的にGitHub Pagesにデプロイ
   ```

### 手動デプロイ
```bash
# Web版ビルド
pnpm build:web

# dist-web フォルダの内容をGitHub Pagesにアップロード
```

### アクセスURL
```
https://your-username.github.io/memo/
```

## 🖥️ デスクトップ版（GitHub Releases）

### 自動ビルド設定

1. **リリースタグをpush**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **自動ビルド実行**
   - Windows (.msi)
   - macOS (.dmg) 
   - Linux (.deb)

3. **GitHub Releases に自動アップロード**

### 手動ビルド
```bash
# デスクトップ版ビルド
pnpm build:tauri

# src-tauri/target/release/bundle/ に生成
```

## 🔧 設定カスタマイズ

### Web版のベースパス変更
```typescript
// vite.config.ts
base: '/your-repo-name/',  // GitHub Pages用
```

### リリースURL更新
```html
<!-- index.html -->
<a href="https://github.com/your-username/your-repo/releases">
```

## 🎯 マーケティング戦略

```
体験の流れ:
1. 📱 Web版で機能を体験
2. 🔽 制限を感じてダウンロード検討  
3. 🖥️ デスクトップ版で完全な機能を利用
```

## 🚨 トラブルシューティング

### GitHub Pages デプロイエラー
```bash
# Pages権限確認
Settings → Pages → Build and deployment → Source = GitHub Actions

# workflow権限確認  
Settings → Actions → General → Workflow permissions = Read/Write
```

### デスクトップビルドエラー
```bash
# Rust依存関係確認
rustup update

# プラットフォーム別依存関係
# Ubuntu: libgtk-3-dev libwebkit2gtk-4.0-dev
# macOS: Xcode Command Line Tools  
# Windows: Visual Studio Build Tools
```

## 📊 Analytics追加（オプション）

Web版にGoogleAnalyticsを追加する場合：

```html
<!-- index.html（Web版のみ） -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  if (!window.__TAURI__) {  // Web版のみ
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_TRACKING_ID');
  }
</script>
``` 