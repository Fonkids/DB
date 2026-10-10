const { dbRef, admin } = require("./config");
/*IRAKASLE BATEN KONTSULTAK*/ 
/*Adibide gisa, irakasle batek existitzen diren ariketen datuak ikusiko ditu*/
async function getAriketakByMota(mota) {
  var queryResult = await dbRef.child("ariketak").orderByChild("mota").equalTo(mota).get();
  return queryResult.val();
}

(async () => {
  try {
    var ariketak = await getAriketakByMota("P1");
    console.log(JSON.stringify(ariketak, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await admin.app().delete();
  }
})();
