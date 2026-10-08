export function sanitizeText(value = "") {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function normalizeEmail(value = "") {
  return sanitizeText(value).toLowerCase();
}

export function validateUsername(value = "") {
  const clean = sanitizeText(value);
  if (!clean) return "Username tidak boleh kosong.";
  if (clean.length < 3) return "Username minimal 3 karakter.";
  if (!/^[a-zA-Z0-9._-]+$/.test(clean)) {
    return "Username hanya boleh berisi huruf, angka, titik, underscore, dan dash.";
  }
  return "";
}

export function validateDisplayName(value = "") {
  const clean = sanitizeText(value);
  if (!clean) return "Nama tampilan tidak boleh kosong.";
  if (clean.length < 2) return "Nama tampilan terlalu pendek.";
  return "";
}

export function validatePassword(value = "") {
  const clean = String(value ?? "");
  if (!clean) return "Password tidak boleh kosong.";
  if (clean.length < 6) return "Password minimal 6 karakter.";
  return "";
}

export function validateAuthEmail(value = "") {
  const email = normalizeEmail(value);
  if (!email) return "Email tidak boleh kosong.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Format email tidak valid.";
  }
  return "";
}

export function validateReflectionInput({ text, title, actionStep }) {
  const safeText = sanitizeText(text);
  const safeTitle = sanitizeText(title);
  const safeAction = sanitizeText(actionStep);

  if (!safeText) {
    return { valid: false, message: "Refleksi tidak boleh kosong." };
  }

  if (safeText.length < 10) {
    return { valid: false, message: "Refleksi terlalu singkat. Tulis minimal 10 karakter." };
  }

  if (safeTitle.length > 200) {
    return { valid: false, message: "Judul terlalu panjang." };
  }

  if (safeAction.length > 200) {
    return { valid: false, message: "Langkah kecil terlalu panjang." };
  }

  return {
    valid: true,
    clean: {
      text: safeText,
      title: safeTitle,
      actionStep: safeAction,
    },
  };
}
