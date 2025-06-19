// 組織管理・自動更新システム（Tauri v2専用）
// 署名付き・完全自動・組織による民主的管理

// 動的インポートで環境判定
declare const __IS_WEB_BUILD__: boolean;
const IS_TAURI = typeof window !== 'undefined' && 
                 '__TAURI__' in window && 
                 !__IS_WEB_BUILD__;

// UpdateInfo interface removed as it's not used

let dialogModule: any = null;
let updaterModule: any = null;

// グローバル状態
let updateCheckInProgress = false;
let updateAvailable = false;

// Tauri環境でのみモジュールを動的ロード
async function loadModules() {
  if (!IS_TAURI || dialogModule) return;
  
  try {
    dialogModule = await import('@tauri-apps/plugin-dialog');
    updaterModule = await import('@tauri-apps/plugin-updater');
  } catch (error) {
    console.warn('モジュールのロードに失敗:', error);
  }
}

/**
 * 静的更新チェック（署名検証付き）
 */
async function silentUpdateCheck(): Promise<void> {
  if (!IS_TAURI || updateCheckInProgress) return;
  
  updateCheckInProgress = true;
  
  try {
    await loadModules();
    if (!updaterModule) return;
    
    const update = await updaterModule.check();
    
    if (update?.available) {
      updateAvailable = true;
      showUpdateIndicator();
      console.info(`新しいバージョン ${update.version} が利用可能です`);
    } else {
      updateAvailable = false;
      hideUpdateIndicator();
      console.debug('最新バージョンです');
    }
  } catch (error) {
    console.debug('更新チェック失敗:', error);
    updateAvailable = false;
    hideUpdateIndicator();
  } finally {
    updateCheckInProgress = false;
  }
}

/**
 * 更新インジケーターを表示（非侵入的）
 */
function showUpdateIndicator(): void {
  const toolbar = document.querySelector('.toolbar');
  if (!toolbar) return;
  
  let indicator = document.getElementById('update-indicator');
  if (indicator) return;
  
  indicator = document.createElement('button');
  indicator.id = 'update-indicator';
  indicator.className = 'update-indicator bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1 text-sm transition-colors shadow-sm';
  indicator.innerHTML = '🚀 更新';
  indicator.title = '新しいバージョンが利用可能です（クリックでインストール）';
  indicator.onclick = () => performUpdate();
  
  toolbar.appendChild(indicator);
}

/**
 * 更新インジケーターを非表示
 */
function hideUpdateIndicator(): void {
  const indicator = document.getElementById('update-indicator');
  if (indicator) {
    indicator.remove();
  }
}

/**
 * 完全自動更新の実行
 */
async function performUpdate(): Promise<void> {
  if (!IS_TAURI) return;
  
  await loadModules();
  if (!dialogModule || !updaterModule) return;
  
  try {
    // 更新確認
    const update = await updaterModule.check();
    
    if (!update?.available) {
      await dialogModule.message('最新バージョンをお使いです！', {
        title: '更新チェック',
        kind: 'info',
        okLabel: 'OK'
      });
      return;
    }
    
    // 更新確認ダイアログ
    const shouldUpdate = await dialogModule.ask(
      `🚀 新しいバージョン ${update.version} が利用可能です！\n\n` +
      `📝 更新内容:\n${update.body || '詳細はリリースノートをご確認ください'}\n\n` +
      `✨ 特徴:\n` +
      `・署名付きで安全\n` +
      `・組織管理で信頼性\n` +
      `・ワンクリックで完了\n\n` +
      `今すぐ更新しますか？`,
      {
        title: 'アップデート利用可能',
        kind: 'info',
        okLabel: '今すぐ更新',
        cancelLabel: '後で'
      }
    );
    
    if (!shouldUpdate) return;
    
         // 更新プロセス開始
     const indicator = document.getElementById('update-indicator') as HTMLButtonElement;
     if (indicator) {
       indicator.innerHTML = '⏳ 更新中...';
       indicator.disabled = true;
     }
    
    // バックグラウンドで更新をダウンロード＆インストール
    let contentLength = 0;
    let downloaded = 0;
    
         await update.downloadAndInstall((event: any) => {
      switch (event.event) {
        case 'Started':
          contentLength = event.data.contentLength || 0;
          console.log(`更新ダウンロード開始: ${Math.round(contentLength / 1024 / 1024 * 100) / 100}MB`);
          break;
        case 'Progress':
          downloaded += event.data.chunkLength || 0;
          const progress = contentLength > 0 ? Math.round((downloaded / contentLength) * 100) : 0;
          if (indicator) {
            indicator.innerHTML = `📦 ${progress}%`;
          }
          break;
        case 'Finished':
          if (indicator) {
            indicator.innerHTML = '✅ 完了';
          }
          console.log('更新のダウンロードが完了しました');
          break;
      }
    });
    
    // インストール完了メッセージ
    await dialogModule.message(
      '🎉 更新が完了しました！\n\n' +
      'アプリケーションを再起動して新しいバージョンをお楽しみください。',
      {
        title: '更新完了',
        kind: 'info',
        okLabel: '今すぐ再起動'
      }
    );
    
    // 自動再起動
    const processModule = await import('@tauri-apps/plugin-process');
    await processModule.relaunch();
    
  } catch (error) {
    console.error('更新エラー:', error);
    
    // エラーメッセージ
    await dialogModule.message(
      `更新中にエラーが発生しました。\n\n` +
      `エラー: ${error}\n\n` +
      `しばらく待ってからもう一度お試しください。`,
      {
        title: '更新エラー',
        kind: 'error',
        okLabel: 'OK'
      }
    );
    
         // インジケーターをリセット
     const indicator = document.getElementById('update-indicator') as HTMLButtonElement;
     if (indicator) {
       indicator.innerHTML = '🚀 更新';
       indicator.disabled = false;
     }
  }
}

/**
 * 手動更新チェック
 */
export async function checkUpdatesManually(): Promise<void> {
  if (!IS_TAURI) return;
  
  await loadModules();
  if (!dialogModule || !updaterModule) return;
  
  try {
    const update = await updaterModule.check();
    
    if (update?.available) {
      await performUpdate();
    } else {
      await dialogModule.message('最新バージョンをお使いです！', {
        title: '更新チェック',
        kind: 'info',
        okLabel: 'OK'
      });
    }
  } catch (error) {
    console.error('手動更新チェックエラー:', error);
    await dialogModule.message('更新の確認中にエラーが発生しました。', {
      title: 'エラー',
      kind: 'error',
      okLabel: 'OK'
    });
  }
}

/**
 * 起動時の自動更新チェック（非侵入的）
 * 組織管理の署名付き更新
 */
export function initializeUpdateChecker(): void {
  if (!IS_TAURI) return;
  
  // 起動から5分後に1回だけ静的チェック
  setTimeout(() => {
    silentUpdateCheck();
  }, 300000); // 5分 = 300,000ms
}

/**
 * 更新状況をチェック（UI用）
 */
export function isUpdateAvailable(): boolean {
  return updateAvailable;
} 