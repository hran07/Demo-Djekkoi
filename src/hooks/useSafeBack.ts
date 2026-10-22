import { useRouter } from "expo-router";

/**
 * Kembali ke halaman sebelumnya dengan aman.
 * Jika tidak ada riwayat (misalnya halaman dibuka lewat deep link),
 * pengguna diarahkan ke halaman utama agar tidak terjebak.
 */
export function useSafeBack() {
  const router = useRouter();

  return () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };
}
