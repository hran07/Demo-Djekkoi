import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { TodoPeriod } from '../../types/todo';
import { getPeriodTitle, getResetNote } from '../../utils/todoPeriod';

interface TodoProgressProps {
  period: TodoPeriod;
  completedCount: number;
  totalCount: number;
  progressPercent: number;
}

export function TodoProgress({
  period,
  completedCount,
  totalCount,
  progressPercent,
}: TodoProgressProps) {
  const isAllDone = totalCount > 0 && completedCount === totalCount;
  const barColor = isAllDone ? COLORS.okCheck : COLORS.accent;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.title}>{getPeriodTitle(period)}</Text>
          <Text style={styles.subtitle}>{getResetNote(period)}</Text>
        </View>

        <View style={styles.counterWrap}>
          <Text style={styles.doneNumber}>{completedCount}</Text>
          <Text style={styles.totalNumber}> / {totalCount}</Text>
        </View>
      </View>

      {/* Progress Track & Fill */}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.min(100, Math.max(0, progressPercent))}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
  },
  subtitle: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  counterWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  doneNumber: {
    fontFamily: FONTS.serif,
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.ink,
    lineHeight: 34,
  },
  totalNumber: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: '600',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.borderLight,
    marginTop: 12,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});

