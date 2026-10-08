import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import CardKolam from "../../components/CardKolam";
import ModalForm, { FormField, FormValues } from "../../components/ModalForm";
import { COLORS, SPACING } from "../../constants/theme";
import { useData } from "../../context/DataContext";
import { Kolam, StatusKolam } from "../../types";

const FORM_FIELDS: FormField[] = [
  {
    key: "nama",
    label: "Nama Kolam",
    type: "text",
    placeholder: "Contoh: Kolam A1",
  },
  {
    key: "jenis",
    label: "Jenis",
    type: "text",
    placeholder: "Contoh: Semen, Terpal, Filtrasi",
  },
  {
    key: "kapasitas",
    label: "Kapasitas (liter / ekor)",
    type: "number",
    placeholder: "Contoh: 5000",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Aktif", value: "Aktif" },
      { label: "Perawatan", value: "Perawatan" },
      { label: "Kosong", value: "Kosong" },
    ],
  },
];

export default function KolamScreen() {
  const { kolam, addKolam, updateKolam, deleteKolam } = useData();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKolam, setEditingKolam] = useState<Kolam | null>(null);

  const initialValues = useMemo<FormValues | undefined>(
    () =>
      editingKolam
        ? {
            nama: editingKolam.nama,
            jenis: editingKolam.jenis,
            kapasitas: String(editingKolam.kapasitas),
            status: editingKolam.status,
          }
        : undefined,
    [editingKolam],
  );

  const handleOpenAdd = () => {
    setEditingKolam(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (item: Kolam) => {
    setEditingKolam(item);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setEditingKolam(null);
  };

  const handleSubmit = (values: FormValues) => {
    const input = {
      nama: values.nama.trim(),
      jenis: values.jenis.trim(),
      kapasitas: Number(values.kapasitas),
      status: values.status as StatusKolam,
    };

    if (editingKolam) {
      updateKolam(editingKolam.id, input);
    } else {
      addKolam(input);
    }
    handleClose();
  };

  const handleDeleteKolam = (id: string) => {
    const target = kolam.find((item) => item.id === id);
    Alert.alert(
      "Hapus Kolam",
      `Hapus ${target?.nama ?? "kolam ini"}? Semua ikan di dalam kolam ini juga akan terhapus.`,
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: () => deleteKolam(id) },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={kolam}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CardKolam
            kolam={item}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteKolam}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="water-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>
              Belum ada kolam. Tap tombol + untuk menambah.
            </Text>
          </View>
        }
      />

      <Pressable style={styles.fab} onPress={handleOpenAdd}>
        <Ionicons name="add" size={28} color={COLORS.surface} />
      </Pressable>

      <ModalForm
        visible={modalVisible}
        title={editingKolam ? "Edit Kolam" : "Tambah Kolam"}
        fields={FORM_FIELDS}
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
