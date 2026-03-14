# Design Tokens - Quick Reference

**OpenClaw Video Generator Design System**

This directory contains the centralized design token system for consistent styling across the project.

---

## Files

- **`design-tokens.ts`** - Complete design token system (colors, typography, spacing, effects, animations)

---

## Quick Start

### Import Design Tokens

```typescript
import { designTokens } from './styles/design-tokens';
```

### Basic Usage

```typescript
// Typography
fontSize: designTokens.typography.fontSize['5xl']        // 80px
fontFamily: designTokens.typography.fontFamily.primary   // 'Orbitron', ...

// Colors
color: designTokens.colors.text.primary                  // #FFFFFF
color: designTokens.colors.primary.cyan                  // #00FFFF

// Spacing
marginTop: designTokens.spacing[10]                      // 40px
padding: `${designTokens.spacing[4]}px ${designTokens.spacing[15]}px`

// Effects
textShadow: designTokens.effects.textEffect.cyberGlow
boxShadow: designTokens.effects.shadow.soft
backdropFilter: designTokens.effects.blur.medium

// Animations
config: designTokens.animation.spring.bouncy
```

---

## Common Patterns

### Title Text
```typescript
<div
  style={{
    fontSize: designTokens.typography.fontSize['5xl'],
    fontWeight: designTokens.typography.fontWeight.bold,
    fontFamily: designTokens.typography.fontFamily.primary,
    color: designTokens.colors.text.primary,
    textShadow: designTokens.effects.textEffect.cyberGlow,
    letterSpacing: designTokens.typography.letterSpacing.tight,
  }}
>
  Title
</div>
```

### Subtitle Text
```typescript
<div
  style={{
    fontSize: designTokens.typography.fontSize['2xl'],
    fontFamily: designTokens.typography.fontFamily.primary,
    color: designTokens.colors.text.tertiary,
    textShadow: designTokens.effects.textEffect.subtleDepth,
    marginTop: designTokens.spacing[10],
  }}
>
  Subtitle
</div>
```

### Number Highlight
```typescript
<div
  style={{
    fontSize: designTokens.typography.fontSize['6xl'],
    fontWeight: designTokens.typography.fontWeight.bold,
    color: designTokens.colors.accent.gold,
    textShadow: designTokens.effects.textEffect.goldShine,
  }}
>
  42
</div>
```

### Background Bar
```typescript
<div
  style={{
    background: designTokens.colors.gradients.darkenCenter,
    borderRadius: designTokens.effects.borderRadius.md,
    backdropFilter: designTokens.effects.blur.medium,
    boxShadow: designTokens.effects.shadow.soft,
    padding: `${designTokens.spacing[4]}px ${designTokens.spacing[15]}px`,
  }}
>
  Content
</div>
```

---

## Token Categories

### Colors

```typescript
// Text
designTokens.colors.text.primary      // #FFFFFF (white)
designTokens.colors.text.secondary    // #B0B0B0 (light gray)
designTokens.colors.text.tertiary     // #888888 (gray)

// Primary (neon)
designTokens.colors.primary.cyan      // #00FFFF
designTokens.colors.primary.magenta   // #FF00FF

// Accent
designTokens.colors.accent.gold       // #FFD700
designTokens.colors.accent.green      // #00FF88

// Background
designTokens.colors.background.dark   // #0A0A0F
```

### Typography

```typescript
// Sizes
xs: 12, sm: 16, base: 20, lg: 24, xl: 32,
'2xl': 40, '3xl': 48, '4xl': 64, '5xl': 80, '6xl': 120, '7xl': 160

// Weights
light: 300, regular: 400, medium: 500, semibold: 600, bold: 700, black: 900

// Line heights
tight: 1.1, normal: 1.2, relaxed: 1.4, loose: 1.6
```

### Spacing (8pt grid)

```typescript
0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 10: 40,
12: 48, 15: 60, 16: 64, 20: 80, 24: 96, 30: 120, 40: 150
```

### Effects

```typescript
// Text effects (combined)
textEffect.cyberGlow      // Cyan glow + stroke + shadow
textEffect.strongGlow     // Intense glow
textEffect.goldShine      // Gold glow
textEffect.subtleDepth    // Subtle shadow

// Individual glows
glow.cyan.soft / medium / strong
glow.magenta.soft / medium / strong
glow.gold.soft / medium / strong

// Shadows
shadow.soft / medium / strong / cyber

// Blurs
blur.light / medium / strong / extreme
```

### Animations

```typescript
// Spring configs
spring.gentle   // Soft, slow
spring.smooth   // Balanced
spring.bouncy   // Playful (default)
spring.snappy   // Quick
spring.wobbly   // Elastic

// Duration (ms)
duration.fast: 150, normal: 300, slow: 500
```

---

## Helper Functions

### getTextShadow
```typescript
import { getTextShadow } from './styles/design-tokens';

textShadow: getTextShadow(sceneType, 'cyan')
```

### getGlitchShadow
```typescript
import { getGlitchShadow } from './styles/design-tokens';

const glitchAmount = Math.sin(frame * 0.5) * 3;
textShadow: getGlitchShadow(glitchAmount)
```

### isContrastCompliant
```typescript
import { isContrastCompliant } from './styles/design-tokens';

isContrastCompliant(4.6, 'AA')  // true
isContrastCompliant(3.2, 'AA')  // false
```

---

## Documentation

- **Complete Guide:** `docs/VISUAL_DESIGN_SYSTEM.md`
- **Accessibility:** `docs/ACCESSIBILITY_REPORT.md`
- **Implementation:** `docs/DESIGN_SYSTEM_IMPLEMENTATION_GUIDE.md`
- **Improvements:** `docs/VISUAL_IMPROVEMENTS_SUMMARY.md`

---

## Examples

**Refactored Components:**
- `src/CyberWireframe-refactored.tsx` - Main composition
- `src/SceneRenderer-refactored.tsx` - Scene rendering

---

**Last Updated:** 2026-03-14
