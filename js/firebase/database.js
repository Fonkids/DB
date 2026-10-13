const { admin, dbRef } = require("./config");
/*-------
TODO
- multimedia/PFP-ren bat eguneratzen/ezabatzen denean, path-a eguneratu behar da. 
- auth????? ni idea
- probatu multimedia fitxategiak igotzen
- ...
---*/
function snapToArray(snapshot) {
  const output = [];
  snapshot.forEach((child) => {
    output.push({ id: child.key, ...child.val() });
  });
  return output;
}

async function getAriketakByMota(mota) {
  const queryResult = await dbRef.child("ariketak").orderByChild("mota").equalTo(mota).get();
  return snapToArray(queryResult);
}

async function getGalderak(ariketaId) {
  const queryResult = await dbRef.child(`ariketak/${ariketaId}/elementuak`).orderByChild("ordena").get();
  return snapToArray(queryResult);
}

async function startSesioa(uid) {
  const newRef = dbRef.child(`sesioak/${uid}`).push();
  await newRef.set({ data: Date.now(), amaituta: false });
  return newRef.key;
}

async function saveSaiakera(uid, sesioId, ariketaId, zkia, saiakera) {
  await dbRef
    .child(`sesioak/${uid}/${sesioId}/saiakerak/${ariketaId}_${zkia}`)
    .set(saiakera);
}

async function endSesioa(uid, sesioId) {
  const path = `sesioak/${uid}/${sesioId}`;
  const queryResult = await dbRef.child(`${path}/saiakerak`).get();

  let puntuazioaGuztira = 0;
  let zuzenak = 0;
  let okerrak = 0;

  queryResult.forEach((s) => {
    const value = s.val();
    puntuazioaGuztira += value.puntuazioa || 0;
    zuzenak += value.zuzenak || 0;
    okerrak += value.okerrak || 0;
  });

 
  const result = {
    amaituta: true,
    puntuazioaGuztira,
    zuzenak,
    okerrak,
    puntuazioaGuztira,
  };

  await dbRef.child(path).update(result);
  return result;
}

async function createTaldea(teacherUid, izena, ikasturtea, ikasleUids) {
  const newRef = dbRef.child("taldeak").push();
  const kideak = {};

  ikasleUids.forEach((uid) => {
    kideak[uid] = true;
  });

  await newRef.set({ irakasleaId: teacherUid, izena, ikasturtea, kideak });
  return newRef.key;
}
async function getIkasleak(){
  const queryResult = await dbRef.child("users").orderByChild("role").equalTo("student").get();
  return snapToArray(queryResult);
}
async function getTaldeakByIrakaslea(teacherUid) {
  const queryResult = await dbRef.child("taldeak").orderByChild("irakasleaId").equalTo(teacherUid).get();
  return snapToArray(queryResult).map((taldea) => ({
    id: taldea.id,
    izena: taldea.izena,
    ikasturtea: taldea.ikasturtea,
    kideKop: Object.keys(taldea.kideak || {}).length,
  }));
}

async function getTaldeStats(taldeaId) {
  const kideakSnap = await dbRef.child(`taldeak/${taldeaId}/kideak`).get();
  const uids = Object.keys(kideakSnap.val() || {});

  return Promise.all(uids.map(async (uid) => {
    const user = (await dbRef.child(`users/${uid}`).get()).val();
    const sesioak = (await dbRef.child(`sesioak/${uid}`).get()).val() || {};
    const amaituak = Object.values(sesioak).filter((sesioa) => sesioa.amaituta);
    const batezbestekoa = amaituak.length
      ? amaituak.reduce((total, sesioa) => total + (sesioa.puntuazioaGuztira || 0), 0) / amaituak.length
      : null;

    return {
      uid,
      izena: user?.username || uid,
      amaituak: amaituak.length,
      batezbestekoa,
    };
  }));
}

async function getSesioak(uid) {
  const snapshot = await dbRef.child(`sesioak/${uid}`).get();
  return snapshot.val() || {};
}

async function getSaiakerak(uid, sesioId) {
  const snapshot = await dbRef.child(`sesioak/${uid}/${sesioId}/saiakerak`).get();
  return snapshot.val() || {};
}


module.exports.getAriketakByMota = getAriketakByMota;
module.exports.getGalderak = getGalderak;
module.exports.startSesioa = startSesioa;
module.exports.saveSaiakera = saveSaiakera;
module.exports.endSesioa = endSesioa;
module.exports.createTaldea = createTaldea;
module.exports.getTaldeakByIrakaslea = getTaldeakByIrakaslea;
module.exports.getTaldeStats = getTaldeStats;
module.exports.getSesioak = getSesioak;
module.exports.getSaiakerak = getSaiakerak;
module.exports.getIkasleak = getIkasleak;

