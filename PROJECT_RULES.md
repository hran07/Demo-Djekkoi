# PROJECT REQUIREMENTS: Djekkoi Mini App (React Native / Expo Router)

## 1. Project Overview

Aplikasi ini adalah versi simpel dari Djekkoi Farm. Bertujuan untuk mencatat data kolam dan data ikan koi secara lokal.

---

## 2. Tech Stack & Library

- **Framework:** React Native dengan Expo Router (File-based Routing).
- **Language:** TypeScript.
- **Styling:** React Native StyleSheet / Tailwind (NativeWind) / Inline Style sederhana.
- **Icons:** `@expo/vector-icons` (Ionicons / MaterialCommunityIcons).

---

## 3. Data Schema & Types (`src/types/index.ts`)

### A. Interface Kolam (`Kolam`)

- `id`: string
- `nama`: string (Contoh: "Kolam A1", "Kolam Karantina")
- `jenis`: string (Contoh: "Semen", "Terpal", "Filtrasi")
- `kapasitas`: number (Dalam liter / ekor)
- `status`: 'Aktif' | 'Perawatan' | 'Kosong'

### B. Interface Ikan (`Ikan`)

- `id`: string
- `kolamId`: string (Relasi ke ID Kolam)
- `varietas`: string (Contoh: "Kohaku", "Taisho Sanke", "Showa")
- `ukuranCm`: number
- `jumlah`: number
- `kondisi`: 'Sehat' | 'Karantina' | 'Sakit'

---

## 4. Architecture & Directory Structure

```text
src/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab Navigation configuration
│   │   ├── index.tsx        # Dashboard (Overview & Quick Stats)
│   │   ├── kolam.tsx        # Management Page for Ponds (Kolam)
│   │   └── ikan.tsx         # Management Page for Fish (Ikan)
│   └── _layout.tsx          # Root Stack Layout
├── components/
│   ├── CardKolam.tsx        # Card UI for Kolam
│   ├── CardIkan.tsx         # Card UI for Ikan
│   └── ModalForm.tsx        # Reusable Modal for Add/Edit
├── data/
│   └── mockData.ts          # Initial local dummy data for Kolam & Ikan
├── types/
│   └── index.ts             # TypeScript definitions
└── constants/
    └── theme.ts             # App Colors & UI Constants
```

## 5. Functional Requirements per Screen

### A. Dashboard Tab (src/app/(tabs)/index.tsx)

- Menampilkan ringkasan data:

- Total Kolam & Total Ikan.

- Jumlah Ikan berdasarkan kondisi (Sehat, Karantina, Sakit).

- Tampilan kartu statistik cepat (Quick Summary).

### B. Data Kolam Tab (src/app/(tabs)/kolam.tsx)

- Menampilkan daftar seluruh kolam (CardKolam).

- Tombol aksi Tambah Kolam (Membuka Modal Form).

- Fitur Edit dan Hapus data kolam secara lokal.

### C. Data Ikan Tab (src/app/(tabs)/ikan.tsx)

- Menampilkan daftar seluruh ikan (CardIkan).

- Filter ikan berdasarkan Kolam tertentu.

- Tombol aksi Tambah Ikan (Membuka Modal Form dengan pilihan Kolam).

- Fitur Edit dan Hapus data ikan secara lokal.

## 6. General Guidelines for AI

- Jaga kode tetap bersih, modular, dan ramah TypeScript (type-safe).

## 7. Coding Standards & Naming Conventions

### A. Naming Conventions

- **Files & Components:** Gunakan `PascalCase` untuk React Components (Contoh: `CardKolam.tsx`, `ModalForm.tsx`).
- **Screen Files (Expo Router):** Gunakan `kebab-case` atau huruf kecil (Contoh: `index.tsx`, `kolam.tsx`, `ikan.tsx`).
- **Variables & Functions:** Gunakan `camelCase` (Contoh: `totalIkan`, `handleDeleteKolam`).
- **Types & Interfaces:** Gunakan `PascalCase` tanpa prefix `I` (Contoh: `Kolam`, `Ikan`, bukan `IKolam`).
- **Constants:** Gunakan `UPPER_SNAKE_CASE` (Contoh: `MAX_KAPASITAS`).

### B. Styling & Design System Standards

- **Styling Method:** Gunakan `StyleSheet.create({...})` bawaan React Native secara konsisten.
- **Color Palette (Wajib ambil dari `src/constants/theme.ts`):**
  - Primary (Tema Air): `#0284C7` (Sky Blue)
  - Secondary: `#0F172A` (Slate Dark)
  - Background: `#F8FAFC` (Off White)
  - Card/Surface: `#FFFFFF` (Pure White)
  - Status Success (Sehat/Aktif): `#22C55E`
  - Status Warning (Perawatan/Karantina): `#F59E0B`
  - Status Danger (Sakit/Kosong): `#EF4444`
- **Spacing Standard:** Gunakan kelipatan 4 atau 8 (`padding: 8`, `16`, `24` / `gap: 12`).
- **Border Radius:** Gunakan `borderRadius: 12` untuk Card dan Modal.

## 8. Workflow & Git Collaboration Guidelines

1. **Pengerjaan Paralel via Contract-First:**
   - Orang 1 (Data & Types) WAJIB menyelesaikan `src/types/index.ts` dan `src/data/mockData.ts` paling awal agar struktur data disepakati bersama.
   - Orang 2 (Components & Constants) fokus buat UI reusable berdasarkan tema di `theme.ts`.
   - Orang 3 (Tabs/Screens) merakit layar menggunakan `mockData` dan `Components` yang ada.
2. **Penyelarasan AI Prompting:**
   - Semua tim wajib mencantumkan acuan ke file ini saat menggunakan AI Antigravity agar output kodenya homogen.
