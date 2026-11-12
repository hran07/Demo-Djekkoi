import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '../types/todo';

export const STORAGE_KEY_TODOS = 'djekkoi.todos.v1';
export const STORAGE_KEY_SYNC_META = 'djekkoi.todos.sync_meta';

/**
 * ID generator sederhana dan unik untuk item Todo
 */
export const generateTodoId = (): string =>
  `t_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

/**
 * Data awal (seeding) lokal ketika storage masih kosong
 * Berisi tugas-tugas perawatan kolam dan ikan koi yang realistis
 */
export function getDefaultSeedTodos(): Todo[] {
  const now = new Date().toISOString();
  return [
    {
      id: generateTodoId(),
      title: 'Beri pakan ikan pagi',
      completed: true,
      period: 'harian',
      lastCompletedKey: null, // akan diatur di hook jika perlu
      createdAt: now,
    },
    {
      id: generateTodoId(),
      title: 'Beri pakan ikan sore',
      completed: false,
      period: 'harian',
      lastCompletedKey: null,
      createdAt: now,
    },
    {
      id: generateTodoId(),
      title: 'Cek kondisi dan kejernihan air',
      completed: true,
      period: 'harian',
      lastCompletedKey: null,
      createdAt: now,
    },
    {
      id: generateTodoId(),
      title: 'Hitung ikan di Kolam Karantina',
      completed: true,
      period: 'harian',
      lastCompletedKey: null,
      createdAt: now,
    },
    {
      id: generateTodoId(),
      title: 'Cek pompa dan aerator',
      completed: false,
      period: 'harian',
      lastCompletedKey: null,
      createdAt: now,
    },
    {
      id: generateTodoId(),
      title: 'Ganti sebagian air kolam',
      completed: false,
      period: 'mingguan',
      lastCompletedKey: null,
      createdAt: now,
    },
    {
      id: generateTodoId(),
      title: 'Bersihkan filter kolam',
      completed: true,
      period: 'mingguan',
      lastCompletedKey: null,
      createdAt: now,
    },
    {
      id: generateTodoId(),
      title: 'Cek pH dan suhu air',
      completed: false,
      period: 'mingguan',
      lastCompletedKey: null,
      createdAt: now,
    },
  ];
}

/**
 * Membaca data Todo dari AsyncStorage secara asinkron
 */
export async function loadLocalTodos(): Promise<Todo[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_TODOS);
    if (raw === null) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('[todoStorage] Gagal membaca data lokal:', error);
    return [];
  }
}

/**
 * Menyimpan seluruh daftar Todo ke AsyncStorage
 */
export async function saveLocalTodos(todos: Todo[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
  } catch (error) {
    console.error('[todoStorage] Gagal menyimpan data lokal:', error);
    throw error;
  }
}

/**
 * Menghapus seluruh data Todo di AsyncStorage (untuk reset)
 */
export async function clearLocalTodos(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY_TODOS);
  } catch (error) {
    console.error('[todoStorage] Gagal menghapus storage:', error);
  }
}

