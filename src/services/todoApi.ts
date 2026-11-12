/**
 * Modul 3: Implementasi External REST API Call (DummyJSON Todo API)
 *
 * Mengimplementasikan:
 * 1. Synchronous dan Asynchronous Programming
 * 2. Async Function
 * 3. Promise
 * 4. async / await
 * 5. .then(), .catch()
 * 6. resolve() dan reject()
 * 7. HTTP Request & HTTP Response
 * 8. Pengolahan data JSON dari External API
 * 9. Interface untuk mendefinisikan struktur data
 */

import {
  CreateTodoApiPayload,
  DummyJsonTodo,
  DummyJsonTodosResponse,
  UpdateTodoApiPayload,
} from '../types/todo';

export const API_BASE_URL = 'https://dummyjson.com/todos';
const DEFAULT_TIMEOUT_MS = 8000;

/**
 * Helper untuk timeout AbortSignal
 */
function createTimeoutSignal(timeoutMs: number = DEFAULT_TIMEOUT_MS, parentSignal?: AbortSignal) {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort(new Error(`Batas waktu request (${timeoutMs} ms) terlampaui`));
  }, timeoutMs);

  if (parentSignal) {
    if (parentSignal.aborted) {
      controller.abort(parentSignal.reason);
    } else {
      parentSignal.addEventListener('abort', () => controller.abort(parentSignal.reason));
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timer),
  };
}

// ============================================================================
// 1. IMPLEMENTASI PROMISE DENGAN resolve() DAN reject()
// ============================================================================

/**
 * Memeriksa ketersediaan koneksi ke External REST API DummyJSON.
 * Dibuat menggunakan Promise constructor manual (new Promise), dengan memanggil
 * resolve() saat HTTP status 200 OK dan reject() saat gagal / offline.
 *
 * Digunakan di aplikasi dengan syntax:
 *   checkApiConnection()
 *     .then((isOnline) => { ... })
 *     .catch((error) => { ... });
 */
export function checkApiConnection(timeoutMs: number = 5000): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
      reject(new Error('Koneksi timeout: Server tidak merespons dalam waktu 5 detik'));
    }, timeoutMs);

    fetch(`${API_BASE_URL}?limit=1`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    })
      .then((response) => {
        clearTimeout(timer);
        if (!response.ok) {
          // HTTP Error status seperti 404, 500
          reject(new Error(`API Error: Server merespons dengan status ${response.status}`));
          return;
        }
        // Berhasil terhubung ke server eksternal
        resolve(true);
      })
      .catch((error) => {
        clearTimeout(timer);
        // Kegagalan jaringan / offline
        reject(error instanceof Error ? error : new Error('Tidak dapat terhubung ke server'));
      });
  });
}

/**
 * Promise untuk mengukur latensi (ping) koneksi ke REST API DummyJSON.
 * Mengembalikan Promise<{ ok: boolean; latencyMs: number }>
 */
export function pingApiLatency(): Promise<{ ok: boolean; latencyMs: number }> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    fetch(`${API_BASE_URL}?limit=1`, { method: 'GET' })
      .then((res) => {
        const latencyMs = Date.now() - startTime;
        if (res.ok) {
          resolve({ ok: true, latencyMs });
        } else {
          reject(new Error(`Ping gagal dengan HTTP status ${res.status}`));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Promise validator untuk judul Todo (Custom asynchronous validation).
 * Menolak (reject) jika judul kosong atau melebihi 80 karakter.
 */
export function validateTodoTitle(title: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const trimmed = title.trim();
    if (!trimmed) {
      reject(new Error('Judul tugas tidak boleh kosong'));
      return;
    }
    if (trimmed.length > 80) {
      reject(new Error('Judul tugas maksimal 80 karakter'));
      return;
    }
    resolve(trimmed);
  });
}

// ============================================================================
// 2. PRE-BUILT ASYNC FUNCTIONS & REST API ENDPOINTS (async / await)
// ============================================================================

/**
 * GET /todos?limit={limit}
 * Mengambil daftar data Todo dari External REST API.
 */
export async function fetchTodosFromApi(
  limit: number = 10,
  signal?: AbortSignal
): Promise<DummyJsonTodosResponse> {
  const url = `${API_BASE_URL}?limit=${limit}`;
  const { signal: combinedSignal, cleanup } = createTimeoutSignal(DEFAULT_TIMEOUT_MS, signal);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: combinedSignal,
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: Gagal memuat data dari DummyJSON`);
    }

    const data: DummyJsonTodosResponse = await res.json();
    return data;
  } finally {
    cleanup();
  }
}

/**
 * GET /todos/{id}
 * Mengambil detail Todo tertentu dari External REST API.
 */
export async function fetchTodoByIdFromApi(
  id: number,
  signal?: AbortSignal
): Promise<DummyJsonTodo> {
  const url = `${API_BASE_URL}/${id}`;
  const { signal: combinedSignal, cleanup } = createTimeoutSignal(DEFAULT_TIMEOUT_MS, signal);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: combinedSignal,
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: Todo #${id} tidak ditemukan di server`);
    }

    const data: DummyJsonTodo = await res.json();
    return data;
  } finally {
    cleanup();
  }
}

/**
 * POST /todos/add
 * Menambahkan data Todo baru ke External REST API simulasi.
 */
export async function createTodoOnApi(
  payload: CreateTodoApiPayload,
  signal?: AbortSignal
): Promise<DummyJsonTodo> {
  const url = `${API_BASE_URL}/add`;
  const { signal: combinedSignal, cleanup } = createTimeoutSignal(DEFAULT_TIMEOUT_MS, signal);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: combinedSignal,
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: Gagal menambahkan todo ke DummyJSON`);
    }

    const data: DummyJsonTodo = await res.json();
    return data;
  } finally {
    cleanup();
  }
}

/**
 * PUT /todos/{id}
 * Memperbarui seluruh data Todo pada External REST API.
 */
export async function updateTodoOnApi(
  id: number,
  payload: UpdateTodoApiPayload,
  signal?: AbortSignal
): Promise<DummyJsonTodo> {
  const url = `${API_BASE_URL}/${id}`;
  const { signal: combinedSignal, cleanup } = createTimeoutSignal(DEFAULT_TIMEOUT_MS, signal);

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: combinedSignal,
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: Gagal memperbarui todo #${id} di server`);
    }

    const data: DummyJsonTodo = await res.json();
    return data;
  } finally {
    cleanup();
  }
}

/**
 * PATCH /todos/{id}
 * Memperbarui sebagian data Todo (misal status completed) pada External REST API.
 */
export async function patchTodoOnApi(
  id: number,
  payload: Partial<UpdateTodoApiPayload>,
  signal?: AbortSignal
): Promise<DummyJsonTodo> {
  const url = `${API_BASE_URL}/${id}`;
  const { signal: combinedSignal, cleanup } = createTimeoutSignal(DEFAULT_TIMEOUT_MS, signal);

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: combinedSignal,
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: Gagal patch todo #${id}`);
    }

    const data: DummyJsonTodo = await res.json();
    return data;
  } finally {
    cleanup();
  }
}

/**
 * DELETE /todos/{id}
 * Menghapus data Todo dari External REST API.
 */
export async function deleteTodoOnApi(
  id: number,
  signal?: AbortSignal
): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> {
  const url = `${API_BASE_URL}/${id}`;
  const { signal: combinedSignal, cleanup } = createTimeoutSignal(DEFAULT_TIMEOUT_MS, signal);

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: combinedSignal,
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: Gagal menghapus todo #${id}`);
    }

    const data = await res.json();
    return data;
  } finally {
    cleanup();
  }
}

