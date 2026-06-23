export const colors = {
  primary:    '#1a8fe0',
  primaryDark:'#0e5f9e',
  primaryLight:'#e8f4fd',
  secondary:  '#14b8a6',
  success:    '#22c55e',
  warning:    '#f59e0b',
  error:      '#ef4444',
  white:      '#ffffff',
  black:      '#0f172a',
  text:       '#1e293b',
  textMuted:  '#64748b',
  textLight:  '#94a3b8',
  border:     '#e2e8f0',
  background: '#f8fafc',
  card:       '#ffffff',
  overlay:    'rgba(0,0,0,0.5)',
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
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  full: 999,
};

export const typography = {
  h1:   { fontSize: 28, fontWeight: '700', color: colors.black,     lineHeight: 36 },
  h2:   { fontSize: 22, fontWeight: '700', color: colors.black,     lineHeight: 30 },
  h3:   { fontSize: 18, fontWeight: '600', color: colors.text,      lineHeight: 26 },
  body: { fontSize: 15, fontWeight: '400', color: colors.text,      lineHeight: 22 },
  small:{ fontSize: 13, fontWeight: '400', color: colors.textMuted, lineHeight: 18 },
  tiny: { fontSize: 11, fontWeight: '500', color: colors.textLight, lineHeight: 16 },
  label:{ fontSize: 12, fontWeight: '600', color: colors.textMuted, lineHeight: 16 },
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
    shadowOpacity: 0.1,
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
