#!/usr/bin/env node

/**
 * 自動リリースノート生成スクリプト
 * Gitコミット履歴から意味のあるリリースノートを自動生成
 */

import { execSync } from 'child_process';

/**
 * Commit type classification
 */
const COMMIT_TYPES = {
  feat: { emoji: '✨', label: 'New Features', priority: 1 },
  fix: { emoji: '🐛', label: 'Bug Fixes', priority: 2 },
  perf: { emoji: '⚡', label: 'Performance Improvements', priority: 3 },
  refactor: { emoji: '♻️', label: 'Code Refactoring', priority: 4 },
  style: { emoji: '💄', label: 'Styles', priority: 5 },
  docs: { emoji: '📚', label: 'Documentation', priority: 6 },
  test: { emoji: '🧪', label: 'Tests', priority: 7 },
  build: { emoji: '🔧', label: 'Build System', priority: 8 },
  ci: { emoji: '👷', label: 'CI/CD', priority: 9 },
  chore: { emoji: '🔨', label: 'Other Changes', priority: 10 }
};

/**
 * コミットメッセージから種類を抽出
 */
function parseCommitType(message) {
  // Conventional Commits format: type(scope): description
  const match = message.match(/^(\w+)(\(.+\))?\s*:\s*(.+)/);
  if (match) {
    const type = match[1].toLowerCase();
    const scope = match[2] ? match[2].replace(/[()]/g, '') : null;
    const description = match[3];
    return { type, scope, description, original: message };
  }

  // Emoji prefix format: 🐛 Fix something
  const emojiMatch = message.match(/^([🔖✨🐛⚡♻️💄📚🧪🔧👷🔨🚀])\s*(.+)/);
  if (emojiMatch) {
    const emoji = emojiMatch[1];
    const description = emojiMatch[2];
    
    // Emoji to type mapping
    const emojiToType = {
      '🔖': 'release',
      '✨': 'feat',
      '🐛': 'fix', 
      '⚡': 'perf',
      '♻️': 'refactor',
      '💄': 'style',
      '📚': 'docs',
      '🧪': 'test',
      '🔧': 'build',
      '👷': 'ci',
      '🔨': 'chore',
      '🚀': 'feat'
    };
    
    const type = emojiToType[emoji] || 'chore';
    return { type, scope: null, description, original: message };
  }

  // Smart detection based on keywords
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('fix') || lowerMessage.includes('bug') || lowerMessage.includes('error')) {
    return { type: 'fix', scope: null, description: message, original: message };
  }
  if (lowerMessage.includes('add') || lowerMessage.includes('new') || lowerMessage.includes('feature')) {
    return { type: 'feat', scope: null, description: message, original: message };
  }
  if (lowerMessage.includes('improve') || lowerMessage.includes('enhance') || lowerMessage.includes('optimize')) {
    return { type: 'perf', scope: null, description: message, original: message };
  }
  if (lowerMessage.includes('refactor') || lowerMessage.includes('restructure')) {
    return { type: 'refactor', scope: null, description: message, original: message };
  }
  if (lowerMessage.includes('style') || lowerMessage.includes('ui') || lowerMessage.includes('design')) {
    return { type: 'style', scope: null, description: message, original: message };
  }
  if (lowerMessage.includes('doc') || lowerMessage.includes('readme')) {
    return { type: 'docs', scope: null, description: message, original: message };
  }
  if (lowerMessage.includes('test')) {
    return { type: 'test', scope: null, description: message, original: message };
  }
  if (lowerMessage.includes('build') || lowerMessage.includes('deps') || lowerMessage.includes('dependencies')) {
    return { type: 'build', scope: null, description: message, original: message };
  }
  if (lowerMessage.includes('ci') || lowerMessage.includes('workflow') || lowerMessage.includes('action')) {
    return { type: 'ci', scope: null, description: message, original: message };
  }

  return { type: 'chore', scope: null, description: message, original: message };
}

/**
 * Get commits since last tag
 */
function getCommitsSinceLastTag(currentTag) {
  try {
    // Get previous tag
    const previousTag = execSync(
      'git describe --tags --abbrev=0 HEAD^', 
      { encoding: 'utf8' }
    ).trim();

    console.log(`📋 Previous tag: ${previousTag}`);
    console.log(`🆕 Current tag: ${currentTag}`);

    // Get commits from previous tag to current tag
    const commits = execSync(
      `git log ${previousTag}..HEAD --pretty=format:"%H|%s|%an|%ad" --date=short`,
      { encoding: 'utf8' }
    );

    return commits.split('\n').filter(line => line.trim()).map(line => {
      const [hash, message, author, date] = line.split('|');
      return { hash: hash.substring(0, 7), message, author, date };
    });

  } catch (error) {
    console.log('⚠️  No previous tag found. Using all commits.');
    
    // For first release, get all commits
    const commits = execSync(
      'git log --pretty=format:"%H|%s|%an|%ad" --date=short',
      { encoding: 'utf8' }
    );

    return commits.split('\n').slice(0, 20).filter(line => line.trim()).map(line => {
      const [hash, message, author, date] = line.split('|');
      return { hash: hash.substring(0, 7), message, author, date };
    });
  }
}

/**
 * Categorize commits and generate release notes
 */
