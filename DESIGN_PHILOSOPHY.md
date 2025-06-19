# Pure Function Apps - Design Philosophy

This document outlines the common design philosophy for developing simple and practical desktop application suites.

## 🎯 Five Core Philosophies

### 1. Single-Function Purity (Pure Function Philosophy)
- **One app = One clear purpose**
- Specialized rather than composite functions
- Unix philosophy: "Do one thing, and do it well"

### 2. Instant Ready State
- **Startup = Immediate work readiness**
- Fresh blank state, not history or settings screens
- Experience that lets you start with a "fresh mindset"

### 3. Lightweight Universal
- **Same experience everywhere**
- Native performance + Web compatibility
- Minimal resource consumption
- Smooth operation even on Raspberry Pi

### 4. Visual Minimalism
- **Function is the appearance**
- Utility > Decoration
- Minimize cognitive load
- 90%+ dedicated to work area

### 5. Intuitive Interaction
- **Usable without thinking**
- Keyboard-first design
- Mouse as auxiliary
- Unified shortcuts

## 🛠️ Standard Technology Stack

### Frontend
- **Framework**: Tauri + TypeScript
- **Styling**: Tailwind CSS
- **Rendering**: HTML/CSS/JavaScript

### Backend
- **Language**: Rust
- **Permissions**: Minimal permission requirements

### Distribution
- **Format**: Single executable file
- **Size**: Target under 10MB
- **Startup Time**: Within 3 seconds

## 📋 Application Design Checklist

### ✅ Startup/Shutdown
- [ ] Startup within 3 seconds
- [ ] Start in blank/initial state
- [ ] Unsaved data confirmation dialog
- [ ] Auto-save only in emergencies

### ✅ UI/UX
- [ ] 90%+ work area
- [ ] Minimal necessary toolbar
- [ ] Icon-based buttons
- [ ] Dark mode support
- [ ] Consistent keyboard shortcuts

### ✅ Performance
- [ ] Memory usage under 200MB
- [ ] CPU usage under 5% at idle
- [ ] Large data handling
- [ ] Raspberry Pi operation verification

### ✅ Compatibility
- [ ] Windows/macOS/Linux support
- [ ] ARM64 support (Apple Silicon/Raspberry Pi)
- [ ] Japanese language support
- [ ] Automatic character encoding detection

## 🎨 UI Design Patterns

### Layout Structure
```
┌─────────────────────────────────┐
│ [🔧] [💾] [🔍] [⚙️]    [Status]  │ ← Toolbar (minimal)
├─────────────────────────────────┤
│                                 │
│                                 │
│        Main Work Area           │ ← 90%+ of space
│                                 │
│                                 │
├─────────────────────────────────┤
│ Line:1 Col:1 | Chars:0 | UTF-8   │ ← Status bar
└─────────────────────────────────┘
```

### Color Palette
```css
/* Light Mode */
--bg-primary: #ffffff
--bg-secondary: #f8f9fa
--text-primary: #1a1a1a
--text-secondary: #666666
--border: #e5e5e5
--accent: #2563eb

/* Dark Mode */
--bg-primary: #1a1a1a
--bg-secondary: #2d2d2d
--text-primary: #ffffff
--text-secondary: #a0a0a0
--border: #404040
--accent: #60a5fa
```

### Button Style
- 32x32px square
- Emoji icons
- Visual feedback on hover
- Active state indication

## ⌨️ Standard Keyboard Shortcuts

### Common Operations
| Function | Shortcut | Notes |
|----------|----------|-------|
| New | `Ctrl+N` | All apps |
| Open File | `Ctrl+O` | File-based apps |
| Save | `Ctrl+S` | All apps |
| Save As | `Ctrl+Shift+S` | All apps |
| Undo | `Ctrl+Z` | Edit apps |
| Redo | `Ctrl+Y` | Edit apps |
| Find | `Ctrl+F` | Search-enabled apps |
| Replace | `Ctrl+H` | Edit apps |
| Toggle Dark Mode | `Ctrl+D` | All apps |
| Settings | `Ctrl+,` | Apps with settings |
| Exit | `Alt+F4` | Windows standard |

