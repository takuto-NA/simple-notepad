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

### 🚀 Auto-Update System (New Feature!)
- **Organizational Code Signing**: Enterprise-level security with cryptographic verification
- **Silent Background Checks**: Non-intrusive update detection
- **One-Click Updates**: Download, verify, install, and restart automatically
- **Multi-Maintainer Management**: Democratic development with no single point of failure
- **Transparent Security**: Complete audit trail and open-source verification

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

## 🔐 Security & Auto-Update System

### 🚀 Automatic Updates (New Feature!)

This application features **enterprise-level automatic updates** with organizational code signing for maximum security and transparency.

#### How It Works
1. **Silent Background Check**: Updates checked 5 minutes after startup
2. **Non-Intrusive Notification**: `🚀 Update` button appears when updates available
3. **One-Click Update**: Download, verify, install, and restart automatically
4. **Signature Verification**: All updates cryptographically verified before installation
5. **Transparent Process**: Complete update process visible to users

#### User Experience
- ✅ **Zero Configuration**: Works automatically
- ✅ **Non-Disruptive**: No forced updates or annoying popups
- ✅ **Opt-in Only**: Users choose when to update
- ✅ **Progress Indicators**: Clear feedback during download and installation
- ✅ **Automatic Restart**: Seamless transition to new version

### 🛡️ Security Architecture

#### Organizational Code Signing
- **Multi-Maintainer System**: No single point of failure
- **GitHub Secrets Management**: Cryptographically secure key storage
- **Democratic Development**: Multiple administrators can manage releases
- **Audit Trail**: All changes tracked in public GitHub history
- **Key Rotation**: Easy key replacement when needed

#### Cryptographic Security
- **Ed25519 Signatures**: Modern, secure signing algorithm
- **TLS Encryption**: All downloads encrypted in transit
- **Integrity Verification**: Files verified before installation
- **Tamper Detection**: Modified files automatically rejected
- **Chain of Trust**: Signatures linked to verified GitHub repository

#### Transparency Measures
- **Open Source**: All code publicly auditable
- **Public Build Process**: GitHub Actions workflows visible to all
- **Reproducible Builds**: Anyone can verify build authenticity
- **Security Documentation**: This section provides complete security overview
- **Community Oversight**: Open to security researchers and community review

### 🔑 Signing Key Management

#### Organizational Approach
Our signing system uses **organizational management** rather than individual developer keys:

- **Shared Responsibility**: Multiple trusted maintainers can manage updates
- **Succession Planning**: Project continues even if original developer unavailable
- **Community Trust**: Built on GitHub's infrastructure and transparency
- **No Personal Dependencies**: No individual passwords or personal information required

#### How Keys Are Protected
1. **Generation**: Keys generated locally using secure random algorithms
2. **Storage**: Private keys encrypted and stored in GitHub Secrets
3. **Access Control**: Only repository administrators can access keys
4. **Distribution**: Public keys embedded in application for verification
5. **Rotation**: Keys can be replaced through standard GitHub processes

#### For Developers and Security Researchers
- **Key Information**: Public keys visible in `src-tauri/tauri.conf.json`
- **Build Process**: Signing process documented in `.github/workflows/`
- **Verification**: Anyone can verify signature authenticity
- **Security Issues**: Report to repository issues or security contacts

### 🏢 Trust Model

#### Why This Approach Is Secure
1. **Decentralized Control**: Not dependent on single individual
2. **GitHub Infrastructure**: Leverages Microsoft's security investments
3. **Open Audit**: All processes visible and verifiable
4. **Community Oversight**: Transparent to security community
5. **Standard Practices**: Follows industry-standard code signing practices

#### What Users Can Verify
- ✅ **Source Code**: Complete application source available on GitHub
- ✅ **Build Process**: All build scripts and workflows public
- ✅ **Signatures**: Every release cryptographically signed
- ✅ **Update Mechanism**: Update process documented and auditable
- ✅ **Key Management**: Signing architecture explained in detail

### 🔄 Update Process Details

#### For End Users
1. Application checks for updates 5 minutes after startup
2. If update available, non-intrusive `🚀 Update` button appears
3. Clicking button downloads and verifies update signature
4. If signature valid, update installs and application restarts
5. If signature invalid, update rejected and user notified

#### For Developers
1. Create git tag (e.g., `git tag v1.2.0`)
2. Push tag to trigger release workflow
3. GitHub Actions builds for all platforms
4. Each build signed with organizational key
5. `latest.json` manifest generated with signatures
6. Release published with signed binaries

### 🆘 Security Contact

For security issues or questions about the signing process:
- **GitHub Issues**: [Report publicly](https://github.com/takuto-NA/simple-notepad/issues) for non-sensitive issues
- **Security Concerns**: Use GitHub's private reporting for sensitive matters
- **Key Verification**: All public keys can be verified through repository history

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

| Platform | Status | Auto-Update | Notes |
|----------|--------|------------|-------|
| Windows | ✅ Full support | ✅ Signed MSI | Enterprise-level security |
| macOS | ✅ Full support | ✅ Signed DMG | Apple notarization ready |
| Linux (x64) | ✅ Full support | ✅ Signed AppImage | Universal compatibility |
| **Raspberry Pi** | ✅ Supported | ✅ ARM builds | Pi 3+ recommended |
| ARM64 Linux | ✅ Supported | ✅ Native ARM64 | High performance |

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
