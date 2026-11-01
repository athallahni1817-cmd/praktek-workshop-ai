import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { pengguna } from "@/db/schema";

// shortcut: sesi berupa cookie bertanda tangan HMAC tanpa tabel sesi (tidak bisa dicabut sebelum kedaluwarsa); ganti ke Supabase Auth saat pilot.
const COOKIE = "ips_sesi";
const UMUR_DETIK = 60 * 60 * 12;

function rahasia() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET belum diisi (minimal 32 karakter) di apps/web/.env.local");
  return s;
}

const tanda = (data: string) => createHmac("sha256", rahasia()).update(data).digest("base64url");

export async function buatSesi(penggunaId: number) {
  const data = Buffer.from(JSON.stringify({ uid: penggunaId, exp: Date.now() + UMUR_DETIK * 1000 })).toString("base64url");
  (await cookies()).set(COOKIE, `${data}.${tanda(data)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UMUR_DETIK,
  });
}

export async function hapusSesi() {
  (await cookies()).delete(COOKIE);
}

async function idDariSesi(): Promise<number | null> {
  const nilai = (await cookies()).get(COOKIE)?.value;
  if (!nilai) return null;
  const [data, sig] = nilai.split(".");
  if (!data || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(tanda(data));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const isi = JSON.parse(Buffer.from(data, "base64url").toString()) as { uid: number; exp: number };
  return isi.exp > Date.now() ? isi.uid : null;
}

export type Pengguna = typeof pengguna.$inferSelect;
export type Peran = Pengguna["peran"];

export async function penggunaSaatIni(): Promise<Pengguna | null> {
  const id = await idDariSesi();
  if (id === null) return null;
  const db = await getDb();
  const [u] = await db.select().from(pengguna).where(eq(pengguna.id, id));
  return u ?? null;
}

/** Wajib login. Pengguna yang masih memakai password awal diarahkan ke halaman ganti password. */
export async function wajibLogin(opsi: { peran?: readonly Peran[]; bolehPasswordAwal?: boolean } = {}) {
  const u = await penggunaSaatIni();
  if (!u) redirect("/login");
  if (u.wajibGantiPassword && !opsi.bolehPasswordAwal) redirect("/ganti-password");
  if (opsi.peran && !opsi.peran.includes(u.peran)) redirect("/");
  return u;
}
