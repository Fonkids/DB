
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const projectRoot = path.resolve(__dirname, "../..");
require("dotenv").config({ path: path.join(projectRoot, ".env") });
function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name} (check your .env file)`);
  return value;
}

// ---- Firebase SDK konfigurazioa (Admin SDK) ----
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve(projectRoot, requireEnv("FIREBASE_PATH")), "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fonkids-8088b-default-rtdb.europe-west1.firebasedatabase.app",
});

const dbRef = admin.database().ref();



module.exports = {admin, dbRef };