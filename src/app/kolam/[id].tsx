import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import InfoRow from '../../components/InfoRow';
import {
  COLORS,
  FONTS,
  KONDISI_IKAN_STYLE,
  RADIUS,
  SPACING,
  STATUS_KOLAM_STYLE,
} from '../../constants/theme';
import { useData } from '../../context/DataContext';
import { useSafeBack } from '../../hooks/useSafeBack';

export default function DetailKolamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const goBack = useSafeBack();
  const { kolam, ikan } = useData();

  const item = kolam.find((x) => x.id === id);

  const ikanDiKolam = useMemo(
    () => ikan.filter((x) => x.kolamId === id),
    [ikan, id]
  );

  const totalEkor = useMemo(
    () => ikanDiKolam.reduce((total, x) => total + x.jumlah, 0),
    [ikanDiKolam]
  );

  if (!item) {
    return (
      <View style={styles.empty}>
        <Ionicons name="water-outline" size={48} color={COLORS.muted} />
        <Text style={styles.emptyText}>Data kolam tidak ditemukan.</Text>
        <Pressable style={styles.secondaryButton} onPress={goBack}>
          <Text style={styles.secondaryText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const badgeStyle = STATUS_KOLAM_STYLE[item.status] || STATUS_KOLAM_STYLE.Aktif;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: item.nama }} />

      {/* Card Info Utama Kolam */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.nama}</Text>
          <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
            <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <InfoRow label="Jenis Kolam" value={item.jenis} />
        <InfoRow
          label="Kapasitas Air"
          value={`${item.kapasitas.toLocaleString('id-ID')} Liter`}
        />
        <InfoRow label="Total Populasi Ikan" value={`${totalEkor} ekor`} />
      </View>

      {/* Sub-daftar Ikan di Kolam Ini */}
      <Text style={styles.sectionTitle}>Ikan di kolam ini</Text>

      {ikanDiKolam.length === 0 ? (
        <View style={styles.cardEmptyIkan}>
          <Text style={styles.emptyText}>Belum ada ikan di dalam kolam ini.</Text>
        </View>
      ) : (
        ikanDiKolam.map((x) => {
          const kondisiStyle = KONDISI_IKAN_STYLE[x.kondisi] || KONDISI_IKAN_STYLE.Sehat;
          return (
            <Pressable
              key={x.id}
              style={styles.ikanRow}
              onPress={() =>
                router.push({ pathname: '/ikan/[id]', params: { id: x.id } })
              }
            >
              <View style={styles.ikanInfo}>
                <Text style={styles.ikanName}>{x.varietas}</Text>
                <Text style={styles.ikanMeta}>
                  {x.ukuranCm} cm · {x.jumlah} ekor
                </Text>
              </View>
              <View style={[styles.kondisiBadge, { backgroundColor: kondisiStyle.bg }]}>
                <Text style={[styles.kondisiBadgeText, { color: kondisiStyle.text }]}>
                  {x.kondisi}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.muted}
              />
            </Pressable>
          );
        })
      )}
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
    marginTop: SPACING.sm,
  },
  cardEmptyIkan: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  ikanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gap,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ikanInfo: {
    flex: 1,
    gap: 2,
  },
  ikanName: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.ink,
  },
  ikanMeta: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
  },
  kondisiBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  kondisiBadgeText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '600',
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
