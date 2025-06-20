// import { invoke } from '@tauri-apps/api/core'; // 現在未使用

// 環境判定
declare const __IS_WEB_BUILD__: boolean;
const IS_TAURI = typeof window !== 'undefined' && 
                 '__TAURI__' in window && 
                 !__IS_WEB_BUILD__;

// Import i18n system
import { availableLanguages, translations, isLanguageSupported, getFallbackChain } from './i18n/languages';
import type { LanguageInfo } from './i18n/languages';

// Import auto-update functionality (Tauri版のみ)
if (IS_TAURI) {
  // Tauri環境でのみインポート（動的インポートに変更）
}

class I18n {
  private currentLanguage: string = 'en'; // Default fallback
  private fallbackLanguage: string = 'en';
  
  constructor() {
    this.currentLanguage = this.detectLanguage();
  }
  
  private detectLanguage(): string {
    // Check saved preference first
    const savedLang = localStorage.getItem('language');
    if (savedLang && isLanguageSupported(savedLang)) {
      return savedLang;
    }
    
    // Auto-detect from browser language
    const browserLang = navigator.language.toLowerCase();
    
    // Use fallback chain for better language matching
    const fallbackChain = getFallbackChain(browserLang);
    if (fallbackChain.length > 0) {
      return fallbackChain[0];
    }
    
    // Final fallback
    return this.fallbackLanguage;
  }
  
  public setLanguage(langCode: string): void {
    if (isLanguageSupported(langCode)) {
      this.currentLanguage = langCode;
      localStorage.setItem('language', langCode);
    }
  }
  
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }
  
  public getAvailableLanguages(): LanguageInfo[] {
    return availableLanguages;
  }
  
  public t(key: string, params?: { [key: string]: string | number }): string {
    // Try current language first
    let translation = translations[this.currentLanguage]?.[key];
    
    // Fall back to fallback language
    if (!translation) {
      translation = translations[this.fallbackLanguage]?.[key];
    }
    
    // Ultimate fallback to key itself
    if (!translation) {
      console.warn(`Missing translation key: ${key}`);
      translation = key;
    }
    
    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value));
      });
    }
    
    return translation;
  }
}

// Global i18n instance
const i18n = new I18n();

interface EditorState {
  content: string;
  filePath: string | null;
  encoding: string;
  lineEnding: string;
  modified: boolean;
  undoStack: string[];
  redoStack: string[];
  fontSize: number;
  showLineNumbers: boolean;
  wordWrap: boolean;
  darkMode: boolean;
}

class SimpleNotepad {
  private state: EditorState = {
    content: '',
    filePath: null,
    encoding: 'UTF-8',
    lineEnding: 'CRLF',
    modified: false,
    undoStack: [],
    redoStack: [],
    fontSize: 14,
    showLineNumbers: false,
    wordWrap: true,
    darkMode: this.getSystemDarkMode()
  };

  private searchState = {
    term: '',
    caseSensitive: false,
    currentMatch: -1,
    matches: [] as { start: number; end: number }[]
  };

  // Performance optimization
  private debounceTimers: Map<string, number> = new Map();
  private raf: number | null = null;

  // DOM Elements
  private editor!: HTMLTextAreaElement;
  private lineNumbers!: HTMLElement;
  private statusText!: HTMLElement;
  private fileInfo!: HTMLElement;
  private cursorPosition!: HTMLElement;
  private selectionInfo!: HTMLElement;
  private charCount!: HTMLElement;
  private encoding!: HTMLElement;
  private searchBar!: HTMLElement;
  private searchInput!: HTMLInputElement;
  private replaceInput!: HTMLInputElement;
  private fileInput!: HTMLInputElement;
  private fontSizeSelect!: HTMLSelectElement;
  private encodingSelect!: HTMLSelectElement;
  private darkModeToggle!: HTMLButtonElement;
  private saveAsDialog!: HTMLElement;

  constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.initializeDarkMode();
    this.initializeI18n(); // 多言語対応の初期化
    this.initializeCleanState(); // 白紙で新鮮な状態で開始
    this.updateDisplay();
    this.addToUndoStack();
    this.setupDragAndDrop();
    this.updateToolbarState();
    this.focusEditor(); // すぐに作業開始できるようフォーカス
    this.showEnvironmentInfo(); // 環境情報を表示
    this.initializeUpdateChecker(); // 非侵入的な更新チェッカーを初期化
    this.setupUpdateButton(); // ツールバーに「ヘルプ」ボタンを追加（更新チェックも含む）
  }

  private getSystemDarkMode(): boolean {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private initializeDarkMode() {
    // Load saved preference or use system default
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      this.state.darkMode = savedDarkMode === 'true';
    }
    this.applyDarkMode();
  }

  private applyDarkMode() {
    if (this.state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', this.state.darkMode.toString());
  }

  private initializeCleanState() {
    // 白紙状態で開始 - 履歴や前回の内容は表示しない
    this.state.content = '';
    this.state.filePath = null;
    this.state.modified = false;
    this.state.undoStack = [];
    this.state.redoStack = [];
    this.statusText.textContent = i18n.t('status.newFile');
  }

  private focusEditor() {
    // エディタにフォーカスを当てて、すぐに入力開始できる状態にする
    setTimeout(() => {
      this.editor.focus();
      this.editor.setSelectionRange(0, 0);
    }, 100);
  }

  private initializeI18n() {
    // Update UI elements with current language
    this.updateAllTexts();
    this.updateLanguageSelectors();
    this.updateDocumentLanguage();
  }

  private updateDocumentLanguage() {
    // Update document language attribute
    document.documentElement.lang = i18n.getCurrentLanguage();
  }

  private updateAllTexts() {
    // Update document title
    document.title = i18n.t('app.title');
    
    // Update web demo banner
    const webBanner = document.getElementById('web-demo-banner');
    if (webBanner) {
      webBanner.innerHTML = `${i18n.t('banner.webDemo')} <a href="https://github.com/takuto-NA/simple-notepad/releases" class="underline font-semibold">${i18n.t('banner.downloadLink')}</a>`;
    }
    
    // Update toolbar tooltips
    this.updateToolbarTooltips();
    
    // Update mobile menu labels
    this.updateMobileMenuLabels();
    
    // Update search bar
    this.updateSearchBarText();
    
    // Update editor placeholder
    const editor = document.getElementById('editor') as HTMLTextAreaElement;
    if (editor) {
      editor.placeholder = i18n.t('editor.placeholder');
    }
    
    // Update status bar
    this.updateStatusBarText();
    
    // Update save dialog
    this.updateSaveDialogText();
  }

  private updateToolbarTooltips() {
    const tooltipElements = [
      { id: 'mobile-menu-btn', key: 'toolbar.menu' },
      { id: 'new-btn', key: 'toolbar.new' },
      { id: 'open-btn', key: 'toolbar.open' },
      { id: 'save-btn', key: 'toolbar.save' },
      { id: 'save-as-btn', key: 'toolbar.saveAs' },
      { id: 'undo-btn', key: 'toolbar.undo' },
      { id: 'redo-btn', key: 'toolbar.redo' },
      { id: 'find-btn', key: 'toolbar.find' },
      { id: 'replace-btn', key: 'toolbar.replace' },
      { id: 'toggle-line-numbers', key: 'toolbar.lineNumbers' },
      { id: 'toggle-wrap', key: 'toolbar.wordWrap' },
      { id: 'dark-mode-toggle', key: 'toolbar.darkMode' }
    ];
    
    tooltipElements.forEach(({ id, key }) => {
      const element = document.getElementById(id);
      if (element) {
        element.title = i18n.t(key);
      }
    });
  }
    
  private updateMobileMenuLabels() {
    const mobileLabels = [
      { id: 'new-btn-mobile', key: 'mobile.new' },
      { id: 'open-btn-mobile', key: 'mobile.open' },
      { id: 'save-btn-mobile', key: 'mobile.save' },
      { id: 'save-as-btn-mobile', key: 'mobile.saveAs' },
      { id: 'undo-btn-mobile', key: 'mobile.undo' },
      { id: 'redo-btn-mobile', key: 'mobile.redo' },
      { id: 'find-btn-mobile', key: 'mobile.find' },
      { id: 'replace-btn-mobile', key: 'mobile.replace' },
      { id: 'toggle-line-numbers-mobile', key: 'mobile.lineNumbers' },
      { id: 'toggle-wrap-mobile', key: 'mobile.wordWrap' }
    ];
    
    mobileLabels.forEach(({ id, key }) => {
      const element = document.getElementById(id);
      if (element) {
        const span = element.querySelector('.text-xs');
        if (span) {
          span.textContent = i18n.t(key);
        }
        element.title = i18n.t(key);
      }
    });
    
    // Update mobile settings labels
    const fontLabel = document.querySelector('[for="font-size-mobile"], label:has(+ #font-size-mobile)');
    if (fontLabel) {
      fontLabel.textContent = i18n.t('mobile.font');
    }

    const encodingLabel = document.querySelector('[for="encoding-select-mobile"], label:has(+ #encoding-select-mobile)');
    if (encodingLabel) {
      encodingLabel.textContent = i18n.t('mobile.encoding');
    }

    const languageLabel = document.querySelector('[for="language-select-mobile"], label:has(+ #language-select-mobile)');
    if (languageLabel) {
      languageLabel.textContent = i18n.t('mobile.language');
    }
  }

  private updateSearchBarText() {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.placeholder = i18n.t('search.placeholder');
    }

    const replaceInput = document.getElementById('replace-input') as HTMLInputElement;
    if (replaceInput) {
      replaceInput.placeholder = i18n.t('search.replacePlaceholder');
    }
    
    const buttons = [
      { id: 'find-prev', key: 'search.previous' },
      { id: 'find-next', key: 'search.next' },
      { id: 'replace-one', key: 'search.replace' },
      { id: 'replace-all', key: 'search.replaceAll' }
    ];
    
    buttons.forEach(({ id, key }) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = i18n.t(key);
      }
    });
  }

  private updateStatusBarText() {
    // Update encoding label
    const encodingLabelElement = document.querySelector('.text-xs.text-gray-600:has(+ #encoding-select)');
    if (encodingLabelElement) {
      encodingLabelElement.textContent = i18n.t('mobile.encoding');
    }
  }

  private updateSaveDialogText() {
    const saveDialog = document.getElementById('save-as-dialog');
    if (saveDialog) {
      const title = saveDialog.querySelector('h3');
      if (title) {
        title.textContent = i18n.t('saveAs.title');
      }

      const labels = saveDialog.querySelectorAll('label');
      if (labels.length >= 3) {
        labels[0].textContent = i18n.t('saveAs.filename');
        labels[1].textContent = i18n.t('saveAs.encoding');
        labels[2].textContent = i18n.t('saveAs.lineEnding');
      }

      const buttons = saveDialog.querySelectorAll('button');
      if (buttons.length >= 2) {
        buttons[0].textContent = i18n.t('saveAs.cancel');
        buttons[1].textContent = i18n.t('saveAs.confirm');
      }
    }
  }

  private toggleLanguage() {
    const currentLang = i18n.getCurrentLanguage();
    const newLang = currentLang === 'ja' ? 'en' : 'ja';
    this.changeLanguage(newLang);
  }

  private changeLanguage(languageCode: string) {
    i18n.setLanguage(languageCode);
    this.updateAllTexts();
    this.updateLanguageSelectors();
    this.updateDocumentLanguage();
    const currentLangCode = i18n.getCurrentLanguage();
    const langInfo = availableLanguages.find(lang => lang.code === currentLangCode);
    const langName = langInfo ? langInfo.nativeName : currentLangCode;
    this.statusText.textContent = i18n.t('status.languageChanged', { language: langName });
  }

  private changeLanguageMobile() {
    const languageMobile = document.getElementById('language-select-mobile') as HTMLSelectElement;
    this.changeLanguage(languageMobile.value);
  }

  private updateLanguageSelectors() {
    const currentLang = i18n.getCurrentLanguage();
    const languageMobile = document.getElementById('language-select-mobile') as HTMLSelectElement;
    
    // Update mobile selector
    if (languageMobile) {
      // Clear existing options
      languageMobile.innerHTML = '';
      
      // Add all available languages
      i18n.getAvailableLanguages().forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.nativeName;
        if (lang.code === currentLang) {
          option.selected = true;
        }
        languageMobile.appendChild(option);
      });
    }
  }

  private showEnvironmentInfo() {
    // 環境に応じた初期メッセージと表示調整
    const webBanner = document.getElementById('web-demo-banner');
    
    if (IS_TAURI) {
      // Tauri版: バナーを非表示
      if (webBanner) webBanner.style.display = 'none';
      this.statusText.textContent = i18n.t('status.desktop');
    } else {
      // Web版: バナーを表示
      if (webBanner) webBanner.style.display = 'block';
      this.statusText.textContent = i18n.t('status.webDemo');
      
      // Web版では高さ調整
      const app = document.getElementById('app');
      if (app) app.style.height = 'calc(100vh - 40px)';
    }
  }

  private initializeElements() {
    this.editor = document.getElementById('editor') as HTMLTextAreaElement;
    this.lineNumbers = document.getElementById('line-numbers') as HTMLElement;
    this.statusText = document.getElementById('status-text') as HTMLElement;
    this.fileInfo = document.getElementById('file-info') as HTMLElement;
    this.cursorPosition = document.getElementById('cursor-position') as HTMLElement;
    this.selectionInfo = document.getElementById('selection-info') as HTMLElement;
    this.charCount = document.getElementById('char-count') as HTMLElement;
    this.encoding = document.getElementById('encoding') as HTMLElement;
    this.searchBar = document.getElementById('search-bar') as HTMLElement;
    this.searchInput = document.getElementById('search-input') as HTMLInputElement;
    this.replaceInput = document.getElementById('replace-input') as HTMLInputElement;
    this.fileInput = document.getElementById('file-input') as HTMLInputElement;
    this.fontSizeSelect = document.getElementById('font-size') as HTMLSelectElement;
    this.encodingSelect = document.getElementById('encoding-select') as HTMLSelectElement;
    this.darkModeToggle = document.getElementById('dark-mode-toggle') as HTMLButtonElement;
    this.saveAsDialog = document.getElementById('save-as-dialog') as HTMLElement;
  }

  private setupEventListeners() {
    // Toolbar buttons
    document.getElementById('new-btn')!.addEventListener('click', () => this.newFile());
    document.getElementById('open-btn')!.addEventListener('click', () => this.openFile());
    document.getElementById('save-btn')!.addEventListener('click', () => this.saveFile());
    document.getElementById('save-as-btn')!.addEventListener('click', () => this.showSaveAsDialog());
    document.getElementById('undo-btn')!.addEventListener('click', () => this.undo());
    document.getElementById('redo-btn')!.addEventListener('click', () => this.redo());
    document.getElementById('find-btn')!.addEventListener('click', () => this.showSearch(false));
    document.getElementById('replace-btn')!.addEventListener('click', () => this.showSearch(true));
    document.getElementById('toggle-line-numbers')!.addEventListener('click', () => this.toggleLineNumbers());
    document.getElementById('toggle-wrap')!.addEventListener('click', () => this.toggleWordWrap());
    this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

    // Language Toggle
    document.getElementById('language-toggle')!.addEventListener('click', () => this.toggleLanguage());

    // Mobile Menu Toggle
    document.getElementById('mobile-menu-btn')!.addEventListener('click', () => this.toggleMobileMenu());

    // Mobile Toolbar buttons
    document.getElementById('new-btn-mobile')!.addEventListener('click', () => { this.newFile(); this.hideMobileMenu(); });
    document.getElementById('open-btn-mobile')!.addEventListener('click', () => { this.openFile(); this.hideMobileMenu(); });
    document.getElementById('save-btn-mobile')!.addEventListener('click', () => { this.saveFile(); this.hideMobileMenu(); });
    document.getElementById('save-as-btn-mobile')!.addEventListener('click', () => { this.showSaveAsDialog(); this.hideMobileMenu(); });
    document.getElementById('undo-btn-mobile')!.addEventListener('click', () => { this.undo(); this.hideMobileMenu(); });
    document.getElementById('redo-btn-mobile')!.addEventListener('click', () => { this.redo(); this.hideMobileMenu(); });
    document.getElementById('find-btn-mobile')!.addEventListener('click', () => { this.showSearch(false); this.hideMobileMenu(); });
    document.getElementById('replace-btn-mobile')!.addEventListener('click', () => { this.showSearch(true); this.hideMobileMenu(); });
    document.getElementById('toggle-line-numbers-mobile')!.addEventListener('click', () => { this.toggleLineNumbers(); this.hideMobileMenu(); });
    document.getElementById('toggle-wrap-mobile')!.addEventListener('click', () => { this.toggleWordWrap(); this.hideMobileMenu(); });

    // Mobile controls
    document.getElementById('font-size-mobile')!.addEventListener('change', () => this.changeFontSizeMobile());
    document.getElementById('encoding-select-mobile')!.addEventListener('change', () => this.changeEncodingMobile());
    document.getElementById('language-select-mobile')!.addEventListener('change', () => this.changeLanguageMobile());

    // Search functionality
    document.getElementById('find-prev')!.addEventListener('click', () => this.findPrevious());
    document.getElementById('find-next')!.addEventListener('click', () => this.findNext());
    document.getElementById('replace-one')!.addEventListener('click', () => this.replaceOne());
    document.getElementById('replace-all')!.addEventListener('click', () => this.replaceAll());
    document.getElementById('close-search')!.addEventListener('click', () => this.hideSearch());

    // Save As Dialog
    document.getElementById('save-cancel')!.addEventListener('click', () => this.hideSaveAsDialog());
    document.getElementById('save-confirm')!.addEventListener('click', () => this.confirmSaveAs());

    // Editor events with performance optimization
    this.editor.addEventListener('input', (e) => this.onEditorInput(e));
    this.editor.addEventListener('keydown', (e) => this.onEditorKeyDown(e));
    this.editor.addEventListener('keyup', () => this.debounce('cursor', () => this.updateCursorPosition(), 50));
    this.editor.addEventListener('click', () => this.debounce('cursor', () => this.updateCursorPosition(), 50));
    this.editor.addEventListener('scroll', () => this.onEditorScroll());

    // Search input events
    this.searchInput.addEventListener('input', () => this.debounce('search', () => this.performSearch(), 300));
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.shiftKey ? this.findPrevious() : this.findNext();
      } else if (e.key === 'Escape') {
        this.hideSearch();
      }
    });

    // File input
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

    // Font size and encoding
    this.fontSizeSelect.addEventListener('change', () => this.changeFontSize());
    this.encodingSelect.addEventListener('change', () => this.changeEncoding());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleGlobalKeyboard(e));

    // Window close protection
    window.addEventListener('beforeunload', (e) => {
      if (this.state.modified) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // System dark mode change detection
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only update if user hasn't manually set a preference
      if (localStorage.getItem('darkMode') === null) {
        this.state.darkMode = e.matches;
        this.applyDarkMode();
      }
    });

    // Resize observer for line number sync
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        this.debounce('resize', () => this.syncLineNumbers(), 100);
      });
      resizeObserver.observe(this.editor);
    }

    // Dialog close on outside click
    this.saveAsDialog.addEventListener('click', (e) => {
      if (e.target === this.saveAsDialog) {
        this.hideSaveAsDialog();
      }
    });
  }

  private toggleDarkMode() {
    this.state.darkMode = !this.state.darkMode;
    this.applyDarkMode();
    this.statusText.textContent = i18n.t(this.state.darkMode ? 'status.darkModeOn' : 'status.darkModeOff');
  }

  private toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('hidden');
    }
  }

  private hideMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
    }
  }

  private changeFontSizeMobile() {
    const fontSizeMobile = document.getElementById('font-size-mobile') as HTMLSelectElement;
    this.state.fontSize = parseInt(fontSizeMobile.value);
    this.fontSizeSelect.value = fontSizeMobile.value; // Sync with desktop select
    
    // iOS Safariズーム対策を適用
    const effectiveFontSize = this.applyMobileFontSizeConstraints(this.state.fontSize);
    this.editor.style.fontSize = `${effectiveFontSize}px`;
    this.lineNumbers.style.fontSize = `${effectiveFontSize}px`;
    
    this.updateLineNumbers();
    
    // ユーザーフィードバック
    if (effectiveFontSize !== this.state.fontSize) {
      this.statusText.textContent = `フォントサイズを ${this.state.fontSize}px に設定 (iOS Safariでは ${effectiveFontSize}px で表示)`;
    } else {
      this.statusText.textContent = `フォントサイズを ${this.state.fontSize}px に変更しました`;
    }
  }

  private changeEncodingMobile() {
    const encodingMobile = document.getElementById('encoding-select-mobile') as HTMLSelectElement;
    this.state.encoding = encodingMobile.value;
    this.encodingSelect.value = encodingMobile.value; // Sync with desktop select
    this.updateDisplay();
    this.statusText.textContent = i18n.t('status.encodingChanged', { encoding: this.state.encoding });
  }

  private changeEncoding() {
    this.state.encoding = this.encodingSelect.value;
    // Sync mobile select
    const encodingMobile = document.getElementById('encoding-select-mobile') as HTMLSelectElement;
    if (encodingMobile) encodingMobile.value = this.encodingSelect.value;
    this.updateDisplay();
    this.statusText.textContent = i18n.t('status.encodingChanged', { encoding: this.state.encoding });
  }

  private showSaveAsDialog() {
    // Pre-populate dialog with current values
    const filenameInput = document.getElementById('save-filename') as HTMLInputElement;
    const encodingSelect = document.getElementById('save-encoding') as HTMLSelectElement;
    const lineEndingSelect = document.getElementById('save-line-ending') as HTMLSelectElement;

    filenameInput.value = this.state.filePath || 'document.txt';
    encodingSelect.value = this.state.encoding;
    lineEndingSelect.value = this.state.lineEnding;

    this.saveAsDialog.classList.remove('hidden');
    filenameInput.focus();
    filenameInput.select();
  }

  private hideSaveAsDialog() {
    this.saveAsDialog.classList.add('hidden');
  }

  private confirmSaveAs() {
    const filenameInput = document.getElementById('save-filename') as HTMLInputElement;
    const encodingSelect = document.getElementById('save-encoding') as HTMLSelectElement;
    const lineEndingSelect = document.getElementById('save-line-ending') as HTMLSelectElement;

    const filename = filenameInput.value.trim();
    if (!filename) {
      alert(i18n.t('error.emptyFilename'));
      return;
    }

    this.state.encoding = encodingSelect.value;
    this.state.lineEnding = lineEndingSelect.value;

    // Convert line endings
    let content = this.state.content;
    switch (this.state.lineEnding) {
      case 'LF':
        content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        break;
      case 'CR':
        content = content.replace(/\r\n/g, '\n').replace(/\n/g, '\r');
        break;
      case 'CRLF':
      default:
        content = content.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
        break;
    }

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    this.state.filePath = filename;
    this.state.modified = false;
    this.updateDisplay();
    this.hideSaveAsDialog();
    this.statusText.textContent = `ファイルを保存しました (${this.state.encoding}, ${this.state.lineEnding})`;
  }

  private debounce(key: string, func: () => void, delay: number) {
    const existingTimer = this.debounceTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    
    const timer = window.setTimeout(() => {
      func();
      this.debounceTimers.delete(key);
    }, delay);
    
    this.debounceTimers.set(key, timer);
  }

  private onEditorInput(_e: Event) {
    const newContent = this.editor.value;
    if (newContent !== this.state.content) {
      this.state.content = newContent;
      this.state.modified = true;
      this.debounce('undo', () => this.addToUndoStack(), 500);
    }
    
    this.updateDisplay();
    this.debounce('lineNumbers', () => this.updateLineNumbers(), 100);
    this.debounce('search', () => this.performSearch(), 300);
  }

  private onEditorScroll() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
    
    this.raf = requestAnimationFrame(() => {
      this.syncLineNumbers();
      this.raf = null;
    });
  }

  private onEditorKeyDown(e: KeyboardEvent) {
    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        this.removeTab();
      } else {
        this.insertTab();
      }
    }
  }

  private insertTab() {
    const start = this.editor.selectionStart;
    const end = this.editor.selectionEnd;
    const value = this.editor.value;
    
    this.editor.value = value.substring(0, start) + '\t' + value.substring(end);
    this.editor.selectionStart = this.editor.selectionEnd = start + 1;
    this.onEditorInput(new Event('input'));
  }

  private removeTab() {
    const start = this.editor.selectionStart;
    const value = this.editor.value;
    
    // Find the start of the current line
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    
    // Check if the line starts with a tab
    if (value[lineStart] === '\t') {
      this.editor.value = value.substring(0, lineStart) + value.substring(lineStart + 1);
      this.editor.selectionStart = this.editor.selectionEnd = Math.max(start - 1, lineStart);
      this.onEditorInput(new Event('input'));
    }
  }

  private addToUndoStack() {
    if (this.state.undoStack.length === 0 || 
        this.state.undoStack[this.state.undoStack.length - 1] !== this.state.content) {
      this.state.undoStack.push(this.state.content);
      if (this.state.undoStack.length > 100) { // Limit undo stack
        this.state.undoStack.shift();
      }
      this.state.redoStack = []; // Clear redo stack when new change is made
      this.updateToolbarState();
    }
  }

  private undo() {
    if (this.state.undoStack.length > 1) {
      this.state.redoStack.push(this.state.undoStack.pop()!);
      this.state.content = this.state.undoStack[this.state.undoStack.length - 1];
      this.editor.value = this.state.content;
      this.updateDisplay();
      this.updateLineNumbers();
      this.updateToolbarState();
    }
  }

  private redo() {
    if (this.state.redoStack.length > 0) {
      this.state.content = this.state.redoStack.pop()!;
      this.state.undoStack.push(this.state.content);
      this.editor.value = this.state.content;
      this.updateDisplay();
      this.updateLineNumbers();
      this.updateToolbarState();
    }
  }

  private newFile() {
    if (this.state.modified && !confirm(i18n.t('confirm.newFile'))) {
      return;
    }
    
    this.initializeCleanState();
    this.editor.value = '';
    this.state.content = '';
    this.updateDisplay();
    this.updateLineNumbers();
    this.updateToolbarState();
    this.statusText.textContent = i18n.t('status.newFile');
  }

  private openFile() {
    if (this.state.modified && !confirm(i18n.t('confirm.unsavedChanges'))) {
      return;
    }
    this.fileInput.click();
  }

  private handleFileSelect(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.state.content = e.target?.result as string;
      this.state.filePath = file.name;
      this.state.modified = false;
      this.state.undoStack = [this.state.content];
      this.state.redoStack = [];
      this.editor.value = this.state.content;
      
      // Auto-detect encoding (simplified)
      this.detectEncoding(file);
      
      this.updateDisplay();
      this.updateLineNumbers();
      this.updateToolbarState();
      this.statusText.textContent = `ファイル "${file.name}" を開きました (${this.state.encoding})`;
    };
    reader.readAsText(file, this.state.encoding);
  }

  private detectEncoding(file: File) {
    // This is a simplified encoding detection
    // In a real app, you'd use more sophisticated detection
    if (file.name.match(/\.(txt|log)$/i)) {
      // Keep current encoding
    } else if (file.name.match(/\.js|\.ts|\.json|\.html|\.css$/i)) {
      this.state.encoding = 'UTF-8';
    }
    this.encodingSelect.value = this.state.encoding;
  }

  private saveFile() {
    if (this.state.filePath) {
      this.performSave();
    } else {
      this.showSaveAsDialog();
    }
  }

  private performSave() {
    if (IS_TAURI) {
      // Tauri版: 実際のファイル保存（将来実装）
      this.saveTauriFile();
    } else {
      // Web版: ダウンロード機能
      this.downloadFile();
    }
  }

  private saveTauriFile() {
    // TODO: Tauri API実装（現在は仮実装）
    this.state.modified = false;
    this.updateDisplay();
    this.statusText.textContent = `ファイルを保存しました (${this.state.encoding})`;
  }

  private downloadFile() {
    const blob = new Blob([this.state.content], { 
      type: 'text/plain;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.state.filePath || 'memo.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.state.modified = false;
    this.updateDisplay();
    this.statusText.textContent = `ファイルをダウンロードしました`;
  }

  private showSearch(showReplace: boolean) {
    this.searchBar.classList.remove('hidden');
    if (showReplace) {
      this.replaceInput.classList.remove('hidden');
      document.getElementById('replace-one')!.classList.remove('hidden');
      document.getElementById('replace-all')!.classList.remove('hidden');
    } else {
      this.replaceInput.classList.add('hidden');
      document.getElementById('replace-one')!.classList.add('hidden');
      document.getElementById('replace-all')!.classList.add('hidden');
    }
    this.searchInput.focus();
    this.searchInput.select();
  }

  private hideSearch() {
    this.searchBar.classList.add('hidden');
    this.clearSearchHighlights();
    this.editor.focus();
  }

  private performSearch() {
    this.clearSearchHighlights();
    const term = this.searchInput.value;
    if (!term) {
      this.statusText.textContent = i18n.t('status.ready');
      return;
    }

    this.searchState.term = term;
    this.searchState.matches = [];
    
    const content = this.editor.value;
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      this.searchState.matches.push({
        start: match.index,
        end: match.index + match[0].length
      });
    }
    
    this.updateSearchStatus();
    
    // Auto-jump to first match if exists
    if (this.searchState.matches.length > 0) {
      this.searchState.currentMatch = 0;
      this.jumpToMatch();
    }
  }

  private clearSearchHighlights() {
    this.searchState.matches = [];
    this.searchState.currentMatch = -1;
  }

  private findNext() {
    if (this.searchState.matches.length === 0) {
      this.performSearch();
      return;
    }
    
    this.searchState.currentMatch = (this.searchState.currentMatch + 1) % this.searchState.matches.length;
    this.jumpToMatch();
  }

  private findPrevious() {
    if (this.searchState.matches.length === 0) {
      this.performSearch();
      return;
    }
    
    this.searchState.currentMatch = this.searchState.currentMatch <= 0 
      ? this.searchState.matches.length - 1 
      : this.searchState.currentMatch - 1;
    this.jumpToMatch();
  }

  private jumpToMatch() {
    if (this.searchState.currentMatch >= 0 && this.searchState.currentMatch < this.searchState.matches.length) {
      const match = this.searchState.matches[this.searchState.currentMatch];
      this.editor.setSelectionRange(match.start, match.end);
      this.editor.focus();
      
      // Scroll to match
      const lines = this.editor.value.substring(0, match.start).split('\n');
      const lineNumber = lines.length;
      const lineHeight = parseFloat(getComputedStyle(this.editor).lineHeight) || 20;
      const scrollTop = (lineNumber - 5) * lineHeight; // Center the match
      this.editor.scrollTop = Math.max(0, scrollTop);
      
      this.updateSearchStatus();
    }
  }

  private updateSearchStatus() {
    if (this.searchState.matches.length === 0) {
      this.statusText.textContent = this.searchState.term ? i18n.t('search.notFound') : i18n.t('status.ready');
    } else {
      this.statusText.textContent = i18n.t('search.results', { 
        current: this.searchState.currentMatch + 1, 
        total: this.searchState.matches.length 
      });
    }
  }

  private replaceOne() {
    if (this.searchState.currentMatch >= 0 && this.searchState.currentMatch < this.searchState.matches.length) {
      const match = this.searchState.matches[this.searchState.currentMatch];
      const newValue = this.editor.value.substring(0, match.start) + 
                      this.replaceInput.value + 
                      this.editor.value.substring(match.end);
      
      this.editor.value = newValue;
      this.onEditorInput(new Event('input'));
      this.performSearch(); // Re-search after replacement
    }
  }

  private replaceAll() {
    if (this.searchState.matches.length === 0) return;
    
    let newValue = this.editor.value;
    const replacement = this.replaceInput.value;
    const count = this.searchState.matches.length;
    
    // Replace from end to start to maintain indices
    for (let i = this.searchState.matches.length - 1; i >= 0; i--) {
      const match = this.searchState.matches[i];
      newValue = newValue.substring(0, match.start) + replacement + newValue.substring(match.end);
    }
    
    this.editor.value = newValue;
    this.onEditorInput(new Event('input'));
    this.statusText.textContent = `${count} 件を置換しました`;
    this.performSearch();
  }

  private toggleLineNumbers() {
    this.state.showLineNumbers = !this.state.showLineNumbers;
    if (this.state.showLineNumbers) {
      this.lineNumbers.classList.remove('hidden');
      this.updateLineNumbers();
    } else {
      this.lineNumbers.classList.add('hidden');
    }
    this.updateToolbarState();
  }

  private toggleWordWrap() {
    this.state.wordWrap = !this.state.wordWrap;
    if (this.state.wordWrap) {
      this.editor.classList.remove('no-wrap');
      this.editor.classList.add('wrap-text');
    } else {
      this.editor.classList.remove('wrap-text');
      this.editor.classList.add('no-wrap');
    }
    this.updateToolbarState();
    this.debounce('lineNumbers', () => this.updateLineNumbers(), 100);
  }

  private changeFontSize() {
    this.state.fontSize = parseInt(this.fontSizeSelect.value);
    // Sync mobile select
    const fontSizeMobile = document.getElementById('font-size-mobile') as HTMLSelectElement;
    if (fontSizeMobile) fontSizeMobile.value = this.fontSizeSelect.value;
    
    // iOS Safariズーム対策: 16px未満の場合は強制的に16pxに設定
    const effectiveFontSize = this.applyMobileFontSizeConstraints(this.state.fontSize);
    this.editor.style.fontSize = `${effectiveFontSize}px`;
    this.lineNumbers.style.fontSize = `${effectiveFontSize}px`;
    
    this.debounce('lineNumbers', () => this.updateLineNumbers(), 100);
    
    // ユーザーフィードバック
    if (effectiveFontSize !== this.state.fontSize) {
      this.statusText.textContent = `フォントサイズを ${this.state.fontSize}px に設定 (モバイルでは ${effectiveFontSize}px で表示)`;
    } else {
      this.statusText.textContent = `フォントサイズを ${this.state.fontSize}px に変更しました`;
    }
  }

  private applyMobileFontSizeConstraints(fontSize: number): number {
    // モバイルデバイスの判定
    const isMobile = window.innerWidth <= 768;
    const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isMobile && isIOSSafari && fontSize < 16) {
      // iOS Safariで16px未満の場合はズーム防止のため16pxに設定
      this.editor.setAttribute('data-font-size-small', 'true');
      return 16;
    } else {
      this.editor.removeAttribute('data-font-size-small');
      return fontSize;
    }
  }

  private updateLineNumbers() {
    if (!this.state.showLineNumbers) return;
    
    const lines = this.editor.value.split('\n');
    const lineCount = lines.length;
    
    // Create line numbers with same styling as editor
    let lineNumbersHtml = '';
    for (let i = 1; i <= lineCount; i++) {
      lineNumbersHtml += `${i}\n`;
    }
    
    // Remove trailing newline
    lineNumbersHtml = lineNumbersHtml.slice(0, -1);
    
    this.lineNumbers.textContent = lineNumbersHtml;
    
    // Ensure perfect sync
    this.syncLineNumbers();
  }

  private syncLineNumbers() {
    if (!this.state.showLineNumbers) return;
    
    // Perfect synchronization
    this.lineNumbers.scrollTop = this.editor.scrollTop;
    
    // Copy exact styling for perfect alignment
    const editorStyles = getComputedStyle(this.editor);
    this.lineNumbers.style.lineHeight = editorStyles.lineHeight;
    this.lineNumbers.style.fontSize = editorStyles.fontSize;
    this.lineNumbers.style.fontFamily = editorStyles.fontFamily;
    this.lineNumbers.style.paddingTop = editorStyles.paddingTop;
    this.lineNumbers.style.paddingBottom = editorStyles.paddingBottom;
  }

  private updateCursorPosition() {
    const value = this.editor.value;
    const pos = this.editor.selectionStart;
    const lines = value.substring(0, pos).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    
    this.cursorPosition.textContent = `${i18n.t('position.line')} ${line}, ${i18n.t('position.column')} ${col}`;
    
    const selectionLength = this.editor.selectionEnd - this.editor.selectionStart;
    if (selectionLength > 0) {
      this.selectionInfo.textContent = `(${i18n.t('position.selected', { count: selectionLength })})`;
    } else {
      this.selectionInfo.textContent = '';
    }
  }

  private updateToolbarState() {
    // Update button states
    const undoBtn = document.getElementById('undo-btn')!;
    const redoBtn = document.getElementById('redo-btn')!;
    const lineNumbersBtn = document.getElementById('toggle-line-numbers')!;
    const wrapBtn = document.getElementById('toggle-wrap')!;
    
    // Undo/Redo state
    if (this.state.undoStack.length <= 1) {
      undoBtn.classList.add('opacity-40');
      (undoBtn as HTMLButtonElement).disabled = true;
    } else {
      undoBtn.classList.remove('opacity-40');
      (undoBtn as HTMLButtonElement).disabled = false;
    }
    
    if (this.state.redoStack.length === 0) {
      redoBtn.classList.add('opacity-40');
      (redoBtn as HTMLButtonElement).disabled = true;
    } else {
      redoBtn.classList.remove('opacity-40');
      (redoBtn as HTMLButtonElement).disabled = false;
    }
    
    // Toggle button states
    if (this.state.showLineNumbers) {
      lineNumbersBtn.classList.add('active');
    } else {
      lineNumbersBtn.classList.remove('active');
    }
    
    if (this.state.wordWrap) {
      wrapBtn.classList.add('active');
    } else {
      wrapBtn.classList.remove('active');
    }

    // Dark mode button state
    if (this.state.darkMode) {
      this.darkModeToggle.classList.add('active');
    } else {
      this.darkModeToggle.classList.remove('active');
    }
  }

  private updateDisplay() {
    // Update character count
    this.charCount.textContent = i18n.t('position.characters', { count: this.state.content.length });
    
    // Update file info
    const fileName = this.state.filePath || i18n.t('status.newDocument');
    const modifiedMark = this.state.modified ? ' *' : '';
    this.fileInfo.textContent = fileName + modifiedMark;
    
    // Update encoding
    this.encoding.textContent = this.state.encoding;
    
    // Update window title
    document.title = `${fileName}${modifiedMark} - ${i18n.t('app.title')}`;
    
    // Update cursor position
    this.updateCursorPosition();
  }

  private handleGlobalKeyboard(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'n':
          e.preventDefault();
          this.newFile();
          break;
        case 'o':
          e.preventDefault();
          this.openFile();
          break;
        case 's':
          e.preventDefault();
          if (e.shiftKey) {
            this.showSaveAsDialog();
          } else {
            this.saveFile();
          }
          break;
        case 'f':
          e.preventDefault();
          this.showSearch(false);
          break;
        case 'h':
          e.preventDefault();
          this.showSearch(true);
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            this.redo();
          } else {
            this.undo();
          }
          break;
        case 'y':
          e.preventDefault();
          this.redo();
          break;
        case 'd':
          e.preventDefault();
          this.toggleDarkMode();
          break;
      }
    } else if (e.key === 'Escape') {
      if (!this.saveAsDialog.classList.contains('hidden')) {
        this.hideSaveAsDialog();
      } else {
        this.hideSearch();
      }
    }
  }

  private setupDragAndDrop() {
    const dropArea = document.querySelector('.drop-area')!;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, () => {
        dropArea.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, () => {
        dropArea.classList.remove('dragover');
      });
    });

    dropArea.addEventListener('drop', (e) => {
      this.handleDrop(e as DragEvent);
    });
  }

  private handleDrop(e: DragEvent) {
    const dataTransfer = e.dataTransfer;
    if (!dataTransfer) return;

    // Check for files first (existing functionality)
    const files = Array.from(dataTransfer.files || []);
    if (files.length > 0) {
      this.loadDroppedFile(files[0]);
      return;
    }

    // Check for text data
    const textData = dataTransfer.getData('text/plain');
    if (textData) {
      this.handleDroppedText(textData);
      return;
    }

    // Check for HTML data (extract text content)
    const htmlData = dataTransfer.getData('text/html');
    if (htmlData) {
      this.handleDroppedHTML(htmlData);
      return;
    }

    // Check for URLs
    const urlData = dataTransfer.getData('text/uri-list');
    if (urlData) {
      this.handleDroppedURL(urlData);
      return;
    }

    // If no recognized data type, show message
    this.statusText.textContent = i18n.t('status.unsupportedDrop');
  }

  private handleDroppedText(text: string) {
    // If editor is empty, just insert the text
    if (!this.state.content.trim()) {
      this.insertTextAtPosition(text, 0);
      this.statusText.textContent = i18n.t('status.textPasted');
      return;
    }

    // If editor has content, ask user what to do
    const options = [
      i18n.t('drop.replace'), // Replace all content
      i18n.t('drop.append'),  // Append to end
      i18n.t('drop.insert'),  // Insert at cursor
      i18n.t('drop.cancel')   // Cancel
    ];

    // Simple confirmation dialog for now (could be improved with custom modal)
    const choice = prompt(
      i18n.t('drop.textDropped') + '\n\n' +
      '1. ' + options[0] + '\n' +
      '2. ' + options[1] + '\n' +
      '3. ' + options[2] + '\n' +
      '4. ' + options[3] + '\n\n' +
      i18n.t('drop.chooseOption'),
      '3'
    );

    switch (choice) {
      case '1': // Replace
        if (this.state.modified && !confirm(i18n.t('confirm.replaceContent'))) return;
        this.replaceAllContent(text);
        break;
      case '2': // Append
        this.appendText(text);
        break;
      case '3': // Insert at cursor
      default:
        this.insertTextAtCursor(text);
        break;
      case '4': // Cancel
        return;
    }

    this.statusText.textContent = i18n.t('status.textDropped');
  }

  private handleDroppedHTML(html: string) {
    // Extract text content from HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    
    if (text.trim()) {
      this.handleDroppedText(text);
    } else {
      this.statusText.textContent = i18n.t('status.noTextInHTML');
    }
  }

  private handleDroppedURL(url: string) {
    // Handle multiple URLs (separated by newlines)
    const urls = url.split('\n').filter(u => u.trim());
    const urlText = urls.join('\n');
    
    this.handleDroppedText(urlText);
  }

  private insertTextAtPosition(text: string, position: number) {
    const currentValue = this.editor.value;
    const newValue = currentValue.slice(0, position) + text + currentValue.slice(position);
    
    this.updateEditorContent(newValue);
    
    // Set cursor after inserted text
    const newCursorPos = position + text.length;
    this.editor.setSelectionRange(newCursorPos, newCursorPos);
    this.editor.focus();
  }

  private insertTextAtCursor(text: string) {
    const cursorPos = this.editor.selectionStart;
    this.insertTextAtPosition(text, cursorPos);
  }

  private appendText(text: string) {
    const currentValue = this.editor.value;
    const separator = currentValue && !currentValue.endsWith('\n') ? '\n' : '';
    const newValue = currentValue + separator + text;
    
    this.updateEditorContent(newValue);
    
    // Set cursor at end
    this.editor.setSelectionRange(newValue.length, newValue.length);
    this.editor.focus();
  }

  private replaceAllContent(text: string) {
    this.updateEditorContent(text);
    
    // Set cursor at start
    this.editor.setSelectionRange(0, 0);
    this.editor.focus();
    
    // Clear file path since this is new content
    this.state.filePath = null;
  }

  private updateEditorContent(newContent: string) {
    this.state.content = newContent;
    this.editor.value = newContent;
    this.state.modified = true;
    
    // Add to undo stack
    this.addToUndoStack();
    
    // Update UI
    this.updateDisplay();
    this.updateLineNumbers();
    this.updateToolbarState();
  }

  private loadDroppedFile(file: File) {
    if (this.state.modified && !confirm(i18n.t('confirm.unsavedChanges'))) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.state.content = e.target?.result as string;
      this.state.filePath = file.name;
      this.state.modified = false;
      this.state.undoStack = [this.state.content];
      this.state.redoStack = [];
      this.editor.value = this.state.content;
      
      this.detectEncoding(file);
      
      this.updateDisplay();
      this.updateLineNumbers();
      this.updateToolbarState();
      this.statusText.textContent = `${i18n.t('status.fileOpened')}: "${file.name}" (${this.state.encoding})`;
    };
    reader.readAsText(file, this.state.encoding);
  }

  private initializeUpdateChecker() {
    // 動的インポートでTauri環境でのみ更新機能を読み込み
    if (IS_TAURI) {
      import('./updater').then(updater => {
        updater.initializeUpdateChecker();
      }).catch(error => {
        console.warn('更新チェッカーの初期化に失敗:', error);
      });
    }
  }

  private setupUpdateButton() {
    // ツールバーの右側コントロール部分に「ヘルプ」ボタンを追加
    const rightControls = document.querySelector('.toolbar .flex.items-center.space-x-1:last-child');
    if (!rightControls) return;

    const helpButton = document.createElement('button');
    helpButton.className = 'toolbar-btn';
    helpButton.innerHTML = '❓';
    helpButton.title = IS_TAURI ? 'ヘルプ・更新確認' : 'このアプリについて';
    helpButton.onclick = () => this.showHelpMenu();
    
    rightControls.appendChild(helpButton);
  }

  private async showHelpMenu() {
    if (IS_TAURI) {
      // デスクトップ版: 更新チェック
      try {
        const updater = await import('./updater');
        await updater.checkUpdatesManually();
      } catch (error) {
        console.warn('更新チェックに失敗:', error);
      }
    } else {
      // Web版: アプリ情報表示
      alert(
        `🚀 シンプルメモ帳 v${document.querySelector('meta[name="version"]')?.getAttribute('content') || '1.0.0'}\n\n` +
        `🌐 Web版体験中！\n` +
        `📱 デスクトップ版もダウンロード可能\n\n` +
        `🔗 GitHub: https://github.com/takuto-NA/simple-notepad\n` +
        `💾 リリース: https://github.com/takuto-NA/simple-notepad/releases`
      );
    }
  }
}

// Initialize the application
window.addEventListener('DOMContentLoaded', () => {
  new SimpleNotepad();
});