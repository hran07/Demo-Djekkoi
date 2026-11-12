import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import CardKolam from '../../components/CardKolam';
import ModalForm, { FormField, FormValues } from '../../components/ModalForm';
import { COLORS, FONTS } from '../../constants/theme';
import { useData } from '../../context/DataContext';
import { Kolam, StatusKolam } from '../../types';

const FORM_FIELDS: FormField[] = [
  {
    key: 'nama',
    label: 'Nama Kolam',
    type: 'text',
    placeholder: 'Contoh: Kolam A1',
  },
  {
    key: 'jenis',
    label: 'Jenis',
    type: 'text',
    placeholder: 'Contoh: Semen, Terpal, Filtrasi',
  },
  {
    key: 'kapasitas',
    label: 'Kapasitas (Liter)',
    type: 'number',
    placeholder: 'Contoh: 5000',
  },
  {
    key: 'status',
    label: 'Status Kolam',
    type: 'select',
    options: [
      { label: 'Aktif', value: 'Aktif' },
      { label: 'Perawatan', value: 'Perawatan' },
      { label: 'Kosong', value: 'Kosong' },
    ],
  },
];

export default function KolamScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { kolam, ikan, addKolam, updateKolam, deleteKolam } = useData();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingKolam, setEditingKolam] = useState<Kolam | null>(null);

  // Hitung jumlah kolam per status untuk subtitle
  const totalKolam = kolam.length;
  const aktifCount = useMemo(() => kolam.filter((k) => k.status === 'Aktif').length, [kolam]);
  const perawatanCount = useMemo(
    () => kolam.filter((k) => k.status === 'Perawatan').length,
    [kolam]
  );
  const kosongCount = useMemo(() => kolam.filter((k) => k.status === 'Kosong').length, [kolam]);

  // Hitung jumlah ikan per kolam
  const ikanCountPerKolam = useMemo(() => {
    const map = new Map<string, number>();
    ikan.forEach((i) => {
      map.set(i.kolamId, (map.get(i.kolamId) || 0) + i.jumlah);
    });
    return map;
  }, [ikan]);

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
    [editingKolam]
  );

  const handleOpenAdd = () => {
    setEditingKolam(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (item: Kolam) => {
    setEditingKolam(item);
    setModalVisible(true);
  };

  const handleOpenDetail = (item: Kolam) => {
    router.push({ pathname: '/kolam/[id]', params: { id: item.id } });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingKolam(null);
  };

  const handleSubmitModal = (values: FormValues) => {
    const input = {
      nama: values.nama.trim(),
      jenis: values.jenis.trim(),
      kapasitas: Number(values.kapasitas) || 0,
      status: values.status as StatusKolam,
    };

    if (editingKolam) {
      updateKolam(editingKolam.id, input);
    } else {
      addKolam(input);
    }
    handleCloseModal();
  };

  const handleDeleteKolam = (id: string) => {
    const target = kolam.find((item) => item.id === id);
    Alert.alert(
      'Hapus Kolam',
      `Hapus ${target?.nama ?? 'kolam ini'}? Semua ikan di dalam kolam ini juga akan terhapus.`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => deleteKolam(id) },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* ── Header ────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kolam</Text>
        <Text style={styles.headerSubtitle}>
          {totalKolam} kolam · {aktifCount} aktif · {perawatanCount} perawatan · {kosongCount} kosong
        </Text>
      </View>

      {/* ── Daftar Kolam ───────────────────────────────────────── */}
      <FlatList
        data={kolam}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CardKolam
            kolam={item}
            ikanCount={ikanCountPerKolam.get(item.id) || 0}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteKolam}
            onPress={handleOpenDetail}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Belum ada kolam.{'\n'}Tap tombol + di bawah untuk menambah.
            </Text>
          </View>
        }
      />

      {/* ── Floating Action Button (FAB) ───────────────────────── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleOpenAdd}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Tambah kolam baru"
      >
        <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 5v14M5 12h14"
            stroke="#FFFFFF"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>

      {/* ── Modal Form Tambah / Edit ──────────────────────────── */}
      <ModalForm
        visible={modalVisible}
        title={editingKolam ? 'Edit Kolam' : 'Tambah Kolam'}
        fields={FORM_FIELDS}
        initialValues={initialValues}
        onSubmit={handleSubmitModal}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: FONTS.serif,
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.ink,
    lineHeight: 36,
  },
  headerSubtitle: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 96,
    gap: 12,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.fab,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.fab,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
});
