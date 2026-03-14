# Design System Implementation Guide

**OpenClaw Video Generator - Design Token Migration**

This guide provides step-by-step instructions for migrating from hardcoded values to the new design token system.

---

## Quick Start

### 1. Install Google Fonts (Recommended)

Add to your Remotion project's HTML template or use `@remotion/google-fonts`:

```bash
npm install @remotion/google-fonts
```

Then in your component:

```typescript
import { loadFont } from '@remotion/google-fonts/Orbitron';

const { fontFamily } = loadFont();

// Use in styles
style={{ fontFamily }}
```

**Alternative (CDN):** Add to `public/index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&display=swap" rel="stylesheet">
```

---

## Migration Steps

### Step 1: Import Design Tokens

In **every component** that uses styling:

```typescript
import { designTokens } from './styles/design-tokens';
```

### Step 2: Replace Hardcoded Values

#### Example 1: CyberWireframe.tsx

**Before:**
```typescript
<AbsoluteFill
  style={{
    backgroundColor: '#0A0A0F',
    fontFamily: 'Arial, sans-serif',
  }}
>
```

**After:**
```typescript
<AbsoluteFill
  style={{
    backgroundColor: designTokens.colors.background.dark,
    fontFamily: designTokens.typography.fontFamily.primary,
  }}
>
```

#### Example 2: SceneRenderer.tsx - Main Title

**Before:**
```typescript
<div
  style={{
    fontSize: 80,
    fontWeight: 'bold',
    color: scene.color || '#FFFFFF',
    textShadow: `
      0 0 10px rgba(0, 255, 255, 0.4),
      0 0 20px rgba(0, 255, 255, 0.2),
      0 4px 10px rgba(0, 0, 0, 0.9),
      -2px -2px 0 rgba(0, 0, 0, 0.8),
      2px -2px 0 rgba(0, 0, 0, 0.8),
      -2px 2px 0 rgba(0, 0, 0, 0.8),
      2px 2px 0 rgba(0, 0, 0, 0.8)
    `,
    lineHeight: 1.2,
  }}
>
```

**After:**
```typescript
<div
  style={{
    fontSize: designTokens.typography.fontSize['5xl'],  // 80
    fontWeight: designTokens.typography.fontWeight.bold,
    fontFamily: designTokens.typography.fontFamily.primary,
    color: scene.color || designTokens.colors.text.primary,
    textShadow: designTokens.effects.textEffect.cyberGlow,
    lineHeight: designTokens.typography.lineHeight.normal,
    letterSpacing: designTokens.typography.letterSpacing.tight,
  }}
>
```

#### Example 3: Subtitle

**Before:**
```typescript
<div
  style={{
    fontSize: 40,
    color: '#888888',
    marginTop: 40,
  }}
>
```

**After:**
```typescript
<div
  style={{
    fontSize: designTokens.typography.fontSize['2xl'],  // 40
    fontFamily: designTokens.typography.fontFamily.primary,
    color: designTokens.colors.text.tertiary,
    textShadow: designTokens.effects.textEffect.subtleDepth,
    marginTop: designTokens.spacing[10],  // 40
    lineHeight: designTokens.typography.lineHeight.relaxed,
  }}
>
```

#### Example 4: Number Highlight

**Before:**
```typescript
<div
  style={{
    fontSize: 120,
    fontWeight: 'bold',
    color: '#FFD700',
  }}
>
```

**After:**
```typescript
<div
  style={{
    fontSize: designTokens.typography.fontSize['6xl'],  // 120
    fontFamily: designTokens.typography.fontFamily.primary,
    fontWeight: designTokens.typography.fontWeight.bold,
    color: designTokens.colors.accent.gold,
    textShadow: designTokens.effects.textEffect.goldShine,
  }}
>
```

#### Example 5: Background Bar

**Before:**
```typescript
<div
  style={{
    padding: '15px 50px',
    background: 'linear-gradient(90deg, rgba(0,0,0,0.6), rgba(0,0,0,0.85), rgba(0,0,0,0.6))',
    borderRadius: 12,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  }}
>
```

**After:**
```typescript
<div
  style={{
    padding: `${designTokens.spacing[4]}px ${designTokens.spacing[15]}px`,
    background: designTokens.colors.gradients.darkenCenter,
    borderRadius: designTokens.effects.borderRadius.md,
    backdropFilter: designTokens.effects.blur.medium,
    boxShadow: designTokens.effects.shadow.soft,
  }}
>
```

#### Example 6: Highlighted Text

**Before:**
```typescript
<span style={{ color: '#00FFFF' }}>
  {highlight}
</span>
```

**After:**
```typescript
<span
  style={{
    color: designTokens.colors.primary.cyan,
    textShadow: designTokens.effects.glow.cyan.strong,
  }}
>
  {highlight}
</span>
```

#### Example 7: Spring Animations

**Before:**
```typescript
scale: spring({
  frame,
  fps,
  from: 0,
  to: 1,
  config: { damping: 10 },
})
```

**After:**
```typescript
scale: spring({
  frame,
  fps,
  from: 0,
  to: 1,
  config: designTokens.animation.spring.bouncy,
})
```

