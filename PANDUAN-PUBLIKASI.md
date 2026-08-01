# Panduan Publikasi Reflection

Panduan ini membawa **Reflection** dari kode di komputer kamu sampai bisa diakses siapa saja lewat alamat web sungguhan.

---

## Bagian 1 — Istilah yang Perlu Kamu Tahu

| Istilah | Penjelasan sederhana |
|---|---|
| **Repository (repo)** | "Folder proyek" yang disimpan di GitHub, supaya bisa dilacak perubahannya dan dihubungkan ke layanan lain. |
| **GitHub** | Tempat menyimpan kode secara online. Ibarat Google Drive, tapi khusus untuk kode dan punya riwayat setiap perubahan. |
| **Supabase** | Layanan "backend siap pakai": database sungguhan + sistem login (termasuk Google Login) + penyimpanan data, tanpa kamu harus membangun server sendiri dari nol. |
| **Database** | Tempat semua data aplikasi tersimpan permanen — profil pengguna, jurnal, post, komentar, dll. |
| **RLS (Row Level Security)** | Aturan keamanan di database yang memastikan, misalnya, jurnal privat seseorang hanya bisa dibaca oleh orang itu sendiri. Sudah disiapkan di `supabase-schema.sql`. |
| **OAuth / Google Login** | Sistem yang memungkinkan orang masuk pakai akun Google mereka, tanpa aplikasi kamu perlu menyimpan password siapa pun. |
| **Vite** | Alat yang mengubah kode React kamu jadi file HTML/CSS/JS yang bisa dijalankan browser. |
| **Deploy** | Proses mengunggah aplikasi supaya bisa diakses lewat internet (bukan cuma di komputer kamu). |
| **Vercel** | Layanan hosting gratis untuk memulai, yang otomatis men-deploy ulang aplikasi kamu setiap ada perubahan kode di GitHub. |
| **Domain** | Alamat web seperti `reflection.app`. Dibeli terpisah dari hosting. |
| **Environment variable (env var)** | Nilai rahasia/konfigurasi (seperti kunci API) yang disimpan terpisah dari kode, supaya tidak ikut ter-upload ke GitHub secara terbuka. |

---

## Bagian 2 — Yang Perlu Disiapkan

