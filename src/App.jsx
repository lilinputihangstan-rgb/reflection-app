import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import * as Tone from "tone";
import { supabase } from "./lib/supabaseClient";

/* ---------------------------------------------------------
   REFLECTION — a social space for people to reflect,
   and to choose what stays private and what gets shared.
   ---------------------------------------------------------
   Palette: warm paper, terracotta clay, moss, muted gold, dusty rose
   Type: Fraunces (display) + Work Sans (body) + IBM Plex Mono (data)
   Signature: "Pohon Refleksi" — a tree that grows a leaf per entry
--------------------------------------------------------- */

const T = {
  id: {
    appName: "Reflection",
    tagline: "Ruang untuk merenung — simpan untuk dirimu, atau bagikan pada dunia.",
    nav: { feed: "Beranda", search: "Cari", journal: "Jurnal Saya", profile: "Profil" },
    onboardTitle: "Buat profil refleksimu",
    onboardDesc: "Ini akan menjadi identitasmu di Reflection. Kamu tetap bisa menulis secara privat kapan pun.",
    username: "Username", usernamePh: "mis. lilin_senja",
    displayName: "Nama tampilan", displayNamePh: "Nama yang ingin orang lain lihat",
    status: "Status / kondisi saat ini", statusPh: "mis. Sedang mempersiapkan kuliah luar negeri",
    bio: "Bio singkat (opsional)", bioPh: "Ceritakan sedikit tentang dirimu…",
    chooseAvatar: "Pilih avatar",
    createProfile: "Buat profil",
    googleNote: "Kamu sudah masuk dengan Google. Lengkapi profil ini untuk mulai menggunakan Reflection.",
    orDivider: "atau",
    authEmailLabel: "Email", authEmailPh: "kamu@email.com",
    authPasswordLabel: "Kata sandi", authPasswordPh: "Minimal 6 karakter",
    authLoginBtn: "Masuk", authLoginBtnLoading: "Masuk…",
    authSignupBtn: "Daftar akun baru", authSignupBtnLoading: "Mendaftar…",
    authSwitchToSignup: "Belum punya akun? Daftar",
    authSwitchToLogin: "Sudah punya akun? Masuk",
    authFillBoth: "Isi email dan kata sandi dulu ya.",
    authPasswordTooShort: "Kata sandi minimal 6 karakter.",
    authCheckEmail: "Cek email kamu untuk konfirmasi sebelum bisa masuk.",
    authErrInvalid: "Email atau kata sandi salah.",
    authErrExists: "Email ini sudah terdaftar. Coba masuk saja.",
    authErrNotConfirmed: "Email belum dikonfirmasi. Cek inbox kamu dulu.",
    authErrRateLimit: "Terlalu banyak percobaan. Coba lagi sebentar lagi.",
    authErrGeneric: "Ada masalah, coba lagi.",
    authForgotLink: "Lupa password?",
    authBackToLogin: "Kembali ke Masuk",
    authSendResetBtn: "Kirim link reset", authSendResetBtnLoading: "Mengirim…",
    authEmailRequired: "Isi email kamu dulu ya.",
    authResetSent: "Link reset password sudah dikirim. Cek email kamu (termasuk folder spam).",
    resetTitle: "Atur Password Baru",
    resetSubtitle: "Masukkan password baru buat akun kamu.",
    resetNewPasswordPh: "Password baru (minimal 6 karakter)",
    resetConfirmPasswordPh: "Ulangi password baru",
    resetSubmitBtn: "Simpan password baru", resetSubmitBtnLoading: "Menyimpan…",
    resetMismatch: "Password tidak sama, coba periksa lagi.",
    resetSuccess: "Password berhasil diganti! Kamu sudah masuk.",
    resetContinueBtn: "Lanjut ke Reflection",
    greetingPrefix: "Selamat",
    morning: "pagi", afternoon: "siang", evening: "sore", night: "malam",
    promptLabel: "Renungan hari ini",
    newPrompt: "Ganti renungan",
    moodLabel: "Bagaimana perasaanmu sekarang?",
    writePlaceholder: "Tulis apa yang sedang kamu rasakan dan pikirkan…",
    publishToggle: "Publikasikan ke Beranda (tampil dengan nama profilmu)",
    privateNote: "Jika tidak dicentang, refleksi ini hanya untukmu sendiri.",
    save: "Simpan refleksi",
    saved: "Tersimpan.",
    titleLabel: "Judul / topik (opsional)",
    titlePlaceholder: "Refleksi ini tentang apa?",
    mediaAttachLabel: "📎 Tambah foto/video (opsional)",
    mediaRemove: "✕ Hapus",
    mediaUnsupported: "Format file tidak didukung. Pakai foto atau video ya.",
    mediaTooLarge: "Ukuran file maksimal 25MB.",
    uploadingMedia: "Mengunggah media…",
    calendarToggle: "📅 Lihat berdasarkan tanggal",
    calendarClose: "Tutup kalender",
    calendarShowAll: "Tampilkan semua",
    calendarNoEntries: "Belum ada refleksi di tanggal ini.",
    translateBtn: "🌐 Terjemahkan",
    showOriginal: "Tampilkan teks asli",
    translating: "Menerjemahkan…",
    translateError: "Gagal menerjemahkan, coba lagi.",
    searchPlaceholder: "Cari nama pengguna atau nama tampilan…",
    searchEmpty: "Ketik nama buat mulai mencari.",
    searchNoResults: "Nggak ketemu akun dengan nama itu.",
    searchLoading: "Mencari…",
    reportAction: "🚩 Laporkan",
    blockAction: "🚫 Blokir pengguna",
    unblockAction: "Buka blokir",
    reportTitle: "Laporkan Post",
    reportSubtitle: "Kasih tau kami kenapa post ini bermasalah (opsional).",
    reportPlaceholder: "Ceritakan alasannya di sini…",
    reportSubmitBtn: "Kirim Laporan", reportSubmitBtnLoading: "Mengirim…",
    reportCancel: "Batal",
    reportSentTitle: "Laporan terkirim",
    reportSentBody: "Makasih udah kasih tau kami. Kami akan meninjau laporan ini.",
    reportClose: "Tutup",
    blockConfirmTitle: "Blokir pengguna ini?",
    blockConfirmBody: "Kamu nggak akan lihat post mereka lagi, dan mereka nggak akan muncul di pencarian kamu.",
    blockConfirmBtn: "Ya, Blokir",
    blockedListEmpty: "Kamu belum memblokir siapa pun.",
    blockedListTitle: "Pengguna yang Diblokir",
    errorOffline: "Kamu lagi offline. Periksa koneksi internet dan coba lagi.",
    errorSaveFailed: "Refleksi belum tersimpan. Periksa koneksi internet dan coba lagi.",
    errorMediaUpload: "Gagal mengunggah foto/video. Coba dengan file yang lebih kecil atau periksa koneksi kamu.",
    draftRestoredNote: "Draf sebelumnya dipulihkan otomatis.",
    draftSavedNote: "Draf tersimpan otomatis",
    dangerZoneTitle: "Zona Berbahaya",
    exportTitle: "Ekspor Data",
    exportDesc: "Unduh semua refleksimu buat disimpan sendiri atau dipindah ke aplikasi lain.",
    exportMarkdownBtn: "⬇️ Unduh sebagai Markdown (.md)",
    exportJsonBtn: "⬇️ Unduh sebagai JSON (.json)",
    exportEmpty: "Belum ada refleksi buat diekspor.",
    deleteAccountBtn: "Hapus Akun Saya",
    deleteAccountWarning: "Ini akan menghapus akun kamu secara permanen, termasuk semua refleksi, post, dan data profil. Tindakan ini tidak bisa dibatalkan.",
    deleteAccountConfirmPh: "Ketik HAPUS untuk konfirmasi",
    deleteAccountConfirmBtn: "Hapus Permanen",
    deleteAccountCancel: "Batal",
    deleteAccountTypeError: "Ketik \"HAPUS\" (huruf besar) buat konfirmasi.",
    deleteAccountDone: "Data akun kamu sudah dihapus. Kamu akan keluar sekarang.",
    deleteAccountFailed: "Gagal menghapus akun. Coba lagi atau hubungi kami.",
    onboardWelcomeTitle: "Selamat datang di Reflection 🌿",
    onboardWelcomeBody: "Ruang kecil buat nulis apa yang kamu rasakan dan pikirkan. Cuma untukmu sendiri, atau boleh dibagikan — kamu yang tentukan.",
    onboardStep1: "Pilih mood yang paling menggambarkan perasaanmu sekarang.",
    onboardStep2: "Tulis bebas, atau jawab pertanyaan pemantik di atas.",
    onboardStep3: "Centang \"Publikasikan ke Beranda\" cuma kalau kamu mau refleksi ini dilihat orang lain. Kalau enggak, aman tersimpan buat kamu sendiri.",
    onboardStep4: "Klik \"Simpan refleksi\". Refleksi pertamamu akan muncul di bawah, dan kamu bisa lihat perkembangannya dari waktu ke waktu.",
    intensityLabel: "Seberapa kuat perasaan ini?",
    intensityLow: "Ringan",
    intensityHigh: "Kuat",
    tagsLabel: "Tag (opsional, pilih yang cocok)",
    tag_kuliah: "Kuliah", tag_keluarga: "Keluarga", tag_kesehatan: "Kesehatan", tag_uang: "Uang", tag_hubungan: "Hubungan", tag_kerja: "Kerja/Karier", tag_diri: "Diri Sendiri",
    journalSearchPh: "Cari di refleksimu…",
    filterByTag: "Filter tag:",
    filterAllTags: "Semua",
    journalSearchNoResults: "Nggak ada refleksi yang cocok dengan pencarian/filter ini.",
    weeklySummaryTitle: "Ringkasan Minggu Ini",
    weeklySummaryEmpty: "Belum ada refleksi minggu ini. Yuk mulai nulis!",
    weeklySummaryCount: "refleksi ditulis",
    weeklySummaryDominantMood: "Mood yang paling sering muncul:",
    weeklySummaryAvgIntensity: "Rata-rata intensitas:",
    weeklySummaryTopTags: "Topik yang sering muncul:",
    empty_journal: "Belum ada refleksi. Tulisan pertamamu akan muncul di sini.",
    streak: "hari beruntun",
    totalEntries: "total refleksi",
    thisWeek: "minggu ini",
    treeTitle: "Pohon Refleksimu",
    treeDesc: "Setiap refleksi menumbuhkan satu daun.",
    moodDistTitle: "Sebaran perasaan",
    feedEmpty: "Beranda masih sunyi. Jadilah yang pertama membagikan refleksimu.",
    loading: "Memuat…",
    langToggle: "EN",
    moods: { calm: "Tenang", grateful: "Bersyukur", heavy: "Berat", confused: "Bingung", happy: "Bahagia" },
    readMore: "Baca selengkapnya",
    readLess: "Tutup",
    deleteEntry: "Hapus",
    like: "Suka", liked: "Disukai",
    comment: "Komentar", commentPh: "Tulis komentar…", send: "Kirim",
    follow: "Ikuti", following: "Mengikuti", unfollow: "Berhenti mengikuti",
    followers: "pengikut", followingCount: "mengikuti",
    backToFeed: "Kembali ke Beranda",
    yourProfile: "Profil Kamu",
    publicBadge: "Publik",
    noPostsYet: "Belum ada refleksi publik.",
    viewProfile: "Lihat profil",
    musicTitle: "Musik Latar",
    musicDesc: "Nyalakan suasana ambient orisinal untuk menemani refleksimu.",
    musicComboNote: "Kamu bisa menyalakan lebih dari satu suasana sekaligus untuk memadukannya.",
    musicOff: "Matikan semua",
    presetRain: "Hujan Senja",
    presetPiano: "Piano Sunyi",
    presetGuitar: "Gitar Akustik",
    presetBells: "Lonceng Meditasi",
    presetStrings: "Senar Hangat",
    presetFlute: "Suling Lembut",
    presetCello: "Cello Dalam",
    presetKalimba: "Kalimba Riang",
    presetHarp: "Harpa Berkilau",
    presetOcean: "Ombak Laut",
    presetRiver: "Aliran Sungai",
    presetWind: "Angin Sepoi",
    presetBirds: "Kicau Burung",
    presetCrickets: "Jangkrik Malam",
    presetCampfire: "Api Unggun",
    descRain: "Gemericik hujan yang menenangkan, seperti sore syahdu di teras.",
    descPiano: "Akord piano lembut yang mengalun pelan dan reflektif.",
    descGuitar: "Petikan gitar akustik yang hangat, seperti memetik senar sendirian.",
    descBells: "Bunyi lonceng sesekali, seperti ruang meditasi yang sunyi.",
    descStrings: "Senar yang mengalun panjang, memberi rasa lapang dan syahdu.",
    descFlute: "Melodi suling yang mengalir bebas, ringan seperti angin pagi.",
    descCello: "Cello dalam dan sedikit melankolis, memberi rasa dalam dan tenang.",
    descKalimba: "Kalimba riang lembut — hangat dan disukai banyak orang.",
    descHarp: "Harpa berkilau lembut, memberi rasa lapang dan damai.",
    descOcean: "Deburan ombak perlahan, membawa rasa tenang seperti di tepi pantai.",
    descRiver: "Aliran sungai yang jernih, mengalir lembut di antara bebatuan.",
    descWind: "Angin sepoi yang berhembus pelan, menenangkan seperti di puncak bukit.",
    descBirds: "Kicau burung pagi yang samar, mengingatkan pada pagi yang tenang.",
    descCrickets: "Bunyi jangkrik malam yang lembut, seperti duduk di teras malam hari.",
    descCampfire: "Derak api unggun yang hangat, seperti berkumpul di bawah bintang.",
    volumeLabel: "Volume",
    melodyLabel: "Melodi",
    ambientLabel: "Efek Suara Alam",
    appearance: "Tampilan Latar",
    sceneLabel: "Latar Pemandangan",
    sceneNone: "Polos",
    sceneMountain: "Gunung Senja",
    sceneSea: "Laut Tenang",
    sceneForest: "Hutan Berkabut",
    sceneNight: "Langit Malam",
    sceneMeadow: "Padang Rumput",
    fontLabel: "Gaya Tulisan",
    fontOrganic: "Organik",
    fontElegant: "Elegan",
    fontHandwritten: "Tulisan Tangan",
    fontModern: "Modern",
    legalPrivacyLink: "Kebijakan Privasi",
    legalTermsLink: "Ketentuan Layanan",
    legalPrivacyTitle: "Kebijakan Privasi",
    legalTermsTitle: "Ketentuan Layanan",
    legalPrivacyBody: [
      "Terakhir diperbarui: Agustus 2026",
      "Reflection adalah aplikasi jurnal & refleksi pribadi yang dibuat secara independen. Halaman ini menjelaskan data apa yang kami simpan dan bagaimana data itu dipakai.",
      "## Data yang kami simpan",
      "Saat kamu mendaftar: email, nama pengguna, nama tampilan, dan foto profil (kalau pakai Google) atau data yang kamu isi sendiri saat pendaftaran.\nSaat kamu menulis refleksi: teks refleksi, mood, judul/topik (kalau diisi), dan foto/video yang kamu lampirkan.\nAktivitas sosial: like, komentar, siapa yang kamu follow, kalau kamu memilih mempublikasikan refleksi ke Beranda.",
      "## Bagaimana data dipakai",
      "Data dipakai semata-mata untuk menjalankan fitur aplikasi: menampilkan jurnalmu, menampilkan post di Beranda kalau kamu pilih publik, dan menghubungkan kamu dengan pengguna lain lewat fitur cari/follow. Kami tidak menjual data kamu ke pihak ketiga, dan tidak menampilkan iklan.",
      "## Refleksi privat vs publik",
      "Refleksi yang TIDAK dicentang \"Publikasikan ke Beranda\" hanya bisa dilihat oleh kamu sendiri. Refleksi yang dipublikasikan bisa dilihat pengguna lain yang punya akun di aplikasi ini.",
      "## Kontrol kamu",
      "Kamu bisa menghapus refleksi kapan saja (baik privat maupun yang sudah dipublikasikan — keduanya akan terhapus bersamaan). Kamu bisa memblokir atau melaporkan pengguna lain lewat fitur yang tersedia di profil/post mereka.",
      "## Penyimpanan & keamanan",
      "Data disimpan menggunakan layanan Supabase (database & storage terenkripsi). Password kamu tidak pernah disimpan dalam bentuk teks biasa — sistem otentikasi menanganinya secara aman.",
      "## Kontak",
      "Ada pertanyaan soal privasi datamu? Hubungi pembuat aplikasi ini melalui GitHub: lilinputihangstan-rgb.",
    ],
    legalTermsBody: [
      "Terakhir diperbarui: Agustus 2026",
      "Dengan menggunakan Reflection, kamu setuju dengan ketentuan berikut.",
      "## Penggunaan yang wajar",
      "Reflection dibuat sebagai ruang refleksi pribadi dan berbagi yang sehat. Kamu setuju untuk tidak memposting konten yang mengandung kebencian, pelecehan, ancaman, konten dewasa/eksplisit, atau hal yang melanggar hukum.",
      "## Konten kamu",
      "Kamu tetap pemilik penuh atas tulisan, foto, dan video yang kamu unggah. Dengan mempublikasikan ke Beranda, kamu mengizinkan pengguna lain di aplikasi ini untuk melihat konten tersebut.",
      "## Moderasi",
      "Kami berhak menghapus konten atau menonaktifkan akun yang melanggar ketentuan ini, termasuk berdasarkan laporan dari pengguna lain.",
      "## Batasan usia",
      "Aplikasi ini ditujukan untuk pengguna berusia 13 tahun ke atas.",
      "## Tanpa jaminan",
      "Aplikasi ini disediakan \"apa adanya\", dikembangkan dan dikelola secara independen tanpa jaminan ketersediaan layanan 100% sepanjang waktu.",
      "## Perubahan ketentuan",
      "Ketentuan ini bisa berubah sewaktu-waktu seiring berkembangnya aplikasi. Perubahan besar akan diinformasikan di dalam aplikasi.",
    ],
  },
  en: {
    appName: "Reflection",
    tagline: "A space to reflect — keep it private, or share it with the world.",
    nav: { feed: "Feed", search: "Search", journal: "My Journal", profile: "Profile" },
    onboardTitle: "Create your Reflection profile",
    onboardDesc: "This becomes your identity on Reflection. You can still write privately anytime.",
    username: "Username", usernamePh: "e.g. dusk_candle",
    displayName: "Display name", displayNamePh: "The name others will see",
    status: "Status / current situation", statusPh: "e.g. Preparing to study abroad",
    bio: "Short bio (optional)", bioPh: "Tell a little about yourself…",
    chooseAvatar: "Choose an avatar",
    createProfile: "Create profile",
    googleNote: "You're signed in with Google. Complete this profile to start using Reflection.",
    orDivider: "or",
    authEmailLabel: "Email", authEmailPh: "you@email.com",
    authPasswordLabel: "Password", authPasswordPh: "At least 6 characters",
    authLoginBtn: "Sign in", authLoginBtnLoading: "Signing in…",
    authSignupBtn: "Create account", authSignupBtnLoading: "Creating account…",
    authSwitchToSignup: "Don't have an account? Sign up",
    authSwitchToLogin: "Already have an account? Sign in",
    authFillBoth: "Please fill in both email and password.",
    authPasswordTooShort: "Password must be at least 6 characters.",
    authCheckEmail: "Check your email to confirm before signing in.",
    authErrInvalid: "Invalid email or password.",
    authErrExists: "This email is already registered. Try signing in instead.",
    authErrNotConfirmed: "Email not confirmed yet. Check your inbox first.",
    authErrRateLimit: "Too many attempts. Please try again shortly.",
    authErrGeneric: "Something went wrong, please try again.",
    authForgotLink: "Forgot password?",
    authBackToLogin: "Back to Sign in",
    authSendResetBtn: "Send reset link", authSendResetBtnLoading: "Sending…",
    authEmailRequired: "Please enter your email first.",
    authResetSent: "Password reset link sent. Check your email (including spam folder).",
    resetTitle: "Set New Password",
    resetSubtitle: "Enter a new password for your account.",
    resetNewPasswordPh: "New password (at least 6 characters)",
    resetConfirmPasswordPh: "Confirm new password",
    resetSubmitBtn: "Save new password", resetSubmitBtnLoading: "Saving…",
    resetMismatch: "Passwords don't match, please check again.",
    resetSuccess: "Password changed successfully! You're now signed in.",
    resetContinueBtn: "Continue to Reflection",
    greetingPrefix: "Good",
    morning: "morning", afternoon: "afternoon", evening: "evening", night: "evening",
    promptLabel: "Today's reflection",
    newPrompt: "New prompt",
    moodLabel: "How are you feeling right now?",
    writePlaceholder: "Write what you're feeling and thinking…",
    publishToggle: "Publish to Feed (shown under your profile name)",
    privateNote: "If unchecked, this reflection stays private to you.",
    save: "Save reflection",
    saved: "Saved.",
    titleLabel: "Title / topic (optional)",
    titlePlaceholder: "What's this reflection about?",
    mediaAttachLabel: "📎 Add photo/video (optional)",
    mediaRemove: "✕ Remove",
    mediaUnsupported: "Unsupported file type. Please use a photo or video.",
    mediaTooLarge: "File size must be under 25MB.",
    uploadingMedia: "Uploading media…",
    calendarToggle: "📅 View by date",
    calendarClose: "Close calendar",
    calendarShowAll: "Show all",
    calendarNoEntries: "No reflections on this date yet.",
    translateBtn: "🌐 Translate",
    showOriginal: "Show original text",
    translating: "Translating…",
    translateError: "Translation failed, try again.",
    searchPlaceholder: "Search username or display name…",
    searchEmpty: "Type a name to start searching.",
    searchNoResults: "No accounts found with that name.",
    searchLoading: "Searching…",
    reportAction: "🚩 Report",
    blockAction: "🚫 Block user",
    unblockAction: "Unblock",
    reportTitle: "Report Post",
    reportSubtitle: "Tell us why this post is a problem (optional).",
    reportPlaceholder: "Describe the reason here…",
    reportSubmitBtn: "Send Report", reportSubmitBtnLoading: "Sending…",
    reportCancel: "Cancel",
    reportSentTitle: "Report sent",
    reportSentBody: "Thanks for letting us know. We'll review this report.",
    reportClose: "Close",
    blockConfirmTitle: "Block this user?",
    blockConfirmBody: "You won't see their posts anymore, and they won't appear in your search.",
    blockConfirmBtn: "Yes, Block",
    blockedListEmpty: "You haven't blocked anyone yet.",
    blockedListTitle: "Blocked Users",
    errorOffline: "You're offline. Check your internet connection and try again.",
    errorSaveFailed: "Your reflection wasn't saved. Check your internet connection and try again.",
    errorMediaUpload: "Failed to upload the photo/video. Try a smaller file or check your connection.",
    draftRestoredNote: "Your previous draft was restored automatically.",
    draftSavedNote: "Draft auto-saved",
    dangerZoneTitle: "Danger Zone",
    exportTitle: "Export Data",
    exportDesc: "Download all your reflections to keep for yourself or move to another app.",
    exportMarkdownBtn: "⬇️ Download as Markdown (.md)",
    exportJsonBtn: "⬇️ Download as JSON (.json)",
    exportEmpty: "No reflections to export yet.",
    deleteAccountBtn: "Delete My Account",
    deleteAccountWarning: "This permanently deletes your account, including all reflections, posts, and profile data. This cannot be undone.",
    deleteAccountConfirmPh: "Type DELETE to confirm",
    deleteAccountConfirmBtn: "Delete Permanently",
    deleteAccountCancel: "Cancel",
    deleteAccountTypeError: "Type \"DELETE\" (all caps) to confirm.",
    deleteAccountDone: "Your account data has been deleted. You'll be signed out now.",
    deleteAccountFailed: "Failed to delete account. Please try again or contact us.",
    onboardWelcomeTitle: "Welcome to Reflection 🌿",
    onboardWelcomeBody: "A small space to write what you're feeling and thinking. Just for you, or shareable — your choice.",
    onboardStep1: "Pick the mood that best describes how you feel right now.",
    onboardStep2: "Write freely, or answer the prompt above.",
    onboardStep3: "Check \"Publish to Feed\" only if you want this reflection seen by others. Otherwise, it stays safely private to you.",
    onboardStep4: "Click \"Save reflection\". Your first entry will appear below, and you can watch your progress over time.",
    intensityLabel: "How strong is this feeling?",
    intensityLow: "Mild",
    intensityHigh: "Strong",
    tagsLabel: "Tags (optional, pick what fits)",
    tag_kuliah: "Study", tag_keluarga: "Family", tag_kesehatan: "Health", tag_uang: "Money", tag_hubungan: "Relationships", tag_kerja: "Work/Career", tag_diri: "Self",
    journalSearchPh: "Search your reflections…",
    filterByTag: "Filter by tag:",
    filterAllTags: "All",
    journalSearchNoResults: "No reflections match this search/filter.",
    weeklySummaryTitle: "This Week's Summary",
    weeklySummaryEmpty: "No reflections yet this week. Time to start writing!",
    weeklySummaryCount: "reflections written",
    weeklySummaryDominantMood: "Most frequent mood:",
    weeklySummaryAvgIntensity: "Average intensity:",
    weeklySummaryTopTags: "Common topics:",
    empty_journal: "No reflections yet. Your first entry will appear here.",
    streak: "day streak",
    totalEntries: "total entries",
    thisWeek: "this week",
    treeTitle: "Your Reflection Tree",
    treeDesc: "Every reflection grows one leaf.",
    moodDistTitle: "Mood distribution",
    feedEmpty: "The feed is still quiet. Be the first to share your reflection.",
    loading: "Loading…",
    langToggle: "ID",
    moods: { calm: "Calm", grateful: "Grateful", heavy: "Heavy", confused: "Confused", happy: "Happy" },
    readMore: "Read more",
    readLess: "Collapse",
    deleteEntry: "Delete",
    like: "Like", liked: "Liked",
    comment: "Comment", commentPh: "Write a comment…", send: "Send",
    follow: "Follow", following: "Following", unfollow: "Unfollow",
    followers: "followers", followingCount: "following",
    backToFeed: "Back to Feed",
    yourProfile: "Your Profile",
    publicBadge: "Public",
    noPostsYet: "No public reflections yet.",
    viewProfile: "View profile",
    musicTitle: "Background Music",
    musicDesc: "Turn on an original ambient mood to accompany your reflection.",
    musicComboNote: "You can turn on more than one mood at once to blend them.",
    musicOff: "Turn off all",
    presetRain: "Evening Rain",
    presetPiano: "Quiet Piano",
    presetGuitar: "Acoustic Guitar",
    presetBells: "Meditation Bells",
    presetStrings: "Warm Strings",
    presetFlute: "Soft Flute",
    presetCello: "Deep Cello",
    presetKalimba: "Cheerful Kalimba",
    presetHarp: "Shimmering Harp",
    presetOcean: "Ocean Waves",
    presetRiver: "River Stream",
    presetWind: "Gentle Wind",
    presetBirds: "Birdsong",
    presetCrickets: "Night Crickets",
    presetCampfire: "Campfire",
    descRain: "Calming rainfall, like a quiet, tender afternoon on the porch.",
    descPiano: "Soft, slow piano chords — warm and reflective.",
    descGuitar: "Warm acoustic guitar picking, like sitting alone with your strings.",
    descBells: "Occasional bell tones, like a quiet meditation room.",
    descStrings: "Long, sustained strings that create a spacious, tender feeling.",
    descFlute: "A flowing flute melody, light like a morning breeze.",
    descCello: "A deep, gently melancholic cello — grounding and calm.",
    descKalimba: "Gently playful kalimba tones, warm and widely loved.",
    descHarp: "Softly shimmering harp, spacious and peaceful.",
    descOcean: "Slow ocean waves, calming like standing at the shore.",
    descRiver: "A clear river stream, flowing gently over stones.",
    descWind: "A soft breeze drifting by, calming like standing on a hilltop.",
    descBirds: "Faint morning birdsong, a reminder of quiet mornings.",
    descCrickets: "Soft night crickets, like sitting on a porch at night.",
    descCampfire: "The warm crackle of a campfire, like gathering under the stars.",
    volumeLabel: "Volume",
    melodyLabel: "Melody",
    ambientLabel: "Nature Sound Effects",
    appearance: "Background Theme",
    sceneLabel: "Scenic Background",
    sceneNone: "Plain",
    sceneMountain: "Mountain Sunset",
    sceneSea: "Calm Sea",
    sceneForest: "Misty Forest",
    sceneNight: "Night Sky",
    sceneMeadow: "Meadow",
    fontLabel: "Text Style",
    fontOrganic: "Organic",
    fontElegant: "Elegant",
    fontHandwritten: "Handwritten",
    fontModern: "Modern",
    legalPrivacyLink: "Privacy Policy",
    legalTermsLink: "Terms of Service",
    legalPrivacyTitle: "Privacy Policy",
    legalTermsTitle: "Terms of Service",
    legalPrivacyBody: [
      "Last updated: August 2026",
      "Reflection is an independently-built personal journaling & reflection app. This page explains what data we store and how it's used.",
      "## Data we store",
      "When you sign up: email, username, display name, and profile photo (if using Google) or the data you fill in yourself during signup.\nWhen you write a reflection: reflection text, mood, title/topic (if filled in), and any photo/video you attach.\nSocial activity: likes, comments, who you follow, if you choose to publish a reflection to the Feed.",
      "## How data is used",
      "Data is used solely to run the app's features: showing your journal, showing posts on the Feed if you choose to make them public, and connecting you with other users via search/follow. We do not sell your data to third parties, and we do not show ads.",
      "## Private vs public reflections",
      "Reflections that are NOT checked with \"Publish to Feed\" can only be seen by you. Published reflections can be seen by other users with an account on this app.",
      "## Your controls",
      "You can delete a reflection at any time (both private and published ones — both are removed together). You can block or report other users through the feature available on their profile/posts.",
      "## Storage & security",
      "Data is stored using Supabase services (encrypted database & storage). Your password is never stored as plain text — the authentication system handles it securely.",
      "## Contact",
      "Questions about your data privacy? Contact the app's developer via GitHub: lilinputihangstan-rgb.",
    ],
    legalTermsBody: [
      "Last updated: August 2026",
      "By using Reflection, you agree to the following terms.",
      "## Fair use",
      "Reflection is built as a space for personal, healthy reflection and sharing. You agree not to post content containing hate speech, harassment, threats, explicit/adult content, or anything unlawful.",
      "## Your content",
      "You retain full ownership of the writing, photos, and videos you upload. By publishing to the Feed, you allow other users of this app to view that content.",
      "## Moderation",
      "We reserve the right to remove content or disable accounts that violate these terms, including based on reports from other users.",
      "## Age restriction",
      "This app is intended for users aged 13 and above.",
      "## No warranty",
      "This app is provided \"as is\", built and maintained independently without a guarantee of 100% uptime.",
      "## Changes to these terms",
      "These terms may change over time as the app evolves. Major changes will be communicated within the app.",
    ],
  },
};

