/**
 * PaperTrail Design Tokens
 * Single source of truth for all visual constants.
 * Use these instead of arbitrary hex codes.
 */

export const tokens = {
  // Brand
  primary: '#1D5FF0',
  primaryHover: '#174FCB',
  primarySoft: '#E5EDFF',
  primaryMuted: '#EBF0FD',

  // Backgrounds
  bg: '#F6F6F2',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0F0EA',
  surfaceElevated: '#FAFAF8',

  // Semantic surfaces (used sparingly, one per screen section)
  sage: '#E8EDD8',      // Info / category
  lavender: '#EBE3F5',  // Secondary / account  
  powder: '#DCE8F8',    // Data / stats
  butter: '#F4EDD5',    // Reminder / warning

  // Text (WCAG 2.1 AA compliant contrast ratios ≥ 4.5:1 on light surfaces)
  textPrimary: '#1E201D',
  textSecondary: '#4A4E46',
  textTertiary: '#646860',
  textInverse: '#FFFFFF',

  // Border
  border: '#E6E6E0',
  borderStrong: '#CFCFC8',

  // Semantic status
  success: '#16A34A',
  successSoft: '#DCFCE7',
  warning: '#D97706',
  warningSoft: '#FEF3C7',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  info: '#0284C7',
  infoSoft: '#E0F2FE',
} as const;

/** Category color mapping — consistent across the entire app */
export const categoryColors: Record<string, {
  bg: string;
  text: string;
  icon: string;
  border: string;
}> = {
  Identity: {
    bg: '#E5EDFF',
    text: '#1D5FF0',
    icon: '#1D5FF0',
    border: '#C7D9FB',
  },
  Education: {
    bg: '#F3E8FF',
    text: '#7C3AED',
    icon: '#7C3AED',
    border: '#DDD0F7',
  },
  Finance: {
    bg: '#FEF9C3',
    text: '#854D0E',
    icon: '#CA8A04',
    border: '#FDE68A',
  },
  Insurance: {
    bg: '#DCFCE7',
    text: '#166534',
    icon: '#16A34A',
    border: '#BBF7D0',
  },
  Medical: {
    bg: '#FFE4E6',
    text: '#9F1239',
    icon: '#E11D48',
    border: '#FECDD3',
  },
  Warranty: {
    bg: '#FFF7ED',
    text: '#9A3412',
    icon: '#EA580C',
    border: '#FED7AA',
  },
  Vehicle: {
    bg: '#E0F2FE',
    text: '#075985',
    icon: '#0284C7',
    border: '#BAE6FD',
  },
  'Bills and receipts': {
    bg: '#EEF2FF',
    text: '#3730A3',
    icon: '#4F46E5',
    border: '#C7D2FE',
  },
  Other: {
    bg: '#F1F5F9',
    text: '#475569',
    icon: '#64748B',
    border: '#CBD5E1',
  },
};

export function getCategoryColor(category: string) {
  const base = categoryColors[category] ?? categoryColors['Other'];
  return {
    ...base,
    accent: base.icon || base.text,
  };
}
