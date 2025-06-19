# Simple Notepad

A truly simple notepad application built with Tauri + TypeScript + Tailwind CSS.

## 📱 Try the Demo

**[Try the Web Demo Now](https://takuto-na.github.io/simple-notepad/)** (Available instantly in your browser)

- ✅ Experience all text editing features
- ⚠️ File saving works as "download" functionality
- 📥 Download the desktop version if you like it

## 🌐 Internationalization Support

- **Automatic Language Detection**: Detects your browser language automatically
- **Languages Supported**: 
  - 🇺🇸 English (en)
  - 🇯🇵 Japanese (ja)
- **Manual Override**: Switch languages manually using the language selector
- **Extensible Architecture**: Easy to add new languages
- **Fallback System**: Graceful fallback to English for missing translations

Want to contribute translations? See [CONTRIBUTING_I18N.md](CONTRIBUTING_I18N.md) for detailed instructions.

## Design Philosophy

- **Singularity**: One window, one memo only
- **Minimal UI**: Maximize writing area, minimize UI elements
- **Practical Focus**: Prioritize practical functionality over decoration

## Features

### ✅ File Operations
- New file (Ctrl+N)
- Open file (Ctrl+O)
- Save (Ctrl+S)
- Save As (Ctrl+Shift+S)
- Drag & drop file loading

### ✅ Editing Features
- Undo/Redo (Ctrl+Z, Ctrl+Y)
- Tab insertion and Shift+Tab for tab removal
- Text search (Ctrl+F)
- Text replace (Ctrl+H)

### ✅ Display Features
- Toggle line numbers
- Font size adjustment (12px-20px)
- Word wrap toggle
- Detailed status bar (line/column position, character count, encoding)

### ✅ Usability
- Manual dark mode toggle (Ctrl+D)
- Rich keyboard shortcuts
- Unsaved changes protection
- Character encoding & line ending selection

### 📱 Mobile Support (New Feature!)
- **Responsive UI**: Interface optimized for smartphones and tablets
- **Hamburger Menu**: Access all features on small screens
- **Touch Optimization**: Button sizes optimized for finger operation
- **Mobile-Specific Settings**: Easy font size and encoding changes on mobile

### 🌐 Internationalization (New Feature!)
- **Multi-language Support**: Japanese and English with automatic detection
- **Language Switching**: Manual language override with persistent preferences
- **Extensible Translation System**: Easy addition of new languages
- **Translation Validation**: Automated quality assurance for translations

## Keyboard Shortcuts

| Feature | Shortcut |
|---------|----------|
| New file | `Ctrl+N` |
| Open file | `Ctrl+O` |
| Save | `Ctrl+S` |
| Save As | `Ctrl+Shift+S` |
| Undo | `Ctrl+Z` |
| Redo | `Ctrl+Y` |
| Find | `Ctrl+F` |
| Replace | `Ctrl+H` |
| Toggle dark mode | `Ctrl+D` |
| Close search bar | `Escape` |

## Excluded Features

- ❌ Multiple memo management
- ❌ Tab functionality
- ❌ Auto-save
- ❌ Cloud synchronization
- ❌ Rich text editing

## Development Environment Setup

### 🖥️ PC/Mac Environment

#### Prerequisites

- Node.js (18.0 or higher)
- Rust (latest version)
- pnpm

#### Installation

```bash
# Install dependencies
pnpm install

# 🌐 Web version development (demo)
pnpm dev                # Web development server
pnpm build:web          # Web build
pnpm preview:web        # Web preview

# 🖥️ Desktop version development
pnpm dev:tauri          # Tauri app development
pnpm build:tauri        # Desktop app build

# 🌐 Translation validation
pnpm validate-translations        # Validate all translations
pnpm validate-translation ja      # Validate specific language
```

### 🍓 Raspberry Pi Environment

#### System Requirements

- **Recommended**: Raspberry Pi 4 (4GB RAM or more)
- **OS**: Raspberry Pi OS Bullseye or later
- **Storage**: 2GB+ free space

#### Setup Instructions

```bash
# 1. System update
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# 4. Install required dependencies
sudo apt install -y libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

# 5. Install pnpm
npm install -g pnpm

# 6. Prepare project
cd scripts/GUI/tauri/memo
pnpm install

# 7. Raspberry Pi optimization (reduce memory usage)
export NODE_OPTIONS="--max_old_space_size=1024"

# 8. Start development server (lightweight mode)
pnpm tauri dev

# 9. Production build (takes time)
pnpm tauri build --target armv7-unknown-linux-gnueabihf
```

#### Raspberry Pi Optimization Settings

```bash
# Add to ~/.bashrc for memory optimization
echo 'export NODE_OPTIONS="--max_old_space_size=1024"' >> ~/.bashrc
echo 'export CARGO_BUILD_JOBS=1' >> ~/.bashrc  # Single-core build
source ~/.bashrc
```

#### Performance Improvement Tips

1. **Use SSD**: USB SSD instead of microSD for better performance
2. **Cooling**: Fan recommended for extended work sessions
3. **Memory**: 4GB+ models recommended
4. **Lightweight Browser**: Use lighter browser engine than Chromium

## Contributing Translations

We welcome translation contributions! The process is designed to be simple and accessible:

1. **Copy the template**: Start with `src/i18n/locales/_template.ts`
2. **Translate**: Replace English text with your language
3. **Validate**: Run `pnpm validate-translation [your-language-code]`
4. **Submit**: Create a pull request

For detailed instructions, see [CONTRIBUTING_I18N.md](CONTRIBUTING_I18N.md).

## Technology Stack

- **Frontend**: TypeScript, HTML, CSS
- **UI Framework**: Tailwind CSS
- **Desktop Framework**: Tauri
- **Backend**: Rust
- **Internationalization**: Custom modular i18n system
- **Data Storage**: Explicit file saving only

## Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| Windows | ✅ Full support | |
| macOS | ✅ Full support | |
| Linux (x64) | ✅ Full support | |
| **Raspberry Pi** | ✅ Supported | Pi 3+ recommended |
| ARM64 Linux | ✅ Supported | |

## File Structure

```
├── src/
│   ├── main.ts          # Main TypeScript file
│   ├── styles.css       # Tailwind CSS + custom styles
│   └── i18n/           # Internationalization system
│       ├── languages.ts      # Language registry
│       └── locales/          # Translation files
│           ├── _template.ts  # Template for new languages
│           ├── en.ts         # English translations
│           └── ja.ts         # Japanese translations
├── scripts/
│   └── validate-translations.js  # Translation validation tool
├── index.html           # Main HTML file
├── src-tauri/          # Tauri backend (Rust)
├── package.json        # Node.js dependencies
├── tailwind.config.js  # Tailwind CSS configuration
├── CONTRIBUTING_I18N.md # Translation contribution guide
└── .gitignore          # Git ignore file settings
```

## Data Storage Policy

- **Basic Principle**: Explicit saving only (no auto-save)
- **Emergency Only**: Temporary save only during app crashes

## npm Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start web development server |
| `pnpm dev:tauri` | Start Tauri development |
| `pnpm build:web` | Build web version |
| `pnpm build:tauri` | Build desktop version |
| `pnpm validate-translations` | Validate all translations |
| `pnpm validate-translation [lang]` | Validate specific language |

## License

This project is open source. Feel free to use, modify, and distribute according to the license terms.

## Feedback & Contributions

We welcome feedback and contributions! Whether you want to:
- Report bugs or suggest features
- Add translations for new languages
- Improve the codebase
- Enhance documentation

Please feel free to open an issue or submit a pull request.
