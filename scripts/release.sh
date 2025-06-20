#!/bin/bash

# 🚀 自動リリーススクリプト
# 使用方法: ./scripts/release.sh 1.3.6

set -e  # エラー時に停止

# 引数チェック
if [ $# -ne 1 ]; then
  echo "❌ 使用方法: $0 <version>"
  echo "   例: $0 1.3.6"
  exit 1
fi

VERSION=$1
TAG="v$VERSION"

echo "🚀 自動リリースプロセス開始"
echo "📋 バージョン: $VERSION"
echo "🏷️ タグ: $TAG"
echo

# 1. 作業ディレクトリの確認
if [ ! -f "package.json" ]; then
  echo "❌ package.jsonが見つかりません。プロジェクトルートで実行してください。"
  exit 1
fi

# 2. ブランチ確認
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "⚠️  現在のブランチ: $CURRENT_BRANCH"
  echo "   mainブランチで実行することを推奨します。"
  read -p "続行しますか? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "🛑 中止されました"
    exit 1
  fi
fi

# 3. 未コミットの変更確認
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  未コミットの変更があります:"
  git status --short
  read -p "続行しますか? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "🛑 中止されました"
    exit 1
  fi
fi

# 4. タグの重複確認
if git tag -l | grep -q "^$TAG$"; then
  echo "❌ タグ $TAG は既に存在します"
  echo "   既存のタグ:"
  git tag -l | grep -E "^v[0-9]+\.[0-9]+\.[0-9]+$" | tail -5
  exit 1
fi

# 5. リモートから最新情報を取得
echo "📡 リモートから最新情報を取得中..."
git fetch origin

# 6. mainブランチが最新か確認（mainブランチの場合のみ）
if [ "$CURRENT_BRANCH" = "main" ]; then
  LOCAL_COMMIT=$(git rev-parse HEAD)
  REMOTE_COMMIT=$(git rev-parse origin/main)
  
  if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
    echo "⚠️  ローカルのmainブランチがリモートと異なります"
    echo "   git pull origin main を実行してください"
    exit 1
  fi
fi

echo "✅ 事前チェック完了"
echo

# 7. package.jsonとtauri.conf.jsonを手動更新
echo "📝 設定ファイルを更新中..."

# package.json更新
if [ -f "package.json" ]; then
  sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" package.json
  echo "   ✅ package.json → $VERSION"
fi

# tauri.conf.json更新
if [ -f "src-tauri/tauri.conf.json" ]; then
  sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" src-tauri/tauri.conf.json
  echo "   ✅ tauri.conf.json → $VERSION"
fi

# バックアップファイルを削除
rm -f package.json.bak src-tauri/tauri.conf.json.bak

# 8. 変更をコミット
echo
echo "📦 変更をコミット中..."
git add package.json src-tauri/tauri.conf.json
git commit -m "🔖 Bump version to $VERSION

Prepare for release $TAG with automated version management.

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

echo "   ✅ コミット完了"

# 9. Generate release notes and create tag
echo
echo "📝 Generating release notes..."

# Generate release notes for tag message
if [ -f "scripts/generate-release-notes.js" ]; then
  RELEASE_SUMMARY=$(node scripts/generate-release-notes.js "$TAG" json 2>/dev/null | head -3 | tr '\n' ' ' || echo "Automated release notes generation")
else
  RELEASE_SUMMARY="Automated version management release"
fi

echo "🏷️ Creating tag..."
git tag -a "$TAG" -m "Release $TAG

$RELEASE_SUMMARY

Detailed changelog will be auto-generated on the GitHub release page."

echo "   ✅ タグ $TAG 作成完了"

# 10. プッシュ確認
echo
echo "🚀 以下の内容をプッシュします:"
echo "   📦 コミット: バージョン$VERSIONへの更新"
echo "   🏷️ タグ: $TAG"
echo
read -p "プッシュを実行しますか? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "📡 プッシュ中..."
  git push origin "$CURRENT_BRANCH"
  git push origin "$TAG"
  
  echo
  echo "🎉 リリースプロセス完了！"
  echo
  echo "📋 次のステップ:"
  echo "   1. GitHub Actions の進行状況を確認"
  echo "      https://github.com/takuto-NA/simple-notepad/actions"
  echo "   2. リリースが完成したら確認"
  echo "      https://github.com/takuto-NA/simple-notepad/releases/tag/$TAG"
  echo "   3. latest.json の動作確認"
  echo "      https://github.com/takuto-NA/simple-notepad/releases/latest/download/latest.json"
  echo
else
  echo "🛑 プッシュをキャンセルしました"
  echo "   手動でプッシュするには:"
  echo "   git push origin $CURRENT_BRANCH"
  echo "   git push origin $TAG"
fi