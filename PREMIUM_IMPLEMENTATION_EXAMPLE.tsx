/**
 * OpenClaw Video Generator - Premium Style Implementation Examples
 *
 * 这个文件展示如何实现 5 种高端商务场景的完整代码示例
 * 可以直接复制到项目中使用，或作为参考进行自定义
 *
 * @version 1.0.0
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';
import { SceneData } from './types';

// ============================================================================
// PREMIUM DESIGN TOKENS
// ============================================================================

export const premiumTokens = {
  colors: {
    elegance: {
      background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
      primary: '#FFFFFF',
      accent: '#B8860B',
      secondary: '#E5E5E5',
    },
    authority: {
      background: '#0F0F0F',
      primary: '#E5E5E5',
      accent: '#C9A961',
      line: '#4A4A4A',
      number: '#C9A961',
    },
    luxury: {
      background: '#000000',
      primary: '#F5F5F5',
      accent: '#D4AF37',
      decorative: '#8B7355',
    },
    minimal: {
      backgroundDark: '#0D0D0D',
      backgroundLight: '#FAFAFA',
      primary: '#FFFFFF',
      primaryDark: '#000000',
      line: '#3A3A3A',
      accentBlue: '#0066FF',
      accentOrange: '#FF6B35',
    },
    cinematic: {
      background: '#000000',
      primary: '#EDEDED',
      accentRed: '#E63946',
      accentBlue: '#457B9D',
      decorative: '#1D3557',
    },
  },

  typography: {
    elegance: {
      fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
      fontSize: { title: 72, subtitle: 32 },
      fontWeight: { title: 300, subtitle: 400 },
      letterSpacing: '0.05em',
    },
    authority: {
      fontFamily: {
        title: "'Georgia', 'Times New Roman', serif",
        number: "'Helvetica Neue', 'Arial', sans-serif",
        subtitle: "'Inter', sans-serif",
      },
      fontSize: { title: 56, number: 96, subtitle: 28 },
      fontWeight: { title: 700, number: 300, subtitle: 400 },
    },
    luxury: {
      fontFamily: {
        title: "'Playfair Display', 'Georgia', serif",
        subtitle: "'Lato', 'Avenir', sans-serif",
      },
      fontSize: { title: 64, subtitle: 24 },
      fontWeight: { title: 400, subtitle: 300 },
      letterSpacing: '0.1em',
    },
    minimal: {
      fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
      fontSize: { title: 68, subtitle: 20 },
      fontWeight: { title: 700, subtitle: 400 },
      letterSpacing: '0',
    },
    cinematic: {
      fontFamily: {
        title: "'Montserrat', 'Arial Black', sans-serif",
        subtitle: "'Roboto', 'Open Sans', sans-serif",
      },
      fontSize: { title: 88, subtitle: 26 },
      fontWeight: { title: 800, subtitle: 300 },
      letterSpacing: '0.02em',
    },
  },

  effects: {
    elegance: {
      blur: 40,
      shadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      textShadow: '0 2px 12px rgba(0, 0, 0, 0.5)',
    },
    authority: {
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
      lineShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
    },
    luxury: {
      blur: 15,
      textShadow: '0 4px 16px rgba(0, 0, 0, 0.8)',
      goldGradient: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.3) 50%, rgba(212,175,55,0.1) 100%)',
    },
    minimal: {
      hardShadow: '0 1px 0 rgba(0, 0, 0, 1)',
    },
    cinematic: {
      blur: 8,
      textShadow: '0 4px 20px rgba(0, 0, 0, 0.9)',
      vignette: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
    },
  },
};

// ============================================================================
// 1. ELEGANCE SCENE - Apple 发布会风格
// ============================================================================

interface EleganceSceneProps {
  scene: SceneData;
  frame: number;
  fps: number;
}

export const EleganceScene: React.FC<EleganceSceneProps> = ({ scene, frame, fps }) => {
  const { elegance } = premiumTokens.colors;
  const typography = premiumTokens.typography.elegance;
  const effects = premiumTokens.effects.elegance;

  // 主标题动画：2秒缓慢淡入 + 微缩放
  const titleOpacity = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1), // easeInOutCubic
  });

  const titleScale = interpolate(frame, [0, 60], [0.98, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const titleBlur = interpolate(frame, [0, 30], [5, 0], {
    extrapolateRight: 'clamp',
  });

  // 副标题动画：延迟0.5秒，从下方上浮
  const subtitleOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const subtitleTranslateY = interpolate(frame, [15, 45], [30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // 渐变遮罩动画
  const maskY = interpolate(frame, [0, 45], [-100, 150], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const maskOpacity = interpolate(frame, [0, 20, 40, 60], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: elegance.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 渐变遮罩效果 */}
      <div
        style={{
          position: 'absolute',
          top: `${maskY}%`,
          width: '100%',
          height: '200%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          pointerEvents: 'none',
          opacity: maskOpacity,
        }}
      />

      {/* 主标题 */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '90%',
          padding: '40px 60px',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: `blur(${effects.blur}px) saturate(120%)`,
          borderRadius: '20px',
          boxShadow: effects.shadow,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          filter: `blur(${titleBlur}px)`,
        }}
      >
        <h1
          style={{
            fontFamily: typography.fontFamily,
            fontSize: `${typography.fontSize.title}px`,
            fontWeight: typography.fontWeight.title,
            color: elegance.primary,
            letterSpacing: typography.letterSpacing,
            lineHeight: 1.2,
            margin: 0,
            textShadow: effects.textShadow,
          }}
        >
          {scene.title}
        </h1>

        {/* 副标题 */}
        {scene.subtitle && (
          <p
            style={{
              fontFamily: typography.fontFamily,
              fontSize: `${typography.fontSize.subtitle}px`,
              fontWeight: typography.fontWeight.subtitle,
              color: elegance.secondary,
              marginTop: '20px',
              lineHeight: 1.4,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleTranslateY}px)`,
              textShadow: effects.textShadow,
            }}
          >
            {scene.subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// 2. AUTHORITY SCENE - 纪录片/TED 风格
// ============================================================================

export const AuthorityScene: React.FC<EleganceSceneProps> = ({ scene, frame, fps }) => {
  const { authority } = premiumTokens.colors;
  const typography = premiumTokens.typography.authority;
  const effects = premiumTokens.effects.authority;

  // 标题从左侧滑入
  const titleTranslateX = interpolate(frame, [0, 45], [-50, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 1, 0.68, 1), // easeOutCubic
  });

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 引用线动画
  const lineWidth = interpolate(frame, [10, 40], [0, 100], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // 数字计数动画
  const numberCount = scene.number
    ? interpolate(frame, [24, 84], [0, parseFloat(scene.number) || 0], {
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.quad),
      })
    : 0;

  const numberOpacity = interpolate(frame, [24, 54], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: authority.background,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: '15%',
        paddingRight: '15%',
      }}
    >
      {/* 引用线 */}
      <div
        style={{
          width: `${lineWidth}%`,
          height: '2px',
          backgroundColor: authority.line,
          marginBottom: '30px',
          boxShadow: effects.lineShadow,
        }}
      />

      {/* 主标题 */}
      <h1
        style={{
          fontFamily: typography.fontFamily.title,
          fontSize: `${typography.fontSize.title}px`,
          fontWeight: typography.fontWeight.title,
          color: authority.primary,
          lineHeight: 1.3,
          margin: 0,
          opacity: titleOpacity,
          transform: `translateX(${titleTranslateX}px)`,
          textShadow: effects.textShadow,
        }}
      >
        {scene.title}
      </h1>

      {/* 数字展示 */}
      {scene.number && (
        <div
          style={{
            fontFamily: typography.fontFamily.number,
            fontSize: `${typography.fontSize.number}px`,
            fontWeight: typography.fontWeight.number,
            color: authority.accent,
            marginTop: '40px',
            letterSpacing: '-0.02em',
            opacity: numberOpacity,
            textShadow: effects.textShadow,
          }}
        >
          {Math.round(numberCount).toLocaleString()}
          {scene.number.includes('%') && '%'}
        </div>
      )}

      {/* 副标题 */}
      {scene.subtitle && (
        <p
          style={{
            fontFamily: typography.fontFamily.subtitle,
            fontSize: `${typography.fontSize.subtitle}px`,
            fontWeight: typography.fontWeight.subtitle,
            color: authority.primary,
            marginTop: '30px',
            lineHeight: 1.5,
            maxWidth: '80%',
            opacity: interpolate(frame, [40, 70], [0, 1], {
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {scene.subtitle}
        </p>
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// 3. LUXURY SCENE - 奢侈品广告风格
// ============================================================================

export const LuxuryScene: React.FC<EleganceSceneProps> = ({ scene, frame, fps }) => {
  const { luxury } = premiumTokens.colors;
  const typography = premiumTokens.typography.luxury;
  const effects = premiumTokens.effects.luxury;

  // 极慢淡入（3秒）
  const opacity = interpolate(frame, [0, 90], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.23, 1, 0.32, 1), // easeOutQuint
  });

  // 几乎察觉不到的缩放
  const scale = interpolate(frame, [0, 90], [0.995, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // 亮度脉冲
  const brightness = interpolate(frame, [0, 60, 120], [0.8, 1.05, 1], {
    extrapolateRight: 'clamp',
  });

  // 金箔扫光效果
  const sweepX = interpolate(frame, [30, 150], [-100, 200], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const sweepOpacity = interpolate(frame, [30, 60, 120, 150], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: luxury.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 细腻噪点纹理 */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* 金箔扫光 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `${sweepX}%`,
          width: '80%',
          height: '100%',
          background: effects.goldGradient,
          filter: 'blur(30px)',
          opacity: sweepOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* 主内容 */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '60%',
          opacity,
          transform: `scale(${scale})`,
          filter: `brightness(${brightness})`,
        }}
      >
        <h1
          style={{
            fontFamily: typography.fontFamily.title,
            fontSize: `${typography.fontSize.title}px`,
            fontWeight: typography.fontWeight.title,
            color: luxury.primary,
            letterSpacing: typography.letterSpacing,
            lineHeight: 1.3,
            margin: 0,
            textShadow: effects.textShadow,
          }}
        >
          {scene.title}
        </h1>

        {scene.subtitle && (
          <p
            style={{
              fontFamily: typography.fontFamily.subtitle,
              fontSize: `${typography.fontSize.subtitle}px`,
              fontWeight: typography.fontWeight.subtitle,
              color: luxury.accent,
              marginTop: '40px',
              letterSpacing: '0.05em',
              lineHeight: 1.6,
              textShadow: effects.textShadow,
            }}
          >
            {scene.subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// 4. MINIMAL SCENE - 极简几何风格
// ============================================================================

export const MinimalScene: React.FC<EleganceSceneProps> = ({ scene, frame, fps }) => {
  const { minimal } = premiumTokens.colors;
  const typography = premiumTokens.typography.minimal;
  const useDarkMode = scene.color === 'dark'; // 可通过 scene.color 控制

  const background = useDarkMode ? minimal.backgroundDark : minimal.backgroundLight;
  const textColor = useDarkMode ? minimal.primary : minimal.primaryDark;

  // 线性淡入（无缓动）
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.linear,
  });

  // Clip-path 文字展开效果
  const clipRight = interpolate(frame, [0, 30], [100, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  // 几何线条动画
  const lineLength = interpolate(frame, [10, 50], [0, 100], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // 字母逐个出现
  const renderStaggeredText = (text: string) => {
    return text.split('').map((char, i) => {
      const charOpacity = interpolate(frame, [i * 1.5, i * 1.5 + 10], [0, 1], {
        extrapolateRight: 'clamp',
        easing: Easing.linear,
      });

      return (
        <span
          key={i}
          style={{
            opacity: charOpacity,
            display: 'inline-block',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: background,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: '10%',
        paddingRight: '10%',
      }}
    >
      {/* 垂直装饰线 */}
      <div
        style={{
          position: 'absolute',
          left: '5%',
          top: 0,
          width: '2px',
          height: `${lineLength}%`,
          backgroundColor: minimal.line,
        }}
      />

      {/* 水平装饰线 */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: 0,
          width: `${lineLength}%`,
          height: '2px',
          backgroundColor: minimal.line,
        }}
      />

      {/* 主标题 */}
      <h1
        style={{
          fontFamily: typography.fontFamily,
          fontSize: `${typography.fontSize.title}px`,
          fontWeight: typography.fontWeight.title,
          color: textColor,
          letterSpacing: typography.letterSpacing,
          lineHeight: 1.1,
          margin: 0,
          opacity,
          clipPath: `inset(0 ${clipRight}% 0 0)`,
        }}
      >
        {renderStaggeredText(scene.title)}
      </h1>

      {/* 副标题 */}
      {scene.subtitle && (
        <p
          style={{
            fontFamily: typography.fontFamily,
            fontSize: `${typography.fontSize.subtitle}px`,
            fontWeight: typography.fontWeight.subtitle,
            color: textColor,
            marginTop: '30px',
            lineHeight: 1.4,
            maxWidth: '70%',
            opacity: interpolate(frame, [30, 60], [0, 1], {
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {scene.subtitle}
        </p>
      )}

      {/* 强调色块（可选） */}
      {scene.highlight && (
        <div
          style={{
            position: 'absolute',
            right: '10%',
            top: '40%',
            width: `${interpolate(frame, [40, 80], [0, 200], {
              extrapolateRight: 'clamp',
            })}px`,
            height: '4px',
            backgroundColor: minimal.accentBlue,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// 5. CINEMATIC SCENE - 电影预告片风格
// ============================================================================

export const CinematicScene: React.FC<EleganceSceneProps> = ({ scene, frame, fps }) => {
  const { cinematic } = premiumTokens.colors;
  const typography = premiumTokens.typography.cinematic;
  const effects = premiumTokens.effects.cinematic;

  // 推轨效果（从远到近）
  const scale = interpolate(frame, [0, 75], [1.5, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1), // easeOutExpo
  });

  const opacity = interpolate(frame, [0, 30, 60, 90], [0, 0.3, 1, 1], {
    extrapolateRight: 'clamp',
  });

  const blur = interpolate(frame, [0, 45], [8, 0], {
    extrapolateRight: 'clamp',
  });

  // 镜头光晕动画
  const flareX = interpolate(frame, [30, 120], [-20, 120], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const flareOpacity = interpolate(frame, [30, 60, 90, 120], [0, 0.6, 0.6, 0], {
    extrapolateRight: 'clamp',
  });

  // 副标题从下方滑入
  const subtitleY = interpolate(frame, [45, 90], [100, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const subtitleOpacity = interpolate(frame, [45, 75], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: cinematic.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 电影黑边（上） */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '10%',
          backgroundColor: '#000000',
          zIndex: 100,
        }}
      />

      {/* 电影黑边（下） */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '10%',
          backgroundColor: '#000000',
          zIndex: 100,
        }}
      />

      {/* 暗角效果 */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: effects.vignette,
          pointerEvents: 'none',
        }}
      />

      {/* 镜头光晕 */}
      <div
        style={{
          position: 'absolute',
          left: `${flareX}%`,
          top: '40%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
          opacity: flareOpacity,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      {/* 主内容 */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '90%',
          transform: `scale(${scale})`,
          opacity,
          filter: `blur(${blur}px) saturate(0.85) contrast(1.1)`,
        }}
      >
        <h1
          style={{
            fontFamily: typography.fontFamily.title,
            fontSize: `${typography.fontSize.title}px`,
            fontWeight: typography.fontWeight.title,
            color: cinematic.primary,
            letterSpacing: typography.letterSpacing,
            lineHeight: 1.1,
            margin: 0,
            textShadow: effects.textShadow,
            textTransform: 'uppercase',
          }}
        >
          {scene.title}
        </h1>

        {scene.subtitle && (
          <p
            style={{
              fontFamily: typography.fontFamily.subtitle,
              fontSize: `${typography.fontSize.subtitle}px`,
              fontWeight: typography.fontWeight.subtitle,
              color: cinematic.accentRed,
              marginTop: '30px',
              lineHeight: 1.5,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
              textShadow: effects.textShadow,
            }}
          >
            {scene.subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE RENDERER INTEGRATION
// ============================================================================

/**
 * 在 SceneRenderer.tsx 中集成这些场景
 *
 * 使用示例:
 */

export const renderPremiumScene = (scene: SceneData, frame: number, fps: number) => {
  switch (scene.type) {
    case 'elegance':
      return <EleganceScene scene={scene} frame={frame} fps={fps} />;
    case 'authority':
      return <AuthorityScene scene={scene} frame={frame} fps={fps} />;
    case 'luxury':
      return <LuxuryScene scene={scene} frame={frame} fps={fps} />;
    case 'minimal':
      return <MinimalScene scene={scene} frame={frame} fps={fps} />;
    case 'cinematic':
      return <CinematicScene scene={scene} frame={frame} fps={fps} />;
    default:
      return null;
  }
};

// ============================================================================
// USAGE EXAMPLES IN scenes-data.ts
// ============================================================================

/**
 * 使用示例：在 scenes-data.ts 中定义场景
 *
 * export const scenes: SceneData[] = [
 *   {
 *     start: 0,
 *     end: 5,
 *     type: 'cinematic',
 *     styleTheme: 'premium',
 *     title: '2026年度回顾',
 *     subtitle: '创新、突破、成长',
 *   },
 *   {
 *     start: 5,
 *     end: 12,
 *     type: 'authority',
 *     styleTheme: 'premium',
 *     title: '营收增长创新高',
 *     number: '340%',
 *     subtitle: '连续三年保持三位数增长',
 *   },
 *   {
 *     start: 12,
 *     end: 20,
 *     type: 'elegance',
 *     styleTheme: 'premium',
 *     title: '全新旗舰产品发布',
 *     subtitle: '重新定义行业标准',
 *   },
 *   {
 *     start: 20,
 *     end: 28,
 *     type: 'luxury',
 *     styleTheme: 'premium',
 *     title: '匠心品质',
 *     subtitle: '每一个细节都值得品味',
 *   },
 *   {
 *     start: 28,
 *     end: 35,
 *     type: 'minimal',
 *     styleTheme: 'premium',
 *     title: '简约而不简单',
 *     subtitle: '设计即功能',
 *     highlight: true,
 *   },
 * ];
 */
