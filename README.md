# User Dashboard SPA (React.js + TailwindCSS)

Aplikasi Single Page Application (SPA) dashboard pengguna yang mengambil data dari REST API publik [JSONPlaceholder](https://jsonplaceholder.typicode.com/users) dengan fitur pencarian realtime, penanganan status loading & error, serta halaman detail pengguna mandiri (*shareable URL*).

Dibangun dengan arsitektur **DRY (*Don't Repeat Yourself*)** menggunakan **Custom Hook** untuk manajemen logika asinkron dan **Reusable Components** untuk elemen UI yang modular.

---

## 🚀 Fitur Utama

1. **Daftar Pengguna (Grid Card):** Menampilkan daftar pengguna dalam bentuk grid card yang bersih dan responsif menggunakan utilitas murni TailwindCSS.
2. **Pencarian Realtime (Client-Side):** Fitur filter pengguna instan berdasarkan nama atau email secara realtime di sisi klien.
3. **Halaman Detail Pengguna (`/dashboard/users/:id`):** Halaman khusus per pengguna yang memuat informasi lengkap (kontak, alamat, dan perusahaan) serta siap dibagikan langsung (*shareable URL*) kepada pihak berwenang.
4. **Loading & Error Handling:** Tampilan state loading (skeleton placeholder) saat data sedang dimuat dan pesan error yang ramah jika API gagal dipanggil, lengkap dengan tombol coba lagi (*retry*).
5. **Path Reservation & Redirect:** Mengakses rute root `/` akan langsung dialihkan (*redirect*) ke `/dashboard/users`.

---

## 🛠️ Cara Menjalankan Project

```bash
# 1. Clone repository
git clone <url-repository>
cd widya_fe

# 2. Install dependensi
pnpm install

# 3. Jalankan server lokal
pnpm run dev

# Buka browser di http://localhost:5173
```

Untuk build produksi dan linter:
```bash
pnpm run build
pnpm run lint
```

---

## 📁 Struktur Folder Project

Struktur folder dirancang dengan memisahkan *stateful logic* (Custom Hook) dan *presentational UI* (Components):

```
src/
├── types/
│   └── user.ts             # Definisi interface TypeScript (User, Address, Company)
├── hooks/
│   └── useFetch.ts         # Custom Hook generik data fetching (DRY & aman memory leak)
├── components/
│   ├── Navbar.tsx          # Komponen header navigasi atas
│   ├── SearchBar.tsx       # Reusable component: Input pencarian dengan clear button
│   ├── LoadingSkeleton.tsx # Reusable component: Animasi skeleton loading
│   ├── ErrorAlert.tsx      # Reusable component: Banner error + tombol retry
│   └── UserCard.tsx        # Reusable component: Kartu ringkasan pengguna
├── pages/
│   ├── UserListPage.tsx    # Halaman daftar pengguna (/dashboard/users)
│   └── UserDetailPage.tsx  # Halaman detail pengguna (/dashboard/users/:id)
├── App.tsx                 # Konfigurasi routing aplikasi
├── index.css               # Direktif dasar TailwindCSS
└── main.tsx                # Titik masuk utama React
```

---

## 📝 Jawaban Pertanyaan Pemahaman (WAJIB)

### 1. State Management & Lifecycle

> **Pertanyaan:** *Bagaimana cara Anda melakukan fetching data di React? Jika Anda menggunakan useEffect, jelaskan bagaimana cara Anda mencegah terjadinya memory leak atau pemanggilan API berulang (infinite loop)?*

**Jawaban:**
1. **Cara Melakukan Fetching (Penerapan Custom Hook `useFetch`):**
   Untuk menghindari penulisan logika fetching yang berulang (*redundant*) di setiap halaman, kami mengekstrak logika tersebut ke dalam sebuah **Custom Hook** bernama `useFetch<T>(url)` (di Vue.js, konsep ini dikenal sebagai **Composable**).
   Hook ini mengelola state `data`, `loading`, `error`, dan fungsi `refetch`.
2. **Mencegah Pemanggilan Berulang (Infinite Loop):**
   *Infinite loop* terjadi jika pemanggilan `setState` di dalam fungsi komponen memicu re-render yang memicu kembali `useEffect` tanpa henti.
   Di dalam `useFetch`, `useEffect` hanya bergantung pada `[url, retryTrigger]`. Selama URL tidak berubah dan tombol retry tidak ditekan, efek ini **hanya akan berjalan satu kali** saat komponen di-mount.
3. **Mencegah Memory Leak & Race Condition (`AbortController`):**
   Jika pengguna berpindah halaman sebelum respons API selesai diterima, memperbarui state pada komponen yang sudah tidak aktif (*unmounted*) dapat menyebabkan kebocoran memori (*memory leak*).
   Kami mencegahnya dengan memanfaatkan **`AbortController`**:
   - `controller.signal` diteruskan ke fungsi `fetch()`.
   - Di akhir `useEffect`, kami mengembalikan **cleanup function** `() => controller.abort()`.
   - Jika pengguna berpindah rute sebelum API merespons, request HTTP dibatalkan secara otomatis dan error `AbortError` diabaikan, sehingga tidak ada *state update* yang bocor pada komponen yang sudah mati.

---

### 2. Struktur Folder & Keputusan Arsitektur

> **Pertanyaan:** *Mengapa Anda menstrukturisasi folder/file seperti yang ada di project Anda saat ini? Jelaskan alasannya.*

**Jawaban:**
1. **Pemisahan Logika dan Tampilan (Separation of Concerns & DRY):**
   - **`hooks/useFetch.ts`**: Logika fetching dan siklus hidup `AbortController` diisolasi di satu tempat. Kedua halaman (`UserListPage` dan `UserDetailPage`) tinggal mengonsumsi hook ini dengan tipe data generic (`useFetch<User[]>` dan `useFetch<User>`).
   - **`components/`**: Elemen UI yang berulang (`ErrorAlert`, `LoadingSkeleton`, `SearchBar`, `UserCard`) diekstrak menjadi **Reusable / Mountable Components**. Halaman utama menjadi sangat bersih dan fokus hanya pada *layout orchestration*.
2. **Alasan Halaman Terpisah `/dashboard/users/:id` vs Modal:**
   - **Pertimbangan Skenario Admin:** Pada sistem nyata, admin sering kali perlu **membagikan tautan pengguna spesifik** (contoh: `http://localhost:5173/dashboard/users/3`) kepada pihak lain melalui email atau pesan internal tanpa mengharuskan penerima mencari manual di halaman list.
   - **Analisis Trade-Off:** Pendekatan ini membutuhkan pemanggilan API tersendiri ke `https://jsonplaceholder.typicode.com/users/:id` saat halaman diakses via URL langsung. Namun, keuntungan kolaborasi (*shareable*, *bookmarkable*, dan mendukung tombol *Back/Forward* browser) jauh lebih bernilai untuk kebutuhan aplikasi dashboard.
3. **Reservasi Path Root `/`:**
   Rute `/` langsung dialihkan (*redirect*) ke `/dashboard/users` karena rute root biasanya direservasi untuk halaman login atau landing page di masa depan.

---

### 3. Optimasi Kinerja (Performance)

> **Pertanyaan:** *Anggaplah API tiba-tiba mengembalikan 10.000 data user sekaligus dan membuat aplikasi lag saat diketik di kolom pencarian. Pendekatan apa (fitur React apa) yang akan Anda gunakan untuk mengatasi lag tersebut?*

**Jawaban:**
Penyebab utama lag pada 10.000 data bukanlah proses pencariannya di memori, melainkan **pemblokiran UI thread saat mengetik** dan **beban browser saat me-render ribuan node DOM nyata sekaligus**.

Solusi bertingkat yang akan diterapkan:

1. **Fitur React Concurrent: `useDeferredValue` atau `useTransition`**
   Secara default, proses render di React bersifat mendesak (*urgent*). Dengan menggunakan `useDeferredValue(search)`, React akan memprioritaskan pembaruan teks di kolom input secara instan (tetap mulus), sementara proses filtering 10.000 data dan re-render list dijalankan di latar belakang dengan prioritas yang lebih rendah tanpa membuat input lag/macet.
2. **DOM Virtualization / Windowing (misalnya: `@tanstack/react-virtual` atau `react-window`)**
   Alih-alih membuat 10.000 elemen card di DOM secara bersamaan, teknik virtualisasi hanya merender elemen yang benar-benar terlihat di layar (*viewport*, misalnya 10-15 card). Ketika di-scroll, card lama dihapus dan card baru digambar secara bergantian, sehingga konsumsi memori browser tetap sangat ringan dan konstan.
3. **Debouncing pada Input Pencarian**
   Menerapkan *debounce* (misal: jeda 250–300 ms) agar kalkulasi pencarian baru dijalankan setelah user berhenti mengetik sejenak, bukan di setiap ketukan tombol keyboard.
