# Reflection

Aplikasi jurnal & refleksi sosial — jurnal privat, mood tracker, dan Beranda publik dengan suka/komentar/follow.

Baca **PANDUAN-PUBLIKASI.md** (di folder induk) untuk panduan lengkap dari nol sampai online.

## Ringkasan cepat

```bash
npm install
cp .env.example .env   # lalu isi dengan kredensial Supabase kamu
npm run dev            # jalankan di localhost untuk uji coba
npm run build           # build untuk production (folder dist/)
```

## Struktur project

```
reflection-app/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── supabase-schema.sql     ← jalankan ini di Supabase SQL Editor
└── src/
    ├── main.jsx
    ├── App.jsx              ← seluruh aplikasi
    └── lib/
        └── supabaseClient.js
```

## Sebelum deploy, jangan lupa

- [ ] Jalankan `supabase-schema.sql` di project Supabase kamu
- [ ] Aktifkan Google sebagai provider di Supabase Authentication → Providers
- [ ] Isi `.env` dengan URL & anon key dari Supabase
- [ ] Tambahkan URL production ke Supabase Authentication → URL Configuration → Redirect URLs
