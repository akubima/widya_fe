import { useState, useEffect, useCallback } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom Hook generik untuk data fetching (mirip Composable di Vue.js).
 * Mengelola state data, loading, error, fungsi retry, serta
 * membersihkan koneksi dengan AbortController untuk mencegah memory leak.
 */
export function useFetch<T>(url: string | null): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(url));
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState<number>(0);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Data tidak ditemukan (404)');
          }
          throw new Error(`Gagal memuat data dari server (Status: ${res.status})`);
        }
        return res.json();
      })
      .then((result: T) => {
        setData(result);
        setLoading(false);
      })
      .catch((err: unknown) => {
        // Abaikan jika request sengaja dibatalkan saat unmount
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan jaringan.');
        setLoading(false);
      });

    // Cleanup: batalkan request saat komponen di-unmount atau URL berubah
    return () => {
      controller.abort();
    };
  }, [url, retryTrigger]);

  return { data, loading, error, refetch };
}
