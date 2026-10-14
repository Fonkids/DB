const { storageSB, createStorageAdminClient } = require("./config");



async function getFileUrl(bucket, pathToFile) {
  const { data, error } = storageSB.from(bucket).getPublicUrl(pathToFile);
  if (error) throw new Error(`Failed to get file URL: ${error.message}`);
  return data.publicUrl;
}

async function uploadFile(bucket, pathToFile, file, contentType) {
  const { data, error } = await createStorageAdminClient().from(bucket).upload(pathToFile, file, {
    upsert: true,
    contentType: contentType || (file && file.type) || "application/octet-stream",
  });
  if (error) throw new Error(`Failed to upload ${bucket}/${pathToFile}: ${error.message}`);
  return data;
}

async function deleteFile(bucket, pathToFile) {
  const { data, error } = await createStorageAdminClient().from(bucket).remove([pathToFile]);
  if (error) throw new Error(`Failed to delete ${bucket}/${pathToFile}: ${error.message}`);
  return data;
}

async function updateFile(bucket, pathToFile, file, contentType) {
  const { data, error } = await createStorageAdminClient().from(bucket).update(pathToFile, file, {
    contentType: contentType || (file && file.type) || "application/octet-stream",
  });
  if (error) throw new Error(`Failed to update ${bucket}/${pathToFile}: ${error.message}`);
  return data;
}

async function getMultimediaUrl(ariketaId, edukia) {
  return getFileUrl("multimedia", `${ariketaId}/${edukia}`);
}

async function updateMultimedia(ariketaId, edukia, file, contentType) {
  return uploadFile("multimedia", `${ariketaId}/${edukia}`, file, contentType);
}

async function deleteMultimedia(ariketaId, edukia) {
  return deleteFile("multimedia", `${ariketaId}/${edukia}`);
}

async function getAvatarUrl(uid, pfp) {
  return getFileUrl("pfp", `${uid}/${pfp}`);
}

async function updateAvatar(uid, pfp, file, contentType) {
  return uploadFile("pfp", `${uid}/${pfp}`, file, contentType);
}

async function deleteAvatar(uid, pfp) {
  return deleteFile("pfp", `${uid}/${pfp}`);
}


module.exports.getMultimediaUrl = getMultimediaUrl;
module.exports.getFileUrl = getFileUrl;
module.exports.uploadFile = uploadFile;
module.exports.updateFile = updateFile;
module.exports.deleteFile = deleteFile;
module.exports.getAvatarUrl = getAvatarUrl;
module.exports.updateAvatar = updateAvatar;
module.exports.deleteAvatar = deleteAvatar;
module.exports.updateMultimedia = updateMultimedia;
module.exports.deleteMultimedia = deleteMultimedia;