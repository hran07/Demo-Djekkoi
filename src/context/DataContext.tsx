import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import { MOCK_IKAN, MOCK_KOLAM } from "../data/mockData";
import { Ikan, Kolam } from "../types";

type KolamInput = Omit<Kolam, "id">;
type IkanInput = Omit<Ikan, "id">;

interface DataContextValue {
  kolam: Kolam[];
  ikan: Ikan[];
  /** Daftar varietas yang pernah diinput (dipakai untuk suggestion di form) */
  riwayatVarietas: string[];
  addKolam: (input: KolamInput) => void;
  updateKolam: (id: string, input: KolamInput) => void;
  deleteKolam: (id: string) => void;
  addIkan: (input: IkanInput) => void;
  updateIkan: (id: string, input: IkanInput) => void;
  deleteIkan: (id: string) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

const generateId = (prefix: string) =>
  `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;

const samaVarietas = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase();

// Ambil varietas unik (tidak peduli huruf besar/kecil) dari daftar ikan
function ambilVarietasUnik(daftar: Ikan[]): string[] {
  const hasil: string[] = [];
  for (const item of daftar) {
    if (!hasil.some((v) => samaVarietas(v, item.varietas))) {
      hasil.push(item.varietas);
    }
  }
  return hasil;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [kolam, setKolam] = useState<Kolam[]>(MOCK_KOLAM);
  const [ikan, setIkan] = useState<Ikan[]>(MOCK_IKAN);
  const [riwayatVarietas, setRiwayatVarietas] = useState<string[]>(() =>
    ambilVarietasUnik(MOCK_IKAN),
  );

  // Catat varietas ke riwayat. Jika sudah pernah ada (beda huruf besar/kecil),
  // pakai penulisan yang sudah tersimpan supaya data tetap konsisten.
  const catatVarietas = (nama: string): string => {
    const sudahAda = riwayatVarietas.find((v) => samaVarietas(v, nama));
    if (sudahAda) return sudahAda;
    setRiwayatVarietas((prev) => [...prev, nama]);
    return nama;
  };

  const value = useMemo<DataContextValue>(
    () => ({
      kolam,
      ikan,
      riwayatVarietas,
      addKolam: (input) =>
        setKolam((prev) => [...prev, { id: generateId("k"), ...input }]),
      updateKolam: (id, input) =>
        setKolam((prev) =>
          prev.map((item) => (item.id === id ? { id, ...input } : item)),
        ),
      // Menghapus kolam ikut menghapus ikan di dalamnya agar tidak ada data yatim
      deleteKolam: (id) => {
        setKolam((prev) => prev.filter((item) => item.id !== id));
        setIkan((prev) => prev.filter((item) => item.kolamId !== id));
      },
      addIkan: (input) => {
        const varietas = catatVarietas(input.varietas);
        setIkan((prev) => [
          ...prev,
          { id: generateId("i"), ...input, varietas },
        ]);
      },
      updateIkan: (id, input) => {
        const varietas = catatVarietas(input.varietas);
        setIkan((prev) =>
          prev.map((item) =>
            item.id === id ? { id, ...input, varietas } : item,
          ),
        );
      },
      deleteIkan: (id) =>
        setIkan((prev) => prev.filter((item) => item.id !== id)),
    }),
    [kolam, ikan, riwayatVarietas],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData harus dipakai di dalam DataProvider");
  }
  return context;
}