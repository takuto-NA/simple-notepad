/**
 * Language Translation Template
 * 
 * Instructions for Translators:
 * 1. Copy this file and rename to your language code (e.g., fr.ts, de.ts, zh.ts)
 * 2. Replace [LANGUAGE_NAME] with your language name
 * 3. Fill in your details in the header
 * 4. Translate all the strings in this file
 * 5. Test the translations in the app
 * 6. Submit a pull request
 * 
 * Translation Guidelines:
 * - Keep translations concise and clear
 * - Maintain consistency with platform conventions for your language
 * - Use {variable} syntax for dynamic values (don't translate variable names)
 * - Test UI with longer translations to ensure they fit
 * - Follow your language's capitalization rules for UI elements
 * 
 * Translator: [Your Name] <[your-email]>
 * Language: [LANGUAGE_NAME] ([LANGUAGE_CODE])
 * Last Updated: [DATE]
 */

export default {
  // Application title
  'app.title': '[TRANSLATE: Simple Notepad]',
  
  // Toolbar tooltips
  'toolbar.new': '[TRANSLATE: New (Ctrl+N)]',
  'toolbar.open': '[TRANSLATE: Open (Ctrl+O)]',
  'toolbar.save': '[TRANSLATE: Save (Ctrl+S)]',
  'toolbar.saveAs': '[TRANSLATE: Save As (Ctrl+Shift+S)]',
  'toolbar.undo': '[TRANSLATE: Undo (Ctrl+Z)]',
  'toolbar.redo': '[TRANSLATE: Redo (Ctrl+Y)]',
  'toolbar.find': '[TRANSLATE: Find (Ctrl+F)]',
  'toolbar.replace': '[TRANSLATE: Replace (Ctrl+H)]',
  'toolbar.lineNumbers': '[TRANSLATE: Toggle Line Numbers]',
  'toolbar.wordWrap': '[TRANSLATE: Toggle Word Wrap]',
  'toolbar.darkMode': '[TRANSLATE: Toggle Dark Mode (Ctrl+D)]',
  'toolbar.menu': '[TRANSLATE: Menu]',
  'toolbar.language': '[TRANSLATE: Language]',
  
  // Mobile menu labels
  'mobile.new': '[TRANSLATE: New]',
  'mobile.open': '[TRANSLATE: Open]',
  'mobile.save': '[TRANSLATE: Save]',
  'mobile.saveAs': '[TRANSLATE: Save As]',
  'mobile.undo': '[TRANSLATE: Undo]',
  'mobile.redo': '[TRANSLATE: Redo]',
  'mobile.find': '[TRANSLATE: Find]',
  'mobile.replace': '[TRANSLATE: Replace]',
  'mobile.lineNumbers': '[TRANSLATE: Line Numbers]',
  'mobile.wordWrap': '[TRANSLATE: Word Wrap]',
  'mobile.font': '[TRANSLATE: Font:]',
  'mobile.encoding': '[TRANSLATE: Encoding:]',
  'mobile.language': '[TRANSLATE: Language:]',
  
  // Search functionality
  'search.placeholder': '[TRANSLATE: Search...]',
  'search.replacePlaceholder': '[TRANSLATE: Replace...]',
  'search.previous': '[TRANSLATE: Previous]',
  'search.next': '[TRANSLATE: Next]',
  'search.replace': '[TRANSLATE: Replace]',
  'search.replaceAll': '[TRANSLATE: Replace All]',
  'search.close': '✕', // Keep this symbol
  
  // Save As Dialog
  'saveAs.title': '[TRANSLATE: Save As]',
  'saveAs.filename': '[TRANSLATE: File Name]',
  'saveAs.encoding': '[TRANSLATE: Encoding]',
  'saveAs.lineEnding': '[TRANSLATE: Line Ending]',
  'saveAs.cancel': '[TRANSLATE: Cancel]',
  'saveAs.confirm': '[TRANSLATE: Save]',
  
  // Editor placeholder
  'editor.placeholder': '[TRANSLATE: Enter your text here...]',
  
  // Status messages
  'status.ready': '[TRANSLATE: Ready]',
  'status.newDocument': '[TRANSLATE: New Document]',
  'status.webDemo': '[TRANSLATE: Web Demo - File saving works as download]',
  'status.desktop': '[TRANSLATE: Desktop Version - Full features ready]',
  'status.newFile': '[TRANSLATE: Created new file]',
  'status.fileOpened': '[TRANSLATE: File opened]',
  'status.fileSaved': '[TRANSLATE: File saved]',
  'status.encodingChanged': '[TRANSLATE: Changed encoding to {encoding}]', // Keep {encoding}
  'status.languageChanged': '[TRANSLATE: Language changed to {language}]', // Keep {language}
  
  // Position indicators
  'position.line': '[TRANSLATE: Line]',
  'position.column': '[TRANSLATE: Col]',
  'position.characters': '[TRANSLATE: {count} chars]', // Keep {count}
  'position.selected': '[TRANSLATE: {count} chars selected]', // Keep {count}
  
  // Error messages
  'error.fileRead': '[TRANSLATE: Failed to read file]',
  'error.fileSave': '[TRANSLATE: Failed to save file]',
  'error.unsupportedFormat': '[TRANSLATE: Unsupported file format]',
  
  // Web demo banner
  'banner.webDemo': '[TRANSLATE: 📱 This is a demo version • File saving works as download •]',
  'banner.downloadLink': '[TRANSLATE: Download full version (Desktop App)]',
  
  // Confirmation dialogs
  'confirm.unsavedChanges': '[TRANSLATE: You have unsaved changes. Do you want to open a file?]',
  'confirm.newFile': '[TRANSLATE: You have unsaved changes. Do you want to create a new file?]',
  
  // File operations
  'file.defaultName': 'document.txt', // Usually keep as is or translate to local convention
  'file.opening': '[TRANSLATE: Opening file...]',
  'file.saving': '[TRANSLATE: Saving file...]',
  
  // Accessibility
  'a11y.menuExpanded': '[TRANSLATE: Menu expanded]',
  'a11y.menuCollapsed': '[TRANSLATE: Menu collapsed]',
  'a11y.searchActive': '[TRANSLATE: Search mode active]',
  'a11y.darkModeOn': '[TRANSLATE: Dark mode on]',
  'a11y.darkModeOff': '[TRANSLATE: Dark mode off]'
}; 