1. Akun **GitHub** (gratis) — [github.com](https://github.com)
2. Akun **Supabase** (gratis untuk mulai) — [supabase.com](https://supabase.com)
3. Akun **Vercel** (gratis untuk mulai) — [vercel.com](https://vercel.com), bisa daftar langsung pakai akun GitHub
4. **Google Cloud Console** untuk membuat kredensial Google Login (gratis) — [console.cloud.google.com](https://console.cloud.google.com)
5. Node.js terpasang di komputer kamu (versi 18 ke atas) — cek dengan `node --version` di terminal
6. (Opsional, untuk nanti) Domain sendiri, dibeli lewat Namecheap, Niagahoster, dll.

---

## Bagian 3 — Setup Supabase (Database + Login)

1. Buka [supabase.com](https://supabase.com) → **New Project**. Beri nama, misalnya `reflection`, buat password database (simpan baik-baik).
2. Setelah project selesai dibuat, buka menu **SQL Editor** → **New query**.
3. Buka file `supabase-schema.sql` dari project ini, salin **seluruh isinya**, tempel di SQL Editor, lalu klik **Run**. Ini akan membuat semua tabel (`profiles`, `journal_entries`, `posts`, dll) beserta aturan keamanannya.
4. Buka menu **Authentication → Providers** → aktifkan **Google**. Supabase akan minta *Client ID* dan *Client Secret* dari Google — lanjut ke Bagian 4 dulu untuk mendapatkannya.
5. Buka menu **Settings → API**. Catat dua nilai ini, kamu akan butuh nanti:
   - **Project URL**
   - **anon public key**

---

## Bagian 4 — Setup Google Login

1. Buka [console.cloud.google.com](https://console.cloud.google.com) → buat project baru (atau pakai yang sudah ada).
2. Buka **APIs & Services → OAuth consent screen** → pilih **External** → isi nama aplikasi (`Reflection`), email kontak, lalu simpan.
3. Buka **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
   - Application type: **Web application**
   - **Authorized redirect URIs**, tambahkan:
     ```
     https://xxxxxxxxxxxx.supabase.co/auth/v1/callback
     ```
     (ganti `xxxxxxxxxxxx` dengan Project URL Supabase kamu dari Bagian 3)
4. Setelah dibuat, kamu akan dapat **Client ID** dan **Client Secret** — salin keduanya.
5. Kembali ke Supabase → **Authentication → Providers → Google** → tempel Client ID & Client Secret → **Save**.

---

## Bagian 5 — Jalankan di Komputer Kamu (Uji Coba)

1. Buka terminal di folder `reflection-app`.
2. Install semua dependency:
   ```bash
   npm install
   ```
3. Salin file environment:
   ```bash
   cp .env.example .env
   ```
4. Buka `.env`, isi dengan Project URL dan anon key dari Supabase (Bagian 3 langkah 5).
5. Jalankan:
   ```bash
   npm run dev
   ```
6. Buka `http://localhost:5173` di browser. Coba masuk dengan Google, buat profil, tulis refleksi.

Kalau langkah ini berhasil, aplikasi kamu sudah berfungsi penuh secara lokal — tinggal dipublikasikan.

---

## Bagian 6 — Simpan Kode ke GitHub

1. Buat repository baru di GitHub (misalnya bernama `reflection-app`), jangan centang "Add README" (karena sudah ada).
2. Di terminal, dari folder `reflection-app`:
   ```bash
   git init
   git add .
   git commit -m "Reflection v1"
   git branch -M main
   git remote add origin https://github.com/USERNAME-KAMU/reflection-app.git
   git push -u origin main
   ```
   (Ganti `USERNAME-KAMU` dengan username GitHub kamu)

> **Penting:** file `.env` sengaja **tidak** ikut ter-upload (sudah diatur lewat `.gitignore`) karena berisi kunci rahasia. Itu wajar dan aman.

---

## Bagian 7 — Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → masuk pakai akun GitHub.
2. **Add New → Project** → pilih repo `reflection-app` yang tadi kamu push.
3. Vercel akan otomatis mendeteksi ini project Vite. Sebelum klik Deploy, buka bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` → isi dengan Project URL Supabase
   - `VITE_SUPABASE_ANON_KEY` → isi dengan anon key Supabase
4. Klik **Deploy**. Setelah selesai (biasanya 1-2 menit), Vercel memberimu URL seperti `reflection-app.vercel.app` — aplikasi kamu sudah **online dan bisa diakses siapa saja**.
5. Kembali ke Supabase → **Authentication → URL Configuration** → tambahkan URL Vercel kamu ke **Redirect URLs**, contoh:
   ```
   https://reflection-app.vercel.app/**
   ```
   Tanpa langkah ini, Google Login akan gagal di versi online (walau berhasil di localhost).

---

## Bagian 8 — Sambungkan Domain Sendiri (Opsional)

1. Beli domain (misalnya `reflection.id` atau `reflection.app`) lewat Namecheap, Niagahoster, dll.
2. Di Vercel: **Project → Settings → Domains** → masukkan domain kamu → ikuti instruksi untuk mengarahkan DNS (biasanya tinggal menambahkan satu baris record di pengaturan domain).
3. Tambahkan juga domain baru ini ke **Redirect URLs** di Supabase (seperti langkah 7.5).

---

## Bagian 9 — Sebelum Benar-Benar Ramai Dipakai Orang

Karena Reflection punya konten publik (Beranda) dan berisi tulisan pribadi orang, ada beberapa hal penting untuk aplikasi sosial:

- **Kebijakan Privasi & Syarat Penggunaan** — jelaskan data apa yang disimpan dan bagaimana digunakan. Bisa dibuat dengan generator gratis seperti [termly.io](https://termly.io) lalu disesuaikan.
- **Moderasi konten** — pertimbangkan tombol "Laporkan" pada post publik, dan cara untuk menghapus konten yang melanggar.
- **Batas panjang teks & rate limiting** — mencegah spam (Supabase punya pengaturan ini di level project).
- **Backup database** — Supabase punya fitur backup otomatis di paket berbayar; untuk versi gratis, sesekali ekspor data secara manual.

---

## Kalau Ada yang Error

- **"Invalid API key"** → cek ulang isi `.env`, pastikan tidak ada spasi tambahan.
- **Google Login redirect ke halaman error** → cek kembali Redirect URLs di Google Cloud Console dan Supabase, harus persis sama termasuk `https://`.
- **Data tidak muncul / error izin (permission denied)** → kemungkinan `supabase-schema.sql` belum dijalankan penuh, atau RLS policy belum aktif. Cek di Supabase → Table Editor, pastikan semua tabel ada.

Kalau masih ada masalah, salin pesan errornya dan tanyakan lagi — aku bisa bantu telusuri.
