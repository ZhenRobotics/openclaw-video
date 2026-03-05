# 🎉 OpenClaw Video v1.1.0 Release Notes

**Release Date**: March 5, 2026
**Release Type**: Minor Feature Release
**Compatibility**: ✅ Fully backward compatible with v1.0.0

---

## 📦 Installation

```bash
npm install -g openclaw-video@1.1.0
```

---

## 🌟 What's New

### 1. Custom Color Support ✨

You can now customize the color of scene titles!

**Usage Example:**
```typescript
{
  type: "title",
  title: "Important Message",
  color: "#FF0000"  // Red text
}
```

**Supported formats:**
- Hex colors: `"#FF0000"`, `"#00FF00"`, `"#0000FF"`
- RGB: `"rgb(255, 0, 0)"`
- Named colors: `"red"`, `"blue"`, `"green"`

### 2. Enhanced Security 🔐

**BREAKING CHANGE FOR CONTRIBUTORS (NOT for users):**

We've removed hardcoded API keys from the repository (important security improvement!).

**For Users:**
- No changes needed if using the CLI normally
- The package works the same way

**For Contributors/Developers:**
- You now need a `.env` file with your API key
- See updated documentation for details

**Migration:**
```bash
# Create .env file
echo 'OPENAI_API_KEY="your-key-here"' > .env
```

### 3. Improved Scripts 🛠️

**Better error messages:**
- Clear validation when API key is missing
- Helpful hints for troubleshooting
- User-friendly output with emojis

**Better portability:**
- Scripts now use relative paths
- Works from any directory
- Easier to integrate into projects

### 4. New Documentation 📚

Added comprehensive OpenClaw Chat integration guide:
- Complete workflow demonstration
- Integration test results
- Best practices for using with AI assistants

---

## 🐛 Bug Fixes

- Fixed path issues in `generate-for-openclaw.sh`
- Improved error handling in Whisper timestamp extraction
- Better cleanup of generated files

---

## 📊 Package Stats

- **Package Size**: 416.9 KB (tarball)
- **Unpacked Size**: 548.7 KB
- **Total Files**: 38 files
- **Dependencies**: 3 (react, react-dom, remotion)

---

## 🔗 Links

- **npm**: https://www.npmjs.com/package/openclaw-video
- **GitHub**: https://github.com/ZhenRobotics/openclaw-video
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)
- **Documentation**: [README.md](./README.md)

---

## 📝 Changelog Summary

### Added
- Custom color support for scene titles
- OpenClaw Chat integration guide
- Better API key validation

### Security
- Removed hardcoded API keys
- Now uses `.env` for configuration

### Improved
- Script portability with relative paths
- Error messages and user feedback
- Documentation and examples

### Changed
- Updated `.gitignore` to exclude generated files
- Better cleanup of temporary files

---

## 🚀 Upgrade Guide

### From v1.0.0 to v1.1.0

**No breaking changes for end users!**

Simply update:
```bash
npm install -g openclaw-video@latest
```

### New Features You Can Use

1. **Add colors to your videos:**
   ```bash
   # Edit your scenes-data.ts
   {
     type: "title",
     title: "Red Title",
     color: "#FF0000"
   }
   ```

2. **Check the new integration guide:**
   ```bash
   cat OPENCLAW-CHAT-INTEGRATION-GUIDE.md
   ```

---

## 🎯 What's Next

### Planned for v1.2.0
- Background color customization
- Font family selection
- More animation effects
- Text shadow and outline options

### Planned for v2.0.0
- Video templates system
- Batch processing
- Cloud rendering support
- Web UI

---

## 🙏 Contributors

- Main Developer: @ZhenRobotics
- AI Assistant: Claude Sonnet 4.5

---

## 📞 Support

- **Issues**: https://github.com/ZhenRobotics/openclaw-video/issues
- **Discussions**: https://github.com/ZhenRobotics/openclaw-video/discussions

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file

---

**Happy Video Creating! 🎬**
