export const AVATAR_EMOJIS = ["🌿", "🍂", "🌾", "🕯️", "🫖", "📖", "🌙", "☀️", "🍁", "🌻", "🪴", "🦋"];
export const AVATAR_COLORS = ["#B5654A", "#6E7B58", "#C69447", "#C98A7C", "#8A6E52", "#7C8B6E"];

export const PROMPTS = [
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

export const MOODS = [
  { key: "calm", color: "var(--moss)" },
  { key: "grateful", color: "var(--gold)" },
  { key: "heavy", color: "var(--ink-soft)" },
  { key: "confused", color: "var(--rose)" },
  { key: "happy", color: "var(--clay)" },
];

export const TAGS = [
  { key: "kuliah", id_: "Kuliah", en: "Study" },
  { key: "keluarga", id_: "Keluarga", en: "Family" },
  { key: "kesehatan", id_: "Kesehatan", en: "Health" },
  { key: "uang", id_: "Uang", en: "Money" },
  { key: "hubungan", id_: "Hubungan", en: "Relationships" },
  { key: "kerja", id_: "Kerja/Karier", en: "Work/Career" },
  { key: "diri", id_: "Diri Sendiri", en: "Self" },
];

export const THEMES = {
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

export const SCENES = [
  { key: "none", icon: "⚪", labelKey: "sceneNone" },
  { key: "gunung", icon: "🏔️", labelKey: "sceneMountain" },
  { key: "laut", icon: "🌊", labelKey: "sceneSea" },
  { key: "hutan", icon: "🌲", labelKey: "sceneForest" },
  { key: "malam", icon: "🌌", labelKey: "sceneNight" },
  { key: "padang", icon: "🌾", labelKey: "sceneMeadow" },
];

export const FONT_OPTIONS = [
  { key: "organik", family: "'Fraunces', serif", google: "Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600", labelKey: "fontOrganic" },
  { key: "elegan", family: "'Playfair Display', serif", google: "Playfair+Display:wght@500;600;700", labelKey: "fontElegant" },
  { key: "tangan", family: "'Caveat', cursive", google: "Caveat:wght@500;600;700", labelKey: "fontHandwritten" },
  { key: "modern", family: "'Space Grotesk', sans-serif", google: "Space+Grotesk:wght@500;600;700", labelKey: "fontModern" },
];

export const MUSIC_PRESETS = [
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
