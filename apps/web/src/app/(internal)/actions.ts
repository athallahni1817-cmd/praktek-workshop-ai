"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hapusSesi, wajibLogin } from "@/lib/auth";
import { COOKIE_CABANG } from "@/lib/akses";

export async function pilihCabang(id: string) {
  const u = await wajibLogin();
  if (u.cabangId !== null) return; // pengguna cabang tidak boleh berpindah cakupan
  const c = await cookies();
  if (id) c.set(COOKIE_CABANG, id, { httpOnly: true, sameSite: "lax", path: "/" });
  else c.delete(COOKIE_CABANG);
}

export async function keluar() {
  await hapusSesi();
  (await cookies()).delete(COOKIE_CABANG);
  redirect("/login");
}
