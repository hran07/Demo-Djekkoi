import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { TodoCard } from '../../components/todo/TodoCard';
import { TodoModal } from '../../components/todo/TodoModal';
import { TodoProgress } from '../../components/todo/TodoProgress';
import { COLORS, FONTS } from '../../constants/theme';
import { useTodos } from '../../hooks/useTodos';
import { Todo, TodoPeriod } from '../../types/todo';

export default function TodoScreen() {
  const insets = useSafeAreaInsets();
  const {
    currentTodos,
    syncStatus,
    period,
    setPeriod,
    currentDate,
    harianCount,
    mingguanCount,
    completedCount,
    totalCount,
    progressPercent,
    reload,
    add,
    edit,
    toggle,
    remove,
    testConnection,
  } = useTodos();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await reload(true);
    setIsRefreshing(false);
  }, [reload]);

  const handleOpenAdd = () => {
    setEditingTodo(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setModalVisible(true);
  };

  const handleDelete = (todo: Todo) => {
    Alert.alert(
      'Hapus Tugas',
      `Kamu yakin ingin menghapus "${todo.title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => remove(todo.id),
        },
      ],
      { cancelable: true }
    );
  };

  const handleSubmitModal = async (title: string, selectedPeriod: TodoPeriod) => {
    if (editingTodo) {
      await edit(editingTodo.id, title, selectedPeriod);
    } else {
      await add(title, selectedPeriod);
    }
  };

  // Tampilan Status Sinkronisasi Pill
  const renderSyncBadge = () => {
    let bg: string = COLORS.okBg;
    let textColor: string = COLORS.ok;
    let dotColor: string = COLORS.okCheck;
    let label = 'Tersinkron';

    if (syncStatus === 'syncing') {
      bg = COLORS.accentSoft;
      textColor = COLORS.accent;
      dotColor = COLORS.accent;
      label = 'Menyinkronkan...';
    } else if (syncStatus === 'local' || syncStatus === 'error') {
      bg = COLORS.warnBg;
      textColor = COLORS.warn;
      dotColor = COLORS.warnBar;
      label = 'Mode lokal';
    }

    return (
      <TouchableOpacity
        style={[styles.syncBadge, { backgroundColor: bg }]}
        onPress={testConnection}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Status koneksi: ${label}. Tap untuk cek koneksi.`}
      >
        <View style={[styles.syncDot, { backgroundColor: dotColor }]} />
        <Text style={[styles.syncText, { color: textColor }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* ── Header ────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Tugas</Text>
          <Text style={styles.headerSubtitle}>Perawatan kolam dan ikan</Text>
        </View>
        {renderSyncBadge()}
      </View>

      {/* ── Segmented Control Filter (Harian / Mingguan) ───────── */}
      <View style={styles.segmentContainer}>
        <View style={styles.segmentWrapper}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              period === 'harian' && styles.segmentBtnActive,
            ]}
            onPress={() => setPeriod('harian')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                period === 'harian' ? styles.segmentTextActive : styles.segmentTextInactive,
              ]}
            >
              Harian ({harianCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              period === 'mingguan' && styles.segmentBtnActive,
            ]}
            onPress={() => setPeriod('mingguan')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                period === 'mingguan' ? styles.segmentTextActive : styles.segmentTextInactive,
              ]}
            >
              Mingguan ({mingguanCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Ringkasan Progress ─────────────────────────────────── */}
      <View style={styles.progressSection}>
        <TodoProgress
          period={period}
          completedCount={completedCount}
          totalCount={totalCount}
          progressPercent={progressPercent}
        />
      </View>

      {/* ── Daftar Tugas ───────────────────────────────────────── */}
      <FlatList
        data={currentTodos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
        renderItem={({ item }) => (
          <TodoCard
            todo={item}
            currentDate={currentDate}
            onToggle={toggle}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Belum ada tugas di kategori ini.{'\n'}Tambahkan lewat tombol + di bawah.
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
        accessibilityLabel="Tambah tugas baru"
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

      {/* ── Modal Tambah / Edit Tugas ─────────────────────────── */}
      <TodoModal
        visible={modalVisible}
        initialTodo={editingTodo}
        defaultPeriod={period}
        onClose={() => {
          setModalVisible(false);
          setEditingTodo(null);
        }}
        onSubmit={handleSubmitModal}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
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
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginTop: 6,
  },
  syncDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  syncText: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    fontWeight: '600',
  },
  segmentContainer: {
    paddingHorizontal: 16,
  },
  segmentWrapper: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    backgroundColor: COLORS.borderLight,
    borderRadius: 14,
  },
  segmentBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
  },
  segmentTextActive: {
    color: COLORS.ink,
    fontWeight: '700',
  },
  segmentTextInactive: {
    color: COLORS.muted,
    fontWeight: '600',
  },
  progressSection: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 96,
    gap: 8,
  },
  emptyContainer: {
    marginTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 22,
    textAlign: 'center',
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