function generateReleaseNotes(currentTag, targetFormat = 'github') {
  const commits = getCommitsSinceLastTag(currentTag);
  
  if (commits.length === 0) {
    return {
      markdown: "No new changes in this release.",
      json: "No new changes in this release."
    };
  }

  console.log(`📦 Analyzing ${commits.length} commits...`);

  // Categorize commits
  const categorized = {};
  const breakingChanges = [];
  const authors = new Set();

  commits.forEach(commit => {
    const parsed = parseCommitType(commit.message);
    
    // Breaking changes detection
    if (commit.message.includes('BREAKING CHANGE') || commit.message.includes('!:')) {
      breakingChanges.push({ ...commit, parsed });
    }

    // Authors tracking
    authors.add(commit.author);

    // Categorization
    const typeInfo = COMMIT_TYPES[parsed.type] || COMMIT_TYPES.chore;
    if (!categorized[parsed.type]) {
      categorized[parsed.type] = {
        ...typeInfo,
        commits: []
      };
    }
    categorized[parsed.type].commits.push({ ...commit, parsed });
  });

  // Sort categories by priority
  const sortedCategories = Object.entries(categorized)
    .sort(([, a], [, b]) => a.priority - b.priority);

  // Generate different formats
  if (targetFormat === 'json') {
    return generateJSONNotes(currentTag, sortedCategories, breakingChanges, Array.from(authors));
  } else {
    return generateMarkdownNotes(currentTag, sortedCategories, breakingChanges, Array.from(authors));
  }
}

/**
 * Generate simple JSON notes for GitHub/latest.json
 */
function generateJSONNotes(version, categories, breakingChanges, authors) {
  let notes = `🚀 Simple Notepad ${version} has been released\\n\\n`;

  // Major changes summary
  const majorCategories = categories.filter(([, cat]) => 
    ['feat', 'fix', 'perf'].includes(cat.commits[0]?.parsed.type)
  );

  if (majorCategories.length > 0) {
    notes += '✨ What\\'s New:\\n';
    majorCategories.slice(0, 3).forEach(([, category]) => {
      const count = category.commits.length;
      notes += `• ${category.label}: ${count} improvement${count > 1 ? 's' : ''}\\n`;
    });
    notes += '\\n';
  }

  // Breaking changes warning
  if (breakingChanges.length > 0) {
    notes += '⚠️ Important changes included. Please check the release page for details.\\n\\n';
  }

  notes += '🔗 View detailed changelog on the release page.';

  return notes;
}

/**
 * Generate detailed Markdown notes for GitHub Release
 */
function generateMarkdownNotes(version, categories, breakingChanges, authors) {
  let markdown = `🚀 Simple Notepad ${version} has been released\n\n`;

  // Breaking changes section
  if (breakingChanges.length > 0) {
    markdown += '## ⚠️ Breaking Changes\n\n';
    breakingChanges.forEach(commit => {
      markdown += `- ${commit.parsed.description} (${commit.hash})\n`;
    });
    markdown += '\n';
  }

  // Changes by category
  categories.forEach(([type, category]) => {
    if (category.commits.length === 0) return;

    markdown += `## ${category.emoji} ${category.label}\n\n`;
    
    category.commits.forEach(commit => {
      const scope = commit.parsed.scope ? `**${commit.parsed.scope}**: ` : '';
      markdown += `- ${scope}${commit.parsed.description} (${commit.hash})\n`;
    });
    markdown += '\n';
  });

  // Statistics
  const totalCommits = categories.reduce((sum, [, cat]) => sum + cat.commits.length, 0);
  markdown += `## 📊 Release Statistics\n\n`;
  markdown += `- **Total commits**: ${totalCommits}\n`;
  markdown += `- **Contributors**: ${authors.length}\n`;
  
  if (authors.length <= 5) {
    markdown += `- **Contributors list**: ${authors.join(', ')}\n`;
  }
  
  markdown += '\n';

  // Downloads section
  markdown += '## 💾 Downloads\n\n';
  markdown += '- **Windows**: `.msi` or `.exe` files\n';
  markdown += '- **macOS**: `.dmg` or `.app.tar.gz` files\n';
  markdown += '- **Linux (x64)**: `*-x64.deb` or `*-x64.AppImage` files\n';
  markdown += '- **🍓 Raspberry Pi 4+ (ARM64)**: `*-arm64.deb` or `*-arm64.AppImage` files\n';
  markdown += '- **🍓 Raspberry Pi 3+ (ARMv7)**: `*-armv7.deb` or `*-armv7.AppImage` files\n\n';
  
  markdown += '## 🌐 Try Online\n\n';
  markdown += '[Try in your browser now](https://takuto-na.github.io/simple-notepad/)\n\n';
  
  markdown += '---\n\n';
  markdown += '🤖 This release note was automatically generated\n';

  return markdown;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const currentTag = args[0];
  const format = args[1] || 'github';

  if (!currentTag) {
    console.error('❌ Usage: node generate-release-notes.js <tag> [format]');
    console.error('   Example: node generate-release-notes.js v1.3.6 github');
    console.error('   Formats: github (default), json');
    process.exit(1);
  }

  console.log(`📝 Generating release notes for ${currentTag}...\n`);

  try {
    const notes = generateReleaseNotes(currentTag, format);
    
    if (format === 'json') {
      // JSON format (for latest.json)
      console.log('=== JSON FORMAT (for latest.json) ===');
      console.log(notes);
    } else {
      // Markdown format (for GitHub Release)
      console.log('=== MARKDOWN FORMAT (for GitHub Release) ===');
      console.log(notes);
    }

  } catch (error) {
    console.error('❌ Release notes generation error:', error.message);
    process.exit(1);
  }
}

// Export for use in other scripts
export { generateReleaseNotes, parseCommitType };

// CLI実行時のメイン処理
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}