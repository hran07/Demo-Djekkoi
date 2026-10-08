export type StatusKolam = "Aktif" | "Perawatan" | "Kosong";

export type KondisiIkan = "Sehat" | "Karantina" | "Sakit";

export interface Kolam {
    id: string;
    nama: string; // Contoh: "Kolam A1", "Kolam Karantina"
    jenis: string; // Contoh: "Semen", "Terpal", "Filtrasi"
    kapasitas: number; // Dalam liter / ekor
    status: StatusKolam;
}

export interface Ikan {
    id: string;
    kolamId: string; // Relasi ke Kolam.id
    varietas: string; // Contoh: "Kohaku", "Taisho Sanke", "Showa"
    ukuranCm: number;
    jumlah: number;
    kondisi: KondisiIkan;
}