---

## Complete File Refactoring

### CyberWireframe.tsx

**Changes:**
1. Import design tokens
2. Replace `backgroundColor: '#0A0A0F'` → `designTokens.colors.background.dark`
3. Replace `fontFamily: 'Arial, sans-serif'` → `designTokens.typography.fontFamily.primary`
4. Add z-index from layout tokens
5. Update debug info styling

**Full refactored file:** See `src/CyberWireframe-refactored.tsx`

### SceneRenderer.tsx

**Changes:**
1. Import design tokens and helpers
2. Replace all font sizes with typography tokens
3. Replace all colors with color tokens
4. Replace all spacing with spacing tokens
5. Replace all effects (shadows, blurs, glows) with effect tokens
6. Update spring configs with animation tokens
7. Add letter spacing for improved readability
8. Update font family to tech fonts

**Full refactored file:** See `src/SceneRenderer-refactored.tsx`

---

## Testing Checklist

After migration, verify:

### Visual Regression Testing

- [ ] **Title scenes** render correctly
  - [ ] Font size matches (80px)
  - [ ] Glitch effect works
  - [ ] Color is white or custom
  - [ ] Neon glow visible

- [ ] **Content scenes** render correctly
  - [ ] Slide-up animation smooth
  - [ ] Text readable on all backgrounds
  - [ ] Spacing consistent

- [ ] **Emphasis scenes** render correctly
  - [ ] Slam animation (1.5x → 1x scale)
  - [ ] Spring bounce effect

