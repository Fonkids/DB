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

function createStorageAdminClient() {
  const serviceKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "Missing SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY (check your .env file)"
    );
  }

  return createClient(requireEnv("SUPABASE_URL"), serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  }).storage;
}

module.exports = { supabase, storageSB, createStorageAdminClient };