const MUSIC_PRESETS = [
  { key: "rain", labelKey: "presetRain", descKey: "descRain", icon: "🌧️", category: "melody" },
  { key: "piano", labelKey: "presetPiano", descKey: "descPiano", icon: "🎹", category: "melody" },
  { key: "guitar", labelKey: "presetGuitar", descKey: "descGuitar", icon: "🎸", category: "melody" },
  { key: "strings", labelKey: "presetStrings", descKey: "descStrings", icon: "🎻", category: "melody" },
  { key: "cello", labelKey: "presetCello", descKey: "descCello", icon: "🎻", category: "melody" },
  { key: "flute", labelKey: "presetFlute", descKey: "descFlute", icon: "🪈", category: "melody" },
  { key: "kalimba", labelKey: "presetKalimba", descKey: "descKalimba", icon: "🎶", category: "melody" },
  { key: "harp", labelKey: "presetHarp", descKey: "descHarp", icon: "✨", category: "melody" },
  { key: "bells", labelKey: "presetBells", descKey: "descBells", icon: "🔔", category: "melody" },
  { key: "ocean", labelKey: "presetOcean", descKey: "descOcean", icon: "🌊", category: "ambient" },
  { key: "river", labelKey: "presetRiver", descKey: "descRiver", icon: "🏞️", category: "ambient" },
  { key: "wind", labelKey: "presetWind", descKey: "descWind", icon: "🍃", category: "ambient" },
  { key: "birds", labelKey: "presetBirds", descKey: "descBirds", icon: "🐦", category: "ambient" },
  { key: "crickets", labelKey: "presetCrickets", descKey: "descCrickets", icon: "🦗", category: "ambient" },
  { key: "campfire", labelKey: "presetCampfire", descKey: "descCampfire", icon: "🔥", category: "ambient" },
];

const PROMPTS = [
  { id: "p1", id_: "Apa satu hal kecil hari ini yang membuatmu bersyukur?", en: "What's one small thing today that you're grateful for?" },
  { id: "p2", id_: "Perasaan apa yang paling sering singgah hari ini, dan dari mana asalnya?", en: "What feeling visited you most today, and where did it come from?" },
  { id: "p3", id_: "Jika hari ini adalah sebuah bab, apa judulnya?", en: "If today were a chapter, what would its title be?" },
  { id: "p4", id_: "Apa yang sedang kamu coba maafkan — pada dirimu atau orang lain?", en: "What are you trying to forgive — in yourself or someone else?" },
  { id: "p5", id_: "Kapan terakhir kali kamu merasa benar-benar hadir?", en: "When did you last feel truly present?" },
  { id: "p6", id_: "Apa yang kamu takutkan, dan apa yang sebenarnya ia coba lindungi?", en: "What are you afraid of, and what is it actually trying to protect?" },
  { id: "p7", id_: "Satu keputusan kecil apa yang kamu ambil hari ini demi dirimu sendiri?", en: "What's one small decision you made today for yourself?" },
  { id: "p8", id_: "Jika versi dirimu setahun lalu melihatmu sekarang, apa yang akan ia katakan?", en: "If the version of you from a year ago saw you now, what would they say?" },
  { id: "p9", id_: "Apa yang terasa berat hari ini, dan apa yang bisa meringankannya sedikit saja?", en: "What felt heavy today, and what could lighten it, even slightly?" },
  { id: "p10", id_: "Apa yang ingin kamu ingat dari hari ini, sepuluh tahun dari sekarang?", en: "What do you want to remember about today, ten years from now?" },
];

