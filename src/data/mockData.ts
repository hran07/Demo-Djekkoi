import { Ikan, Kolam } from "../types";

export const MOCK_KOLAM: Kolam[] = [
    {
        id: "k1",
        nama: "Kolam A1",
        jenis: "Semen",
        kapasitas: 5000,
        status: "Aktif",
    },
    {
        id: "k2",
        nama: "Kolam A2",
        jenis: "Filtrasi",
        kapasitas: 8000,
        status: "Aktif",
    },
    {
        id: "k3",
        nama: "Kolam Karantina",
        jenis: "Terpal",
        kapasitas: 2000,
        status: "Perawatan",
    },
    {
        id: "k4",
        nama: "Kolam B1",
        jenis: "Semen",
        kapasitas: 6000,
        status: "Kosong",
    },
];

export const MOCK_IKAN: Ikan[] = [
    {
        id: "i1",
        kolamId: "k1",
        varietas: "Kohaku",
        ukuranCm: 35,
        jumlah: 12,
        kondisi: "Sehat",
    },
    {
        id: "i2",
        kolamId: "k1",
        varietas: "Taisho Sanke",
        ukuranCm: 40,
        jumlah: 8,
        kondisi: "Sehat",
    },
    {
        id: "i3",
        kolamId: "k2",
        varietas: "Showa",
        ukuranCm: 45,
        jumlah: 6,
        kondisi: "Sehat",
    },
    {
        id: "i4",
        kolamId: "k2",
        varietas: "Shiro Utsuri",
        ukuranCm: 30,
        jumlah: 10,
        kondisi: "Sehat",
    },
    {
        id: "i5",
        kolamId: "k3",
        varietas: "Kohaku",
        ukuranCm: 25,
        jumlah: 4,
        kondisi: "Karantina",
    },
    {
        id: "i6",
        kolamId: "k3",
        varietas: "Showa",
        ukuranCm: 28,
        jumlah: 2,
        kondisi: "Sakit",
    },
];