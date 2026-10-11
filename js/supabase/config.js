require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name} (check your .env file)`);
  return value;
}



// ---- Supabase SDK konfigurazioa ----
const supabase = createClient(
  requireEnv("SUPABASE_URL"),
  requireEnv("SUPABASE_PUBLISHABLE_KEY")
);
const storageSB = supabase.storage;

module.exports = {supabase, storageSB };