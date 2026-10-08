import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import CardIkan from "../../components/CardIkan";
import ModalForm, { FormField, FormValues } from "../../components/ModalForm";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import { useData } from "../../context/DataContext";
import { Ikan, KondisiIkan } from "../../types";

const SEMUA = "semua";

export default function IkanScreen() {
  const { kolam, ikan, addIkan, updateIkan, deleteIkan } = useData();
  const [filterKolamId, setFilterKolamId] = useState<string>(SEMUA);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIkan, setEditingIkan] = useState<Ikan | null>(null);

  // Jika kolam yang difilter sudah dihapus, otomatis kembali ke "Semua"
  const activeFilter = kolam.some((item) => item.id === filterKolamId)
    ? filterKolamId
    : SEMUA;

  const filteredIkan = useMemo(
    () =>
      activeFilter === SEMUA
        ? ikan
        : ikan.filter((item) => item.kolamId === activeFilter),
    [ikan, activeFilter],
  );

  const namaKolamById = useMemo(
    () => Object.fromEntries(kolam.map((item) => [item.id, item.nama])),
    [kolam],
  );

  const formFields = useMemo<FormField[]>(
    () => [
      {
        key: "kolamId",
        label: "Kolam",
        type: "select",
        options: kolam.map((item) => ({ label: item.nama, value: item.id })),
      },
      {
        key: "varietas",
        label: "Varietas",
        type: "text",
        placeholder: "Contoh: Kohaku, Showa",
      },
      {
        key: "ukuranCm",
        label: "Ukuran (cm)",
        type: "number",
        placeholder: "Contoh: 35",
      },
      {
        key: "jumlah",
        label: "Jumlah (ekor)",
        type: "number",
        placeholder: "Contoh: 10",
      },
      {
        key: "kondisi",
        label: "Kondisi",
        type: "select",
        options: [
          { label: "Sehat", value: "Sehat" },
          { label: "Karantina", value: "Karantina" },
          { label: "Sakit", value: "Sakit" },
        ],
      },
    ],
    [kolam],
  );

  const initialValues = useMemo<FormValues | undefined>(() => {
    if (editingIkan) {
      return {
        kolamId: editingIkan.kolamId,
        varietas: editingIkan.varietas,
        ukuranCm: String(editingIkan.ukuranCm),
        jumlah: String(editingIkan.jumlah),
        kondisi: editingIkan.kondisi,
      };
    }
    // Mode tambah: pra-pilih kolam sesuai filter yang sedang aktif
    if (activeFilter === SEMUA) return undefined;
    const prefilled: FormValues = { kolamId: activeFilter };
    return prefilled;
  }, [editingIkan, activeFilter]);

  const handleOpenAdd = () => {
    if (kolam.length === 0) {
      Alert.alert(
        "Belum ada kolam",
        "Tambahkan kolam terlebih dahulu sebelum menambah ikan.",
      );
      return;
    }
    setEditingIkan(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (item: Ikan) => {
    setEditingIkan(item);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setEditingIkan(null);
  };

  const handleSubmit = (values: FormValues) => {
    const input = {
      kolamId: values.kolamId,
      varietas: values.varietas.trim(),
      ukuranCm: Number(values.ukuranCm),
      jumlah: Number(values.jumlah),
      kondisi: values.kondisi as KondisiIkan,
    };

    if (editingIkan) {
      updateIkan(editingIkan.id, input);
    } else {
      addIkan(input);
    }
    handleClose();
  };

  const handleDeleteIkan = (id: string) => {
    const target = ikan.find((item) => item.id === id);
    Alert.alert("Hapus Ikan", `Hapus data ${target?.varietas ?? "ikan ini"}?`, [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => deleteIkan(id) },
    ]);
  };

  const filterOptions = [
    { id: SEMUA, nama: "Semua" },
    ...kolam.map((k) => ({ id: k.id, nama: k.nama })),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filterOptions.map((option) => {
            const selected = activeFilter === option.id;
            return (
              <Pressable
                key={option.id}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => setFilterKolamId(option.id)}
              >
                <Text
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {option.nama}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredIkan}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CardIkan
            ikan={item}
            namaKolam={namaKolamById[item.kolamId] ?? "-"}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteIkan}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="fish-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>
              {activeFilter === SEMUA
                ? "Belum ada ikan. Tap tombol + untuk menambah."
                : "Belum ada ikan di kolam ini."}
            </Text>
          </View>
        }
      />

      <Pressable style={styles.fab} onPress={handleOpenAdd}>
        <Ionicons name="add" size={28} color={COLORS.surface} />
      </Pressable>

      <ModalForm
        visible={modalVisible}
        title={editingIkan ? "Edit Ikan" : "Tambah Ikan"}
        fields={formFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterWrapper: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterRow: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  chipTextSelected: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  list: {
    padding: SPACING.md,
    gap: SPACING.gap,
    paddingBottom: 96,
  },
  empty: {
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.lg * 2,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    elevation: 4,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});