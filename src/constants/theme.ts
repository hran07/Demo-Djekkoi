export const COLORS = {
    primary: "#0d00fcff", // Sky Blue (tema air)
    secondary: "#0F172A", // Slate Dark
    background: "#009ff4ff", // background apk
    surface: "#09ff00ff", // Card / Modal
    success: "#22C55E", // Sehat / Aktif
    warning: "#F59E0B", // Perawatan / Karantina
    danger: "#EF4444", // Sakit / Kosong
    textMuted: "#64748B",
    border: "#E2E8F0",
} as const;

export const SPACING = {
    xs: 4, // spacing antar text ke bawah dalam card
    sm: 8, // jarak ikon
    md: 16, // ukuran card
    lg: 24, // posisi tombol tambah
    gap: 12, // jarak antar card
} as const;

export const RADIUS = {
    card: 11,
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