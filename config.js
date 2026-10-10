require("dotenv").config();
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const { createClient } = require("@supabase/supabase-js");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name} (check your .env file)`);
  return value;
}

// ---- Firebase SDK konfigurazioa (Admin SDK) ----
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve(requireEnv("FIREBASE_PATH")), "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fonkids-8088b-default-rtdb.europe-west1.firebasedatabase.app",
});

const dbRef = admin.database().ref();

// ---- Supabase SDK konfigurazioa ----
const supabase = createClient(
  requireEnv("SUPABASE_URL"),
  requireEnv("SUPABASE_PUBLISHABLE_KEY")
);
const storageSB = supabase.storage;

module.exports = { admin, dbRef, supabase, storageSB };