### App-Specific Operations
- Assign `Ctrl+Enter` to main app function
- Sub-functions assigned to `Ctrl+number`

## 📁 Project Structure Template

```
app-name/
├── src/
│   ├── main.ts           # Main logic
│   ├── styles.css        # Style definitions
│   └── types.ts          # Type definitions
├── src-tauri/
│   ├── src/
│   │   └── main.rs       # Rust backend
│   ├── tauri.conf.json   # Tauri configuration
│   └── Cargo.toml        # Rust dependencies
├── index.html            # Main HTML
├── package.json          # Node.js dependencies
├── tailwind.config.js    # Tailwind configuration
├── README.md             # Usage instructions
├── DESIGN_PHILOSOPHY.md  # Design philosophy
└── .gitignore           # Git configuration
```

## 🚀 Application Roadmap

### 🔧 Utility Suite
- [x] **Simple Notepad** - Text editing focused
- [ ] **Clock & Timer** - Large display for presentations
- [ ] **QR Code Generator** - Instant text/URL conversion
- [ ] **Hash Converter** - MD5/SHA256/BASE64 batch processing
- [ ] **Archive Tool** - Drag & drop compression/extraction

### 🎨 Creative Suite
- [ ] **Simple Paint** - Transparent PNG/pixel art support
- [ ] **Screenshot Tool** - Area selection/annotation features
- [ ] **Diagram Helper** - Wiring diagrams/flowcharts focused

### 📁 Media Suite
- [ ] **Image Viewer** - Batch display/thumbnails
- [ ] **Media Converter** - Video/image/audio batch conversion
- [ ] **Media Player** - Lightweight playback

### 📅 Productivity Suite
- [ ] **Scheduler** - Toast notification support
- [ ] **App Launcher** - Keyboard operation focused
- [ ] **File Cleaner** - Unnecessary data detection/removal

### 🔒 Security Suite
- [ ] **Steganography** - Image data hiding
- [ ] **File Encryption** - AES256 support

## 💡 Implementation Guidelines

### Startup Behavior
```typescript
// ❌ Bad example: Show history
async function onAppStart() {
  showRecentFiles();
  loadLastSession();
}

// ✅ Good example: Fresh state
async function onAppStart() {
  initializeCleanState();
  focusMainInput();
}
```

### Error Handling
```typescript
// User-friendly error display
function handleError(error: Error) {
  showToast({
    type: 'error',
    message: 'An error occurred during processing',
    detail: error.message,
    duration: 5000
  });
}
```

### Performance Optimization
```typescript
// Debounce for large data processing
const debouncedUpdate = debounce((data) => {
  updateUI(data);
}, 100);
```

## 🌍 Internationalization Policy

### Priority Order
1. **English** - Primary language
2. **Japanese** - Secondary support
3. **Others** - Based on demand

### Implementation Strategy
- Externalize UI strings
- Use emoji icons to reduce language dependency
- Follow international standards for numbers/symbols

## 📊 Quality Standards

### Performance Metrics
- Startup time: Within 3 seconds
- Memory usage: Under 200MB
- Binary size: Under 10MB
- Response time: Within 100ms

### Quality Checklist
- [ ] All platform operation verification
- [ ] Raspberry Pi operation verification  
- [ ] Large data processing verification
- [ ] Memory leak verification
- [ ] Keyboard shortcut verification
- [ ] Dark mode verification
- [ ] International input verification

---

## 🎊 Development Flow

1. **Concept Design** - Clarify single function
2. **UI/UX Mockup** - Ensure 90% work area
3. **Prototype Development** - Core functions only
4. **Performance Optimization** - Raspberry Pi baseline
5. **Multi-platform Verification** - All environment checks
6. **Documentation** - README + usage instructions
7. **Release** - Single executable distribution

---

*We continue creating truly useful, simple applications based on this philosophy.* 