/**
 * PaperTrail Design Tokens
 * Source of truth for Web and Native Mobile styling
 */

export const colors = {
  primary: {
    DEFAULT: '#0861E8', // Electric Cobalt Blue
    hover: '#0752c4',
    light: '#2575fc',
    muted: '#EBF2FF',
    dark: '#0546aa',
    glow: 'rgba(8, 97, 232, 0.35)',
  },
  canvas: {
    DEFAULT: '#EBECEF', // External cool grey backdrop
    light: '#F0F1F4',
  },
  surface: {
    DEFAULT: '#F7F7F7', // Main viewport soft off-white surface
    card: '#FFFFFF',
    subtle: '#F1F3F6',
  },
  charcoal: {
    900: '#14181F',
    800: '#1F242D',
    700: '#323945',
    600: '#4B5565',
    500: '#697586',
    400: '#9AA4B2',
    300: '#CDD5DF',
    200: '#E3E8EF',
    100: '#F8F9FA',
  },
  status: {
    danger: '#EF4444',
    dangerBg: '#FEF2F2',
    warning: '#F59E0B',
    warningBg: '#FFFBEB',
    success: '#10B981',
    successBg: '#ECFDF5',
    info: '#3B82F6',
    infoBg: '#EFF6FF',
  },
} as const;

export const radii = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '28px',
  '3.5xl': '32px',
  '4xl': '38px',
  full: '9999px',
} as const;

export const typography = {
  fontFamilies: {
    sans: 'Plus Jakarta Sans, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  },
  sizes: {
    xs: '11px',
    sm: '13px',
    base: '15px',
    lg: '17px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '34px',
  },
} as const;

export const shadows = {
  soft: '0 8px 30px rgba(0, 0, 0, 0.04)',
  card: '0 12px 36px -4px rgba(8, 97, 232, 0.28)',
  nav: '0 10px 40px -6px rgba(0, 0, 0, 0.12)',
  device: '0 25px 70px -15px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0,0,0,0.06)',
} as const;
