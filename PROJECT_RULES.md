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
