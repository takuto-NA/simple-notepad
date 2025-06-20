#!/usr/bin/env node

/**
 * Translation Validation Script
 * 
 * This script validates translations for consistency and completeness.
 * Run before submitting translation PRs.
 * 
 * Usage: node scripts/validate-translations.js [language_code]
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class TranslationValidator {
  constructor() {
    this.localesDir = path.join(__dirname, '../src/i18n/locales');
    this.templateFile = path.join(this.localesDir, '_template.ts');
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  log(type, message, details = '') {
    const timestamp = new Date().toISOString().substr(11, 8);
    const typeColors = {
      ERROR: colors.red,
      WARN: colors.yellow,
      INFO: colors.blue,
      SUCCESS: colors.green
    };
    
    console.log(
      `${colors.bold}[${timestamp}]${colors.reset} ` +
      `${typeColors[type]}${type}${colors.reset} ` +
      `${message}${details ? ' ' + colors.cyan + details + colors.reset : ''}`
    );

    if (type === 'ERROR') this.errors.push(message);
    if (type === 'WARN') this.warnings.push(message);
    if (type === 'INFO') this.info.push(message);
  }

  async validateLanguage(langCode) {
    this.log('INFO', `Validating language: ${langCode}`);
    
    const langFile = path.join(this.localesDir, `${langCode}.ts`);
    
    if (!fs.existsSync(langFile)) {
      this.log('ERROR', `Language file not found: ${langFile}`);
      return false;
    }

    try {
      // Read template to get required keys
      const templateContent = fs.readFileSync(this.templateFile, 'utf8');
      const requiredKeys = this.extractKeys(templateContent);
      
      // Read language file
      const langContent = fs.readFileSync(langFile, 'utf8');
      const langKeys = this.extractKeys(langContent);
      
      // Validate completeness
      this.validateCompleteness(langCode, requiredKeys, langKeys);
      
      // Validate format
      this.validateFormat(langCode, langContent);
      
      // Validate translations
      this.validateTranslations(langCode, langContent);
      
      return this.errors.length === 0;
      
    } catch (error) {
      this.log('ERROR', `Failed to validate ${langCode}:`, error.message);
      return false;
    }
  }

  extractKeys(content) {
    const keys = new Set();
    const regex = /'([^']+)':\s*'[^']*'/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      keys.add(match[1]);
    }
    
    return keys;
  }

  validateCompleteness(langCode, requiredKeys, langKeys) {
    this.log('INFO', `Checking completeness for ${langCode}...`);
    
    const missingKeys = [...requiredKeys].filter(key => !langKeys.has(key));
    const extraKeys = [...langKeys].filter(key => !requiredKeys.has(key));
    
    if (missingKeys.length > 0) {
      this.log('ERROR', `Missing translation keys in ${langCode}:`, missingKeys.join(', '));
    }
    
    if (extraKeys.length > 0) {
      this.log('WARN', `Extra translation keys in ${langCode}:`, extraKeys.join(', '));
    }
    
    if (missingKeys.length === 0 && extraKeys.length === 0) {
      this.log('SUCCESS', `All required keys present in ${langCode}`);
    }
  }

  validateFormat(langCode, content) {
    this.log('INFO', `Checking format for ${langCode}...`);
    
    // Check for TypeScript export
    if (!content.includes('export default {')) {
      this.log('ERROR', `${langCode} must use 'export default {' syntax`);
    }
    
    // Check for proper header
    if (!content.includes('* Translator:')) {
      this.log('WARN', `${langCode} missing translator information in header`);
    }
    
    // Check for template markers
    const templateMarkers = content.match(/\[TRANSLATE:/g);
    if (templateMarkers && templateMarkers.length > 0) {
      this.log('ERROR', `${langCode} contains ${templateMarkers.length} untranslated template markers`);
    }
    
    // Check for proper quotes
    const badQuotes = content.match(/['"][^'"]*['"][^,]/g);
    if (badQuotes && badQuotes.some(quote => !quote.endsWith(','))) {
      this.log('WARN', `${langCode} may have missing commas after translations`);
    }
  }

  validateTranslations(langCode, content) {
    this.log('INFO', `Checking translation quality for ${langCode}...`);
    
    // Extract translations
    const translations = {};
    const regex = /'([^']+)':\s*'([^']*)'/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      translations[match[1]] = match[2];
    }
    
    // Check for empty translations
    const emptyTranslations = Object.entries(translations)
      .filter(([key, value]) => !value.trim())
      .map(([key]) => key);
    
    if (emptyTranslations.length > 0) {
      this.log('ERROR', `Empty translations in ${langCode}:`, emptyTranslations.join(', '));
    }
    
    // Check for very long translations that might break UI
    const longTranslations = Object.entries(translations)
      .filter(([key, value]) => {
        // Different length limits for different types
        if (key.startsWith('mobile.')) return value.length > 15;
        if (key.includes('button') || key.includes('btn')) return value.length > 20;
        if (key.includes('title') || key.includes('placeholder')) return value.length > 50;
        return value.length > 100;
      })
      .map(([key, value]) => `${key} (${value.length} chars)`);
    
    if (longTranslations.length > 0) {
      this.log('WARN', `Potentially long translations in ${langCode}:`, longTranslations.join(', '));
    }
    
    // Check parameter preservation
    const parameterKeys = Object.entries(translations)
      .filter(([key, value]) => key.includes('{') || value.includes('{'))
      .forEach(([key, value]) => {
        const keyParams = (key.match(/\{[^}]+\}/g) || []);
        const valueParams = (value.match(/\{[^}]+\}/g) || []);
        
        if (keyParams.length !== valueParams.length) {
          this.log('ERROR', `Parameter mismatch in ${langCode}:`, `${key} - expected ${keyParams.join(',')}, got ${valueParams.join(',')}`);
        }
      });
  }

  async validateAll() {
    this.log('INFO', 'Starting validation of all translations...');
    
    // Get all language files
    const files = fs.readdirSync(this.localesDir)
      .filter(file => file.endsWith('.ts') && !file.startsWith('_'))
      .map(file => file.replace('.ts', ''));
    
    this.log('INFO', `Found languages: ${files.join(', ')}`);
    
    let allValid = true;
    for (const langCode of files) {
      const isValid = await this.validateLanguage(langCode);
      if (!isValid) allValid = false;
      console.log(); // Add spacing between languages
    }
    
    return allValid;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log(`${colors.bold}VALIDATION SUMMARY${colors.reset}`);
    console.log('='.repeat(60));
    
    if (this.errors.length > 0) {
      console.log(`${colors.red}❌ ${this.errors.length} error(s)${colors.reset}`);
    }
    
    if (this.warnings.length > 0) {
      console.log(`${colors.yellow}⚠️  ${this.warnings.length} warning(s)${colors.reset}`);
    }
    
    if (this.info.length > 0) {
      console.log(`${colors.blue}ℹ️  ${this.info.length} info message(s)${colors.reset}`);
    }
    
    if (this.errors.length === 0) {
      console.log(`${colors.green}✅ All validations passed!${colors.reset}`);
    }
  }
}

// Main execution
async function main() {
  const validator = new TranslationValidator();
  const langCode = process.argv[2];
  
  let success;
  if (langCode) {
    success = await validator.validateLanguage(langCode);
  } else {
    success = await validator.validateAll();
  }
  
  validator.printSummary();
  
  // Exit with error code if validation failed
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = TranslationValidator; 