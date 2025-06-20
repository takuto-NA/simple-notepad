/**
 * Japanese Translation File
 * 日本語翻訳ファイル
 * 
 * Translator: [Your Name] <[your-email]>
 * Last Updated: 2024
 * 
 * Translation Guidelines:
 * - Keep translations concise and clear
 * - Use polite form (です/ます調) for UI text
 * - Maintain consistency with existing Japanese software conventions
 * - Use appropriate Kanji/Hiragana/Katakana balance
 */

export default {
  // Application title
  'app.title': 'シンプルメモ帳',
  
  // Toolbar tooltips
  'toolbar.new': '新規 (Ctrl+N)',
  'toolbar.open': '開く (Ctrl+O)', 
  'toolbar.save': '保存 (Ctrl+S)',
  'toolbar.saveAs': '名前を付けて保存 (Ctrl+Shift+S)',
  'toolbar.undo': '元に戻す (Ctrl+Z)',
  'toolbar.redo': 'やり直し (Ctrl+Y)',
  'toolbar.find': '検索 (Ctrl+F)',
  'toolbar.replace': '置換 (Ctrl+H)',
  'toolbar.lineNumbers': '行番号表示切り替え',
  'toolbar.wordWrap': 'ワードラップ切り替え',
  'toolbar.darkMode': 'ダークモード切り替え (Ctrl+D)',
  'toolbar.menu': 'メニュー',
  'toolbar.language': '言語',
  
  // Mobile menu labels
  'mobile.new': '新規',
  'mobile.open': '開く',
  'mobile.save': '保存',
  'mobile.saveAs': '名前付保存',
  'mobile.undo': '元に戻す',
  'mobile.redo': 'やり直し',
  'mobile.find': '検索',
  'mobile.replace': '置換',
  'mobile.lineNumbers': '行番号',
  'mobile.wordWrap': 'ワードラップ',
  'mobile.font': 'フォント:',
  'mobile.encoding': '文字コード:',
  'mobile.language': '言語:',
  
  // Search functionality
  'search.placeholder': '検索...',
  'search.replacePlaceholder': '置換...',
  'search.previous': '前へ',
  'search.next': '次へ',
  'search.replace': '置換',
  'search.replaceAll': '全置換',
  'search.close': '✕',
  
  // Save As Dialog
  'saveAs.title': '名前を付けて保存',
  'saveAs.filename': 'ファイル名',
  'saveAs.encoding': '文字コード',
  'saveAs.lineEnding': '改行コード',
  'saveAs.cancel': 'キャンセル',
  'saveAs.confirm': '保存',
  
  // Editor placeholder
  'editor.placeholder': 'ここにテキストを入力してください...',
  
  // Status messages
  'status.ready': '準備完了',
  'status.newDocument': '新規ドキュメント',
  'status.webDemo': 'Web体験版 - ファイル保存はダウンロードになります',
  'status.desktop': 'デスクトップ版 - フル機能で準備完了',
  'status.newFile': '新しいファイルを作成しました',
  'status.fileOpened': 'ファイルを開きました',
  'status.fileSaved': 'ファイルを保存しました',
  'status.encodingChanged': '文字コードを {encoding} に変更しました',
  'status.languageChanged': '言語を {language} に変更しました',
  'status.darkModeOn': 'ダークモードに切り替えました',
  'status.darkModeOff': 'ライトモードに切り替えました',
  
  // Position indicators
  'position.line': '行',
  'position.column': '列',
  'position.characters': '{count} 文字',
  'position.selected': '{count} 文字選択',
  
  // Error messages
  'error.fileRead': 'ファイルの読み込みに失敗しました',
  'error.fileSave': 'ファイルの保存に失敗しました',
  'error.unsupportedFormat': 'サポートされていないファイル形式です',
  'error.emptyFilename': 'ファイル名を入力してください。',
  
  // Search results
  'search.notFound': '見つかりませんでした',
  'search.results': '{current} / {total} 件',
  
  // Web demo banner
  'banner.webDemo': '📱 これは体験版です • ファイル保存はダウンロードになります •',
  'banner.downloadLink': '完全版（デスクトップアプリ）をダウンロード',
  
  // Confirmation dialogs
  'confirm.unsavedChanges': '未保存の変更があります。ファイルを開きますか？',
  'confirm.newFile': '未保存の変更があります。新しいファイルを作成しますか？',
  
  // File operations
  'file.defaultName': 'document.txt',
  'file.opening': 'ファイルを開いています...',
  'file.saving': 'ファイルを保存しています...',
  
  // Accessibility
  'a11y.menuExpanded': 'メニューが展開されました',
  'a11y.menuCollapsed': 'メニューが折りたたまれました',
  'a11y.searchActive': '検索モードがアクティブです',
  'a11y.darkModeOn': 'ダークモードがオンです',
  'a11y.darkModeOff': 'ダークモードがオフです',

  // Search results
  'search.notFound': '見つかりません',
  'search.results': '{current} / {total} 件目',

  // Drag and drop
  'drop.textDropped': 'テキストが検出されました。どのように処理しますか？',
  'drop.replace': 'すべて置き換え',
  'drop.append': '末尾に追加',
  'drop.insert': 'カーソル位置に挿入',
  'drop.cancel': 'キャンセル',
  'drop.chooseOption': 'オプションを選択してください (1-4):',
  
  // Drop status messages
  'status.textPasted': 'テキストが挿入されました',
  'status.textDropped': 'テキストが正常に追加されました',
  'status.unsupportedDrop': 'サポートされていないコンテンツタイプです',
  'status.noTextInHTML': 'HTMLにテキストコンテンツが見つかりません',
  
  // Additional confirmations
  'confirm.replaceContent': '現在の内容がすべて置き換えられます。続行しますか？'
}; 