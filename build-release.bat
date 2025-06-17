@echo off
echo =====================================
echo   シンプルメモ帳 - リリースビルド
echo =====================================
echo.

echo [1/4] 依存関係を確認しています...
pnpm install

echo.
echo [2/4] TypeScriptをコンパイルしています...
pnpm build

echo.
echo [3/4] Tauriアプリをビルドしています...
echo (これには数分かかる場合があります)
pnpm tauri build

echo.
echo [4/4] ビルド結果を確認しています...
if exist "src-tauri\target\release\bundle\msi\*.msi" (
    echo ✅ MSIインストーラーが作成されました
    dir "src-tauri\target\release\bundle\msi\*.msi"
)

if exist "src-tauri\target\release\bundle\nsis\*-setup.exe" (
    echo ✅ NSISインストーラーが作成されました  
    dir "src-tauri\target\release\bundle\nsis\*-setup.exe"
)

if exist "src-tauri\target\release\simple-notepad.exe" (
    echo ✅ 単体実行ファイルが作成されました
    dir "src-tauri\target\release\simple-notepad.exe"
)

echo.
echo =====================================
echo   ビルド完了！
echo =====================================
echo.
echo 📁 ファイルの場所:
echo    • インストーラー: src-tauri\target\release\bundle\
echo    • 実行ファイル: src-tauri\target\release\
echo.
pause 