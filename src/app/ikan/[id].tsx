import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import InfoRow from '../../components/InfoRow';
import {
  COLORS,
  FONTS,
  KONDISI_IKAN_STYLE,
  RADIUS,
  SPACING,
} from '../../constants/theme';
import { useData } from '../../context/DataContext';
import { useSafeBack } from '../../hooks/useSafeBack';

export default function DetailIkanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const goBack = useSafeBack();
  const { kolam, ikan, deleteIkan } = useData();

  const item = ikan.find((x) => x.id === id);
  const kolamIkan = kolam.find((x) => x.id === item?.kolamId);

  if (!item) {
    return (
      <View style={styles.empty}>
        <Ionicons name="fish-outline" size={48} color={COLORS.muted} />
        <Text style={styles.emptyText}>Data ikan tidak ditemukan.</Text>
        <Pressable style={styles.secondaryButton} onPress={goBack}>
          <Text style={styles.secondaryText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Hapus Ikan',
      `Hapus data ikan ${item.varietas}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            deleteIkan(item.id);
            goBack();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const kondisiStyle = KONDISI_IKAN_STYLE[item.kondisi] || KONDISI_IKAN_STYLE.Sehat;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: item.varietas }} />

      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.varietas}</Text>
          <View style={[styles.badge, { backgroundColor: kondisiStyle.bg }]}>
            <Text style={[styles.badgeText, { color: kondisiStyle.text }]}>
              {item.kondisi}
            </Text>
          </View>
        </View>

        <InfoRow label="Lokasi Kolam" value={kolamIkan?.nama ?? 'Belum ditentukan'} />
        <InfoRow label="Ukuran Rata-rata" value={`${item.ukuranCm} cm`} />
        <InfoRow label="Jumlah Populasi" value={`${item.jumlah} ekor`} />
      </View>

      {kolamIkan && (
        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            router.push({
              pathname: '/kolam/[id]',
              params: { id: kolamIkan.id },
            })
          }
        >
          <Ionicons name="water-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryText}>Lihat {kolamIkan.nama}</Text>
        </Pressable>
      )}

      <Pressable style={styles.dangerButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
        <Text style={styles.dangerText}>Hapus Data Ikan</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: SPACING.md,
    gap: SPACING.gap,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.ink,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
  },
  primaryText: {
    fontFamily: FONTS.sans,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.surface,
  },
  dangerText: {
    fontFamily: FONTS.sans,
    color: COLORS.danger,
    fontWeight: '600',
    fontSize: 15,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.bg,
  },
  emptyText: {
    fontFamily: FONTS.sans,
    color: COLORS.muted,
    fontSize: 14,
  },
  secondaryButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  secondaryText: {
    fontFamily: FONTS.sans,
    color: COLORS.ink,
    fontWeight: '600',
  },
});
