/**
 * Type dan Interface untuk Modul 3: Fitur Todo List Djekkoi Farm
 * Mendefinisikan struktur data Todo lokal dan data dari External REST API (DummyJSON).
 */

export type TodoPeriod = 'harian' | 'mingguan';

export type SyncStatus = 'synced' | 'local' | 'syncing' | 'error';

/**
 * Interface Todo aplikasi (Objek lokal type-safe)
 */
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  period: TodoPeriod;
  lastCompletedKey: string | null;
  createdAt: string;
  remoteId?: number;
}

/**
 * Interface data item individual dari External REST API (DummyJSON /todos)
 */
export interface DummyJsonTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

/**
 * Interface response list dari External REST API (GET https://dummyjson.com/todos)
 */
export interface DummyJsonTodosResponse {
  todos: DummyJsonTodo[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Payload untuk menambah todo ke API (POST https://dummyjson.com/todos/add)
 */
export interface CreateTodoApiPayload {
  todo: string;
  completed: boolean;
  userId: number;
}

/**
 * Payload untuk memperbarui todo di API (PUT / PATCH https://dummyjson.com/todos/{id})
 */
export interface UpdateTodoApiPayload {
  todo?: string;
  completed?: boolean;
}

/**
 * Metadata informasi sinkronisasi
 */
export interface SyncMetadata {
  lastSyncedAt: string | null;
  status: SyncStatus;
  message?: string;
}

