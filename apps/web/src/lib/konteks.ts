import "server-only";
import { cookies } from "next/headers";
import { COOKIE_CABANG, cakupanCabang } from "./akses";
import { type Peran, wajibLogin } from "./auth";

/** Pengguna yang login + cakupan cabang yang berlaku untuk halaman ini. */
export async function konteks(peran?: readonly Peran[]) {
  const pengguna = await wajibLogin({ peran });
  const cabangId = cakupanCabang(pengguna, (await cookies()).get(COOKIE_CABANG)?.value);
  return { pengguna, cabangId };
}
