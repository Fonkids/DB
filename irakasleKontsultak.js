const { dbRef, admin, storageSB } = require("./config");
/*IRAKASLE BATEN KONTSULTAK*/ 
/*Adibide gisa, irakasle batek existitzen diren ariketen datuak ikusiko ditu*/



// Irakasle bezala logeatu
async function logIn(email, password){
  try {
    const userCredential = await admin.auth().getUserByEmail(email);
    
    return userCredential;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  } 
}




async function getAriketakByMota(mota) {
  var queryResult = await dbRef.child("ariketak").orderByChild("mota").equalTo(mota).get();
  return queryResult.val();
}



// Supabaseko multimedia edukiaren URL publikoa lortu
function getMultimediaUrl(ariketaId, edukia) {
  const { data, error } = storageSB
    .from("multimedia")
    .getPublicUrl(`${ariketaId}/${edukia}`);

  if (error) throw error;
  return data.publicUrl;
}

(async () => {
  try {
    var ariketak = await getAriketakByMota("P1");
    console.log(JSON.stringify(ariketak, null, 2));
    if (!ariketak) {
      console.log("Ez da ariketarik aurkitu mota honetarako: P1");
      return;
    }

    for (const [ariketaId, ariketa] of Object.entries(ariketak)) {
      for (const [elementuId, elementua] of Object.entries(ariketa.elementuak || {})) {
        const multimediaEdukiak = [
          ["galdera", elementua.galdera],
          ...Object.entries(elementua.erantzunak || {}),
        ];

        for (const [edukiMota, edukia] of multimediaEdukiak) {
          if (edukia && edukia.formatua !== "testua") {
            const url = getMultimediaUrl(ariketaId, edukia.edukia);
            console.log(`${ariketaId}/${elementuId} ${edukiMota}: ${url}`);
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await admin.app().delete();
  }
})();
