/**
 * Premium Design Tokens
 * High-end visual styles for business and luxury content
 */

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
      textShadow: '0 3px 12px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.9)',  // 增强双层阴影
      subtitleShadow: '0 2px 8px rgba(0, 0, 0, 0.75), 0 1px 2px rgba(0, 0, 0, 0.85)',  // 副标题专用阴影
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

  animation: {
    elegance: {
      duration: 60, // 2 seconds at 30fps
      easing: 'cubic',
    },
    authority: {
      duration: 45, // 1.5 seconds at 30fps
      easing: 'cubic',
    },
    luxury: {
      duration: 90, // 3 seconds at 30fps
      easing: 'quint',
    },
    minimal: {
      duration: 30, // 1 second at 30fps
      easing: 'linear',
    },
    cinematic: {
      duration: 75, // 2.5 seconds at 30fps
      easing: 'expo',
    },
  },
};
