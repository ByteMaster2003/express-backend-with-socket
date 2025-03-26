import crypto from "crypto";

export const generateMD5Hash = (inputString) => {
  const md5Hash = crypto.createHash("md5").update(inputString).digest("hex");
  return md5Hash;
};
