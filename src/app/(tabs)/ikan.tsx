import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import CardIkan from '../../components/CardIkan';
import ModalForm, { FormField, FormValues } from '../../components/ModalForm';
import { COLORS, FONTS } from '../../constants/theme';
import { useData } from '../../context/DataContext';
import { Ikan, KondisiIkan } from '../../types';

const SEMUA = 'semua';

export default function IkanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { kolam, ikan, riwayatVarietas, addIkan, updateIkan, deleteIkan } = useData();

  const [filterKolamId, setFilterKolamId] = useState<string>(SEMUA);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIkan, setEditingIkan] = useState<Ikan | null>(null);

  // Subtitle stats: e.g. "87 ekor · 7 kelompok · 81 sehat"
  const totalEkor = useMemo(() => ikan.reduce((acc, curr) => acc + curr.jumlah, 0), [ikan]);
  const kelompokCount = ikan.length;
  const sehatCount = useMemo(
    () => ikan.filter((i) => i.kondisi === 'Sehat').reduce((acc, curr) => acc + curr.jumlah, 0),
    [ikan]
  );

  const activeFilter = kolam.some((item) => item.id === filterKolamId) ? filterKolamId : SEMUA;

  const filteredIkan = useMemo(
    () => (activeFilter === SEMUA ? ikan : ikan.filter((item) => item.kolamId === activeFilter)),
    [ikan, activeFilter]
  );

  const namaKolamById = useMemo(
    () => Object.fromEntries(kolam.map((item) => [item.id, item.nama])),
    [kolam]
  );

  const formFields = useMemo<FormField[]>(
    () => [
      {
        key: 'kolamId',
        label: 'Pilih Kolam',
        type: 'select',
        options: kolam.map((item) => ({ label: item.nama, value: item.id })),
      },
      {
        key: 'varietas',
        label: 'Varietas Ikan Koi',
        type: 'text',
        placeholder: 'Contoh: Kohaku, Showa, Taisho Sanke',
        suggestions: riwayatVarietas,
      },
      {
        key: 'ukuranCm',
        label: 'Ukuran Rata-rata (cm)',
        type: 'number',
        placeholder: 'Contoh: 35',
      },
      {
        key: 'jumlah',
        label: 'Jumlah (ekor)',
        type: 'number',
        placeholder: 'Contoh: 10',
      },
      {
        key: 'kondisi',
        label: 'Kondisi Ikan',
        type: 'select',
        options: [
          { label: 'Sehat', value: 'Sehat' },
          { label: 'Karantina', value: 'Karantina' },
          { label: 'Sakit', value: 'Sakit' },
        ],
      },
    ],
    [kolam, riwayatVarietas]
  );

  const initialValues = useMemo<FormValues | undefined>(() => {
    if (editingIkan) {
      const vals: FormValues = {
        kolamId: editingIkan.kolamId,
        varietas: editingIkan.varietas,
        ukuranCm: String(editingIkan.ukuranCm),
        jumlah: String(editingIkan.jumlah),
        kondisi: editingIkan.kondisi,
      };
      return vals;
    }
    if (activeFilter === SEMUA) return undefined;
    const prefilled: FormValues = { kolamId: activeFilter };
    return prefilled;
  }, [editingIkan, activeFilter]);

  const handleOpenAdd = () => {
    if (kolam.length === 0) {
      Alert.alert('Belum ada kolam', 'Tambahkan kolam terlebih dahulu sebelum menambah ikan.');
      return;
    }
    setEditingIkan(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (item: Ikan) => {
    setEditingIkan(item);
    setModalVisible(true);
  };

  const handleOpenDetail = (item: Ikan) => {
    router.push({ pathname: '/ikan/[id]', params: { id: item.id } });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingIkan(null);
  };

  const handleSubmitModal = (values: FormValues) => {
    const input = {
      kolamId: values.kolamId,
      varietas: values.varietas.trim(),
      ukuranCm: Number(values.ukuranCm) || 0,
      jumlah: Number(values.jumlah) || 1,
      kondisi: values.kondisi as KondisiIkan,
    };

    if (editingIkan) {
      updateIkan(editingIkan.id, input);
    } else {
      addIkan(input);
    }
    handleCloseModal();
  };

  const handleDeleteIkan = (id: string) => {
    const target = ikan.find((item) => item.id === id);
    Alert.alert('Hapus Ikan', `Hapus data ${target?.varietas ?? 'ikan ini'}?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => deleteIkan(id) },
    ]);
  };

  const filterOptions = [
    { id: SEMUA, nama: 'Semua' },
    ...kolam.map((k) => ({ id: k.id, nama: k.nama })),
  ];

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* ── Header ────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ikan</Text>
        <Text style={styles.headerSubtitle}>
          {totalEkor} ekor · {kelompokCount} kelompok · {sehatCount} sehat
        </Text>
      </View>

      {/* ── Filter Chips Kolam ─────────────────────────────────── */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterOptions.map((opt) => {
            const isSelected = activeFilter === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.filterChip,
                  isSelected ? styles.filterChipActive : styles.filterChipInactive,
                ]}
                onPress={() => setFilterKolamId(opt.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected ? styles.filterTextActive : styles.filterTextInactive,
                  ]}
                >
                  {opt.nama}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Daftar Ikan ───────────────────────────────────────── */}
      <FlatList
        data={filteredIkan}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CardIkan
            ikan={item}
            namaKolam={namaKolamById[item.kolamId] || 'Kolam tidak diketahui'}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteIkan}
            onPress={handleOpenDetail}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Belum ada ikan di filter ini.{'\n'}Tap tombol + di bawah untuk menambah.
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
        accessibilityLabel="Tambah ikan baru"
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

      {/* ── Modal Form Tambah / Edit Ikan ─────────────────────── */}
      <ModalForm
        visible={modalVisible}
        title={editingIkan ? 'Edit Data Ikan' : 'Tambah Ikan'}
        fields={formFields}
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
    paddingBottom: 12,
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
  filterSection: {
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: COLORS.headerDark,
    borderWidth: 1,
    borderColor: COLORS.headerDark,
  },
  filterChipInactive: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filterTextInactive: {
    color: COLORS.ink,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 96,
    gap: 10,
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
