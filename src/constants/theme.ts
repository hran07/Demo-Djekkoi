import { Platform } from 'react-native';

export const COLORS = {
  // Palet Utama Djekkoi Mini Redesign
  bg: '#F4F7F6',
  headerDark: '#0B3B47',
  ink: '#0B2B33',
  muted: '#4F676D',
  border: '#DCE5E6',
  borderLight: '#E4ECED',
  surface: '#FFFFFF',

  // Brand Accent & Actions
  accent: '#0E5A6B',
  accentSoft: '#DDEEF1',
  accentHover: '#0B3B47',
  fab: '#C93C18',
  fabShadow: 'rgba(201, 60, 24, 0.35)',

  // Status & Indikator
  ok: '#14613B',
  okBg: '#E3F3EA',
  okCheck: '#1F7A4D',
  okBorder: '#BFE3CF',

  warn: '#7A4F00',
  warnBg: '#FBEFD2',
  warnBar: '#E0A21B',

  danger: '#A3231B',
  dangerBg: '#FBE4E1',
  dangerBar: '#D64533',

  // Koi Illustration Colors
  koiOrange: '#E4572E',
  koiTail: '#F08A63',
  koiLight: '#DCEBEE',
  koiSubtitle: '#B9D3D8',

  // Kompatibilitas Modul 2
  primary: '#0E5A6B',
  secondary: '#0B2B33',
  background: '#F4F7F6',
  textMuted: '#4F676D',
  success: '#14613B',
  warning: '#7A4F00',
} as const;

export const FONTS = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
  bold: '700' as const,
  semiBold: '600' as const,
  medium: '500' as const,
  regular: '400' as const,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  gap: 12,
} as const;

export const RADIUS = {
  card: 16,
  modal: 24,
  pill: 999,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const STATUS_KOLAM_STYLE = {
  Aktif: { bg: COLORS.okBg, text: COLORS.ok },
  Perawatan: { bg: COLORS.warnBg, text: COLORS.warn },
  Kosong: { bg: COLORS.dangerBg, text: COLORS.danger },
} as const;

export const KONDISI_IKAN_STYLE = {
  Sehat: { bg: COLORS.okBg, text: COLORS.ok },
  Karantina: { bg: COLORS.warnBg, text: COLORS.warn },
  Sakit: { bg: COLORS.dangerBg, text: COLORS.danger },
} as const;

// Kompatibilitas Modul 2
export const STATUS_KOLAM_COLOR = {
  Aktif: COLORS.ok,
  Perawatan: COLORS.warn,
  Kosong: COLORS.danger,
} as const;

export const KONDISI_IKAN_COLOR = {
  Sehat: COLORS.ok,
  Karantina: COLORS.warn,
  Sakit: COLORS.danger,
} as const;
