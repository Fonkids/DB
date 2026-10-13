const { getAriketakByMota, getGalderak } = require("./firebase/database");
const { getMultimediaUrl } = require("./supabase/storage");

function print(label, value) {
  console.log(`\n# ${label}`);
  if (value !== undefined) console.log(JSON.stringify(value, null, 2));
}

async function listMultimediaUrls(mota = "P2") {
  const ariketak = await getAriketakByMota(mota);

  if (!Array.isArray(ariketak) || ariketak.length === 0) {
    console.log(`No ariketak found for category: ${mota}`);
    return [];
  }

  const results = [];

  for (const ariketa of ariketak) {
    const galderak = await getGalderak(ariketa.id);

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
    const mediaUrls = await listMultimediaUrls("P8");

    if (!mediaUrls.length) {
      console.log("No media URLs were generated.");
      return;
    }

    console.log("MEDIA URLS:");
    for (const entry of mediaUrls) {
      console.log(`${entry.ariketaId} / ${entry.field}: ${entry.url}`);
    }
  } catch (error) {
    console.error("Script failed:", error);
  }
}


  main();
