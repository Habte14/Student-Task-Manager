/**
 * Centralized design tokens.
 *
 * Every "magic" rgba/hex value the UI used to repeat inline (sometimes
 * with tiny inconsistencies, e.g. 0.1 vs 0.10 vs 0.08 for what was meant
 * to be the same "glass border") lives here once. Components import from
 * this file instead of hardcoding colors, which is what keeps spacing,
 * borders and translucency consistent across the whole app.
 */

export const colors = {
  // Surfaces
  glassBg: 'rgba(0,0,0,0.75)',
  glassBgSoft: 'rgba(255,255,255,0.1)',
  glassBgSofter: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.1)',
  glassBorderStrong: 'rgba(255,255,255,0.2)',
  glassBorderFocus: 'rgba(255,255,255,0.4)',
  overlay: 'rgba(0,0,0,0.45)',
  /**
   * Vertical scrim over the dashboard background photo: darkest at the
   * very top/bottom edges (where header text and list rows sit) and a
   * touch lighter through the middle, so the photo stays visible without
   * fighting the stat cards for attention.
   */
  overlayGradient:
    'linear-gradient(180deg, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.55) 28%, rgba(10,10,10,0.62) 60%, rgba(10,10,10,0.8) 100%)',
  glow: 'rgba(255,255,255,0.04)',

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  textDisabled: '#6b7280',
  textOnLight: '#000000',

  // Accents (kept monochrome to match the existing dark-mode brand)
  surfaceInverse: '#ffffff',
  surfaceInverseHover: '#e5e7eb',
  border: 'rgba(255,255,255,0.1)',

  // Priority scale
  priority: {
    High: { badge: '#000000', text: '#ffffff', border: '#000000' },
    Medium: { badge: '#6b7280', text: '#ffffff', border: '#9ca3af' },
    Low: { badge: '#ffffff', text: '#000000', border: '#e5e7eb' },
  },
} as const

export const fonts = {
  heading: "'Playfair Display', serif",
  body: 'Inter, sans-serif',
  ui: 'Sora, sans-serif',
  mono: "'JetBrains Mono', monospace",
  display: "'Space Grotesk', sans-serif",
} as const

/** Fixed left sidebar width on desktop layouts ($gtMd and up). */
export const SIDEBAR_WIDTH = 272
