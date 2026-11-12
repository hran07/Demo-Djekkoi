import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, FONTS, KONDISI_IKAN_STYLE } from '../constants/theme';
import { Ikan } from '../types';

interface CardIkanProps {
  ikan: Ikan;
  namaKolam: string;
  onEdit?: (ikan: Ikan) => void;
  onDelete?: (id: string) => void;
  onPress?: (ikan: Ikan) => void;
}

export default function CardIkan({
  ikan,
  namaKolam,
  onEdit,
  onDelete,
  onPress,
}: CardIkanProps) {
  const badgeStyle = KONDISI_IKAN_STYLE[ikan.kondisi] || KONDISI_IKAN_STYLE.Sehat;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(ikan)}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Ikan ${ikan.varietas}, ${ikan.jumlah} ekor, kondisi ${ikan.kondisi}`}
    >
      {/* Icon Badge Kolam/Ikan */}
      <View style={[styles.iconWrap, { backgroundColor: badgeStyle.bg }]}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M2 12c3-4.5 7.5-6 11.5-4.2C15.4 8.7 16.8 10 18 12c-1.2 2-2.6 3.3-4.5 4.2C9.5 18 5 16.5 2 12z"
            stroke={badgeStyle.text}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M18 12l4-3.5v7z"
            stroke={badgeStyle.text}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      {/* Info Varietas & Kolam */}
      <View style={styles.infoWrap}>
        <Text style={styles.varietas}>{ikan.varietas}</Text>
        <Text style={styles.meta}>
          {namaKolam} · {ikan.ukuranCm} cm
        </Text>
      </View>

      {/* Jumlah Ekor & Badge Kondisi */}
      <View style={styles.rightWrap}>
        <View style={styles.countRow}>
          <Text style={styles.countNumber}>{ikan.jumlah}</Text>
          <Text style={styles.countUnit}> ekor</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
          <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
            {ikan.kondisi}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoWrap: {
    flex: 1,
    minWidth: 0,
  },
  varietas: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
  },
  meta: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  rightWrap: {
    alignItems: 'flex-end',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  countNumber: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.ink,
  },
  countUnit: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginTop: 2,
  },
  badgeText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '600',
  },
});
