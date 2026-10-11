const {admin,dbRef} = require("./config");


async function getAriketakByMota(mota) {
    var queryResult = await dbRef.child("ariketak").orderByChild("mota").equalTo(mota).get();
    return queryResult.val();
  }

module.exports = getAriketakByMota;