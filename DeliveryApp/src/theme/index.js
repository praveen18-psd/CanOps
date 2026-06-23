// Delivery app uses a green/teal operational palette — bolder, high-contrast for field use
export const colors = {
  primary:      '#059669', // emerald-600
  primaryDark:  '#047857',
  primaryLight: '#d1fae5',
  accent:       '#0ea5e9', // sky-500 for map/nav elements
  warning:      '#f59e0b',
  error:        '#ef4444',
  success:      '#22c55e',
  white:        '#ffffff',
  black:        '#0f172a',
  text:         '#1e293b',
  textMuted:    '#64748b',
  textLight:    '#94a3b8',
  border:       '#e2e8f0',
  background:   '#f0fdf4', // faint green tint
  card:         '#ffffff',
  statusBar:    '#047857',
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 999,
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
};
