import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import { MOCK_IKAN, MOCK_KOLAM } from "../data/mockData";
import { Ikan, Kolam } from "../types";

type KolamInput = Omit<Kolam, "id">;
type IkanInput = Omit<Ikan, "id">;

interface DataContextValue {
    kolam: Kolam[];
    ikan: Ikan[];
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

export function DataProvider({ children }: { children: ReactNode }) {
    const [kolam, setKolam] = useState<Kolam[]>(MOCK_KOLAM);
    const [ikan, setIkan] = useState<Ikan[]>(MOCK_IKAN);

    const value = useMemo<DataContextValue>(
        () => ({
            kolam,
            ikan,
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
            addIkan: (input) =>
                setIkan((prev) => [...prev, { id: generateId("i"), ...input }]),
            updateIkan: (id, input) =>
                setIkan((prev) =>
                    prev.map((item) => (item.id === id ? { id, ...input } : item)),
                ),
            deleteIkan: (id) =>
                setIkan((prev) => prev.filter((item) => item.id !== id)),
        }),
        [kolam, ikan],
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