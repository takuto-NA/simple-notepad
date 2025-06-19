# 🌐 Internationalization (i18n) Contribution Guide

Thank you for helping make Simple Notepad accessible to users worldwide! This guide will walk you through adding a new language translation.

## 📋 Quick Checklist

- [ ] Copy the template file
- [ ] Translate all strings
- [ ] Update language registry
- [ ] Update HTML language selector
- [ ] Test the translation
- [ ] Submit pull request

## 🚀 Step-by-Step Guide

### 1. Setup Your Development Environment

```bash
git clone https://github.com/takuto-NA/simple-notepad.git
cd simple-notepad
pnpm install
```

### 2. Create Your Language File

1. **Copy the template:**
   ```bash
   cp src/i18n/locales/_template.ts src/i18n/locales/[YOUR_LANG_CODE].ts
   ```
   
   Example for French: `cp src/i18n/locales/_template.ts src/i18n/locales/fr.ts`

2. **Edit the header:**
   Replace placeholders with your information:
   ```typescript
   /**
    * French Translation File
    * 
    * Translator: John Doe <john.doe@example.com>
    * Language: French (fr)
    * Last Updated: 2024-01-15
    */
   ```

3. **Translate all strings:**
   Replace `[TRANSLATE: ...]` with your translations:
   ```typescript
   // Before
   'app.title': '[TRANSLATE: Simple Notepad]',
   
   // After  
   'app.title': 'Bloc-notes Simple',
   ```

### 3. Register Your Language

1. **Update `src/i18n/languages.ts`:**
   
   Add your language info to `availableLanguages`:
   ```typescript
   export const availableLanguages: LanguageInfo[] = [
     // ... existing languages
     {
       code: 'fr',
       name: 'French',
       nativeName: 'Français',
       country: 'FR'
     }
   ];
   ```

   Add the import and registration:
   ```typescript
   // Add import
   import fr from './locales/fr';
   
   // Add to translations object
   export const translations: Languages = {
     ja,
     en,
     fr  // Add your language
   };
   ```

### 4. Update HTML Language Selector

Edit `index.html` to add your language option:

```html
<!-- Desktop language selector (if added in future) -->
<!-- Mobile language selector -->
<select id="language-select-mobile" class="...">
  <option value="ja">日本語</option>
  <option value="en">English</option>
  <option value="fr">Français</option> <!-- Add your language -->
</select>
```

### 5. Test Your Translation

1. **Start the development server:**
   ```bash
   pnpm dev
   ```

2. **Test your language:**
   - Open the app in your browser
   - Switch to your language using the language selector
   - Check all UI elements are translated correctly
   - Test with longer text to ensure UI doesn't break
   - Try all features (save, open, search, etc.)

### 6. Submit Your Pull Request

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add [Language Name] translation ([lang_code])"
   ```

2. **Push and create PR:**
   ```bash
   git push origin your-branch-name
   ```

3. **PR Description Template:**
   ```markdown
   ## 🌐 New Language Translation: [Language Name]
   
   ### Language Details
   - **Language:** [Language Name] ([Language Code])
   - **Translator:** [Your Name]
   - **Native Speakers:** [Estimated number or region]
   
   ### Translation Quality
   - [ ] All UI strings translated
   - [ ] Tested in browser
   - [ ] UI doesn't break with longer text
   - [ ] Follows language conventions
   - [ ] Grammar and spelling checked
   
   ### Files Changed
   - Added `src/i18n/locales/[lang].ts`
   - Updated `src/i18n/languages.ts`
   - Updated `index.html`
   
   ### Screenshots
   [Include screenshots of key UI elements in your language]
   ```

## 📚 Translation Guidelines

### General Principles
- **Clarity:** Use clear, simple language
- **Consistency:** Keep terminology consistent throughout
- **Context:** Consider the UI context when translating
- **Length:** Avoid translations that break the UI layout

### Specific Guidelines

#### Toolbar & Buttons
- Use standard conventions for your language/platform
- Keep button text short and action-oriented
- Include keyboard shortcuts in tooltips

#### Status Messages
- Use present tense for actions
- Be descriptive but concise
- Consider formality level appropriate for your language

#### Error Messages
- Be helpful and clear about what went wrong
- Suggest solutions when possible
- Use appropriate tone (not too technical)

#### Placeholders
- Make them inviting and helpful
- Use appropriate punctuation for your language

### Language-Specific Considerations

#### Right-to-Left (RTL) Languages
If your language reads right-to-left:
1. Set `rtl: true` in the language info
2. Test UI layout carefully
3. Mention RTL requirements in your PR

#### Character Encoding
- Ensure your language displays correctly
- Test with various fonts
- Consider character limits for UI elements

#### Cultural Considerations
- Use culturally appropriate terminology
- Consider local software conventions
- Adapt file naming conventions if needed

## 🔧 Advanced: Language-Specific Features

### Adding New Translation Keys

If you need to add new translation keys:

1. **Add to all language files** (including template)
2. **Use semantic naming:** `category.item` format
3. **Update TypeScript interfaces** if needed

### Dynamic Language Detection

The app automatically detects:
- Browser language (`navigator.language`)
- Language family fallback (`zh-CN` → `zh`)
- Default fallback (`en`)

### Testing Checklist

- [ ] All buttons and menus
- [ ] Search functionality
- [ ] Save/Open dialogs
- [ ] Error messages
- [ ] Status indicators
- [ ] Mobile responsive layout
- [ ] Keyboard shortcuts work
- [ ] Long text doesn't break UI

## 🐛 Common Issues

### UI Layout Problems
**Issue:** Text too long for buttons
**Solution:** Use shorter translations or abbreviations

### Missing Translations
**Issue:** Some text still in English
**Solution:** Check console for missing translation keys

### Character Display Issues
**Issue:** Special characters not displaying
**Solution:** Verify UTF-8 encoding and font support

## 🏆 Translation Credits

Your contribution will be credited in:
- `README.md` contributors section
- Language file header
- About dialog (if added in future)

## 📞 Need Help?

- **GitHub Issues:** Create an issue with `i18n` label
- **Discussions:** Use GitHub Discussions for questions
- **Reference:** Check existing translations (`ja.ts`, `en.ts`)

## 📊 Language Priority

We're especially looking for translations in:
- Spanish (es)
- French (fr)
- German (de)
- Chinese (zh)
- Korean (ko)
- Arabic (ar)
- Portuguese (pt)
- Russian (ru)

Thank you for making Simple Notepad more accessible to users worldwide! 🙏 