# Changelog

All notable changes to OpenClaw Company Secretary will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-03-08

### 🎉 Major Transformation

Project successfully transformed from **openclaw-video-generator** to **openclaw-company-secretary**

**Positioning Change**:
- From: Automated short video generation tool
- To: AI-powered Company Secretary assistant

### ✨ New Features

#### Core Modules

- **Meeting Management System** (`MeetingManager`)
  - Create and manage board meetings (regular/special/annual/audit committee)
  - Attendee management and check-in
  - Agenda creation and tracking
  - Meeting workflow control (scheduled → in-progress → completed)
  - Quorum checking
  - Meeting transcript recording

- **Minutes Generator** (`MinutesGenerator`)
  - AI-powered automatic minutes generation (GPT-4)
  - Multiple templates (standard/annual/special/audit)
  - Automatic key information extraction
  - Export to Markdown and JSON formats
  - Structured sections

- **Resolution Tracker** (`ResolutionTracker`)
  - Resolution creation and voting record
  - Multiple resolution types (financial/strategic/personnel/investment/compliance)
  - Full execution status tracking
  - Overdue checking and reminders
  - Statistics and analytics

- **Action Item Tracker** (`ActionTracker`)
  - Task creation and assignment
  - Real-time progress tracking (0-100%)
  - Priority management (high/medium/low)
  - Overdue checking
  - Multi-dimensional viewing

#### CLI Tools

New command-line interface with 6 subcommands:

- `company-secretary meeting` - Meeting management
- `company-secretary minutes` - Minutes generation
- `company-secretary resolution` - Resolution management
- `company-secretary action` - Action item management
- `company-secretary video` - Video reporting (preserved)
- `company-secretary dashboard` - Dashboard overview

#### TypeScript API

Complete programming interface:

```typescript
import { CompanySecretary } from 'openclaw-company-secretary';

const secretary = new CompanySecretary();
const meeting = secretary.meetings.createMeeting({...});
const minutes = await secretary.generateMinutes(meeting.id);
```

#### Data Management

- Local JSON file storage
- Automatic data persistence
- Import/export backup support
- Minutes saved in both JSON and Markdown formats

### 🎥 Preserved Features

Original video generation capabilities **100% preserved**, now serving as board reporting tool:

- Video generation pipeline (`scripts/script-to-video.sh`)
- OpenAI TTS voice generation
- OpenAI Whisper audio transcription
- Remotion video rendering
- Scene orchestration and animation effects

**New video use cases**:
- Resolution announcement videos
- Investor update videos
- Board summary videos
- Compliance disclosure videos

### 📚 Documentation

- Complete rewrite of `README.md`
- Rewrite of `QUICKSTART.md` - 5-minute quick start guide
- New `TRANSFORMATION.md` - Detailed transformation documentation
- New `TRANSFORMATION_SUMMARY.md` - Transformation summary
- New `NAMING_CONVENTION.md` - Naming conventions
- New `PUBLISHING_CHECKLIST.md` - Publishing checklist
- New `examples/basic-usage.ts` - Complete usage example

### 🏗️ Architecture

New project structure:

```
src/
├── company-secretary.ts       # Main class
├── secretary-types.ts         # Type definitions
├── core/                      # Core modules
│   ├── meeting-manager.ts
│   ├── minutes-generator.ts
│   ├── resolution-tracker.ts
│   └── action-tracker.ts
└── utils/                     # Utility functions
    └── helpers.ts

cli/                          # CLI tools
├── secretary-cli.sh
└── commands/
```

### 📦 Package Information

- Package name: `openclaw-company-secretary`
- CLI command: `company-secretary`
- Main class: `CompanySecretary`
- Version: `2.0.0`

### 🎯 Use Cases

- Startup board meetings - Lightweight meeting management
- Growing companies - Standardized governance processes
- Public companies - Compliance management and disclosure
- AI Agent integration - Used as a skill

---

## [1.1.0] - 2026-03-05

### Added
- ✨ Custom color support for scene titles
  - New `color` property in SceneData type
  - Apply custom colors to main titles (e.g., `color: "#FF0000"`)
- 📚 OpenClaw Chat integration guide
  - Complete workflow demonstration
  - Integration test documentation

### Security
- 🔐 **IMPORTANT**: Removed hardcoded API key from scripts
  - Now loads configuration from `.env` file (best practice)
  - Added API key validation with helpful error messages
  - Enhanced security for production deployments

### Improved
- 🛠️ Enhanced `generate-for-openclaw.sh` script
  - Uses relative paths instead of absolute paths
  - Better error handling and user-friendly messages
  - Displays API endpoint being used
  - Script directory auto-detection for portability
- 📁 Updated `.gitignore` to exclude generated files
  - Prevents committing temporary audio files
  - Cleaner repository structure

### Changed
- Improved error messages with emojis and formatting
- Better script portability across different environments

## [1.0.0] - 2026-03-03

### Added
- 🎤 OpenAI TTS integration for voice generation
- ⏱️ OpenAI Whisper integration for timestamp extraction
- 🎬 Intelligent scene orchestration with 6 scene types
- 🎨 Cyber wireframe visual style with neon effects
- 🤖 Smart Agent system for natural language interaction
- 📝 Complete documentation suite (5000+ lines)
- 🛠️ CLI tools for easy video generation
- 📦 Full automation pipeline from text to video
- 🎯 Example scripts and demo videos
- ⚡ Fast rendering with Remotion

### Features
- Text-to-speech with multiple voice options
- Automatic timing and scene detection
- 6 scene types: title, emphasis, pain, content, circle, end
- 1080x1920 portrait video output
- 30 fps rendering
- Customizable voice speed and style
- Agent-based natural language interface
- Cost-effective: ~$0.003 per 15-second video

### Documentation
- Comprehensive README
- Quick start guide (QUICKSTART.md)
- Delivery documentation (DELIVERY.md)
- Project summary (PROJECT_SUMMARY.md)
- Agent usage guide (docs/AGENT.md)
- FAQ and troubleshooting (docs/FAQ.md)
- Technical documentation for TTS, Whisper, Pipeline
- Integration guide for OpenClaw

### Initial Release
This is the first stable release of OpenClaw Video, ready for production use.

[1.0.0]: https://github.com/ZhenRobotics/openclaw-video/releases/tag/v1.0.0
