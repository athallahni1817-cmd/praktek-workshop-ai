"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { logAudit, pengguna } from "@/db/schema";
import { buatSesi, wajibLogin } from "@/lib/auth";
import { cocokPassword, hashPassword } from "@/lib/password";

export type StatusForm = { pesan: string } | undefined;

const BATAS_GAGAL = 5;
const KUNCI_MENIT = 15;
const jamWIB = (d: Date) => new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(d).replace(".", ":");

export async function masuk(_: StatusForm, fd: FormData): Promise<StatusForm> {
  const username = String(fd.get("username") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!username || !password) return { pesan: "Isi username dan password." };

  const db = await getDb();
  const [u] = await db.select().from(pengguna).where(eq(pengguna.username, username));
  const salah = { pesan: "Username atau password salah." };
  if (!u) return salah;
  if (u.terkunciSampai && u.terkunciSampai > new Date()) {
    return { pesan: `Akun dikunci sementara setelah ${BATAS_GAGAL} kali gagal login. Coba lagi pukul ${jamWIB(u.terkunciSampai)} WIB, atau minta reset ke admin.` };
  }

  if (!(await cocokPassword(password, u.passwordHash))) {
    const gagal = u.gagalLogin + 1;
    await db
      .update(pengguna)
      .set(gagal >= BATAS_GAGAL ? { gagalLogin: 0, terkunciSampai: new Date(Date.now() + KUNCI_MENIT * 60_000) } : { gagalLogin: gagal })
      .where(eq(pengguna.id, u.id));
    await db.insert(logAudit).values({ penggunaId: u.id, aksi: "login_gagal" });
    return salah;
  }

  await db.update(pengguna).set({ gagalLogin: 0, terkunciSampai: null }).where(eq(pengguna.id, u.id));
  await db.insert(logAudit).values({ penggunaId: u.id, aksi: "login" });
  await buatSesi(u.id);
  redirect(u.wajibGantiPassword ? "/ganti-password" : "/");
}

export async function gantiPassword(_: StatusForm, fd: FormData): Promise<StatusForm> {
  const u = await wajibLogin({ bolehPasswordAwal: true });
  const lama = String(fd.get("lama") ?? "");
  const baru = String(fd.get("baru") ?? "");
  const ulang = String(fd.get("ulang") ?? "");

  if (!(await cocokPassword(lama, u.passwordHash))) return { pesan: "Password saat ini salah." };
  if (baru.length < 8) return { pesan: "Password baru minimal 8 karakter." };
  if (baru === lama) return { pesan: "Password baru harus berbeda dari password saat ini." };
  if (baru !== ulang) return { pesan: "Ulangi password baru dengan sama persis." };

  const db = await getDb();
  await db.update(pengguna).set({ passwordHash: await hashPassword(baru), wajibGantiPassword: false }).where(eq(pengguna.id, u.id));
  await db.insert(logAudit).values({ penggunaId: u.id, aksi: "ganti_password" });
  redirect("/");
}
