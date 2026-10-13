const { storageSB } = require("./config");



async function getFileUrl(bucket, pathToFile) {
  const result = storageSB.from(bucket).getPublicUrl(pathToFile);
  if (result.error) throw new Error(result.error.message);
  return result.data.publicUrl;
}

async function uploadFile(bucket, pathToFile, file) {
  return storageSB.from(bucket).upload(pathToFile, file, {
    upsert: true,
    contentType: file.type || "application/octet-stream",
  });
}

async function deleteFile(bucket, pathToFile) {
  return storageSB.from(bucket).remove([pathToFile]);
}

async function getMultimediaUrl(ariketaId, edukia) {
  return getFileUrl("multimedia", `${ariketaId}/${edukia}`);
}


async function getAvatarUrl(uid, pfp) {
  return getFileUrl("pfp", `${uid}/${pfp}`);
}


module.exports.getMultimediaUrl = getMultimediaUrl;
module.exports.getFileUrl = getFileUrl;
module.exports.uploadFile = uploadFile;
module.exports.deleteFile = deleteFile;
module.exports.getAvatarUrl = getAvatarUrl;
