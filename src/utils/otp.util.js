import crypto from "crypto";

import bcrypt from "bcryptjs";

import { generateMD5Hash, redisClient } from "./index.js";

const generateOTP = async (userId) => {
  const randomBytes = crypto.randomBytes(3);
  const timestamp = Date.now();
  const bufferData = Buffer.concat([
    randomBytes,
    Buffer.from(userId.toString()),
    Buffer.from(timestamp.toString())
  ]);

  const hash = crypto.createHash("sha256");
  const combinedHash = hash.update(bufferData);
  const finalHash = combinedHash.digest("hex");

  const OTP = parseInt(finalHash, 16) % 1000000;
  const OTPString = OTP.toString().padEnd(6, "0");
  const hashedOTP = bcrypt.hashSync(OTPString, 10);
  await redisClient.set(generateMD5Hash(`${userId}_otp`), hashedOTP, "EX", 10 * 60);

  return OTPString;
};

const compareOTP = async (otp, userId) => {
  const cacheKey = generateMD5Hash(`${userId}_otp`);
  const OTP = await redisClient.get(cacheKey);

  if (!OTP) return false;
  await redisClient.del(cacheKey);
  return bcrypt.compareSync(otp.toString(), OTP);
};

export { generateOTP, compareOTP };
