/*IKASLE BATEN KONTSULTAK*/
/*Ikasle batek ariketa baten erantzunak bidaliko ditu*/
const { admin, dbRef } = require("./config");

const STUDENT_UID = process.env.STUDENT_UID;
const MOTA = "P1";

// 1. Sesio berria hasi
async function startSesioa(uid) {
  var newRef = dbRef.child("sesioak/" + uid).push();
  await newRef.set({ data: Date.now(), amaituta: false });

  return newRef.key;
}

// 2. Lortu mota horri dagokion ariketa
async function getAriketa(mota) {
  var queryResult = await dbRef.child("ariketak").orderByChild("mota").equalTo(mota).limitToFirst(1).get();
  var ariketa = null;
  queryResult.forEach(function (c) { ariketa = Object.assign({ id: c.key }, c.val()); });
  return ariketa;
}

// 3. Ariketa horretarako galdera-sorta lortu
async function getGalderak(ariketaId) {
  var queryResult = await dbRef.child("ariketak/" + ariketaId + "/elementuak").orderByChild("ordena").get();
  var list = [];
  queryResult.forEach(function (c) { list.push(Object.assign({ id: c.key }, c.val())); });
  return list;
}

// 4. Saiakera gorde sesioan
async function saveSaiakera(uid, sesioId, ariketaId, zkia, saiakera) {
  await dbRef.child("sesioak/" + uid + "/" + sesioId + "/saiakerak/" + ariketaId + "_" + zkia).set(saiakera);
}

// 5. Sesioa amaitu: saiakerak batu eta sesioa eguneratu
async function endSesioa(uid, sesioId) {
  var path = "sesioak/" + uid + "/" + sesioId;
  var queryResult = await dbRef.child(path + "/saiakerak").get();
  var puntuazioaGuztira = 0, zuzenak = 0, okerrak = 0;
  queryResult.forEach(function (s) {
    var v = s.val();
    puntuazioaGuztira += v.puntuazioa;
    zuzenak += v.zuzenak;
    okerrak += v.okerrak;
  });
  var nota = puntuazioaGuztira;
  var result = { amaituta: true, puntuazioaGuztira: puntuazioaGuztira, zuzenak: zuzenak, okerrak: okerrak, nota: nota };
  await dbRef.child(path).update(result);
  return result;
}

(async () => {
  try {
    if (!STUDENT_UID) throw new Error("Missing environment variable STUDENT_UID (begiratu .env fitxategia)");

    var sesioId = await startSesioa(STUDENT_UID);
    console.log("Sesio berria:", sesioId);

    var ariketa = await getAriketa(MOTA);
    console.log("Ariketa:", ariketa.id);

    var galderak = await getGalderak(ariketa.id);
    console.log("Galderak:", galderak.length);

    // Erantzunen emaitza
    await saveSaiakera(STUDENT_UID, sesioId, ariketa.id, 1, { denbora: 10, zuzenak: 1, okerrak: 1, puntuazioa: 5 });
    console.log("Saiakera gordeta");

    console.log("Sesioa amaituta:", await endSesioa(STUDENT_UID, sesioId));
  } catch (e) {
    console.error("ERROR:", e.code || "", e.message || e);
  } finally {
    await admin.app().delete(); // konexioa itxi
  }
})();