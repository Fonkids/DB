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

async function updateMultimedia(ariketaId, edukia, file) {
  await uploadFile("multimedia", `${ariketaId}/${edukia}`, file);
}

async function deleteMultimedia(ariketaId, edukia) {
  await deleteFile("multimedia", `${ariketaId}/${edukia}`);
}

async function getAvatarUrl(uid, pfp) {
  return getFileUrl("pfp", `${uid}/${pfp}`);
}

async function updateAvatar(uid, pfp, file) {
  await uploadFile("pfp", `${uid}/${pfp}`, file);
}

async function deleteAvatar(uid, pfp) {
  await deleteFile("pfp", `${uid}/${pfp}`);
}


module.exports.getMultimediaUrl = getMultimediaUrl;
module.exports.getFileUrl = getFileUrl;
module.exports.uploadFile = uploadFile;
module.exports.deleteFile = deleteFile;
module.exports.getAvatarUrl = getAvatarUrl;
module.exports.updateAvatar = updateAvatar;
module.exports.deleteAvatar = deleteAvatar;
module.exports.updateMultimedia = updateMultimedia;
module.exports.deleteMultimedia = deleteMultimedia;