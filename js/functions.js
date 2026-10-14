const fs = require("fs/promises");
const path = require("path");
const { getAriketakByMota, getGalderak, updatePfpPath, startSesioa, saveSaiakera, endSesioa } = require("./firebase/database");
const { admin } = require("./firebase/config");
const { getAvatarUrl, getMultimediaUrl, updateAvatar } = require("./supabase/storage");


const projectRoot = path.resolve(__dirname, "..");
const avatarPath = path.join(
  projectRoot,
  "PFP_aesthetic_increible_fonkids_wow_boom_incredible_omg_damn_ze_guay_def_def_final_(1).png"
);
// PROBA: ERABILTZAILE BATEK HAREN PFP EGUNERATZEA
async function updateTeacherAvatar() {
  const uid = process.env.TEACHER_UID;
  if (!uid) {
    throw new Error("Missing environment variable TEACHER_UID");
  }

  const pfpName ="hola"+ avatarPath.split(path.sep).pop();
  const pfp = await fs.readFile(avatarPath);
  await updateAvatar(uid, pfpName, pfp, "image/png");

  const photoURL = await getAvatarUrl(uid, pfpName);
  await updatePfpPath(uid, pfpName);
  console.log(`PFPa eguneratuta!: ${photoURL}`);
}
// PROBA: ARIKETA GUZTIAK LORTU + MULTIMEDIA ESTEKAK
async function listMultimediaUrls(mota = "P2") {
  const ariketak = await getAriketakByMota(mota);

  if (!Array.isArray(ariketak) || ariketak.length === 0) {
    console.log(`Ez dago mota honetarako ariketarik :(  (${mota})`);
    return [];
  }

  const results = [];

  for (const ariketa of ariketak) {
    const galderak = await getGalderak(ariketa.id);
    console.log(JSON.stringify(galderak, null, 2));

    for (const galdera of galderak) {
      const multimedia = [
        ["galdera", galdera.galdera],
        ...Object.entries(galdera.erantzunak || {}).map(([id, answer]) => [`erantzunak.${id}`, answer]),
      ].filter(([, value]) => value && value.formatua && value.formatua !== "testua" && value.edukia);

      for (const [field, value] of multimedia) {
        const url = await getMultimediaUrl(ariketa.id, value.edukia);
        results.push({ ariketaId: ariketa.id, elementuId: galdera.id, field, url });
      }
    }
  }

  return results;
}

async function main() {
  try {
    // PROBA: ERABILTZAILE BATEK HAREN PFP EGUNERATZEA
    await updateTeacherAvatar();
    // PROBA: ARIKETA GUZTIAK LORTU + MULTIMEDIA ESTEKAK
    const mediaUrls = await listMultimediaUrls("P8"); // P8 pantailaren galdera-sorta + multimedia deskargatu

    if (!mediaUrls.length) {
      console.log("Ez dago multimediarik");
      return;
    }

    console.log(
      `MEDIA URLS (${mediaUrls.length}):\n${mediaUrls
        .map((entry) => `${entry.ariketaId} / ${entry.field}: ${entry.url}`)
        .join("\n")}`
    );

    // PROBA: ARIKETA SESIOA SIMULATU
    const uid = process.env.STUDENT_UID;


    // Sesioa hasi
    const sesioId = await startSesioa(uid);

    // Saiakera bat egin A3 ariketaren galdera-sortagaz
    await saveSaiakera(uid, sesioId, "A3", "1", {
      puntuazioa: 7,
      zuzenak: 2,
      okerrak: 1,
    });
    console.log(`Saiakera bat egin da: Ariketa A3 / Galdera 1`);
    const s2 = await saveSaiakera(uid, sesioId, "A3", "2", {
      puntuazioa: 8,
      zuzenak: 2,
      okerrak: 1,
    });
    console.log(`Saiakera bat egin da: Ariketa A3 / Galdera 2`);

    // Sesioa amaitu
    const result = await endSesioa(uid, sesioId);
    console.log(`Sesioa amaituta: ${sesioId}`);
    console.log("Emaitzak: ", JSON.stringify(result));

  } catch (error) {
    console.error("Script failed:", error);
    process.exitCode = 1;
  } finally {
    try {
      await admin.app().delete();
    } catch (error) {
      console.error("Failed to close Firebase Admin app:", error);
      process.exitCode = 1;
    }
  }
}

main();