const MOODS = [
  { key: "calm", color: "var(--moss)" },
  { key: "grateful", color: "var(--gold)" },
  { key: "heavy", color: "var(--ink-soft)" },
  { key: "confused", color: "var(--rose)" },
  { key: "happy", color: "var(--clay)" },
];

const TAGS = [
  { key: "kuliah", id_: "Kuliah", en: "Study" },
  { key: "keluarga", id_: "Keluarga", en: "Family" },
  { key: "kesehatan", id_: "Kesehatan", en: "Health" },
  { key: "uang", id_: "Uang", en: "Money" },
  { key: "hubungan", id_: "Hubungan", en: "Relationships" },
  { key: "kerja", id_: "Kerja/Karier", en: "Work/Career" },
  { key: "diri", id_: "Diri Sendiri", en: "Self" },
];

const AVATAR_EMOJIS = ["🌿", "🍂", "🌾", "🕯️", "🫖", "📖", "🌙", "☀️", "🍁", "🌻", "🪴", "🦋"];
const AVATAR_COLORS = ["#B5654A", "#6E7B58", "#C69447", "#C98A7C", "#8A6E52", "#7C8B6E"];

const THEMES = {
  hangat: {
    label_id: "Hangat", label_en: "Warm",
    paper: "#F3E9D8", paperCard: "#FBF5E9", ink: "#3B2F26", inkSoft: "#6B5A47",
    clay: "#B5654A", clayDark: "#9A5039", moss: "#6E7B58", gold: "#C69447", rose: "#C98A7C", line: "#DECEAE",
  },
  kabut: {
    label_id: "Kabut Pagi", label_en: "Morning Mist",
    paper: "#E7ECE8", paperCard: "#F4F7F4", ink: "#333F3A", inkSoft: "#66766E",
    clay: "#7C9885", clayDark: "#5E7A68", moss: "#5E7A68", gold: "#A8B79A", rose: "#9FB3AE", line: "#D6E0D9",
  },
  malam: {
    label_id: "Malam Tenang", label_en: "Calm Night",
    paper: "#242B2F", paperCard: "#2D373C", ink: "#E7E1D4", inkSoft: "#B4AA9B",
    clay: "#C98A7C", clayDark: "#B3705F", moss: "#8CA48F", gold: "#CBA845", rose: "#C98A7C", line: "#3B4650",
  },
  pasir: {
    label_id: "Pasir Pantai", label_en: "Sandy Beach",
    paper: "#F1E7D6", paperCard: "#FAF3E6", ink: "#3E3226", inkSoft: "#7A6A54",
    clay: "#C48B5D", clayDark: "#A66F45", moss: "#7E9E9A", gold: "#D9B26F", rose: "#D9A79C", line: "#E3D3B8",
  },
  hutan: {
    label_id: "Hutan Tenang", label_en: "Forest Calm",
    paper: "#E8ECDF", paperCard: "#F5F7EE", ink: "#333B29", inkSoft: "#68715A",
    clay: "#8A9A5B", clayDark: "#6D7C43", moss: "#5F7A4E", gold: "#B9A05A", rose: "#A9B98F", line: "#D7DEC4",
  },
};

const SCENES = [
  { key: "none", icon: "⚪", labelKey: "sceneNone" },
  { key: "gunung", icon: "🏔️", labelKey: "sceneMountain" },
  { key: "laut", icon: "🌊", labelKey: "sceneSea" },
  { key: "hutan", icon: "🌲", labelKey: "sceneForest" },
  { key: "malam", icon: "🌌", labelKey: "sceneNight" },
  { key: "padang", icon: "🌾", labelKey: "sceneMeadow" },
];

const FONT_OPTIONS = [
  { key: "organik", family: "'Fraunces', serif", google: "Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600", labelKey: "fontOrganic" },
  { key: "elegan", family: "'Playfair Display', serif", google: "Playfair+Display:wght@500;600;700", labelKey: "fontElegant" },
  { key: "tangan", family: "'Caveat', cursive", google: "Caveat:wght@500;600;700", labelKey: "fontHandwritten" },
  { key: "modern", family: "'Space Grotesk', sans-serif", google: "Space+Grotesk:wght@500;600;700", labelKey: "fontModern" },
];


