# OpenClaw Video Generator - Visual Design System

**Version:** 1.0.0
**Created:** 2026-03-14
**Format:** 1080x1920 (Vertical Video)
**Theme:** Cyber/Wireframe Aesthetic

## Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing System](#spacing-system)
6. [Visual Effects](#visual-effects)
7. [Animation System](#animation-system)
8. [Accessibility](#accessibility)
9. [Implementation Guide](#implementation-guide)
10. [Component Examples](#component-examples)

---

## Overview

The OpenClaw Video Generator design system provides a comprehensive set of design tokens optimized for AI-powered vertical video generation. The system emphasizes:

- **Cyber/Wireframe Aesthetic**: Neon glows, tech fonts, and futuristic visual effects
- **Vertical Video Format**: Optimized for 1080x1920 (9:16 aspect ratio)
- **Accessibility**: WCAG AA compliant (4.5:1 contrast ratio)
- **Consistency**: 8pt grid system for predictable spacing
- **Maintainability**: Centralized design tokens for easy updates

### Design Token Location

All design tokens are defined in: **`src/styles/design-tokens.ts`**

```typescript
import { designTokens } from './styles/design-tokens';
```

---

## Design Principles

### 1. **High Contrast for Video Backgrounds**
Video backgrounds can have varying brightness, so all text must maintain high contrast ratios (4.5:1 minimum for WCAG AA).

### 2. **Cyber Aesthetic First**
Neon glows, tech fonts, and futuristic effects are core to the visual identity.

### 3. **Readability Over Style**
Despite the cyber theme, text must remain legible at all times. Effects should enhance, not hinder readability.

### 4. **Consistent Spacing**
8pt grid system ensures visual rhythm and predictable layouts.

### 5. **Performance Optimized**
Effects and animations are optimized for Remotion rendering performance.

---

## Color System

### Primary Palette (Neon Cyber)

```typescript
designTokens.colors.primary
```

| Color | Hex | Usage | Contrast (vs #0A0A0F) |
|-------|-----|-------|----------------------|
| **Cyan** | `#00FFFF` | Main accent, highlights | 15.6:1 (AAA) |
| **Blue** | `#0080FF` | Secondary accent | 8.2:1 (AAA) |
| **Magenta** | `#FF00FF` | Emphasis, special effects | 6.4:1 (AA) |
| **Pink** | `#FF0080` | Hot highlights | 5.8:1 (AA) |

**Usage Example:**
```typescript
color: designTokens.colors.primary.cyan
```

### Background Palette

```typescript
designTokens.colors.background
```

| Color | Hex | Usage |
|-------|-----|-------|
| **Darkest** | `#050508` | Deep space black |
| **Dark** | `#0A0A0F` | Main background (current) |
| **Charcoal** | `#15151F` | Subtle elevation |
| **Translucent** | `rgba(10, 10, 15, 0.85)` | Overlay base |
| **Translucent Light** | `rgba(10, 10, 15, 0.6)` | Light overlay (scene backgrounds) |
| **Translucent Dark** | `rgba(10, 10, 15, 0.95)` | Heavy overlay |

### Text Palette

```typescript
designTokens.colors.text
```

| Color | Hex | Usage | Contrast | WCAG |
|-------|-----|-------|----------|------|
| **Primary** | `#FFFFFF` | Main text | 21.0:1 | AAA |
| **Secondary** | `#B0B0B0` | Subtitles | 8.7:1 | AAA |
| **Tertiary** | `#888888` | Secondary info | 4.6:1 | AA ✓ |
| **Muted** | `#606060` | Subtle text | 3.2:1 | Large text only (18pt+) |

**Usage Example:**
```typescript
color: designTokens.colors.text.primary  // White
color: designTokens.colors.text.tertiary  // Gray (#888888 - current subtitle color)
```

### Accent Palette

```typescript
designTokens.colors.accent
```

| Color | Hex | Usage | Contrast |
|-------|-----|-------|----------|
| **Gold** | `#FFD700` | Numbers, key highlights | 13.6:1 (AAA) |
| **Green** | `#00FF88` | Success, positive | 14.2:1 (AAA) |
| **Yellow** | `#FFFF00` | Warnings | 18.4:1 (AAA) |
| **Orange** | `#FF8800` | Attention | 8.9:1 (AAA) |
| **Red** | `#FF3366` | Critical, urgent | 6.8:1 (AA) |

**Current Usage:**
- Number highlights: `designTokens.colors.accent.gold` (was `#FFD700`)
- Text highlights: `designTokens.colors.primary.cyan` (was `#00FFFF`)

### Gradients

```typescript
designTokens.colors.gradients
```

```typescript
// Background bar gradient (current)
background: designTokens.colors.gradients.darkenCenter
// Result: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.6) 100%)'
```

---

## Typography

### Font Families

**Recommendation**: Use **Orbitron** or **Rajdhani** for cyber/tech aesthetic.

```typescript
designTokens.typography.fontFamily.primary
// Result: "'Orbitron', 'Rajdhani', 'Exo 2', sans-serif"
```

**Current**: Arial (generic system font) ❌

#### Google Fonts Integration

Add to your HTML `<head>`:

```html
<!-- Orbitron (futuristic display) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&display=swap" rel="stylesheet">

<!-- Rajdhani (alternative, lighter) -->
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;600;700&display=swap" rel="stylesheet">

<!-- Share Tech Mono (monospace, for code/tech text) -->
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
```

### Font Scale (8pt Grid)

```typescript
designTokens.typography.fontSize
```

| Token | Size (px) | Current Usage |
|-------|-----------|---------------|
| `xs` | 12 | Debug info |
| `sm` | 16 | Small labels |
| `base` | 20 | Body text |
| `lg` | 24 | Secondary text |
| `xl` | 32 | Tertiary titles |
| `'2xl'` | 40 | **Subtitles** ✓ |
| `'3xl'` | 48 | Medium emphasis |
| `'4xl'` | 64 | Large text |
| `'5xl'` | 80 | **Main titles** ✓ |
| `'6xl'` | 120 | **Numbers** ✓ |
| `'7xl'` | 160 | Hero numbers |

**Usage Example:**
```typescript
fontSize: designTokens.typography.fontSize['5xl']  // 80px (main title)
fontSize: designTokens.typography.fontSize['2xl']  // 40px (subtitle)
fontSize: designTokens.typography.fontSize['6xl']  // 120px (numbers)
```

### Font Weights

```typescript
designTokens.typography.fontWeight
```

| Token | Value | Usage |
|-------|-------|-------|
| `light` | 300 | Subtle text |
| `regular` | 400 | Body text |
| `medium` | 500 | Slight emphasis |
| `semibold` | 600 | Strong emphasis |
| `bold` | 700 | **Main titles** ✓ |
| `black` | 900 | Ultra bold |

### Line Heights

```typescript
designTokens.typography.lineHeight
```

| Token | Value | Usage |
|-------|-------|-------|
| `tight` | 1.1 | Compact titles |
| `normal` | 1.2 | **Standard text** ✓ |
| `relaxed` | 1.4 | Comfortable reading |
| `loose` | 1.6 | Spacious layouts |

### Letter Spacing

```typescript
designTokens.typography.letterSpacing
```

| Token | Value | Effect |
|-------|-------|--------|
| `tighter` | -0.05em | Compact |
| `tight` | -0.025em | Slightly tight |
| `normal` | 0 | Default |
| `wide` | 0.05em | Spaced out |
| `wider` | 0.1em | Very spaced |
| `widest` | 0.15em | Ultra wide (tech look) |

**Recommended for cyber aesthetic:**
```typescript
letterSpacing: designTokens.typography.letterSpacing.tight  // Titles
letterSpacing: designTokens.typography.letterSpacing.wide   // Tech labels
```

---

## Spacing System

**8pt Grid System**: All spacing values are multiples of 4px or 8px.

```typescript
designTokens.spacing
```

| Token | Value (px) | Current Usage |
|-------|------------|---------------|
| `0` | 0 | None |
| `1` | 4 | Tiny |
| `2` | 8 | Extra small |
| `3` | 12 | Small |
| `4` | 16 | Base |
| `6` | 24 | Medium |
| `8` | 32 | Large |
| `10` | 40 | **Subtitle margin** ✓ |
| `12` | 48 | XXL |
| `15` | 60 | Padding (≈ 50px) |
| `16` | 64 | 4XL |
| `20` | 80 | 5XL |
| `24` | 96 | Mascot position (≈ 100px) |
| `30` | 120 | 7XL |
| `40` | 150 | **Bottom padding** ✓ |

**Usage Example:**
```typescript
paddingBottom: designTokens.spacing[40]  // 150px
marginTop: designTokens.spacing[10]      // 40px
padding: `${designTokens.spacing[4]}px ${designTokens.spacing[15]}px`  // "16px 60px"
```

---

## Visual Effects

### Neon Glow Effects

```typescript
designTokens.effects.glow
```

Each color has three intensity levels:

#### Cyan Glow (Primary)

```typescript
// Soft glow
textShadow: designTokens.effects.glow.cyan.soft
// '0 0 10px rgba(0, 255, 255, 0.4), 0 0 20px rgba(0, 255, 255, 0.2)'

// Medium glow
textShadow: designTokens.effects.glow.cyan.medium
// '0 0 10px rgba(0, 255, 255, 0.6), 0 0 20px rgba(0, 255, 255, 0.3)'

// Strong glow
textShadow: designTokens.effects.glow.cyan.strong
// '0 0 15px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.4), 0 0 45px rgba(0, 255, 255, 0.2)'
```

**Available Colors:** `cyan`, `magenta`, `gold`, `green`, `white`

### Text Effects (Glow + Stroke + Shadow)

```typescript
designTokens.effects.textEffect
```

**Pre-combined effects for common use cases:**

```typescript
// Cyber glow (current style)
textShadow: designTokens.effects.textEffect.cyberGlow
// Cyan glow + black stroke + drop shadow

// Strong glow (emphasis)
textShadow: designTokens.effects.textEffect.strongGlow
// Intense cyan glow + strong black stroke

// Gold shine (numbers)
textShadow: designTokens.effects.textEffect.goldShine
// Gold glow + black stroke + shadow

// Subtle depth (subtitles)
textShadow: designTokens.effects.textEffect.subtleDepth
// Light shadow + subtle stroke
```

**Current Usage:**
```typescript
// Main title (non-glitch)
textShadow: designTokens.effects.textEffect.cyberGlow

// Numbers
textShadow: designTokens.effects.textEffect.goldShine

// Subtitles
textShadow: designTokens.effects.textEffect.subtleDepth
```

### Box Shadows

```typescript
designTokens.effects.shadow
```

| Token | Usage | Current |
|-------|-------|---------|
| `soft` | Background bars | ✓ |
| `medium` | Elevated cards | |
| `strong` | High elevation | |
| `cyber` | Cyber glow + shadow | |

**Usage Example:**
```typescript
boxShadow: designTokens.effects.shadow.soft
// '0 4px 20px rgba(0, 0, 0, 0.5)' - current
```

### Backdrop Filters

```typescript
designTokens.effects.blur
```

| Token | Value | Current |
|-------|-------|---------|
| `none` | none | |
| `light` | blur(5px) | |
| `medium` | blur(10px) | ✓ |
| `strong` | blur(15px) | |
| `extreme` | blur(20px) | |

**Usage Example:**
```typescript
backdropFilter: designTokens.effects.blur.medium  // 'blur(10px)' - current
```

### Border Radius

```typescript
designTokens.effects.borderRadius
```

| Token | Value (px) | Current |
|-------|------------|---------|
| `none` | 0 | |
| `sm` | 4 | |
| `base` | 8 | |
| `md` | 12 | ✓ |
| `lg` | 16 | |
| `xl` | 20 | |
| `'2xl'` | 24 | |
| `full` | 9999 | |

**Usage Example:**
```typescript
borderRadius: designTokens.effects.borderRadius.md  // 12px - current
```

---

## Animation System

### Duration (milliseconds)

```typescript
designTokens.animation.duration
```

| Token | Value (ms) | Usage |
|-------|------------|-------|
| `instant` | 100 | Micro interactions |
| `fast` | 150 | Quick transitions |
| `normal` | 300 | Standard animations |
| `slow` | 500 | Deliberate animations |
| `slower` | 700 | Smooth, slow |
| `slowest` | 1000 | Very slow transitions |

### Easing Curves

```typescript
designTokens.animation.easing
```

| Token | Bezier | Effect |
|-------|--------|--------|
| `linear` | linear | Constant speed |
| `easeIn` | (0.4, 0, 1, 1) | Accelerate |
| `easeOut` | (0, 0, 0.2, 1) | Decelerate |
| `easeInOut` | (0.4, 0, 0.2, 1) | Smooth |
| `easeInBack` | (0.6, -0.28, 0.735, 0.045) | Anticipation |
| `easeOutBack` | (0.175, 0.885, 0.32, 1.275) | Overshoot |
| `easeInOutBack` | (0.68, -0.55, 0.265, 1.55) | Both |

### Spring Configurations (Remotion)

```typescript
designTokens.animation.spring
```

| Token | Config | Effect | Current Usage |
|-------|--------|--------|---------------|
| `gentle` | damping: 20, stiffness: 100 | Soft, slow | End scenes |
| `smooth` | damping: 15, stiffness: 120 | Balanced | Title scenes |
| `bouncy` | damping: 10, stiffness: 100 | Playful bounce | Emphasis, numbers ✓ |
| `snappy` | damping: 12, stiffness: 150 | Quick response | |
| `wobbly` | damping: 8, stiffness: 80 | Elastic | |

**Usage Example:**
```typescript
// Title scene spring
scale: spring({
  frame,
  fps,
  from: 0.8,
  to: 1,
  config: designTokens.animation.spring.smooth,
})

// Number pop-in
scale: spring({
  frame,
  fps,
  from: 0,
  to: 1,
  config: designTokens.animation.spring.bouncy,  // Current
})
```

### Animation Presets

```typescript
designTokens.animation.presets
```

| Preset | Values | Current Usage |
|--------|--------|---------------|
| `fadeIn` | opacity: [0, 1] | |
| `fadeOut` | opacity: [1, 0] | |
| `slideUp` | translateY: [80, 0], opacity: [0, 1] | Content scenes ✓ |
| `slideDown` | translateY: [-50, 0], opacity: [0, 1] | Pain scenes ✓ |
| `scaleIn` | scale: [0.8, 1] | Title scenes ✓ |
| `scaleOut` | scale: [1, 0] | |
| `popIn` | scale: [0, 1] | Numbers ✓ |
| `slamIn` | scale: [1.5, 1] | Emphasis ✓ |

---

## Accessibility

### WCAG AA Compliance

**Minimum Contrast Ratio:** 4.5:1 for normal text, 3:1 for large text (18pt+)

#### Contrast Ratios (against #0A0A0F background)

```typescript
designTokens.accessibility.contrast
```

| Color | Hex | Contrast | WCAG | Status |
|-------|-----|----------|------|--------|
| White | #FFFFFF | 21.0:1 | AAA | ✓ Excellent |
| Secondary Gray | #B0B0B0 | 8.7:1 | AAA | ✓ Excellent |
| Tertiary Gray | #888888 | 4.6:1 | AA | ✓ Compliant (current subtitle) |
| Muted Gray | #606060 | 3.2:1 | - | ⚠️ Large text only |
| Cyan | #00FFFF | 15.6:1 | AAA | ✓ Excellent (current highlight) |
| Gold | #FFD700 | 13.6:1 | AAA | ✓ Excellent (current number) |
| Green | #00FF88 | 14.2:1 | AAA | ✓ Excellent |
| Magenta | #FF00FF | 6.4:1 | AA | ✓ Compliant |
| Red | #FF3366 | 6.8:1 | AA | ✓ Compliant |

**All current color combinations are WCAG AA compliant!** ✓

### Validation Function

```typescript
import { isContrastCompliant } from './styles/design-tokens';

// Check if contrast ratio meets WCAG AA
isContrastCompliant(4.6, 'AA')  // true (tertiary gray)
isContrastCompliant(3.2, 'AA')  // false (muted gray - use large text only)

// Check for AAA (stricter)
isContrastCompliant(8.7, 'AAA')  // true (secondary gray)
isContrastCompliant(4.6, 'AAA')  // false
```

### Font Size Guidelines

```typescript
designTokens.accessibility.minFontSize
```

- **WCAG AA (4.5:1)**: Min 16px normal, 18px large
- **WCAG AAA (7:1)**: Min 16px normal, 18px large

**Current Implementation:** All text sizes exceed minimum requirements ✓

---

## Implementation Guide

### Step 1: Import Design Tokens

```typescript
import { designTokens } from './styles/design-tokens';
```

### Step 2: Replace Hardcoded Values

**Before (hardcoded):**
```typescript
style={{
  fontSize: 80,
  color: '#FFFFFF',
  textShadow: '0 0 10px rgba(0, 255, 255, 0.4), ...',
  marginTop: 40,
}}
```

**After (design tokens):**
```typescript
style={{
  fontSize: designTokens.typography.fontSize['5xl'],  // 80px
  color: designTokens.colors.text.primary,            // #FFFFFF
  textShadow: designTokens.effects.textEffect.cyberGlow,
  marginTop: designTokens.spacing[10],                // 40px
}}
```

### Step 3: Use Helper Functions

```typescript
import { getTextShadow, getGlitchShadow } from './styles/design-tokens';

// Get text shadow for scene type
textShadow: scene.type === 'title'
  ? getGlitchShadow(glitchAmount)
  : getTextShadow(scene.type, 'cyan')
```

### Step 4: Update Font Families

**CyberWireframe.tsx:**
```typescript
fontFamily: designTokens.typography.fontFamily.primary
// Result: "'Orbitron', 'Rajdhani', 'Exo 2', sans-serif"
```

**Don't forget to load Google Fonts** in your HTML or Remotion config!

### Step 5: Apply Consistent Spacing

```typescript
// Padding with spacing tokens
padding: `${designTokens.spacing[4]}px ${designTokens.spacing[15]}px`
// Result: "16px 60px" (close to original "15px 50px")

// Margin
marginTop: designTokens.spacing[10]  // 40px

// Bottom spacing
paddingBottom: designTokens.spacing[40]  // 150px
```

---

## Component Examples

### Title Scene (with Glitch Effect)

```typescript
<div
  style={{
    fontSize: designTokens.typography.fontSize['5xl'],       // 80px
    fontWeight: designTokens.typography.fontWeight.bold,     // 700
    fontFamily: designTokens.typography.fontFamily.primary,  // Orbitron
    color: designTokens.colors.text.primary,                 // White
    textShadow: getGlitchShadow(glitchAmount),              // RGB split
    letterSpacing: designTokens.typography.letterSpacing.tight,
    lineHeight: designTokens.typography.lineHeight.normal,
  }}
>
  {scene.title}
</div>
```

### Subtitle

```typescript
<div
  style={{
    fontSize: designTokens.typography.fontSize['2xl'],      // 40px
    color: designTokens.colors.text.tertiary,               // #888888
    fontFamily: designTokens.typography.fontFamily.primary,
    textShadow: designTokens.effects.textEffect.subtleDepth,
    marginTop: designTokens.spacing[10],                    // 40px
    lineHeight: designTokens.typography.lineHeight.relaxed,
  }}
>
  {scene.subtitle}
</div>
```

### Number Highlight

```typescript
<div
  style={{
    fontSize: designTokens.typography.fontSize['6xl'],      // 120px
    fontWeight: designTokens.typography.fontWeight.bold,
    color: designTokens.colors.accent.gold,                 // #FFD700
    textShadow: designTokens.effects.textEffect.goldShine,
    transform: `scale(${springValue})`,
  }}
>
  {scene.number}
</div>
```

### Background Bar

```typescript
<div
  style={{
    background: designTokens.colors.gradients.darkenCenter,
    borderRadius: designTokens.effects.borderRadius.md,     // 12px
    backdropFilter: designTokens.effects.blur.medium,       // blur(10px)
    boxShadow: designTokens.effects.shadow.soft,
    padding: `${designTokens.spacing[4]}px ${designTokens.spacing[15]}px`,
  }}
>
  {/* Content */}
</div>
```

### Highlighted Text

```typescript
<span
  style={{
    color: designTokens.colors.primary.cyan,                // #00FFFF
    textShadow: designTokens.effects.glow.cyan.strong,
  }}
>
  {highlightedWord}
</span>
```

---

## Migration Checklist

### Phase 1: Setup (Complete)

- [x] Create `src/styles/design-tokens.ts`
- [x] Define all design tokens
- [x] Create helper functions
- [x] Document system

### Phase 2: Refactor Components

- [ ] Update `CyberWireframe.tsx`:
  - [ ] Replace hardcoded colors
  - [ ] Replace hardcoded font family
  - [ ] Use spacing tokens

- [ ] Update `SceneRenderer.tsx`:
  - [ ] Replace all hardcoded values
  - [ ] Use design token colors
  - [ ] Use spacing tokens
  - [ ] Use effect tokens
  - [ ] Use animation configs

### Phase 3: Font Integration

- [ ] Add Google Fonts to project
- [ ] Load Orbitron or Rajdhani
- [ ] Load Share Tech Mono (monospace)
- [ ] Update font fallbacks
- [ ] Test font rendering

### Phase 4: Testing

- [ ] Visual regression testing
- [ ] Contrast ratio validation
- [ ] Animation smoothness
- [ ] Cross-platform rendering
- [ ] Performance benchmarks

### Phase 5: Documentation

- [x] Design system documentation
- [ ] Component usage examples
- [ ] Migration guide
- [ ] Best practices guide

---

## Best Practices

### 1. Always Use Design Tokens

❌ **Don't:**
```typescript
color: '#FFFFFF'
fontSize: 80
marginTop: 40
```

✓ **Do:**
```typescript
color: designTokens.colors.text.primary
fontSize: designTokens.typography.fontSize['5xl']
marginTop: designTokens.spacing[10]
```

### 2. Validate Contrast Ratios

Before using a new color combination:

```typescript
import { isContrastCompliant } from './styles/design-tokens';

// Check compliance
if (!isContrastCompliant(contrastRatio, 'AA')) {
  console.warn('Color combination does not meet WCAG AA standards');
}
```

### 3. Use Semantic Tokens

Prefer semantic tokens over raw values:

```typescript
// Good: Semantic meaning
color: designTokens.colors.text.primary

// Less good: Direct token
color: designTokens.colors.text['#FFFFFF']
```

### 4. Maintain 8pt Grid

All spacing should use the spacing scale:

```typescript
// Good: 8pt grid
marginTop: designTokens.spacing[10]  // 40px

// Avoid: Off-grid values
marginTop: 37  // Not on grid
```

### 5. Combine Effects Thoughtfully

Effects should enhance, not overwhelm:

```typescript
// Subtle for subtitles
textShadow: designTokens.effects.textEffect.subtleDepth

// Strong for emphasis
textShadow: designTokens.effects.textEffect.strongGlow
```

---

## Future Enhancements

### Planned Features

1. **Responsive Typography**
   - Scale fonts based on video resolution
   - Auto-adjust for different aspect ratios

2. **Dark Mode Variants**
   - Alternative color schemes
   - Adjustable background opacity

3. **Animation Presets Library**
   - More pre-built animation patterns
   - Scene-specific transitions

4. **Theme Variants**
   - Alternative color palettes (purple, green, blue)
   - Seasonal themes

5. **Performance Optimization**
   - CSS-in-JS optimization
   - Render performance metrics

---

## Support & Resources

### Related Documentation

- **Design Tokens:** `src/styles/design-tokens.ts`
- **Component Refactoring:** See refactored examples
- **Accessibility:** WCAG 2.1 AA Guidelines

### External Resources

- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Google Fonts](https://fonts.google.com/)
- [Remotion Animation Docs](https://www.remotion.dev/docs/animation)
- [Cyber Typography Guide](https://fonts.google.com/?query=tech)

---

**Design System Version:** 1.0.0
**Last Updated:** 2026-03-14
**Maintained by:** OpenClaw Video Generator Team
