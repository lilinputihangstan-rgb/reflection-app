import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingEnv = [];
if (!supabaseUrl) missingEnv.push("VITE_SUPABASE_URL");
if (!supabaseAnonKey) missingEnv.push("VITE_SUPABASE_ANON_KEY");

if (missingEnv.length > 0) {
  console.warn(
    `[Reflection] Env belum lengkap: ${missingEnv.join(", ")}. Salin .env.example menjadi .env dan isi credential Supabase Anda.`
  );
}

const safeUrl = supabaseUrl || "https://placeholder.supabase.co";
const safeAnonKey = supabaseAnonKey || "placeholder-anon-key";

export const supabase = createClient(safeUrl, safeAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
