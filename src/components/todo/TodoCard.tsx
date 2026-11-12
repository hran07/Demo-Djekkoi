import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, FONTS } from '../../constants/theme';
import { Todo } from '../../types/todo';
import { isTodoDone } from '../../utils/todoPeriod';

interface TodoCardProps {
  todo: Todo;
  currentDate: Date;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export function TodoCard({ todo, currentDate, onToggle, onEdit, onDelete }: TodoCardProps) {
  const isDone = isTodoDone(todo, currentDate);

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: isDone ? COLORS.okBorder : COLORS.border,
        },
      ]}
    >
      {/* Tombol Checkbox & Konten Judul */}
      <TouchableOpacity
        style={styles.mainTouch}
        onPress={() => onToggle(todo.id)}
        onLongPress={() => onEdit(todo)}
        activeOpacity={0.7}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isDone }}
        accessibilityLabel={`${todo.title}, ${isDone ? 'Selesai' : 'Belum selesai'}`}
      >
        {/* Checkbox Icon */}
        <View
          style={[
            styles.checkbox,
            isDone
              ? { backgroundColor: COLORS.okCheck, borderColor: COLORS.okCheck }
              : { backgroundColor: COLORS.surface, borderColor: '#8FA5AA', borderWidth: 2 },
          ]}
        >
          {isDone && (
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="#FFFFFF"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </View>

        {/* Teks Judul & Status */}
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              {
                color: isDone ? COLORS.muted : COLORS.ink,
                textDecorationLine: isDone ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={2}
          >
            {todo.title}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDone ? COLORS.ok : COLORS.muted },
            ]}
          >
            {isDone ? 'Selesai untuk periode ini' : 'Belum selesai'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Tombol Edit */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => onEdit(todo)}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${todo.title}`}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 20h4L19 9l-4-4L4 16z"
            stroke={COLORS.accent}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>

      {/* Tombol Hapus */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => onDelete(todo)}
        accessibilityRole="button"
        accessibilityLabel={`Hapus ${todo.title}`}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
            stroke={COLORS.muted}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    minHeight: 64,
  },
  mainTouch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.sans,
    fontSize: 14.5,
    fontWeight: '600',
    lineHeight: 20,
  },
  subtitle: {
    fontFamily: FONTS.sans,
    fontSize: 11.5,
    marginTop: 2,
    fontWeight: '500',
  },
  actionBtn: {
    width: 36,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

