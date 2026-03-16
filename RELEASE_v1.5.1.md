# Release v1.5.1 - Compatibility & Documentation Improvements

**Release Date**: 2026-03-17
**Type**: Patch Release (Bug Fixes + Documentation)

---

## 🐛 Bug Fixes

### Bash Compatibility Fix
- **Problem**: `${variable^^}` syntax requires Bash 4.0+, breaking on macOS (Bash 3.2) and other shells
- **Fix**: Replace with portable `tr '[:lower:]' '[:upper:]'` command
- **Affected**: `scripts/providers/utils.sh`
- **Impact**: Now works on macOS, zsh, sh, and all Bash versions
- **Reference**: [COMPATIBILITY_FIX_2026-03-16.md](COMPATIBILITY_FIX_2026-03-16.md)

---

## 📚 Documentation Improvements

### Installation Guide Enhancement
- **Added**: Installation method comparison table
- **Added**: macOS special instructions (permission fixes, environment variables)
- **Improved**: Clear guidance on when to use npm global vs git clone
- **Files**: README.md, openclaw-skill/SKILL.md
- **Reference**: [DOCUMENTATION_UPDATE_2026-03-17.md](DOCUMENTATION_UPDATE_2026-03-17.md)

### Repository Path Consistency Fix
- **Problem**: Documentation referenced incorrect repository name `openclaw-video` instead of `openclaw-video-generator`
- **Fix**: Updated all references to use correct repository name
- **Affected**: README.md (5 locations)
- **Reference**: [PATH_FIX_2026-03-17.md](PATH_FIX_2026-03-17.md)

### Error Message Improvements
- **Improved**: Unknown argument error shows valid options
- **Improved**: File path error provides usage examples
- **Impact**: Better user experience for beginners
- **Files**: `scripts/script-to-video.sh`

---

## 🎯 What's Changed

### Core Improvements
1. ✅ **Cross-platform compatibility** - Works on macOS, Linux, Windows WSL
2. ✅ **Better error messages** - Clearer guidance when users make mistakes
3. ✅ **Comprehensive documentation** - Installation guides for all platforms
4. ✅ **Path consistency** - All references use correct repository name

### Files Modified
- `package.json` - Version bump to 1.5.1
- `scripts/providers/utils.sh` - Bash compatibility fix
- `scripts/script-to-video.sh` - Error message improvements
- `README.md` - Installation guide and path fixes
- `openclaw-skill/SKILL.md` - Installation guide updates
- `.gitignore` - Exclude test files

### Documentation Added
- `COMPATIBILITY_FIX_2026-03-16.md` - Bash compatibility analysis
- `DOCUMENTATION_UPDATE_2026-03-17.md` - Documentation update details
- `PATH_FIX_2026-03-17.md` - Path consistency fix details

---

## 🔄 Upgrade Guide

### For npm Users
```bash
npm update -g openclaw-video-generator
```

### For Git Clone Users
```bash
cd ~/openclaw-video-generator
git pull
npm install
```

### Breaking Changes
None - This is a fully backward-compatible patch release.

---

## 🐛 Known Issues
None

---

## 📊 Impact Analysis

| Platform | Before | After |
|----------|--------|-------|
| **Linux** | ✅ Works | ✅ Works |
| **macOS** | ❌ Bash error | ✅ Fixed |
| **Windows WSL** | ✅ Works | ✅ Works |

| User Experience | Before | After |
|-----------------|--------|-------|
| **Error clarity** | ⚠️ Basic | ✅ Detailed |
| **Documentation** | ⚠️ Incomplete | ✅ Comprehensive |
| **Path consistency** | ❌ Incorrect | ✅ Fixed |

---

## 🙏 Credits

- **Compatibility Fix**: Identified by macOS user feedback
- **Documentation**: Based on user confusion about installation methods
- **Testing**: Verified on Linux (Ubuntu), compatible with macOS Bash 3.2+

---

## 📝 Full Changelog

**v1.5.1** (2026-03-17):
- Fix: Bash 4.0+ syntax compatibility issue (`${var^^}`)
- Fix: Incorrect repository path in documentation
- Improve: Error messages with usage examples
- Improve: Installation documentation with platform-specific guides
- Improve: .gitignore to exclude test files
- Docs: Add COMPATIBILITY_FIX_2026-03-16.md
- Docs: Add DOCUMENTATION_UPDATE_2026-03-17.md
- Docs: Add PATH_FIX_2026-03-17.md

---

**GitHub**: https://github.com/ZhenRobotics/openclaw-video-generator/releases/tag/v1.5.1
**npm**: https://www.npmjs.com/package/openclaw-video-generator
**ClawHub**: https://clawhub.ai/ZhenStaff/video-generator
