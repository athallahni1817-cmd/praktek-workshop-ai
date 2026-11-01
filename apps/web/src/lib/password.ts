import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

/** Format tersimpan: scrypt$<salt hex>$<hash hex> */
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function cocokPassword(password: string, tersimpan: string) {
  const [algo, saltHex, hashHex] = tersimpan.split("$");
  if (algo !== "scrypt" || !saltHex || !hashHex) return false;
  const harapan = Buffer.from(hashHex, "hex");
  const hasil = await scrypt(password, Buffer.from(saltHex, "hex"), harapan.length);
  return timingSafeEqual(hasil, harapan);
}
