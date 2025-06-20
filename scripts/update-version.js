#!/usr/bin/env node

/**
 * 自動バージョン更新スクリプト
 * Gitタグから自動的にpackage.json、tauri.conf.jsonのバージョンを更新
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const PROJECT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

/**
 * 最新のGitタグからバージョンを取得
 */
function getVersionFromGit() {
  try {
    // 最新のタグを取得
    const latestTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
    
    // "v"プレフィックスを削除
    const version = latestTag.replace(/^v/, '');
    
    console.log(`📋 最新のGitタグ: ${latestTag}`);
    console.log(`🔢 抽出されたバージョン: ${version}`);
    
    return version;
  } catch (error) {
    console.error('❌ Gitタグの取得に失敗:', error.message);
    process.exit(1);
  }
}

/**
 * package.jsonのバージョンを更新
 */
function updatePackageJson(version) {
  const packagePath = path.join(PROJECT_ROOT, 'package.json');
  
  try {
    const packageContent = readFileSync(packagePath, 'utf8');
    const packageData = JSON.parse(packageContent);
    
    const oldVersion = packageData.version;
    packageData.version = version;
    
    writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n');
    
    console.log(`📦 package.json: ${oldVersion} → ${version}`);
    return true;
  } catch (error) {
    console.error('❌ package.json更新エラー:', error.message);
    return false;
  }
}

/**
 * tauri.conf.jsonのバージョンを更新
 */
function updateTauriConfig(version) {
  const tauriPath = path.join(PROJECT_ROOT, 'src-tauri', 'tauri.conf.json');
  
  try {
    const tauriContent = readFileSync(tauriPath, 'utf8');
    const tauriData = JSON.parse(tauriContent);
    
    const oldVersion = tauriData.version;
    tauriData.version = version;
    
    writeFileSync(tauriPath, JSON.stringify(tauriData, null, 2) + '\n');
    
    console.log(`🦀 tauri.conf.json: ${oldVersion} → ${version}`);
    return true;
  } catch (error) {
    console.error('❌ tauri.conf.json更新エラー:', error.message);
    return false;
  }
}

/**
 * バージョン整合性の検証
 */
function verifyVersionConsistency(expectedVersion) {
  const packagePath = path.join(PROJECT_ROOT, 'package.json');
  const tauriPath = path.join(PROJECT_ROOT, 'src-tauri', 'tauri.conf.json');
  
  try {
    const packageData = JSON.parse(readFileSync(packagePath, 'utf8'));
    const tauriData = JSON.parse(readFileSync(tauriPath, 'utf8'));
    
    if (packageData.version === expectedVersion && tauriData.version === expectedVersion) {
      console.log('✅ バージョンの整合性確認完了');
      return true;
    } else {
      console.log('❌ バージョンの不整合が検出されました');
      console.log(`   package.json: ${packageData.version}`);
      console.log(`   tauri.conf.json: ${tauriData.version}`);
      console.log(`   期待値: ${expectedVersion}`);
      return false;
    }
  } catch (error) {
    console.error('❌ バージョン検証エラー:', error.message);
    return false;
  }
}

/**
 * メイン処理
 */
function main() {
  console.log('🚀 自動バージョン更新開始\n');
  
  // Gitタグからバージョンを取得
  const version = getVersionFromGit();
  
  // 各設定ファイルを更新
  console.log('\n📝 設定ファイル更新中...');
  const packageSuccess = updatePackageJson(version);
  const tauriSuccess = updateTauriConfig(version);
  
  if (packageSuccess && tauriSuccess) {
    console.log('\n🔍 バージョン整合性確認中...');
    if (verifyVersionConsistency(version)) {
      console.log('\n🎉 バージョン更新完了！');
      console.log(`✨ 全ての設定ファイルがバージョン ${version} に統一されました\n`);
    } else {
      console.log('\n❌ バージョン更新は完了しましたが、整合性の問題があります');
      process.exit(1);
    }
  } else {
    console.log('\n❌ バージョン更新に失敗しました');
    process.exit(1);
  }
}

// CLIとして実行された場合のみメイン処理を実行
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}