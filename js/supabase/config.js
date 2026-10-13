const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const projectRoot = path.resolve(__dirname, "../..");
require("dotenv").config({ path: path.join(projectRoot, ".env") });
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