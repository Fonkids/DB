const { storageSB } = require("./config");


function getMultimediaUrl(ariketaId, edukia) {
    const { data, error } = storageSB
      .from("multimedia")
      .getPublicUrl(`${ariketaId}/${edukia}`);
  
    if (error) throw error;
    return data.publicUrl;
  }

  module.exports = getMultimediaUrl;

