export const COLORS = {
    primary: "#0284C7", // Sky Blue (tema air)
    secondary: "#0F172A", // Slate Dark
    background: "#F8FAFC", // Off White
    surface: "#FFFFFF", // Card / Modal
    success: "#22C55E", // Sehat / Aktif
    warning: "#F59E0B", // Perawatan / Karantina
    danger: "#EF4444", // Sakit / Kosong
    textMuted: "#64748B",
    border: "#E2E8F0",
} as const;

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    gap: 12,
} as const;

export const RADIUS = {
    card: 12,
    modal: 12,
} as const;

export const STATUS_KOLAM_COLOR = {
    Aktif: COLORS.success,
    Perawatan: COLORS.warning,
    Kosong: COLORS.danger,
} as const;

export const KONDISI_IKAN_COLOR = {
    Sehat: COLORS.success,
    Karantina: COLORS.warning,
    Sakit: COLORS.danger,
} as const;