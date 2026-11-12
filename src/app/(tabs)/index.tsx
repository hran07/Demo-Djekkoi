import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { HeaderFishArt } from '../../components/common/HeaderFishArt';
import { COLORS, FONTS, STATUS_KOLAM_STYLE } from '../../constants/theme';
import { useData } from '../../context/DataContext';
import { useTodos } from '../../hooks/useTodos';
import { Ikan, KondisiIkan } from '../../types';

function hitungJumlahIkan(daftar: Ikan[], kondisi?: KondisiIkan): number {
  let total = 0;
  for (const item of daftar) {
    if (kondisi === undefined || item.kondisi === kondisi) {
      total += item.jumlah;
    }
  }
  return total;
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { kolam, ikan } = useData();
  const { todos, currentDate } = useTodos();

  const totalIkan = useMemo(() => hitungJumlahIkan(ikan), [ikan]);
  const sehatCount = useMemo(() => hitungJumlahIkan(ikan, 'Sehat'), [ikan]);
  const karantinaCount = useMemo(() => hitungJumlahIkan(ikan, 'Karantina'), [ikan]);
  const sakitCount = useMemo(() => hitungJumlahIkan(ikan, 'Sakit'), [ikan]);

  // Statistik Tugas Hari Ini untuk Card Tugas di Beranda
  const harianTodos = useMemo(() => todos.filter((t) => t.period === 'harian'), [todos]);
  const harianTotal = harianTodos.length;
  const harianDone = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;
    return harianTodos.filter((t) => t.lastCompletedKey === key).length;
  }, [harianTodos, currentDate]);

  const harianProgress = harianTotal > 0 ? (harianDone / harianTotal) * 100 : 0;

  // Peta jumlah ikan per kolam
  const ikanCountPerKolam = useMemo(() => {
    const map = new Map<string, number>();
    ikan.forEach((i) => {
      map.set(i.kolamId, (map.get(i.kolamId) || 0) + i.jumlah);
    });
    return map;
  }, [ikan]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* ── 1. DARK TEAL HEADER CARD ─────────────────────────── */}
      <View style={[styles.heroCard, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
        <HeaderFishArt />

        {/* Logo & App Info */}
        <View style={styles.appHeader}>
          <View style={styles.appIcon}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M2 12c3-4.5 7.5-6 11.5-4.2C15.4 8.7 16.8 10 18 12c-1.2 2-2.6 3.3-4.5 4.2C9.5 18 5 16.5 2 12z"
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M18 12l4-3.5v7z"
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <View>
            <Text style={styles.appTitle}>Djekkoi Farm</Text>
            <Text style={styles.appSubtitle}>Catatan kolam dan ikan koi</Text>
          </View>
        </View>

        {/* Total Ikan Koi Counter */}
        <View style={styles.heroStats}>
          <Text style={styles.heroStatLabel}>Total ikan koi</Text>
          <View style={styles.heroStatValueRow}>
            <Text style={styles.heroStatNumber}>{totalIkan}</Text>
            <Text style={styles.heroStatUnit}>ekor</Text>
          </View>
          <Text style={styles.heroStatSub}>tersebar di {kolam.length} kolam</Text>
        </View>
      </View>

      {/* ── 2. BODY CONTENT (FLOATING CARDS) ─────────────────── */}
      <View style={styles.bodyWrapper}>
        {/* Kondisi Ikan Card */}
        <View style={styles.kondisiCard}>
          <View style={styles.kondisiHeader}>
            <Text style={styles.kondisiTitle}>Kondisi ikan</Text>
            <Text style={styles.kondisiTotal}>{totalIkan} ekor</Text>
          </View>

          {/* Segmented Progress Bar */}
          <View style={styles.segmentedBar}>
            <View
              style={[
                styles.segmentBarSehat,
                { flex: totalIkan > 0 ? sehatCount || 0.1 : 1 },
              ]}
            />
            <View
              style={[
                styles.segmentBarKarantina,
                { flex: totalIkan > 0 ? karantinaCount || 0.05 : 0 },
              ]}
            />
            <View
              style={[
                styles.segmentBarSakit,
                { flex: totalIkan > 0 ? sakitCount || 0.05 : 0 },
              ]}
            />
          </View>

          {/* 3 Kolom Kondisi */}
          <View style={styles.kondisiColumns}>
            <View style={styles.kondisiCol}>
              <View style={styles.kondisiTag}>
                <View style={[styles.statusDot, { backgroundColor: '#2E9E6B' }]} />
                <Text style={styles.kondisiTagText}>Sehat</Text>
              </View>
              <Text style={styles.kondisiNumber}>{sehatCount}</Text>
            </View>

            <View style={styles.kondisiCol}>
              <View style={styles.kondisiTag}>
                <View style={[styles.statusDot, { backgroundColor: '#E0A21B' }]} />
                <Text style={styles.kondisiTagText}>Karantina</Text>
              </View>
              <Text style={styles.kondisiNumber}>{karantinaCount}</Text>
            </View>

            <View style={styles.kondisiCol}>
              <View style={styles.kondisiTag}>
                <View style={[styles.statusDot, { backgroundColor: '#D64533' }]} />
                <Text style={styles.kondisiTagText}>Sakit</Text>
              </View>
              <Text style={styles.kondisiNumber}>{sakitCount}</Text>
            </View>
          </View>
        </View>

        {/* Tugas Hari Ini Card */}
        <TouchableOpacity
          style={styles.tugasCard}
          onPress={() => router.push('/(tabs)/todo' as any)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Tugas hari ini, ${harianDone} dari ${harianTotal} selesai`}
        >
          <View style={styles.tugasIconWrap}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 6h11M9 12h11M9 18h11M3.5 6l1.2 1.2L7 4.8M3.5 12l1.2 1.2L7 10.8M3.5 18l1.2 1.2L7 16.8"
                stroke={COLORS.accent}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          <View style={styles.tugasInfo}>
            <View style={styles.tugasTitleRow}>
              <Text style={styles.tugasTitle}>Tugas hari ini</Text>
              <Text style={styles.tugasMeta}>
                {harianDone} dari {harianTotal} selesai
              </Text>
            </View>
            <View style={styles.tugasProgressTrack}>
              <View
                style={[
                  styles.tugasProgressFill,
                  { width: `${Math.min(100, Math.max(0, harianProgress))}%` },
                ]}
              />
            </View>
          </View>

          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 6l6 6-6 6"
              stroke={COLORS.muted}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        {/* Section Kolam List Preview */}
        <View style={styles.kolamSection}>
          <View style={styles.kolamSectionHeader}>
            <Text style={styles.kolamSectionTitle}>Kolam</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/kolam')}
              style={styles.lihatSemuaBtn}
              accessibilityRole="link"
              accessibilityLabel="Lihat semua kolam"
            >
              <Text style={styles.lihatSemuaText}>Lihat semua</Text>
            </TouchableOpacity>
          </View>

          {/* Card Daftar Kolam */}
          <View style={styles.kolamListCard}>
            {kolam.slice(0, 4).map((item, index) => {
              const badgeStyle = STATUS_KOLAM_STYLE[item.status] || STATUS_KOLAM_STYLE.Aktif;
              const isLast = index === Math.min(kolam.length, 4) - 1;
              const ekorCount = ikanCountPerKolam.get(item.id) || 0;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.kolamItem, !isLast && styles.kolamItemBorder]}
                  onPress={() =>
                    router.push({
                      pathname: '/kolam/[id]',
                      params: { id: item.id },
                    })
                  }
                  activeOpacity={0.7}
                >
                  <View style={styles.kolamItemLeft}>
                    <Text style={styles.kolamItemName}>{item.nama}</Text>
                    <Text style={styles.kolamItemMeta}>
                      {item.jenis} · {item.kapasitas.toLocaleString('id-ID')} L
                    </Text>
                  </View>

                  <View style={styles.kolamItemRight}>
                    <View style={[styles.kolamBadge, { backgroundColor: badgeStyle.bg }]}>
                      <Text style={[styles.kolamBadgeText, { color: badgeStyle.text }]}>
                        {item.status}
                      </Text>
                    </View>
                    <Text style={styles.kolamEkorCount}>{ekorCount} ekor</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroCard: {
    position: 'relative',
    backgroundColor: COLORS.headerDark,
    paddingHorizontal: 24,
    paddingBottom: 64,
    overflow: 'hidden',
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.koiOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  appSubtitle: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: '#B9D3D8',
  },
  heroStats: {
    marginTop: 28,
  },
  heroStatLabel: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: '500',
    color: '#B9D3D8',
  },
  heroStatValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  heroStatNumber: {
    fontFamily: FONTS.serif,
    fontSize: 64,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 70,
  },
  heroStatUnit: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    fontWeight: '500',
    color: '#DCEBEE',
  },
  heroStatSub: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: '#B9D3D8',
    marginTop: 2,
  },
  bodyWrapper: {
    marginTop: -38,
    paddingHorizontal: 16,
    gap: 16,
  },
  kondisiCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  kondisiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kondisiTitle: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
  },
  kondisiTotal: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
  },
  segmentedBar: {
    flexDirection: 'row',
    height: 10,
    marginTop: 12,
    borderRadius: 5,
    overflow: 'hidden',
    gap: 2,
  },
  segmentBarSehat: {
    backgroundColor: '#2E9E6B',
  },
  segmentBarKarantina: {
    backgroundColor: '#E0A21B',
  },
  segmentBarSakit: {
    backgroundColor: '#D64533',
  },
  kondisiColumns: {
    flexDirection: 'row',
    marginTop: 14,
  },
  kondisiCol: {
    flex: 1,
  },
  kondisiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  kondisiTagText: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
  },
  kondisiNumber: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.ink,
    marginTop: 2,
  },
  tugasCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  tugasIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tugasInfo: {
    flex: 1,
    minWidth: 0,
  },
  tugasTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  tugasTitle: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
  },
  tugasMeta: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
  },
  tugasProgressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.borderLight,
    marginTop: 8,
    overflow: 'hidden',
  },
  tugasProgressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  kolamSection: {
    marginTop: 2,
  },
  kolamSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kolamSectionTitle: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },
  lihatSemuaBtn: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  lihatSemuaText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accent,
  },
  kolamListCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    overflow: 'hidden',
  },
  kolamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  kolamItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  kolamItemLeft: {
    flex: 1,
    minWidth: 0,
  },
  kolamItemName: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink,
  },
  kolamItemMeta: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  kolamItemRight: {
    alignItems: 'flex-end',
  },
  kolamBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  kolamBadgeText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '600',
  },
  kolamEkorCount: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
});