function SceneBackground({ sceneKey }) {
  if (sceneKey === "none") return null;
  const common = { preserveAspectRatio: "xMidYMid slice", style: { position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -2 } };
  if (sceneKey === "gunung") {
    return (
      <svg viewBox="0 0 800 500" {...common}>
        <defs><linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E9C9B6" /><stop offset="100%" stopColor="#F3DFC9" /></linearGradient></defs>
        <rect width="800" height="500" fill="url(#skyG)" />
        <circle cx="620" cy="250" r="46" fill="#E8B36B" opacity="0.55" />
        <path d="M0,330 L150,210 L280,310 L400,190 L550,300 L650,230 L800,330 L800,500 L0,500 Z" fill="#B98F86" opacity="0.45" />
        <path d="M0,390 L200,270 L350,370 L500,250 L680,360 L800,290 L800,500 L0,500 Z" fill="#8F6459" opacity="0.55" />
      </svg>
    );
  }
  if (sceneKey === "laut") {
    return (
      <svg viewBox="0 0 800 500" {...common}>
        <defs><linearGradient id="skyG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#CFE0E4" /><stop offset="100%" stopColor="#F1E4CE" /></linearGradient></defs>
        <rect width="800" height="280" fill="url(#skyG2)" />
        <circle cx="400" cy="230" r="40" fill="#F0D9A8" opacity="0.6" />
        <rect y="280" width="800" height="220" fill="#7C9FA0" opacity="0.5" />
        <path d="M0,300 Q100,290 200,300 T400,300 T600,300 T800,300" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.25" />
        <path d="M0,340 Q100,330 200,340 T400,340 T600,340 T800,340" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.2" />
      </svg>
    );
  }
  if (sceneKey === "hutan") {
    return (
      <svg viewBox="0 0 800 500" {...common}>
        <defs><linearGradient id="skyG3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#DCE3D6" /><stop offset="100%" stopColor="#EEF1E7" /></linearGradient></defs>
        <rect width="800" height="500" fill="url(#skyG3)" />
        {[0, 1, 2].map((row) => (
          <g key={row} opacity={0.3 + row * 0.22}>
            {[...Array(7)].map((_, i) => {
              const x = i * 130 - row * 40 + (row % 2) * 60;
              const y = 200 + row * 90;
              return <polygon key={i} points={`${x},${y + 90} ${x + 45},${y} ${x + 90},${y + 90}`} fill="#5F7A5E" />;
            })}
          </g>
        ))}
      </svg>
    );
  }
  if (sceneKey === "malam") {
    return (
      <svg viewBox="0 0 800 500" {...common}>
        <defs><linearGradient id="skyG4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1E2530" /><stop offset="100%" stopColor="#333F4A" /></linearGradient></defs>
        <rect width="800" height="500" fill="url(#skyG4)" />
        <circle cx="640" cy="120" r="34" fill="#EADFB0" opacity="0.7" />
        <circle cx="628" cy="112" r="30" fill="#1E2530" opacity="0.85" />
        {[...Array(40)].map((_, i) => {
          const sx = seeded(i * 3.7) * 800;
          const sy = seeded(i * 9.1) * 250;
          const r = 1 + seeded(i * 5.3) * 1.6;
          return <circle key={i} cx={sx} cy={sy} r={r} fill="#F4EEDB" opacity={0.3 + seeded(i * 2.1) * 0.5} />;
        })}
        <path d="M0,400 L200,340 L400,410 L600,350 L800,400 L800,500 L0,500 Z" fill="#161C24" opacity="0.7" />
      </svg>
    );
  }
  if (sceneKey === "padang") {
    return (
      <svg viewBox="0 0 800 500" {...common}>
        <defs><linearGradient id="skyG5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F1E9CE" /><stop offset="100%" stopColor="#EDEFD9" /></linearGradient></defs>
        <rect width="800" height="500" fill="url(#skyG5)" />
        <path d="M0,340 Q200,300 400,335 T800,320 L800,500 L0,500 Z" fill="#B9C48F" opacity="0.55" />
        <path d="M0,390 Q220,360 420,385 T800,370 L800,500 L0,500 Z" fill="#95A66A" opacity="0.55" />
        {[...Array(18)].map((_, i) => {
          const fx = seeded(i * 4.4) * 800;
          const fy = 400 + seeded(i * 8.8) * 80;
          return <circle key={i} cx={fx} cy={fy} r={3.5} fill="#D9A76F" opacity="0.7" />;
        })}
      </svg>
    );
  }
  return null;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function mapAuthError(message = "", t) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return t.authErrInvalid;
  if (m.includes("already registered") || m.includes("already exists") || m.includes("user already"))
    return t.authErrExists;
  if (m.includes("email not confirmed")) return t.authErrNotConfirmed;
  if (m.includes("password") && m.includes("least")) return t.authPasswordTooShort;
  if (m.includes("rate limit")) return t.authErrRateLimit;
  return message || t.authErrGeneric;
}
function dayOfYear(d) {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / 86400000);
}
function formatDate(ts, lang) {
  return new Date(ts).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { day: "numeric", month: "long", year: "numeric" });
}
function timeAgo(ts, lang) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return lang === "id" ? "baru saja" : "just now";
  if (mins < 60) return `${mins}${lang === "id" ? "mnt" : "m"}`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}${lang === "id" ? "jam" : "h"}`;
  return `${Math.floor(hrs / 24)}${lang === "id" ? "hr" : "d"}`;
}
function computeStreak(entries) {
  if (!entries.length) return 0;
  const days = new Set(entries.map((e) => new Date(e.ts).toDateString()));
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
function seeded(i) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function mapProfileRow(row) {
  if (!row) return null;
  return {
    userId: row.id,
    username: row.username,
    displayName: row.display_name,
    status: row.status || "",
    bio: row.bio || "",
    avatarEmoji: row.avatar_emoji,
    avatarColor: row.avatar_color,
    createdAt: row.created_at,
  };
}
function mapEntryRow(row) {
  return {
    id: row.id,
    ts: new Date(row.ts).getTime(),
    mood: row.mood,
    moodIntensity: row.mood_intensity || 3,
    tags: row.tags || [],
    text: row.text,
    title: row.title || "",
    mediaUrl: row.media_url || null,
    mediaType: row.media_type || null,
    promptId: row.prompt_id,
    isPublic: row.is_public,
  };
}
function mapPostRow(row, likes = [], comments = []) {
  return {
    id: row.id,
    userId: row.user_id,
    entryId: row.entry_id || null,
    ts: new Date(row.ts).getTime(),
    mood: row.mood,
    moodIntensity: row.mood_intensity || 3,
    tags: row.tags || [],
    text: row.text,
    title: row.title || "",
    mediaUrl: row.media_url || null,
    mediaType: row.media_type || null,
    likes,
    comments,
  };
}
function sameDay(ts, date) {
  const d = new Date(ts);
  return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate();
}
async function translateChunk(text, target, source) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("translate_failed");
  const data = await res.json();
  const out = data?.responseData?.translatedText;
  if (!out || String(out).toUpperCase().includes("MYMEMORY WARNING")) throw new Error("translate_failed");
  return out;
}
async function translateLongText(text, target, source) {
  if (!text) return "";
  if (text.length <= 480) return translateChunk(text, target, source);
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let cur = "";
  for (const s of sentences) {
    if ((cur + " " + s).trim().length > 450) {
      if (cur) chunks.push(cur.trim());
      cur = s;
    } else {
      cur = (cur + " " + s).trim();
    }
  }
  if (cur) chunks.push(cur);
  const results = [];
  for (const c of chunks) results.push(await translateChunk(c, target, source));
  return results.join(" ");
}
function MediaBlock({ url, type, alt = "" }) {
  if (!url) return null;
  return (
    <div style={{ marginTop: 10, marginBottom: 10, borderRadius: 12, overflow: "hidden", border: "1px solid var(--line)" }}>
      {type === "video" ? (
        <video src={url} controls style={{ width: "100%", display: "block", maxHeight: 420, background: "#000" }} />
      ) : (
        <img src={url} alt={alt} style={{ width: "100%", display: "block", maxHeight: 420, objectFit: "cover" }} />
      )}
    </div>
  );
}
function IntensityDots({ value = 3, color = "var(--clay)" }) {
  return (
    <span style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i <= value ? color : "var(--line)", display: "inline-block" }} />
      ))}
    </span>
  );
}
function startOfWeek(d) {
  const dt = new Date(d);
  const day = dt.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // Monday as start
  dt.setDate(dt.getDate() + diff);
  dt.setHours(0, 0, 0, 0);
  return dt;
}
function weeklySummary(entries) {
  const weekStart = startOfWeek(new Date()).getTime();
  const weekEntries = entries.filter((e) => e.ts >= weekStart);
  const moodCounts = {};
  const tagCounts = {};
  let intensitySum = 0;
  weekEntries.forEach((e) => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    intensitySum += e.moodIntensity || 3;
    (e.tags || []).forEach((tg) => { tagCounts[tg] = (tagCounts[tg] || 0) + 1; });
  });
  let dominantMood = null, maxCount = 0;
  Object.entries(moodCounts).forEach(([k, v]) => { if (v > maxCount) { maxCount = v; dominantMood = k; } });
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  return {
    count: weekEntries.length,
    dominantMood,
    avgIntensity: weekEntries.length ? (intensitySum / weekEntries.length).toFixed(1) : null,
    topTags,
  };
}
function MiniCalendar({ entries, viewMonth, onChangeMonth, selectedDate, onSelectDate, lang }) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const entryDays = useMemo(() => {
    const s = new Set();
    entries.forEach((e) => {
      const d = new Date(e.ts);
      if (d.getFullYear() === year && d.getMonth() === month) s.add(d.getDate());
    });
    return s;
  }, [entries, year, month]);
  const monthLabel = viewMonth.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { month: "long", year: "numeric" });
  const weekdayLabels = lang === "id" ? ["M", "S", "S", "R", "K", "J", "S"] : ["S", "M", "T", "W", "T", "F", "S"];
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const today = new Date();

  return (
    <div className="rf-card" style={{ padding: 14, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={() => onChangeMonth(new Date(year, month - 1, 1))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--ink-soft)", padding: "2px 8px" }}>‹</button>
        <span style={{ fontWeight: 600, fontSize: 13, textTransform: "capitalize" }}>{monthLabel}</span>
        <button onClick={() => onChangeMonth(new Date(year, month + 1, 1))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--ink-soft)", padding: "2px 8px" }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, fontSize: 11, color: "var(--ink-soft)", marginBottom: 4, textAlign: "center" }}>
        {weekdayLabels.map((w, i) => <span key={i}>{w}</span>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((d, i) => {
          if (d === null) return <span key={i} />;
          const cellDate = new Date(year, month, d);
          const isSelected = selectedDate && sameDay(selectedDate.getTime(), cellDate);
          const hasEntry = entryDays.has(d);
          const isToday = sameDay(today.getTime(), cellDate);
          return (
            <button
              key={i}
              onClick={() => onSelectDate(isSelected ? null : cellDate)}
              style={{
                position: "relative", padding: "6px 0", borderRadius: 8,
                border: isToday && !isSelected ? "1px solid var(--clay)" : "1px solid transparent",
                background: isSelected ? "var(--clay)" : "transparent",
                color: isSelected ? "var(--paper)" : "var(--ink)",
                fontSize: 12, cursor: "pointer",
              }}
            >
              {d}
              {hasEntry && !isSelected && <span style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "var(--clay)" }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LegalModal({ page, onClose, t, lang }) {
  if (!page) return null;
  const content = page === "privacy" ? t.legalPrivacyBody : t.legalTermsBody;
  const title = page === "privacy" ? t.legalPrivacyTitle : t.legalTermsTitle;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(10,14,23,0.72)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rf-card"
        style={{ maxWidth: 560, width: "100%", maxHeight: "80vh", overflowY: "auto", padding: 26, position: "relative" }}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--ink-soft)" }}>✕</button>
        <h2 className="rf-display" style={{ fontSize: 22, marginTop: 0, marginBottom: 14, color: "var(--clay-dark)" }}>{title}</h2>
        {content.map((para, i) => (
          para.startsWith("## ") ? (
            <h3 key={i} style={{ fontSize: 15, fontWeight: 700, marginTop: 18, marginBottom: 6 }}>{para.slice(3)}</h3>
          ) : (
            <p key={i} style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink)", marginBottom: 10, whiteSpace: "pre-wrap" }}>{para}</p>
          )
        ))}
      </div>
    </div>
  );
}

function ReportModal({ open, onClose, reason, setReason, onSubmit, sending, done, t }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(10,14,23,0.72)", zIndex: 210, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="rf-card" style={{ maxWidth: 420, width: "100%", padding: 24 }}>
        {!done ? (
          <>
            <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700 }}>{t.reportTitle}</h3>
            <p style={{ margin: "0 0 14px", fontSize: 13.5, color: "var(--ink-soft)" }}>{t.reportSubtitle}</p>
            <textarea
              className="rf-textarea"
              style={{ minHeight: 90 }}
              placeholder={t.reportPlaceholder}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
              <button onClick={onClose} className="rf-btn" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--ink-soft)", padding: "9px 16px", fontSize: 13.5 }}>{t.reportCancel}</button>
              <button onClick={onSubmit} disabled={sending} className="rf-btn" style={{ background: "var(--clay)", color: "var(--paper)", padding: "9px 18px", fontSize: 13.5, opacity: sending ? 0.7 : 1 }}>
                {sending ? t.reportSubmitBtnLoading : t.reportSubmitBtn}
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700 }}>{t.reportSentTitle}</h3>
            <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--ink-soft)" }}>{t.reportSentBody}</p>
            <button onClick={onClose} className="rf-btn" style={{ background: "var(--clay)", color: "var(--paper)", padding: "9px 18px", fontSize: 13.5 }}>{t.reportClose}</button>
          </>
        )}
      </div>
    </div>
  );
}

function Avatar({ profile, size = 40 }) {
  if (!profile) return <span style={{ width: size, height: size, borderRadius: "50%", background: "var(--line)", display: "inline-block" }} />;
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: profile.avatarColor || "var(--clay)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        flexShrink: 0,
      }}
    >
      {profile.avatarEmoji || "🌿"}
    </span>
  );
}

function ReflectionTree({ entries }) {
  const leaves = entries.slice(0, 60);
  const branches = [
    "M200 380 C 200 320, 150 300, 120 250", "M200 380 C 200 320, 250 300, 280 250",
    "M200 380 C 200 300, 200 260, 200 200", "M200 320 C 190 280, 140 260, 100 220",
    "M200 320 C 210 280, 260 260, 300 220", "M200 250 C 195 210, 160 190, 130 160",
    "M200 250 C 205 210, 240 190, 270 160",
  ];
  const anchors = [[120, 250], [280, 250], [200, 200], [100, 220], [300, 220], [130, 160], [270, 160]];
  const leafPoints = [];
  branches.forEach((_, bi) => {
    const count = Math.max(2, Math.floor(leaves.length / branches.length) + 1);
    for (let i = 0; i < count; i++) leafPoints.push({ branch: bi });
  });
  return (
    <svg viewBox="0 0 400 400" style={{ width: "100%", maxWidth: 300, display: "block", margin: "0 auto" }}>
      <path d="M200 400 L200 340" stroke="var(--ink-soft)" strokeWidth="10" strokeLinecap="round" fill="none" />
      {branches.map((d, i) => (
        <path key={i} d={d} stroke="var(--ink-soft)" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85" />
      ))}
      {leafPoints.slice(0, leaves.length).map((lp, i) => {
        const entry = leaves[i];
        const mood = MOODS.find((m) => m.key === entry.mood) || MOODS[0];
        const [ax, ay] = anchors[lp.branch];
        const jx = (seeded(i * 3.1) - 0.5) * 46;
        const jy = (seeded(i * 7.7) - 0.5) * 46;
        return <circle key={entry.id} cx={ax + jx} cy={ay + jy - 10} r={7 + seeded(i * 5.5) * 3} fill={mood.color} opacity="0.9" />;
      })}
    </svg>
  );
}

const GlobalStyle = ({ theme, fontFamily }) => (
  <style>{`
    :root {
      --paper: ${theme.paper}; --paper-card: ${theme.paperCard}; --ink: ${theme.ink}; --ink-soft: ${theme.inkSoft};
      --clay: ${theme.clay}; --clay-dark: ${theme.clayDark}; --moss: ${theme.moss}; --gold: ${theme.gold};
      --rose: ${theme.rose}; --line: ${theme.line}; --font-display: ${fontFamily};
    }
    * { box-sizing: border-box; }
    body, .rf-root { transition: background 0.5s ease, color 0.5s ease; }
    .rf-display { font-family: var(--font-display); }
    .rf-mono { font-family: 'IBM Plex Mono', monospace; }
    .rf-btn { font-family: 'Work Sans', sans-serif; font-weight: 600; border: none; border-radius: 999px; cursor: pointer; transition: transform 0.15s ease; }
    .rf-btn:hover { transform: translateY(-1px); }
    .rf-btn:disabled { opacity: 0.5; cursor: default; transform: none; }
    .rf-btn:focus-visible, input:focus-visible, textarea:focus-visible, .rf-tab:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }
    .rf-tab { font-family: 'Work Sans', sans-serif; font-weight: 500; background: none; border: none; cursor: pointer; padding: 8px 4px; border-bottom: 2px solid transparent; color: var(--ink-soft); }
    .rf-tab.active { color: var(--clay-dark); border-bottom-color: var(--clay); }
    .rf-card { background: var(--paper-card); border-radius: 4px 16px 4px 16px; box-shadow: 0 1px 0 var(--line), 0 6px 18px -12px rgba(59,47,38,0.35); border: 1px solid var(--line); }
    .rf-input, textarea.rf-textarea { width: 100%; font-family: 'Work Sans', sans-serif; font-size: 15px; padding: 12px 14px; border-radius: 10px; border: 1px solid var(--line); background: var(--paper-card); color: var(--ink); }
    textarea.rf-textarea { line-height: 1.6; resize: vertical; min-height: 130px; border-radius: 4px 16px 4px 16px; padding: 16px; }
    .rf-icon-btn { background: none; border: none; cursor: pointer; color: var(--ink-soft); font-size: 13px; display: flex; align-items: center; gap: 5px; padding: 4px 6px; border-radius: 8px; }
    .rf-icon-btn:hover { background: var(--paper); }
    .rf-auth-input::placeholder { color: rgba(229,231,235,0.4); }
    .rf-auth-input:focus { outline: 2px solid rgba(229,193,181,0.5); outline-offset: 1px; }
    @media (prefers-reduced-motion: reduce) { .rf-btn { transition: none; } }
  `}</style>
);

function Onboarding({ t, lang, onCreate }) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState("");
  const [bio, setBio] = useState("");
  const [emoji, setEmoji] = useState(AVATAR_EMOJIS[0]);
  const [color, setColor] = useState(AVATAR_COLORS[0]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    const err = await onCreate({ username: username.trim(), displayName: displayName.trim(), status: status.trim(), bio: bio.trim(), avatarEmoji: emoji, avatarColor: color });
    setSubmitting(false);
    if (err) setError(err);
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px" }}>
      <h1 className="rf-display" style={{ fontSize: 30, color: "var(--clay-dark)", marginBottom: 4 }}>{t.onboardTitle}</h1>
      <p style={{ color: "var(--ink-soft)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>{t.onboardDesc}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 13, color: "var(--ink-soft)", display: "block", marginBottom: 5 }}>{t.username}</label>
          <input className="rf-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t.usernamePh} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: "var(--ink-soft)", display: "block", marginBottom: 5 }}>{t.displayName}</label>
          <input className="rf-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={t.displayNamePh} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: "var(--ink-soft)", display: "block", marginBottom: 5 }}>{t.status}</label>
          <input className="rf-input" value={status} onChange={(e) => setStatus(e.target.value)} placeholder={t.statusPh} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: "var(--ink-soft)", display: "block", marginBottom: 5 }}>{t.bio}</label>
          <textarea className="rf-textarea" style={{ minHeight: 70 }} value={bio} onChange={(e) => setBio(e.target.value)} placeholder={t.bioPh} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: "var(--ink-soft)", display: "block", marginBottom: 8 }}>{t.chooseAvatar}</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {AVATAR_EMOJIS.map((em) => (
              <button key={em} onClick={() => setEmoji(em)} style={{ width: 38, height: 38, borderRadius: "50%", border: emoji === em ? "2px solid var(--clay)" : "1px solid var(--line)", background: "var(--paper-card)", fontSize: 18, cursor: "pointer" }}>{em}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {AVATAR_COLORS.map((c) => (
              <button key={c} onClick={() => setColor(c)} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: color === c ? "3px solid var(--ink)" : "3px solid transparent", cursor: "pointer" }} />
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <Avatar profile={{ avatarEmoji: emoji, avatarColor: color }} size={56} />
          </div>
        </div>

        {error && <p style={{ color: "var(--clay-dark)", fontSize: 13, margin: 0 }}>{error}</p>}
        <button
          className="rf-btn"
          disabled={!username.trim() || !displayName.trim() || submitting}
          onClick={handleSubmit}
          style={{ background: "var(--clay)", color: "var(--paper)", padding: "13px 26px", fontSize: 15, marginTop: 6 }}
        >
          {t.createProfile}
        </button>
        <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 4 }}>{t.googleNote}</p>
      </div>
    </div>
  );
}

export default function Reflection() {
  const [lang, setLang] = useState("id");
  const t = T[lang];
  const [tab, setTab] = useState("feed");
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState(null);
  const account = useMemo(() => (session ? { userId: session.user.id } : null), [session]); // derived, keeps rest of the app unchanged
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup" | "forgot"
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [resetSaving, setResetSaving] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetDone, setResetDone] = useState(false);
  const [myProfile, setMyProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState("calm");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [moodIntensity, setMoodIntensity] = useState(3);
  const [selectedTags, setSelectedTags] = useState([]);
  const [journalQuery, setJournalQuery] = useState("");
  const [tagFilter, setTagFilter] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // "image" | "video" | null
  const [mediaError, setMediaError] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [publish, setPublish] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d; });
  const [selectedDate, setSelectedDate] = useState(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState(null);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deleteAccountConfirmText, setDeleteAccountConfirmText] = useState("");
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState("");
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [translations, setTranslations] = useState({});
  const [legalPage, setLegalPage] = useState(null); // "privacy" | "terms" | null
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [saveState, setSaveState] = useState("idle");
  const [saveError, setSaveError] = useState("");
  const [feed, setFeed] = useState([]);
  const [blockedIds, setBlockedIds] = useState([]);
  const [reportModal, setReportModal] = useState(null); // { postId, userId } | null
  const [reportReason, setReportReason] = useState("");
  const [reportSending, setReportSending] = useState(false);
  const [reportDone, setReportDone] = useState(false);
  const [openMenuPostId, setOpenMenuPostId] = useState(null);
  const [feedLoading, setFeedLoading] = useState(false);
  const [profileCache, setProfileCache] = useState({});
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [viewingUserId, setViewingUserId] = useState(null); // null = own profile
  const [viewedProfile, setViewedProfile] = useState(null);
  const [viewedPosts, setViewedPosts] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followerCount, setFollowerCount] = useState(null);
  const [activePresets, setActivePresets] = useState([]);
  const [volume, setVolume] = useState(0.35);
  const [themeKey, setThemeKey] = useState("hangat");
  const [sceneKey, setSceneKey] = useState("none");
  const [fontKey, setFontKey] = useState("organik");
  const [showThemePicker, setShowThemePicker] = useState(false);
  const loadedFontsRef = useRef(new Set());
  const toneRef = useRef({ master: null, presets: {} });

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    loadedFontsRef.current.add("base");
  }, []);

  useEffect(() => {
    const opt = FONT_OPTIONS.find((f) => f.key === fontKey);
    if (!opt || loadedFontsRef.current.has(opt.key)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${opt.google}&display=swap`;
    document.head.appendChild(link);
    loadedFontsRef.current.add(opt.key);
  }, [fontKey]);

  useEffect(() => {
    setPromptIndex(dayOfYear(new Date()) % PROMPTS.length);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("reflection-theme") || "null");
      if (saved?.key && THEMES[saved.key]) setThemeKey(saved.key);
      if (saved?.scene && SCENES.some((s) => s.key === saved.scene)) setSceneKey(saved.scene);
      if (saved?.font && FONT_OPTIONS.some((f) => f.key === saved.font)) setFontKey(saved.font);
    } catch (e) {
      /* no saved appearance yet */
    }
  }, []);

  const persistAppearance = (patch) => {
    try {
      localStorage.setItem(
        "reflection-theme",
        JSON.stringify({ key: patch.key ?? themeKey, scene: patch.scene ?? sceneKey, font: patch.font ?? fontKey })
      );
    } catch (e) {
      /* ignore */
    }
  };

  const chooseTheme = (key) => { setThemeKey(key); persistAppearance({ key }); };
  const chooseScene = (key) => { setSceneKey(key); persistAppearance({ scene: key }); };
  const chooseFont = (key) => { setFontKey(key); persistAppearance({ font: key }); };

  // load session + profile + journal + follows
  useEffect(() => {
    let mounted = true;

    const loadUserData = async (userId) => {
      const { data: profRow } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (mounted) setMyProfile(mapProfileRow(profRow));
      const { data: entryRows } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", userId)
        .order("ts", { ascending: false });
      if (mounted) setEntries((entryRows || []).map(mapEntryRow));
      const { data: followRows } = await supabase.from("follows").select("following_id").eq("follower_id", userId);
      if (mounted) setFollowingList((followRows || []).map((r) => r.following_id));
      const { data: blockRows } = await supabase.from("blocks").select("blocked_id").eq("blocker_id", userId);
      if (mounted) setBlockedIds((blockRows || []).map((r) => r.blocked_id));
    };

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (mounted) setSession(s);
      if (s) await loadUserData(s.user.id);
      if (mounted) setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
      setSession(s);
      if (s) {
        await loadUserData(s.user.id);
      } else {
        setMyProfile(null);
        setEntries([]);
        setFollowingList([]);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const handleEmailAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthNotice("");
    if (!authEmail || !authPassword) {
      setAuthError(t.authFillBoth);
      return;
    }
    if (authPassword.length < 6) {
      setAuthError(t.authPasswordTooShort);
      return;
    }
    setAuthLoading(true);
    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword,
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword,
        });
        if (error) throw error;
        // If email confirmation is required, there will be no active session yet.
        if (data?.user && !data?.session) {
          setAuthNotice(t.authCheckEmail);
          setAuthPassword("");
        }
      }
    } catch (err) {
      setAuthError(mapAuthError(err?.message, t));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthNotice("");
    if (!authEmail.trim()) {
      setAuthError(t.authEmailRequired);
      return;
    }
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(authEmail.trim(), {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setAuthNotice(t.authResetSent);
    } catch (err) {
      setAuthError(mapAuthError(err?.message, t));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    if (newPassword.length < 6) {
      setResetError(t.authPasswordTooShort);
      return;
    }
    if (newPassword !== newPassword2) {
      setResetError(t.resetMismatch);
      return;
    }
    setResetSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setResetDone(true);
      setNewPassword(""); setNewPassword2("");
    } catch (err) {
      setResetError(mapAuthError(err?.message, t));
    } finally {
      setResetSaving(false);
    }
  };

  const createAccount = async (profileData) => {
    if (!session) return "Sesi tidak ditemukan, coba masuk ulang.";
    const row = {
      id: session.user.id,
      username: profileData.username,
      display_name: profileData.displayName,
      status: profileData.status,
      bio: profileData.bio,
      avatar_emoji: profileData.avatarEmoji,
      avatar_color: profileData.avatarColor,
    };
    const { data, error } = await supabase.from("profiles").insert(row).select().maybeSingle();
    if (!error && data) {
      setMyProfile(mapProfileRow(data));
      setEntries([]);
      setFollowingList([]);
      return null;
    }
    if (error?.code === "23505") {
      return lang === "id" ? "Username ini sudah dipakai, coba yang lain." : "That username is already taken, try another.";
    }
    return lang === "id" ? "Gagal membuat profil, coba lagi." : "Failed to create profile, please try again.";
  };

  const getProfile = useCallback(
    async (userId) => {
      if (profileCache[userId]) return profileCache[userId];
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      const p = mapProfileRow(data);
      setProfileCache((c) => ({ ...c, [userId]: p }));
      return p;
    },
    [profileCache]
  );

  const loadFeed = useCallback(async () => {
    setFeedLoading(true);
    try {
      const { data: postRows } = await supabase.from("posts").select("*").order("ts", { ascending: false }).limit(30);
      const rows = postRows || [];
      const postIds = rows.map((r) => r.id);
      const likesByPost = {};
      const commentsByPost = {};
      if (postIds.length) {
        const { data: likeRows } = await supabase.from("post_likes").select("post_id, user_id").in("post_id", postIds);
        (likeRows || []).forEach((l) => {
          likesByPost[l.post_id] = likesByPost[l.post_id] || [];
          likesByPost[l.post_id].push(l.user_id);
        });
        const { data: commentRows } = await supabase
          .from("post_comments")
          .select("*")
          .in("post_id", postIds)
          .order("ts", { ascending: true });
        (commentRows || []).forEach((c) => {
          commentsByPost[c.post_id] = commentsByPost[c.post_id] || [];
          commentsByPost[c.post_id].push({ userId: c.user_id, username: c.username, text: c.text, ts: new Date(c.ts).getTime() });
        });
      }
      const posts = rows.map((r) => mapPostRow(r, likesByPost[r.id] || [], commentsByPost[r.id] || []));
      setFeed(posts.filter((p) => !blockedIds.includes(p.userId)));
      const uniqueAuthors = [...new Set(posts.map((p) => p.userId))];
      if (uniqueAuthors.length) {
        const { data: authorRows } = await supabase.from("profiles").select("*").in("id", uniqueAuthors);
        const newCacheEntries = {};
        (authorRows || []).forEach((row) => { newCacheEntries[row.id] = mapProfileRow(row); });
        setProfileCache((c) => ({ ...c, ...newCacheEntries }));
      }
    } catch (e) {
      setFeed([]);
    } finally {
      setFeedLoading(false);
    }
  }, [blockedIds]);

  useEffect(() => {
    if (tab === "feed" && account) loadFeed();
  }, [tab, account, loadFeed]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) { setSearchResults([]); setSearchLoading(false); return; }
    setSearchLoading(true);
    const handle = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
          .limit(20);
        if (error) throw error;
        setSearchResults((data || []).map(mapProfileRow).filter((p) => !blockedIds.includes(p.userId)));
      } catch (e) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [searchQuery, blockedIds]);

  // Autosave draft: restore once when the account is known, then keep saving as the person types.
  useEffect(() => {
    if (!account) return;
    try {
      if (localStorage.getItem(`reflection_onboarding_dismissed_${account.userId}`) === "1") {
        setOnboardingDismissed(true);
      }
    } catch (e) {}
  }, [account?.userId]);

  const dismissOnboarding = () => {
    setOnboardingDismissed(true);
    if (!account) return;
    try { localStorage.setItem(`reflection_onboarding_dismissed_${account.userId}`, "1"); } catch (e) {}
  };

  useEffect(() => {
    if (!account) return;
    try {
      const raw = localStorage.getItem(`reflection_draft_${account.userId}`);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft && (draft.text || draft.title)) {
          setText(draft.text || "");
          setTitle(draft.title || "");
          if (draft.mood) setMood(draft.mood);
          if (typeof draft.publish === "boolean") setPublish(draft.publish);
          setDraftRestored(true);
        }
      }
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.userId]);

  useEffect(() => {
    if (!account) return;
    const handle = setTimeout(() => {
      try {
        if (text.trim() || title.trim()) {
          localStorage.setItem(
            `reflection_draft_${account.userId}`,
            JSON.stringify({ text, title, mood, publish, savedAt: Date.now() })
          );
          setDraftSavedAt(Date.now());
        } else {
          localStorage.removeItem(`reflection_draft_${account.userId}`);
          setDraftSavedAt(null);
        }
      } catch (e) {}
    }, 600);
    return () => clearTimeout(handle);
  }, [text, title, mood, publish, account]);

  const clearDraft = () => {
    if (!account) return;
    try { localStorage.removeItem(`reflection_draft_${account.userId}`); } catch (e) {}
    setDraftSavedAt(null);
    setDraftRestored(false);
  };

  const currentPrompt = PROMPTS[promptIndex];
  const streak = useMemo(() => computeStreak(entries), [entries]);
  const thisWeekCount = useMemo(() => entries.filter((e) => e.ts >= Date.now() - 7 * 86400000).length, [entries]);
  const moodCounts = useMemo(() => {
    const c = {}; MOODS.forEach((m) => (c[m.key] = 0));
    entries.forEach((e) => { if (c[e.mood] !== undefined) c[e.mood] += 1; });
    return c;
  }, [entries]);
  const maxMoodCount = Math.max(1, ...Object.values(moodCounts));

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaError("");
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      setMediaError(t.mediaUnsupported);
      e.target.value = "";
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setMediaError(t.mediaTooLarge);
      e.target.value = "";
      return;
    }
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaFile(file);
    setMediaType(isImage ? "image" : "video");
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setMediaError("");
  };

  const handleTranslate = async (key, titleText, bodyText) => {
    const existing = translations[key];
    if (existing && existing.text) {
      setTranslations((prev) => ({ ...prev, [key]: { ...prev[key], showing: !prev[key].showing } }));
      return;
    }
    setTranslations((prev) => ({ ...prev, [key]: { loading: true, showing: true } }));
    const target = lang;
    const source = target === "en" ? "id" : "en";
    try {
      const tText = await translateLongText(bodyText, target, source);
      const tTitle = titleText ? await translateLongText(titleText, target, source) : "";
      setTranslations((prev) => ({ ...prev, [key]: { text: tText, title: tTitle, showing: true, loading: false } }));
    } catch (e) {
      setTranslations((prev) => ({ ...prev, [key]: { loading: false, showing: false, error: true } }));
    }
  };

  const handleSave = async () => {
    if (!text.trim() || !account) return;
    setSaveState("saving");
    setSaveError("");
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setSaveState("idle");
      setSaveError(t.errorOffline);
      return;
    }
    try {
      let mediaUrl = null;
      let mType = null;
      if (mediaFile) {
        setUploadingMedia(true);
        const safeName = mediaFile.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
        const path = `${account.userId}/${uid()}-${safeName}`;
        const { error: upErr } = await supabase.storage.from("reflection-media").upload(path, mediaFile);
        if (upErr) throw Object.assign(upErr, { stage: "media" });
        const { data: pub } = supabase.storage.from("reflection-media").getPublicUrl(path);
        mediaUrl = pub?.publicUrl || null;
        mType = mediaType;
        setUploadingMedia(false);
      }
      const { data: inserted, error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: account.userId,
          mood,
          mood_intensity: moodIntensity,
          tags: selectedTags.length ? selectedTags : null,
          text: text.trim(),
          title: title.trim() || null,
          media_url: mediaUrl,
          media_type: mType,
          prompt_id: currentPrompt.id,
          is_public: publish,
        })
        .select()
        .maybeSingle();
      if (error) throw error;
      const entry = mapEntryRow(inserted);
      setEntries((prev) => [entry, ...prev]);
      if (publish) {
        await supabase.from("posts").insert({
          user_id: account.userId, mood, mood_intensity: moodIntensity, tags: selectedTags.length ? selectedTags : null,
          text: entry.text, title: title.trim() || null, media_url: mediaUrl, media_type: mType,
          entry_id: entry.id,
        });
      }
      setText(""); setTitle(""); clearMedia(); setPublish(false); setSaveState("saved");
      setMoodIntensity(3); setSelectedTags([]);
      clearDraft();
      dismissOnboarding();
      setTimeout(() => setSaveState("idle"), 2500);
    } catch (e) {
      setUploadingMedia(false);
      setSaveState("idle");
      setSaveError(e?.stage === "media" ? t.errorMediaUpload : t.errorSaveFailed);
    }
  };

  const handleDelete = async (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    // Kalau refleksi ini pernah dipublikasikan, hapus juga dari tampilan Beranda/Profil.
    // Baris di tabel "posts" ikut terhapus otomatis lewat ON DELETE CASCADE di database.
    setFeed((prev) => prev.filter((p) => p.entryId !== id));
    setViewedPosts((prev) => prev.filter((p) => p.entryId !== id));
    try {
      await supabase.from("journal_entries").delete().eq("id", id);
    } catch (e) {}
  };

  const toggleLike = async (post) => {
    if (!account) return;
    const liked = post.likes.includes(account.userId);
    const newLikes = liked ? post.likes.filter((u) => u !== account.userId) : [...post.likes, account.userId];
    setFeed((f) => f.map((p) => (p.id === post.id ? { ...p, likes: newLikes } : p)));
    try {
      if (liked) {
        await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", account.userId);
      } else {
        await supabase.from("post_likes").insert({ post_id: post.id, user_id: account.userId });
      }
    } catch (e) {}
  };

  const submitComment = async (post) => {
    const draft = (commentDrafts[post.id] || "").trim();
    if (!draft || !account || !myProfile) return;
    const newComment = { userId: account.userId, username: myProfile.displayName, text: draft, ts: Date.now() };
    setFeed((f) => f.map((p) => (p.id === post.id ? { ...p, comments: [...p.comments, newComment] } : p)));
    setCommentDrafts((d) => ({ ...d, [post.id]: "" }));
    try {
      await supabase.from("post_comments").insert({
        post_id: post.id, user_id: account.userId, username: myProfile.displayName, text: draft,
      });
    } catch (e) {}
  };

  const openProfile = async (userId) => {
    if (userId === account?.userId) {
      setViewingUserId(null);
      setTab("profile");
      return;
    }
    setViewingUserId(userId);
    setTab("profile");
    const prof = await getProfile(userId);
    setViewedProfile(prof);
    try {
      const { data: postRows } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("ts", { ascending: false })
        .limit(60);
      setViewedPosts((postRows || []).map((r) => mapPostRow(r)));
      const { count } = await supabase
        .from("follows")
        .select("follower_id", { count: "exact", head: true })
        .eq("following_id", userId);
      setFollowerCount(count || 0);
    } catch (e) {}
  };

  const toggleFollow = async (userId) => {
    if (!account) return;
    const isFollowing = followingList.includes(userId);
    setFollowingList((prev) => (isFollowing ? prev.filter((u) => u !== userId) : [...prev, userId]));
    try {
      if (isFollowing) {
        await supabase.from("follows").delete().eq("follower_id", account.userId).eq("following_id", userId);
      } else {
        await supabase.from("follows").insert({ follower_id: account.userId, following_id: userId });
      }
    } catch (e) {}
  };

  const submitReport = async () => {
    if (!reportModal || !account) return;
    setReportSending(true);
    try {
      await supabase.from("reports").insert({
        reporter_id: account.userId,
        reported_user_id: reportModal.userId,
        post_id: reportModal.postId || null,
        reason: reportReason.trim() || null,
      });
      setReportDone(true);
    } catch (e) {
      // fail quietly, keep modal open with basic message via reportDone remaining false
    } finally {
      setReportSending(false);
    }
  };

  const closeReportModal = () => {
    setReportModal(null);
    setReportReason("");
    setReportDone(false);
    setReportSending(false);
  };

  const handleBlock = async (userId) => {
    if (!account || userId === account.userId) return;
    setBlockedIds((prev) => [...new Set([...prev, userId])]);
    setFeed((prev) => prev.filter((p) => p.userId !== userId));
    setSearchResults((prev) => prev.filter((p) => p.userId !== userId));
    setOpenMenuPostId(null);
    if (viewingUserId === userId) { setTab("feed"); setViewingUserId(null); }
    try {
      await supabase.from("blocks").insert({ blocker_id: account.userId, blocked_id: userId });
    } catch (e) {}
  };

  const handleUnblock = async (userId) => {
    setBlockedIds((prev) => prev.filter((id) => id !== userId));
    try {
      await supabase.from("blocks").delete().eq("blocker_id", account.userId).eq("blocked_id", userId);
    } catch (e) {}
  };

  const handleDeleteAccount = async () => {
    setDeleteAccountError("");
    const expected = lang === "id" ? "HAPUS" : "DELETE";
    if (deleteAccountConfirmText.trim().toUpperCase() !== expected) {
      setDeleteAccountError(t.deleteAccountTypeError);
      return;
    }
    setDeleteAccountLoading(true);
    try {
      const uidVal = account.userId;
      await supabase.from("posts").delete().eq("user_id", uidVal);
      await supabase.from("journal_entries").delete().eq("user_id", uidVal);
      await supabase.from("follows").delete().eq("follower_id", uidVal);
      await supabase.from("blocks").delete().eq("blocker_id", uidVal);
      await supabase.from("reports").delete().eq("reporter_id", uidVal);
      await supabase.from("profiles").delete().eq("id", uidVal);
      clearDraft();
      await supabase.auth.signOut();
    } catch (e) {
      setDeleteAccountLoading(false);
      setDeleteAccountError(t.deleteAccountFailed);
    }
  };

  const downloadFile = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsMarkdown = () => {
    const sorted = [...entries].sort((a, b) => a.ts - b.ts);
    const lines = [`# Reflection — ${myProfile?.displayName || ""}`, ""];
    sorted.forEach((e) => {
      lines.push(`## ${formatDate(e.ts, lang)}${e.title ? " — " + e.title : ""}`);
      lines.push(`*${t.moods[e.mood]} (${e.moodIntensity || 3}/5)${e.tags?.length ? " · " + e.tags.join(", ") : ""}*`);
      lines.push("");
      lines.push(e.text);
      lines.push("");
    });
    downloadFile("reflection-export.md", lines.join("\n"), "text/markdown");
  };

  const exportAsJson = () => {
    const sorted = [...entries].sort((a, b) => a.ts - b.ts);
    downloadFile("reflection-export.json", JSON.stringify(sorted, null, 2), "application/json");
  };

  const stopPreset = useCallback((key) => {
    const st = toneRef.current;
    const entry = st.presets[key];
    if (!entry) return;
    entry.nodes.forEach((n) => {
      try { n.stop && n.stop(); } catch (e) {}
      try { n.dispose && n.dispose(); } catch (e) {}
    });
    if (entry.loop) {
      try { entry.loop.stop(0); entry.loop.dispose(); } catch (e) {}
    }
    delete st.presets[key];
  }, []);

  const stopAllMusic = useCallback(() => {
    const st = toneRef.current;
    Object.keys(st.presets).forEach((k) => stopPreset(k));
    setActivePresets([]);
  }, [stopPreset]);

  const startPreset = useCallback((key, master) => {
    let nodes = [];
    let loop = null;

    if (key === "rain") {
      const rainGain = new Tone.Gain(0.9).connect(master);
      const filter = new Tone.Filter(700, "lowpass").connect(rainGain);
      const noise = new Tone.Noise("pink").connect(filter).start();
      const lfo = new Tone.LFO(0.06, 350, 1100).start();
      lfo.connect(filter.frequency);
      nodes = [noise, filter, lfo, rainGain];
    } else if (key === "piano") {
      const pianoGain = new Tone.Gain(0.85).connect(master);
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 2.2, decay: 1, sustain: 0.4, release: 4 },
      }).connect(pianoGain);
      const chords = [
        ["C4", "E4", "G4"], ["A3", "C4", "E4"], ["F3", "A3", "C4"], ["G3", "B3", "D4"],
      ];
      let idx = 0;
      loop = new Tone.Loop((time) => {
        synth.triggerAttackRelease(chords[idx % chords.length], "2n", time);
        idx += 1;
      }, "4s").start(0);
      nodes = [synth, pianoGain];
    } else if (key === "guitar") {
      const guitarGain = new Tone.Gain(0.75).connect(master);
      const pluck = new Tone.PluckSynth({ attackNoise: 1, dampening: 3800, resonance: 0.9 }).connect(guitarGain);
      const pattern = ["E3", "G3", "B3", "E4", "D3", "F#3", "A3", "D4"];
      let i = 0;
      loop = new Tone.Loop((time) => {
        pluck.triggerAttack(pattern[i % pattern.length], time);
        i += 1;
      }, "1.1s").start(0);
      nodes = [pluck, guitarGain];
    } else if (key === "strings") {
      const stringsGain = new Tone.Gain(0.45).connect(master);
      const filter = new Tone.Filter(1200, "lowpass").connect(stringsGain);
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sawtooth" },
        envelope: { attack: 3, decay: 1, sustain: 0.6, release: 5 },
      }).connect(filter);
      const chords = [["C3", "G3", "E4"], ["A2", "E3", "C4"], ["F2", "C3", "A3"], ["G2", "D3", "B3"]];
      let idx = 0;
      loop = new Tone.Loop((time) => {
        synth.triggerAttackRelease(chords[idx % chords.length], "6s", time);
        idx += 1;
      }, "6s").start(0);
      nodes = [synth, filter, stringsGain];
    } else if (key === "flute") {
      const fluteGain = new Tone.Gain(0.6).connect(master);
      const synth = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.3, decay: 0.2, sustain: 0.5, release: 1.5 },
      }).connect(fluteGain);
      const scale = ["C5", "D5", "E5", "G5", "A5", "C6"];
      loop = new Tone.Loop((time) => {
        if (Math.random() > 0.35) {
          const n = scale[Math.floor(Math.random() * scale.length)];
          synth.triggerAttackRelease(n, "2n", time);
        }
      }, "2.5s").start(0);
      nodes = [synth, fluteGain];
    } else if (key === "cello") {
      const celloGain = new Tone.Gain(0.5).connect(master);
      const filter = new Tone.Filter(800, "lowpass").connect(celloGain);
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 1.5, decay: 0.5, sustain: 0.7, release: 3 },
      }).connect(filter);
      const chords = [["C2", "G2"], ["A1", "E2"], ["F1", "C2"], ["G1", "D2"]];
      let idx = 0;
      loop = new Tone.Loop((time) => {
        synth.triggerAttackRelease(chords[idx % chords.length], "7s", time);
        idx += 1;
      }, "8s").start(0);
      nodes = [synth, filter, celloGain];
    } else if (key === "kalimba") {
      const kalimbaGain = new Tone.Gain(0.45).connect(master);
      const synth = new Tone.FMSynth({
        harmonicity: 3, modulationIndex: 4,
        envelope: { attack: 0.001, decay: 0.6, sustain: 0, release: 0.8 },
        modulationEnvelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.3 },
      }).connect(kalimbaGain);
      const scale = ["C4", "D4", "F4", "G4", "A4", "C5", "D5"];
      loop = new Tone.Loop((time) => {
        const n = scale[Math.floor(Math.random() * scale.length)];
        synth.triggerAttackRelease(n, "8n", time);
      }, "0.9s").start(0);
      nodes = [synth, kalimbaGain];
    } else if (key === "harp") {
      const harpGain = new Tone.Gain(0.4).connect(master);
      const pluck = new Tone.PluckSynth({ attackNoise: 0.5, dampening: 6000, resonance: 0.95 }).connect(harpGain);
      const pattern = ["C5", "E5", "G5", "C6", "G5", "E5", "D5", "A5", "F5", "C5"];
      let hi = 0;
      loop = new Tone.Loop((time) => {
        pluck.triggerAttack(pattern[hi % pattern.length], time);
        hi += 1;
      }, "0.55s").start(0);
      nodes = [pluck, harpGain];
    } else if (key === "ocean") {
      const oceanGain = new Tone.Gain(0.6).connect(master);
      const filter = new Tone.Filter(500, "bandpass").connect(oceanGain);
      const noise = new Tone.Noise("brown").connect(filter).start();
      const ampLFO = new Tone.LFO(0.1, 0.3, 0.9).start();
      ampLFO.connect(oceanGain.gain);
      const freqLFO = new Tone.LFO(0.05, 300, 700).start();
      freqLFO.connect(filter.frequency);
      nodes = [noise, filter, ampLFO, freqLFO, oceanGain];
    } else if (key === "river") {
      const riverGain = new Tone.Gain(0.55).connect(master);
      const filter = new Tone.Filter(1400, "bandpass").connect(riverGain);
      const noise = new Tone.Noise("pink").connect(filter).start();
      const lfo = new Tone.LFO(0.3, 900, 2000).start();
      lfo.connect(filter.frequency);
      nodes = [noise, filter, lfo, riverGain];
    } else if (key === "wind") {
      const windGain = new Tone.Gain(0.5).connect(master);
      const filter = new Tone.Filter(500, "lowpass").connect(windGain);
      const noise = new Tone.Noise("brown").connect(filter).start();
      const freqLFO = new Tone.LFO(0.04, 250, 900).start();
      freqLFO.connect(filter.frequency);
      const ampLFO = new Tone.LFO(0.07, 0.3, 0.8).start();
      ampLFO.connect(windGain.gain);
      nodes = [noise, filter, freqLFO, ampLFO, windGain];
    } else if (key === "birds") {
      const birdGain = new Tone.Gain(0.45).connect(master);
      const synth = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.1 },
      }).connect(birdGain);
      const notes = ["E6", "G6", "A6", "C7", "D7"];
      loop = new Tone.Loop((time) => {
        if (Math.random() > 0.4) {
          synth.triggerAttackRelease(notes[Math.floor(Math.random() * notes.length)], "32n", time);
          synth.triggerAttackRelease(notes[Math.floor(Math.random() * notes.length)], "32n", time + 0.09);
        }
      }, "1.3s").start(0);
      nodes = [synth, birdGain];
    } else if (key === "crickets") {
      const cricketGain = new Tone.Gain(0.3).connect(master);
      const synth = new Tone.Synth({
        oscillator: { type: "square" },
        envelope: { attack: 0.005, decay: 0.03, sustain: 0, release: 0.02 },
      }).connect(cricketGain);
      loop = new Tone.Loop((time) => {
        synth.triggerAttackRelease("A7", "64n", time);
        synth.triggerAttackRelease("A7", "64n", time + 0.06);
        synth.triggerAttackRelease("A7", "64n", time + 0.12);
      }, "0.9s").start(0);
      nodes = [synth, cricketGain];
    } else if (key === "campfire") {
      const fireGain = new Tone.Gain(0.5).connect(master);
      const noiseSynth = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.08, sustain: 0 },
      }).connect(fireGain);
      loop = new Tone.Loop((time) => {
        if (Math.random() > 0.5) noiseSynth.triggerAttackRelease("16n", time);
      }, "0.2s").start(0);
      nodes = [noiseSynth, fireGain];
    } else if (key === "bells") {
      const bellGain = new Tone.Gain(0.5).connect(master);
      const bell = new Tone.MetalSynth({
        envelope: { attack: 0.001, decay: 1.4, release: 0.3 },
        harmonicity: 5.1, modulationIndex: 16, resonance: 900, octaves: 1.2,
      }).connect(bellGain);
      const notes = ["C5", "E5", "G5", "B4"];
      loop = new Tone.Loop((time) => {
        const n = notes[Math.floor(Math.random() * notes.length)];
        bell.triggerAttackRelease(n, "8n", time);
      }, "6s").start(0);
      nodes = [bell, bellGain];
    }

    toneRef.current.presets[key] = { nodes, loop };
  }, []);

  const togglePreset = useCallback(
    async (key) => {
      const isActive = activePresets.includes(key);
      if (isActive) {
        stopPreset(key);
        setActivePresets((a) => a.filter((k) => k !== key));
        return;
      }
      await Tone.start();
      if (!toneRef.current.master) {
        toneRef.current.master = new Tone.Gain(volume).toDestination();
      }
      if (Tone.Transport.state !== "started") Tone.Transport.start();
      startPreset(key, toneRef.current.master);
      setActivePresets((a) => [...a, key]);
    },
    [activePresets, stopPreset, startPreset, volume]
  );

  const handleVolumeChange = (v) => {
    setVolume(v);
    if (toneRef.current.master) toneRef.current.master.gain.value = v;
  };

  useEffect(() => {
    return () => stopAllMusic();
  }, [stopAllMusic]);

  const greeting = () => {
    const h = new Date().getHours();
    const period = h < 11 ? t.morning : h < 15 ? t.afternoon : h < 19 ? t.evening : t.night;
    return `${t.greetingPrefix} ${period}`;
  };

  const currentFont = (FONT_OPTIONS.find((f) => f.key === fontKey) || FONT_OPTIONS[0]).family;
  const sceneOverlay = (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, background: "var(--paper)", opacity: sceneKey === "none" ? 1 : 0.76, pointerEvents: "none" }} />
  );

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <GlobalStyle theme={THEMES[themeKey]} fontFamily={currentFont} />
        <SceneBackground sceneKey={sceneKey} />
        {sceneOverlay}
        <p style={{ color: "var(--ink-soft)", fontFamily: "'Work Sans', sans-serif" }}>{t.loading}</p>
      </div>
    );
  }

  if (passwordRecovery) {
    return (
      <div
        style={{
          minHeight: "100vh", fontFamily: "'Work Sans', sans-serif", display: "flex",
          alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden",
          background: "radial-gradient(circle at 25% 15%, rgba(229,193,181,0.16), transparent 45%), radial-gradient(circle at 80% 75%, rgba(142,106,94,0.20), transparent 50%), linear-gradient(160deg, #0b1220 0%, #16202f 45%, #1c2436 75%, #241d2c 100%)",
        }}
      >
        <GlobalStyle theme={THEMES[themeKey]} fontFamily={currentFont} />
        <div style={{ position: "absolute", inset: 0, background: "#0a0e17", opacity: 0.6, pointerEvents: "none" }} />
        <div
          style={{
            position: "relative", zIndex: 1, width: "100%", maxWidth: 400,
            background: "rgba(30, 41, 59, 0.65)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: 16, padding: "32px 28px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)", textAlign: "center",
          }}
        >
          <h1 className="rf-display" style={{ fontSize: 26, fontStyle: "italic", color: "#E5C1B5", marginBottom: 6 }}>{t.resetTitle}</h1>
          {!resetDone ? (
            <>
              <p style={{ color: "rgba(229,231,235,0.65)", fontSize: 14, marginBottom: 22 }}>{t.resetSubtitle}</p>
              <form onSubmit={handleResetPassword} style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t.resetNewPasswordPh} className="rf-auth-input"
                  style={{ width: "100%", boxSizing: "border-box", padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(15,20,30,0.55)", color: "#f1ede9", fontSize: 14, fontFamily: "'Work Sans', sans-serif" }}
                />
                <input
                  type="password" autoComplete="new-password" value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)}
                  placeholder={t.resetConfirmPasswordPh} className="rf-auth-input"
                  style={{ width: "100%", boxSizing: "border-box", padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(15,20,30,0.55)", color: "#f1ede9", fontSize: 14, fontFamily: "'Work Sans', sans-serif" }}
                />
                {resetError && <p style={{ color: "#e8a191", fontSize: 13, margin: 0 }}>{resetError}</p>}
                <button
                  type="submit" disabled={resetSaving}
                  style={{ background: "linear-gradient(135deg, #C29B8C 0%, #8E6A5E 100%)", border: "none", color: "#fff", padding: "13px 26px", fontSize: 15, borderRadius: 10, cursor: resetSaving ? "default" : "pointer", opacity: resetSaving ? 0.7 : 1, boxShadow: "0 8px 20px rgba(142,106,94,0.35)" }}
                >
                  {resetSaving ? t.resetSubmitBtnLoading : t.resetSubmitBtn}
                </button>
              </form>
            </>
          ) : (
            <>
              <p style={{ color: "rgba(229,231,235,0.75)", fontSize: 14, marginBottom: 22 }}>{t.resetSuccess}</p>
              <button
                onClick={() => setPasswordRecovery(false)}
                style={{ background: "linear-gradient(135deg, #C29B8C 0%, #8E6A5E 100%)", border: "none", color: "#fff", padding: "13px 26px", fontSize: 15, borderRadius: 10, cursor: "pointer", boxShadow: "0 8px 20px rgba(142,106,94,0.35)" }}
              >
                {t.resetContinueBtn}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "'Work Sans', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 25% 15%, rgba(229,193,181,0.16), transparent 45%), radial-gradient(circle at 80% 75%, rgba(142,106,94,0.20), transparent 50%), linear-gradient(160deg, #0b1220 0%, #16202f 45%, #1c2436 75%, #241d2c 100%)",
        }}
      >
        <GlobalStyle theme={THEMES[themeKey]} fontFamily={currentFont} />
        {/* dark overlay to mimic a dim sunset photo backdrop, per spec opacity 0.6 */}
        <div style={{ position: "absolute", inset: 0, background: "#0a0e17", opacity: 0.6, pointerEvents: "none" }} />

        <div
          className="rf-auth-card"
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 400,
            background: "rgba(30, 41, 59, 0.65)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 16,
            padding: "32px 28px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <svg viewBox="0 0 200 200" width="86" height="86">
              <defs>
                <linearGradient id="roseGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E5C1B5" />
                  <stop offset="50%" stopColor="#C29B8C" />
                  <stop offset="100%" stopColor="#8E6A5E" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="95" r="75" fill="none" stroke="url(#roseGold)" strokeWidth="3.5" opacity="0.85" />
              <circle cx="100" cy="95" r="83" fill="none" stroke="url(#roseGold)" strokeWidth="1.5" opacity="0.4" strokeDasharray="4 4" />
              <path d="M100 35 C110 50, 112 65, 100 78 C88 65, 90 50, 100 35 Z" fill="none" stroke="url(#roseGold)" strokeWidth="2.5" />
              <path d="M97 50 L97 68 M97 50 C103 50, 105 55, 102 60 C99 63, 97 60, 97 60 L103 68" fill="none" stroke="url(#roseGold)" strokeWidth="2" strokeLinecap="round" />
              <path d="M96 75 C80 70, 68 55, 75 42 C85 52, 92 65, 96 75 Z" fill="none" stroke="url(#roseGold)" strokeWidth="2" />
              <path d="M104 75 C120 70, 132 55, 125 42 C115 52, 108 65, 104 75 Z" fill="none" stroke="url(#roseGold)" strokeWidth="2" />
              <circle cx="100" cy="98" r="7.5" fill="url(#roseGold)" />
              <path d="M100 108 C93 112, 85 118, 80 128 C88 132, 95 130, 100 130 C105 130, 112 132, 120 128 C115 118, 107 112, 100 108 Z" fill="url(#roseGold)" />
              <path d="M86 120 C80 125, 75 135, 82 138 C90 138, 96 133, 100 132 C104 132, 110 138, 118 138 C125 135, 120 125, 114 120" fill="none" stroke="url(#roseGold)" strokeWidth="3" strokeLinecap="round" />
              <line x1="55" y1="145" x2="145" y2="145" stroke="url(#roseGold)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="68" y1="151" x2="132" y2="151" stroke="url(#roseGold)" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
              <line x1="80" y1="156" x2="120" y2="156" stroke="url(#roseGold)" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>

          <h1
            className="rf-display"
            style={{ fontSize: 32, fontStyle: "italic", color: "#E5C1B5", marginBottom: 8, letterSpacing: 0.2 }}
          >
            {t.appName}
          </h1>
          <p style={{ color: "rgba(229,231,235,0.65)", fontSize: 14, marginBottom: 26, lineHeight: 1.6 }}>{t.tagline}</p>

          <button
            className="rf-btn"
            onClick={signInWithGoogle}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.16)", color: "#f1ede9",
              padding: "13px 26px", fontSize: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.35 0-4.34-1.58-5.05-3.71H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.95 10.71A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.99-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l2.99 2.33C4.66 5.16 6.65 3.58 9 3.58z"/></svg>
            Masuk dengan Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.14)" }} />
            <span style={{ fontSize: 12, color: "rgba(229,231,235,0.5)" }}>{t.orDivider}</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.14)" }} />
          </div>

          <form onSubmit={authMode === "forgot" ? handleForgotPassword : handleEmailAuthSubmit} style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              autoComplete="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder={t.authEmailPh}
              className="rf-auth-input"
              style={{
                width: "100%", boxSizing: "border-box", padding: "13px 16px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.14)", background: "rgba(15,20,30,0.55)", color: "#f1ede9",
                fontSize: 14, fontFamily: "'Work Sans', sans-serif",
              }}
            />
            {authMode !== "forgot" && (
              <input
                type="password"
                autoComplete={authMode === "login" ? "current-password" : "new-password"}
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder={t.authPasswordPh}
                className="rf-auth-input"
                style={{
                  width: "100%", boxSizing: "border-box", padding: "13px 16px", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.14)", background: "rgba(15,20,30,0.55)", color: "#f1ede9",
                  fontSize: 14, fontFamily: "'Work Sans', sans-serif",
                }}
              />
            )}

            {authMode === "login" && (
              <button
                type="button"
                onClick={() => { setAuthMode("forgot"); setAuthError(""); setAuthNotice(""); }}
                style={{ background: "none", border: "none", color: "rgba(229,231,235,0.55)", fontSize: 12.5, textDecoration: "underline", cursor: "pointer", padding: 0, textAlign: "right" }}
              >
                {t.authForgotLink}
              </button>
            )}

            {authError && <p style={{ color: "#e8a191", fontSize: 13, margin: 0 }}>{authError}</p>}
            {authNotice && <p style={{ color: "rgba(229,231,235,0.7)", fontSize: 13, margin: 0 }}>{authNotice}</p>}

            <button
              type="submit"
              className="rf-btn"
              disabled={authLoading}
              style={{
                background: "linear-gradient(135deg, #C29B8C 0%, #8E6A5E 100%)", border: "none", color: "#fff",
                padding: "13px 26px", fontSize: 15, borderRadius: 10, cursor: authLoading ? "default" : "pointer",
                opacity: authLoading ? 0.7 : 1, boxShadow: "0 8px 20px rgba(142,106,94,0.35)",
              }}
            >
              {authMode === "forgot"
                ? (authLoading ? t.authSendResetBtnLoading : t.authSendResetBtn)
                : authMode === "login"
                ? (authLoading ? t.authLoginBtnLoading : t.authLoginBtn)
                : (authLoading ? t.authSignupBtnLoading : t.authSignupBtn)}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode((m) => (m === "forgot" ? "login" : m === "login" ? "signup" : "login"));
                setAuthError("");
                setAuthNotice("");
              }}
              style={{ background: "none", border: "none", color: "rgba(229,231,235,0.6)", fontSize: 13, textDecoration: "underline", cursor: "pointer", padding: 4 }}
            >
              {authMode === "forgot" ? t.authBackToLogin : authMode === "login" ? t.authSwitchToSignup : t.authSwitchToLogin}
            </button>
          </form>

          <p style={{ marginTop: 22, fontSize: 11.5, color: "rgba(229,231,235,0.4)" }}>
            <button type="button" onClick={() => setLegalPage("privacy")} style={{ background: "none", border: "none", color: "rgba(229,231,235,0.5)", fontSize: 11.5, textDecoration: "underline", cursor: "pointer", padding: 0 }}>{t.legalPrivacyLink}</button>
            {" · "}
            <button type="button" onClick={() => setLegalPage("terms")} style={{ background: "none", border: "none", color: "rgba(229,231,235,0.5)", fontSize: 11.5, textDecoration: "underline", cursor: "pointer", padding: 0 }}>{t.legalTermsLink}</button>
          </p>
        </div>
        <LegalModal page={legalPage} onClose={() => setLegalPage(null)} t={t} lang={lang} />
      </div>
    );
  }

  if (!myProfile) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "'Work Sans', sans-serif", color: "var(--ink)" }}>
        <GlobalStyle theme={THEMES[themeKey]} fontFamily={currentFont} />
        <SceneBackground sceneKey={sceneKey} />
        {sceneOverlay}
        <Onboarding t={t} lang={lang} onCreate={createAccount} />
      </div>
    );
  }

  const isOwnProfile = !viewingUserId || viewingUserId === account.userId;
  const displayedProfile = isOwnProfile ? myProfile : viewedProfile;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "'Work Sans', sans-serif", color: "var(--ink)" }}>
      <GlobalStyle theme={THEMES[themeKey]} fontFamily={currentFont} />
      <SceneBackground sceneKey={sceneKey} />
      {sceneOverlay}
      <header style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 className="rf-display" style={{ fontSize: 30, fontWeight: 600, margin: 0, color: "var(--clay-dark)" }}>{t.appName}</h1>
            <p style={{ margin: "4px 0 0", color: "var(--ink-soft)", fontSize: 14, maxWidth: 380 }}>{t.tagline}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="rf-btn"
              onClick={() => setShowThemePicker((s) => !s)}
              aria-label={t.appearance}
              style={{ background: "var(--paper-card)", border: "1px solid var(--line)", width: 34, height: 34, borderRadius: "50%", fontSize: 15, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              🎨
            </button>
            <button className="rf-btn" onClick={() => setLang((l) => (l === "id" ? "en" : "id"))} style={{ background: "var(--paper-card)", border: "1px solid var(--line)", padding: "7px 13px", fontSize: 13, color: "var(--ink-soft)" }}>{t.langToggle}</button>
            <button
              className="rf-btn"
              onClick={signOut}
              title={lang === "id" ? "Keluar" : "Sign out"}
              style={{ background: "var(--paper-card)", border: "1px solid var(--line)", width: 34, height: 34, borderRadius: "50%", fontSize: 14, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-soft)" }}
            >
              ⎋
            </button>
            <button onClick={() => openProfile(account.userId)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Avatar profile={myProfile} size={38} />
            </button>
          </div>
        </div>
        {showThemePicker && (
          <div className="rf-card" style={{ padding: 16, marginTop: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 8px" }}>{t.appearance}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              {Object.entries(THEMES).map(([key, th]) => (
                <button
                  key={key}
                  onClick={() => chooseTheme(key)}
                  title={lang === "id" ? th.label_id : th.label_en}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "6px 10px",
                    borderRadius: 999, cursor: "pointer",
                    background: "var(--paper-card)",
                    border: themeKey === key ? "2px solid var(--clay)" : "1px solid var(--line)",
                  }}
                >
                  <span style={{ width: 16, height: 16, borderRadius: "50%", background: th.paper, border: `1px solid ${th.line}`, display: "inline-block" }} />
                  <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{lang === "id" ? th.label_id : th.label_en}</span>
                </button>
              ))}
            </div>

            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 8px" }}>{t.sceneLabel}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              {SCENES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => chooseScene(s.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "6px 10px",
                    borderRadius: 999, cursor: "pointer",
                    background: "var(--paper-card)",
                    border: sceneKey === s.key ? "2px solid var(--clay)" : "1px solid var(--line)",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{s.icon}</span>
                  <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{t[s.labelKey]}</span>
                </button>
              ))}
            </div>

            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 8px" }}>{t.fontLabel}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => chooseFont(f.key)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999, cursor: "pointer",
                    background: "var(--paper-card)",
                    border: fontKey === f.key ? "2px solid var(--clay)" : "1px solid var(--line)",
                    fontFamily: f.family,
                    fontSize: 13,
                    color: "var(--ink)",
                  }}
                >
                  {t[f.labelKey]}
                </button>
              ))}
            </div>
          </div>
        )}
        <nav style={{ display: "flex", gap: 20, marginTop: 22, borderBottom: "1px solid var(--line)" }}>
          {Object.entries(t.nav).map(([key, label]) => (
            <button key={key} className={`rf-tab ${tab === key ? "active" : ""}`} onClick={() => { setTab(key); if (key !== "profile") setViewingUserId(null); }}>{label}</button>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "20px 20px 80px" }}>
        {tab === "search" && (
          <section>
            <input
              className="rf-input"
              style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", fontSize: 15, marginBottom: 18 }}
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {!searchQuery.trim() ? (
              <p style={{ color: "var(--ink-soft)" }}>{t.searchEmpty}</p>
            ) : searchLoading ? (
              <p style={{ color: "var(--ink-soft)" }}>{t.searchLoading}</p>
            ) : searchResults.length === 0 ? (
              <p style={{ color: "var(--ink-soft)" }}>{t.searchNoResults}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {searchResults.map((p) => (
                  <button
                    key={p.userId}
                    onClick={() => openProfile(p.userId)}
                    className="rf-card"
                    style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer", border: "1px solid var(--line)", background: "var(--paper-card)" }}
                  >
                    <Avatar profile={p} size={44} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{p.displayName}</p>
                      <p className="rf-mono" style={{ margin: "2px 0 0", fontSize: 12, color: "var(--ink-soft)" }}>@{p.username}</p>
                      {p.status && <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--clay-dark)" }}>{p.status}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
        {tab === "feed" && (
          <section>
            {feedLoading ? (
              <p style={{ color: "var(--ink-soft)" }}>{t.loading}</p>
            ) : feed.length === 0 ? (
              <p style={{ color: "var(--ink-soft)" }}>{t.feedEmpty}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {feed.map((post) => {
                  const author = profileCache[post.userId];
                  const m = MOODS.find((mm) => mm.key === post.mood) || MOODS[0];
                  const liked = post.likes.includes(account.userId);
                  const trKey = `post-${post.id}`;
                  const tr = translations[trKey];
                  const showingTr = tr?.showing && tr?.text;
                  return (
                    <div key={post.id} className="rf-card" style={{ padding: 18, position: "relative" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <button onClick={() => openProfile(post.userId)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                          <Avatar profile={author} size={36} />
                        </button>
                        <div style={{ flex: 1 }}>
                          <button onClick={() => openProfile(post.userId)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{author?.displayName || "…"}</p>
                          </button>
                          <p className="rf-mono" style={{ margin: 0, fontSize: 11, color: "var(--ink-soft)" }}>
                            {author?.status ? `${author.status} · ` : ""}{formatDate(post.ts, lang)} · {t.moods[post.mood]}
                          </p>
                        </div>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: m.color, display: "inline-block" }} />
                        {post.userId !== account.userId && (
                          <div style={{ position: "relative" }}>
                            <button
                              onClick={() => setOpenMenuPostId((cur) => (cur === post.id ? null : post.id))}
                              style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 18, cursor: "pointer", padding: "0 4px" }}
                            >
                              ⋯
                            </button>
                            {openMenuPostId === post.id && (
                              <div style={{ position: "absolute", right: 0, top: 24, background: "var(--paper-card)", border: "1px solid var(--line)", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", zIndex: 20, minWidth: 170, overflow: "hidden" }}>
                                <button
                                  onClick={() => { setReportModal({ postId: post.id, userId: post.userId }); setOpenMenuPostId(null); }}
                                  style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13.5, color: "var(--ink)" }}
                                >
                                  {t.reportAction}
                                </button>
                                <button
                                  onClick={() => handleBlock(post.userId)}
                                  style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", borderTop: "1px solid var(--line)", cursor: "pointer", fontSize: 13.5, color: "#B5654A" }}
                                >
                                  {t.blockAction}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {post.title && <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 16 }}>{showingTr && tr.title ? tr.title : post.title}</p>}
                      <MediaBlock url={post.mediaUrl} type={post.mediaType} alt={post.title} />
                      <p style={{ margin: "0 0 8px", lineHeight: 1.6, fontSize: 15, whiteSpace: "pre-wrap" }}>{showingTr ? tr.text : post.text}</p>
                      <button
                        onClick={() => handleTranslate(trKey, post.title, post.text)}
                        style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 12.5, cursor: "pointer", padding: 0, marginBottom: 10 }}
                      >
                        {tr?.loading ? t.translating : tr?.error ? t.translateError : showingTr ? t.showOriginal : t.translateBtn}
                      </button>
                      <div style={{ display: "flex", gap: 6, borderTop: "1px solid var(--line)", paddingTop: 10 }}>
                        <button className="rf-icon-btn" onClick={() => toggleLike(post)} style={{ color: liked ? "var(--clay-dark)" : "var(--ink-soft)" }}>
                          {liked ? "♥" : "♡"} {post.likes.length > 0 ? post.likes.length : t.like}
                        </button>
                        <span className="rf-icon-btn" style={{ cursor: "default" }}>💬 {post.comments.length}</span>
                      </div>
                      {post.comments.length > 0 && (
                        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                          {post.comments.map((c, i) => (
                            <p key={i} style={{ margin: 0, fontSize: 13.5, color: "var(--ink-soft)" }}>
                              <strong style={{ color: "var(--ink)" }}>{c.username}</strong> {c.text}
                            </p>
                          ))}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <input
                          className="rf-input"
                          style={{ padding: "8px 12px", fontSize: 13 }}
                          placeholder={t.commentPh}
                          value={commentDrafts[post.id] || ""}
                          onChange={(e) => setCommentDrafts((d) => ({ ...d, [post.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && submitComment(post)}
                        />
                        <button className="rf-btn" onClick={() => submitComment(post)} style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "0 14px", fontSize: 13, color: "var(--ink-soft)" }}>{t.send}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {tab === "journal" && (
          <section>
            <p className="rf-mono" style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-soft)", margin: "0 0 4px" }}>{greeting()} · {formatDate(Date.now(), lang)}</p>

            {entries.length === 0 && !onboardingDismissed && (
              <div className="rf-card" style={{ padding: 20, marginTop: 14, border: "1px solid var(--clay)", position: "relative" }}>
                <button
                  onClick={dismissOnboarding}
                  style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", fontSize: 16, color: "var(--ink-soft)", cursor: "pointer" }}
                >
                  ✕
                </button>
                <p className="rf-display" style={{ fontSize: 18, margin: "0 0 6px", paddingRight: 20 }}>{t.onboardWelcomeTitle}</p>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: "0 0 14px", lineHeight: 1.6 }}>{t.onboardWelcomeBody}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[t.onboardStep1, t.onboardStep2, t.onboardStep3, t.onboardStep4].map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--clay)", color: "var(--paper)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                      <span style={{ fontSize: 13.5, lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rf-card" style={{ padding: 22, marginTop: 14 }}>
              <p className="rf-mono" style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--clay)", margin: "0 0 8px" }}>{t.promptLabel}</p>
              <p className="rf-display" style={{ fontSize: 20, lineHeight: 1.4, margin: "0 0 14px" }}>{lang === "id" ? currentPrompt.id_ : currentPrompt.en}</p>
              <button className="rf-btn" onClick={() => setPromptIndex((i) => (i + 1) % PROMPTS.length)} style={{ background: "transparent", border: "1px solid var(--line)", padding: "6px 14px", fontSize: 13, color: "var(--ink-soft)" }}>↻ {t.newPrompt}</button>
            </div>

            <div className="rf-card" style={{ padding: "16px 18px", marginTop: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 3px" }}>🎵 {t.musicTitle}</p>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "0 0 3px" }}>{t.musicDesc}</p>
              <p style={{ fontSize: 11.5, color: "var(--ink-soft)", margin: "0 0 14px", fontStyle: "italic" }}>{t.musicComboNote}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--clay-dark)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>{t.melodyLabel}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, marginBottom: 16 }}>
                {MUSIC_PRESETS.filter((p) => p.category === "melody").map((p) => {
                  const active = activePresets.includes(p.key);
                  return (
                    <button
                      key={p.key}
                      onClick={() => togglePreset(p.key)}
                      style={{
                        textAlign: "left",
                        background: active ? "var(--clay)" : "var(--paper)",
                        border: active ? "1px solid var(--clay)" : "1px solid var(--line)",
                        borderRadius: 10,
                        padding: "10px 12px",
                        cursor: "pointer",
                        fontFamily: "'Work Sans', sans-serif",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: active ? "var(--paper-card)" : "var(--ink)" }}>
                        {p.icon} {t[p.labelKey]}
                      </p>
                      <p style={{ margin: "3px 0 0", fontSize: 11.5, lineHeight: 1.4, color: active ? "var(--paper-card)" : "var(--ink-soft)", opacity: active ? 0.9 : 1 }}>
                        {t[p.descKey]}
                      </p>
                    </button>
                  );
                })}
              </div>

              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--clay-dark)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>{t.ambientLabel}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, marginBottom: activePresets.length > 0 ? 12 : 0 }}>
                {MUSIC_PRESETS.filter((p) => p.category === "ambient").map((p) => {
                  const active = activePresets.includes(p.key);
                  return (
                    <button
                      key={p.key}
                      onClick={() => togglePreset(p.key)}
                      style={{
                        textAlign: "left",
                        background: active ? "var(--clay)" : "var(--paper)",
                        border: active ? "1px solid var(--clay)" : "1px solid var(--line)",
                        borderRadius: 10,
                        padding: "10px 12px",
                        cursor: "pointer",
                        fontFamily: "'Work Sans', sans-serif",
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: active ? "var(--paper-card)" : "var(--ink)" }}>
                        {p.icon} {t[p.labelKey]}
                      </p>
                      <p style={{ margin: "3px 0 0", fontSize: 11.5, lineHeight: 1.4, color: active ? "var(--paper-card)" : "var(--ink-soft)", opacity: active ? 0.9 : 1 }}>
                        {t[p.descKey]}
                      </p>
                    </button>
                  );
                })}
              </div>
              {activePresets.length > 0 && (
                <>
                  <button
                    className="rf-btn"
                    onClick={stopAllMusic}
                    style={{ background: "transparent", border: "1px solid var(--line)", padding: "7px 14px", fontSize: 13, color: "var(--ink-soft)", marginBottom: 12 }}
                  >
                    ⏹ {t.musicOff}
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{t.volumeLabel}</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      style={{ flex: 1, accentColor: "var(--clay)" }}
                    />
                  </div>
                </>
              )}
            </div>

            <div style={{ marginTop: 22 }}>
              <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px", color: "var(--ink-soft)" }}>{t.moodLabel}</p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {MOODS.map((m) => (
                  <button key={m.key} onClick={() => setMood(m.key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                    <span style={{ width: 32, height: 32, borderRadius: "50%", background: m.color, display: "block", border: mood === m.key ? "3px solid var(--ink)" : "3px solid transparent" }} />
                    <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{t.moods[m.key]}</span>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "0 0 6px" }}>{t.intensityLabel}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>{t.intensityLow}</span>
                  <input
                    type="range" min={1} max={5} step={1} value={moodIntensity}
                    onChange={(e) => setMoodIntensity(Number(e.target.value))}
                    style={{ flex: 1, maxWidth: 220, accentColor: "var(--clay)" }}
                  />
                  <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>{t.intensityHigh}</span>
                  <IntensityDots value={moodIntensity} color={(MOODS.find((m) => m.key === mood) || MOODS[0]).color} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <textarea className="rf-textarea" placeholder={t.writePlaceholder} value={text} onChange={(e) => setText(e.target.value)} />
            </div>

            <div style={{ marginTop: 12 }}>
              <input
                className="rf-input"
                style={{ width: "100%", boxSizing: "border-box" }}
                placeholder={t.titlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "0 0 8px" }}>{t.tagsLabel}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TAGS.map((tg) => {
                  const active = selectedTags.includes(tg.key);
                  return (
                    <button
                      key={tg.key}
                      onClick={() => setSelectedTags((prev) => (active ? prev.filter((k) => k !== tg.key) : [...prev, tg.key]))}
                      style={{
                        background: active ? "var(--clay)" : "transparent",
                        color: active ? "var(--paper)" : "var(--ink-soft)",
                        border: active ? "1px solid var(--clay)" : "1px solid var(--line)",
                        borderRadius: 999, padding: "5px 12px", fontSize: 12.5, cursor: "pointer",
                      }}
                    >
                      {lang === "id" ? tg.id_ : tg.en}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              {!mediaPreview ? (
                <label className="rf-btn" style={{ display: "inline-flex", background: "transparent", border: "1px dashed var(--line)", color: "var(--ink-soft)", padding: "9px 16px", fontSize: 13, cursor: "pointer" }}>
                  {t.mediaAttachLabel}
                  <input type="file" accept="image/*,video/*" onChange={handleMediaChange} style={{ display: "none" }} />
                </label>
              ) : (
                <div style={{ position: "relative", maxWidth: 280 }}>
                  <MediaBlock url={mediaPreview} type={mediaType} />
                  <button onClick={clearMedia} className="rf-btn" style={{ background: "var(--paper-card)", border: "1px solid var(--line)", color: "var(--ink-soft)", padding: "5px 12px", fontSize: 12 }}>{t.mediaRemove}</button>
                </div>
              )}
              {mediaError && <p style={{ color: "#B5654A", fontSize: 12, marginTop: 6 }}>{mediaError}</p>}
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 12, fontSize: 14, color: "var(--ink-soft)", cursor: "pointer" }}>
              <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} style={{ marginTop: 3 }} />
              <span>{t.publishToggle}<br /><span style={{ fontSize: 12 }}>{t.privateNote}</span></span>
            </label>

            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <button className="rf-btn" onClick={handleSave} disabled={!text.trim() || saveState === "saving"} style={{ background: "var(--clay)", color: "var(--paper)", padding: "12px 26px", fontSize: 15 }}>{t.save}</button>
              {uploadingMedia && <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{t.uploadingMedia}</span>}
              {saveState === "saved" && <span style={{ fontSize: 13, color: "var(--moss)" }}>{t.saved}</span>}
              {saveState !== "saving" && !uploadingMedia && draftSavedAt && text.trim() && (
                <span style={{ fontSize: 11.5, color: "var(--ink-soft)", opacity: 0.75 }}>💾 {t.draftSavedNote}</span>
              )}
            </div>
            {saveError && <p style={{ color: "#B5654A", fontSize: 13, marginTop: 8 }}>⚠️ {saveError}</p>}
            {draftRestored && text.trim() && (
              <p style={{ color: "var(--ink-soft)", fontSize: 12.5, marginTop: 6, fontStyle: "italic" }}>{t.draftRestoredNote}</p>
            )}

            <div style={{ marginTop: 30 }}>
              {(() => {
                const wk = weeklySummary(entries);
                const dominantMoodObj = wk.dominantMood ? MOODS.find((m) => m.key === wk.dominantMood) : null;
                return (
                  <div className="rf-card" style={{ padding: 18, marginBottom: 20 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--clay-dark)", margin: "0 0 10px" }}>{t.weeklySummaryTitle}</p>
                    {wk.count === 0 ? (
                      <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: 0 }}>{t.weeklySummaryEmpty}</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <p style={{ margin: 0, fontSize: 14 }}><strong>{wk.count}</strong> {t.weeklySummaryCount}</p>
                        {dominantMoodObj && (
                          <p style={{ margin: 0, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}>
                            {t.weeklySummaryDominantMood}
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: dominantMoodObj.color, display: "inline-block" }} />
                            {t.moods[wk.dominantMood]}
                          </p>
                        )}
                        {wk.avgIntensity && (
                          <p style={{ margin: 0, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}>
                            {t.weeklySummaryAvgIntensity} <IntensityDots value={Math.round(wk.avgIntensity)} /> ({wk.avgIntensity}/5)
                          </p>
                        )}
                        {wk.topTags.length > 0 && (
                          <p style={{ margin: 0, fontSize: 13.5 }}>
                            {t.weeklySummaryTopTags} {wk.topTags.map((tg) => (lang === "id" ? TAGS.find((x) => x.key === tg)?.id_ : TAGS.find((x) => x.key === tg)?.en)).join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div style={{ marginTop: 20 }}>
              <input
                className="rf-input"
                style={{ width: "100%", boxSizing: "border-box", marginBottom: 12 }}
                placeholder={t.journalSearchPh}
                value={journalQuery}
                onChange={(e) => setJournalQuery(e.target.value)}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{t.filterByTag}</span>
                <button
                  onClick={() => setTagFilter(null)}
                  style={{ background: !tagFilter ? "var(--clay)" : "transparent", color: !tagFilter ? "var(--paper)" : "var(--ink-soft)", border: "1px solid var(--line)", borderRadius: 999, padding: "3px 10px", fontSize: 11.5, cursor: "pointer" }}
                >
                  {t.filterAllTags}
                </button>
                {TAGS.map((tg) => (
                  <button
                    key={tg.key}
                    onClick={() => setTagFilter((cur) => (cur === tg.key ? null : tg.key))}
                    style={{ background: tagFilter === tg.key ? "var(--clay)" : "transparent", color: tagFilter === tg.key ? "var(--paper)" : "var(--ink-soft)", border: "1px solid var(--line)", borderRadius: 999, padding: "3px 10px", fontSize: 11.5, cursor: "pointer" }}
                  >
                    {lang === "id" ? tg.id_ : tg.en}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <button onClick={() => setCalendarOpen((v) => !v)} className="rf-btn" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--ink-soft)", padding: "7px 14px", fontSize: 13 }}>
                {calendarOpen ? t.calendarClose : t.calendarToggle}
              </button>
              {calendarOpen && (
                <div style={{ marginTop: 12 }}>
                  <MiniCalendar
                    entries={entries}
                    viewMonth={calendarMonth}
                    onChangeMonth={setCalendarMonth}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    lang={lang}
                  />
                  {selectedDate && (
                    <button onClick={() => setSelectedDate(null)} className="rf-btn" style={{ background: "transparent", border: "none", color: "var(--clay-dark)", fontSize: 13, padding: 0, marginBottom: 10, textDecoration: "underline" }}>
                      {t.calendarShowAll}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginTop: 20 }}>
              {(() => {
                const q = journalQuery.trim().toLowerCase();
                let visibleEntries = selectedDate ? entries.filter((e) => sameDay(e.ts, selectedDate)) : entries;
                if (tagFilter) visibleEntries = visibleEntries.filter((e) => (e.tags || []).includes(tagFilter));
                if (q) visibleEntries = visibleEntries.filter((e) => e.text.toLowerCase().includes(q) || (e.title || "").toLowerCase().includes(q));
                if (visibleEntries.length === 0) {
                  const reason = q || tagFilter ? t.journalSearchNoResults : (selectedDate ? t.calendarNoEntries : t.empty_journal);
                  return <p style={{ color: "var(--ink-soft)" }}>{reason}</p>;
                }
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {visibleEntries.map((e) => {
                      const m = MOODS.find((mm) => mm.key === e.mood) || MOODS[0];
                      const expanded = expandedEntry === e.id;
                      const isLong = e.text.length > 220;
                      return (
                        <div key={e.id} className="rf-card" style={{ padding: 18 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={{ width: 10, height: 10, borderRadius: "50%", background: m.color, display: "inline-block" }} />
                              <span className="rf-mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>{formatDate(e.ts, lang)} · {t.moods[e.mood]}</span>
                              <IntensityDots value={e.moodIntensity} color={m.color} />
                              {e.isPublic && <span style={{ fontSize: 10, background: "var(--gold)", color: "var(--paper-card)", padding: "2px 8px", borderRadius: 999 }}>{t.publicBadge}</span>}
                            </div>
                            <button onClick={() => handleDelete(e.id)} style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 12, cursor: "pointer" }}>{t.deleteEntry}</button>
                          </div>
                          {e.title && <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 15.5 }}>{e.title}</p>}
                          <MediaBlock url={e.mediaUrl} type={e.mediaType} alt={e.title} />
                          <p style={{ margin: 0, lineHeight: 1.6, fontSize: 15, whiteSpace: "pre-wrap" }}>{isLong && !expanded ? e.text.slice(0, 220) + "…" : e.text}</p>
                          {isLong && <button onClick={() => setExpandedEntry(expanded ? null : e.id)} style={{ background: "none", border: "none", color: "var(--clay-dark)", fontSize: 13, marginTop: 6, cursor: "pointer", padding: 0 }}>{expanded ? t.readLess : t.readMore}</button>}
                          {e.tags && e.tags.length > 0 && (
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                              {e.tags.map((tg) => {
                                const tgObj = TAGS.find((x) => x.key === tg);
                                return (
                                  <span key={tg} style={{ fontSize: 11, color: "var(--ink-soft)", border: "1px solid var(--line)", borderRadius: 999, padding: "2px 9px" }}>
                                    #{tgObj ? (lang === "id" ? tgObj.id_ : tgObj.en) : tg}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </section>
        )}

        {tab === "profile" && (
          <section>
            {!isOwnProfile && (
              <button className="rf-btn" onClick={() => { setViewingUserId(null); setTab("feed"); }} style={{ background: "transparent", border: "1px solid var(--line)", padding: "6px 14px", fontSize: 13, color: "var(--ink-soft)", marginBottom: 18 }}>← {t.backToFeed}</button>
            )}
            {!displayedProfile ? (
              <p style={{ color: "var(--ink-soft)" }}>{t.loading}</p>
            ) : (
              <>
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
                  <Avatar profile={displayedProfile} size={64} />
                  <div>
                    <p className="rf-display" style={{ fontSize: 22, margin: 0 }}>{displayedProfile.displayName}</p>
                    <p className="rf-mono" style={{ fontSize: 12, color: "var(--ink-soft)", margin: "2px 0 0" }}>@{displayedProfile.username}</p>
                    {displayedProfile.status && <p style={{ fontSize: 13, color: "var(--clay-dark)", margin: "4px 0 0" }}>{displayedProfile.status}</p>}
                  </div>
                </div>
                {displayedProfile.bio && <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 16 }}>{displayedProfile.bio}</p>}

                {!isOwnProfile && (
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22, flexWrap: "wrap" }}>
                    <button className="rf-btn" onClick={() => toggleFollow(viewingUserId)} style={{ background: followingList.includes(viewingUserId) ? "var(--paper-card)" : "var(--clay)", border: followingList.includes(viewingUserId) ? "1px solid var(--line)" : "none", color: followingList.includes(viewingUserId) ? "var(--ink-soft)" : "var(--paper)", padding: "9px 20px", fontSize: 14 }}>
                      {followingList.includes(viewingUserId) ? t.following : t.follow}
                    </button>
                    {followerCount !== null && <span className="rf-mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>{followerCount} {t.followers}</span>}
                    {blockedIds.includes(viewingUserId) ? (
                      <button onClick={() => handleUnblock(viewingUserId)} style={{ background: "none", border: "1px solid var(--line)", color: "var(--ink-soft)", fontSize: 12.5, padding: "6px 12px", borderRadius: 999, cursor: "pointer" }}>
                        {t.unblockAction}
                      </button>
                    ) : (
                      <>
                        <button onClick={() => setReportModal({ postId: null, userId: viewingUserId })} style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 12.5, cursor: "pointer", padding: 0 }}>
                          {t.reportAction}
                        </button>
                        <button onClick={() => handleBlock(viewingUserId)} style={{ background: "none", border: "none", color: "#B5654A", fontSize: 12.5, cursor: "pointer", padding: 0 }}>
                          {t.blockAction}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {isOwnProfile && (
                  <>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
                      {[{ label: t.streak, value: streak }, { label: t.totalEntries, value: entries.length }, { label: t.thisWeek, value: thisWeekCount }, { label: t.followingCount, value: followingList.length }].map((s) => (
                        <div key={s.label} className="rf-card" style={{ padding: "14px 16px", flex: "1 1 120px" }}>
                          <p className="rf-display" style={{ fontSize: 26, margin: 0, color: "var(--clay-dark)" }}>{s.value}</p>
                          <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "3px 0 0" }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rf-card" style={{ padding: 22, marginBottom: 24 }}>
                      <p className="rf-display" style={{ fontSize: 18, margin: "0 0 4px", textAlign: "center" }}>{t.treeTitle}</p>
                      <p style={{ fontSize: 12, color: "var(--ink-soft)", textAlign: "center", margin: "0 0 14px" }}>{t.treeDesc}</p>
                      <ReflectionTree entries={entries} />
                    </div>
                    <div className="rf-card" style={{ padding: 22, marginBottom: 28 }}>
                      <p className="rf-display" style={{ fontSize: 18, margin: "0 0 14px" }}>{t.moodDistTitle}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                        {MOODS.map((m) => (
                          <div key={m.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 13, width: 84, color: "var(--ink-soft)" }}>{t.moods[m.key]}</span>
                            <div style={{ flex: 1, background: "var(--paper)", borderRadius: 6, height: 9, overflow: "hidden" }}>
                              <div style={{ width: `${(moodCounts[m.key] / maxMoodCount) * 100}%`, background: m.color, height: "100%" }} />
                            </div>
                            <span className="rf-mono" style={{ fontSize: 11, width: 18, textAlign: "right", color: "var(--ink-soft)" }}>{moodCounts[m.key]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rf-card" style={{ padding: 22, marginBottom: 20 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 6px" }}>{t.exportTitle}</p>
                      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "0 0 14px" }}>{t.exportDesc}</p>
                      {entries.length === 0 ? (
                        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: 0 }}>{t.exportEmpty}</p>
                      ) : (
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <button onClick={exportAsMarkdown} style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)", padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                            {t.exportMarkdownBtn}
                          </button>
                          <button onClick={exportAsJson} style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)", padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                            {t.exportJsonBtn}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="rf-card" style={{ padding: 22, marginBottom: 28, border: "1px solid rgba(181,101,74,0.35)" }}>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 6px", color: "#B5654A" }}>{t.dangerZoneTitle}</p>
                      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "0 0 14px" }}>{t.deleteAccountWarning}</p>
                      {!deleteAccountOpen ? (
                        <button
                          onClick={() => setDeleteAccountOpen(true)}
                          style={{ background: "none", border: "1px solid #B5654A", color: "#B5654A", padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
                        >
                          {t.deleteAccountBtn}
                        </button>
                      ) : (
                        <div>
                          <input
                            className="rf-input"
                            style={{ width: "100%", maxWidth: 280, boxSizing: "border-box", marginBottom: 10 }}
                            placeholder={t.deleteAccountConfirmPh}
                            value={deleteAccountConfirmText}
                            onChange={(e) => setDeleteAccountConfirmText(e.target.value)}
                          />
                          {deleteAccountError && <p style={{ color: "#B5654A", fontSize: 12.5, marginBottom: 8 }}>{deleteAccountError}</p>}
                          <div style={{ display: "flex", gap: 10 }}>
                            <button
                              onClick={handleDeleteAccount}
                              disabled={deleteAccountLoading}
                              style={{ background: "#B5654A", border: "none", color: "#fff", padding: "9px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer", opacity: deleteAccountLoading ? 0.7 : 1 }}
                            >
                              {deleteAccountLoading ? "…" : t.deleteAccountConfirmBtn}
                            </button>
                            <button
                              onClick={() => { setDeleteAccountOpen(false); setDeleteAccountConfirmText(""); setDeleteAccountError(""); }}
                              style={{ background: "none", border: "1px solid var(--line)", color: "var(--ink-soft)", padding: "9px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
                            >
                              {t.deleteAccountCancel}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 10 }}>
                  {isOwnProfile ? t.nav.feed : t.noPostsYet}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {(isOwnProfile ? feed.filter((p) => p.userId === account.userId) : viewedPosts).length === 0 && (
                    <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>{t.noPostsYet}</p>
                  )}
                  {(isOwnProfile ? feed.filter((p) => p.userId === account.userId) : viewedPosts).map((post) => {
                    const m = MOODS.find((mm) => mm.key === post.mood) || MOODS[0];
                    const trKey = `profpost-${post.id}`;
                    const tr = translations[trKey];
                    const showingTr = tr?.showing && tr?.text;
                    return (
                      <div key={post.id} className="rf-card" style={{ padding: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ width: 9, height: 9, borderRadius: "50%", background: m.color, display: "inline-block" }} />
                          <span className="rf-mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>{formatDate(post.ts, lang)}</span>
                        </div>
                        {post.title && <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 15 }}>{showingTr && tr.title ? tr.title : post.title}</p>}
                        <MediaBlock url={post.mediaUrl} type={post.mediaType} alt={post.title} />
                        <p style={{ margin: "0 0 6px", fontSize: 14.5, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{showingTr ? tr.text : post.text}</p>
                        <button
                          onClick={() => handleTranslate(trKey, post.title, post.text)}
                          style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 12, cursor: "pointer", padding: 0 }}
                        >
                          {tr?.loading ? t.translating : tr?.error ? t.translateError : showingTr ? t.showOriginal : t.translateBtn}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        )}
      </main>
      <footer style={{ textAlign: "center", padding: "20px 20px 40px", fontSize: 11.5, color: "var(--ink-soft)" }}>
        <button type="button" onClick={() => setLegalPage("privacy")} style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 11.5, textDecoration: "underline", cursor: "pointer", padding: 0 }}>{t.legalPrivacyLink}</button>
        {" · "}
        <button type="button" onClick={() => setLegalPage("terms")} style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 11.5, textDecoration: "underline", cursor: "pointer", padding: 0 }}>{t.legalTermsLink}</button>
      </footer>
      <LegalModal page={legalPage} onClose={() => setLegalPage(null)} t={t} lang={lang} />
      <ReportModal
        open={!!reportModal}
        onClose={closeReportModal}
        reason={reportReason}
        setReason={setReportReason}
        onSubmit={submitReport}
        sending={reportSending}
        done={reportDone}
        t={t}
      />
    </div>
  );
}
