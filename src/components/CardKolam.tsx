import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, FONTS, STATUS_KOLAM_STYLE } from '../constants/theme';
import { Kolam } from '../types';

interface CardKolamProps {
  kolam: Kolam;
  ikanCount?: number;
  onEdit: (kolam: Kolam) => void;
  onDelete: (id: string) => void;
  onPress?: (kolam: Kolam) => void;
}

export default function CardKolam({
  kolam,
  ikanCount = 0,
  onEdit,
  onDelete,
  onPress,
}: CardKolamProps) {
  const badgeStyle = STATUS_KOLAM_STYLE[kolam.status] || STATUS_KOLAM_STYLE.Aktif;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(kolam)}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Kolam ${kolam.nama}, status ${kolam.status}`}
    >
      {/* Baris Atas: Nama Kolam, Jenis, dan Badge Status */}
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.nama}>{kolam.nama}</Text>
          <Text style={styles.jenis}>Kolam {kolam.jenis.toLowerCase()}</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
          <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
            {kolam.status}
          </Text>
        </View>
      </View>

      {/* Baris Bawah: Info Ikan, Kapasitas, & Tombol Aksi */}
      <View style={styles.bottomRow}>
        <View style={styles.statsWrap}>
          <Text style={styles.statItem}>
            <Text style={styles.statLabel}>Ikan </Text>
            <Text style={styles.statValue}>{ikanCount} ekor</Text>
          </Text>
          <Text style={styles.statItem}>
            <Text style={styles.statLabel}>Kapasitas </Text>
            <Text style={styles.statValue}>{kolam.kapasitas.toLocaleString('id-ID')} L</Text>
          </Text>
        </View>

        <View style={styles.actionsWrap}>
          {/* Tombol Edit */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={(e) => {
              e.stopPropagation?.();
              onEdit(kolam);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${kolam.nama}`}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M4 20h4L19 9l-4-4L4 16z"
                stroke={COLORS.accent}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          {/* Tombol Hapus */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={(e) => {
              e.stopPropagation?.();
              onDelete(kolam.id);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Hapus ${kolam.nama}`}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
                stroke={COLORS.danger}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingTop: 14,
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingRight: 8,
  },
  titleWrap: {
    flex: 1,
  },
  nama: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },
  jenis: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  statsWrap: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  statItem: {
    fontFamily: FONTS.sans,
    fontSize: 13,
  },
  statLabel: {
    color: COLORS.muted,
  },
  statValue: {
    fontWeight: '600',
    color: COLORS.ink,
  },
  actionsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