- [ ] **Number highlights** render correctly
  - [ ] Gold color (#FFD700)
  - [ ] Pop-in animation
  - [ ] Gold glow effect

- [ ] **Subtitles** render correctly
  - [ ] Gray color (#888888)
  - [ ] Fade-in animation
  - [ ] 40px margin top
  - [ ] Readable on backgrounds

### Font Testing

- [ ] **Google Fonts loaded** (Orbitron/Rajdhani)
- [ ] **Fallback fonts work** (if fonts fail to load)
- [ ] **Font weights correct** (light, regular, semibold, bold)
- [ ] **Letter spacing improved** readability

### Spacing Testing

- [ ] **Bottom padding** (150px from bottom)
- [ ] **Subtitle margin** (40px from title)
- [ ] **Background bar padding** (~15px 50px)
- [ ] **Mascot position** (~100px from bottom/right)

### Effects Testing

- [ ] **Neon glows** visible
- [ ] **Text strokes** add depth
- [ ] **Drop shadows** create separation
- [ ] **Backdrop blur** works
- [ ] **Border radius** smooth (12px)

### Animation Testing

- [ ] **Title spring** smooth (0.8 → 1.0 scale)
- [ ] **Emphasis slam** bouncy (1.5 → 1.0 scale)
- [ ] **Content slide** smooth (80px → 0px translateY)
- [ ] **Number pop** bouncy (0 → 1.0 scale)
- [ ] **Fade-ins** smooth opacity transitions

### Accessibility Testing

- [ ] **Contrast ratios** meet WCAG AA (4.5:1)
- [ ] **Text readable** on all background brightnesses
- [ ] **Colors distinguishable** for colorblind users
- [ ] **Font sizes** legible at 1080x1920 resolution

### Performance Testing

- [ ] **Render time** not significantly increased
- [ ] **Memory usage** stable
- [ ] **Frame rate** consistent (30fps)
- [ ] **No visual glitches** during playback

---

## Troubleshooting

### Issue: Fonts not loading

**Solution:**

1. Verify Google Fonts link in HTML:
```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&display=swap" rel="stylesheet">
```

2. Check font-family spelling:
```typescript
fontFamily: designTokens.typography.fontFamily.primary
// Should resolve to: "'Orbitron', 'Rajdhani', 'Exo 2', sans-serif"
```

3. Use `@remotion/google-fonts` for better reliability

### Issue: Colors look different

**Cause:** Design tokens use exact color values; original code may have had typos or variations.

**Solution:** Compare token values with original:

```typescript
// Original
color: '#FFFFFF'

// Token (exact match)
color: designTokens.colors.text.primary  // '#FFFFFF'
```

### Issue: Spacing feels off

**Cause:** 8pt grid system uses standardized values; original may have used off-grid values.

**Solution:** Find closest grid value:

```typescript
// Original: 50px
// Closest grid: 48px (designTokens.spacing[12])
// Better match: 60px (designTokens.spacing[15])

padding: `16px ${designTokens.spacing[15]}px`  // Result: "16px 60px"
```

### Issue: Animations feel different

**Cause:** Spring configs have been standardized.

**Solution:** Adjust spring config:

```typescript
// Original
config: { damping: 10 }

// Token equivalent
config: designTokens.animation.spring.bouncy  // { damping: 10, mass: 1, stiffness: 100 }

// If different feel needed, customize:
config: { ...designTokens.animation.spring.bouncy, damping: 12 }
```

### Issue: Glitch effect not working

**Cause:** Glitch shadow is dynamic (changes per frame).

**Solution:** Use helper function:

```typescript
import { getGlitchShadow } from './styles/design-tokens';

const glitchAmount = Math.sin(frame * 0.5) * 3;
textShadow: getGlitchShadow(glitchAmount)
```

---

## Advanced Usage

### Custom Color Variants

Create scene-specific color overrides:

```typescript
const sceneColor = scene.color || designTokens.colors.text.primary;

<div style={{ color: sceneColor }}>
  {scene.title}
</div>
```

### Responsive Font Sizes

Use helper function for different video resolutions:

```typescript
import { getResponsiveFontSize } from './styles/design-tokens';

const fontSize = getResponsiveFontSize(80, videoHeight);
// Scales 80px proportionally to video height
```

### Combining Effects

Layer multiple effects for unique styles:

```typescript
// Combine glow + shadow + stroke
textShadow: `
  ${designTokens.effects.glow.cyan.strong},
  ${designTokens.effects.shadow.soft},
  ${designTokens.effects.stroke.medium}
`
```

### Theme Switching

Create multiple themes:

```typescript
const themes = {
  cyber: designTokens,
  dark: { ...designTokens, colors: { /* dark variant */ } },
  light: { ...designTokens, colors: { /* light variant */ } },
};

const currentTheme = themes[scene.theme] || themes.cyber;
```

---

## Performance Optimization

### Best Practices

1. **Import once per file:**
```typescript
import { designTokens } from './styles/design-tokens';
```

2. **Avoid inline token access in loops:**
```typescript
// Bad: Repeated lookups
scenes.map(scene => <div style={{ color: designTokens.colors.text.primary }} />)

// Good: Extract once
const textColor = designTokens.colors.text.primary;
scenes.map(scene => <div style={{ color: textColor }} />)
```

3. **Use pre-combined effects:**
```typescript
// Good: Pre-combined
textShadow: designTokens.effects.textEffect.cyberGlow

// Avoid: Manual combination each time
textShadow: `0 0 10px rgba(0, 255, 255, 0.4), ...`
```

4. **Memoize computed styles:**
```typescript
const titleStyle = useMemo(() => ({
  fontSize: designTokens.typography.fontSize['5xl'],
  color: designTokens.colors.text.primary,
  fontFamily: designTokens.typography.fontFamily.primary,
}), []);
```

---

## Examples Gallery

### Example 1: Cyber Title with Strong Glow

```typescript
<div
  style={{
    fontSize: designTokens.typography.fontSize['5xl'],
    fontWeight: designTokens.typography.fontWeight.bold,
    fontFamily: designTokens.typography.fontFamily.primary,
    color: designTokens.colors.primary.cyan,
    textShadow: designTokens.effects.textEffect.strongGlow,
    letterSpacing: designTokens.typography.letterSpacing.wide,
    textTransform: 'uppercase',
  }}
>
  CYBER TITLE
</div>
```

### Example 2: Gold Number with Shine

```typescript
<div
  style={{
    fontSize: designTokens.typography.fontSize['7xl'],  // 160px
    fontWeight: designTokens.typography.fontWeight.black,
    fontFamily: designTokens.typography.fontFamily.primary,
    color: designTokens.colors.accent.gold,
    textShadow: designTokens.effects.textEffect.goldShine,
  }}
>
  42
</div>
```

### Example 3: Subtle Subtitle

```typescript
<div
  style={{
    fontSize: designTokens.typography.fontSize['2xl'],
    fontFamily: designTokens.typography.fontFamily.primary,
    color: designTokens.colors.text.secondary,
    textShadow: designTokens.effects.textEffect.subtleDepth,
    lineHeight: designTokens.typography.lineHeight.relaxed,
    marginTop: designTokens.spacing[10],
  }}
>
  Subtitle text with subtle depth
</div>
```

### Example 4: Monospace Code-Style Text

```typescript
<div
  style={{
    fontSize: designTokens.typography.fontSize.lg,
    fontFamily: designTokens.typography.fontFamily.secondary,  // Monospace
    color: designTokens.colors.semantic.info.base,
    textShadow: designTokens.effects.glow.cyan.soft,
    letterSpacing: designTokens.typography.letterSpacing.wider,
    textTransform: 'uppercase',
  }}
>
  SYSTEM ONLINE
</div>
```

---

## Next Steps

1. ✅ Review this guide
2. ✅ Install Google Fonts (optional but recommended)
3. ✅ Start with CyberWireframe.tsx refactoring
4. ✅ Refactor SceneRenderer.tsx
5. ✅ Run visual regression tests
6. ✅ Adjust as needed based on test results
7. ✅ Update type definitions if needed
8. ✅ Document any custom modifications

---

## Support

**Documentation:**
- Design System Overview: `docs/VISUAL_DESIGN_SYSTEM.md`
- Accessibility Report: `docs/ACCESSIBILITY_REPORT.md`
- Design Tokens: `src/styles/design-tokens.ts`

**Examples:**
- Refactored CyberWireframe: `src/CyberWireframe-refactored.tsx`
- Refactored SceneRenderer: `src/SceneRenderer-refactored.tsx`

**Questions?** Check the design system documentation or review the refactored example files.

---

**Last Updated:** 2026-03-14
**Version:** 1.0.0
