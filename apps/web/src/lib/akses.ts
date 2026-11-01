import type { Pengguna, Peran } from "./auth";

export const LABEL_PERAN: Record<Peran, string> = {
  admin: "Super Admin",
  direksi: "Direksi",
  kepala_cabang: "Kepala Cabang",
  sales: "Sales & Marketing",
  hr: "HR",
  ops: "Operasional",
  spv: "SPV / Team Leader",
  finance: "Finance",
};

/** Peran yang boleh membuka tiap halaman (PRD bagian 3). */
export const AKSES = {
  klien: ["admin", "direksi", "kepala_cabang", "sales", "finance", "ops"],
  kontrak: ["admin", "direksi", "kepala_cabang", "sales", "finance"],
  site: ["admin", "direksi", "kepala_cabang", "ops", "spv", "finance"],
  karyawan: ["admin", "direksi", "kepala_cabang", "hr", "ops"],
  dokumen: ["admin", "direksi", "kepala_cabang", "hr"],
} as const satisfies Record<string, readonly Peran[]>;

export const COOKIE_CABANG = "ips_cabang";

/**
 * Cabang yang boleh dilihat. Pengguna yang terikat cabang selalu dibatasi ke cabangnya;
 * pengguna pusat boleh memilih satu cabang (disimpan di cookie), atau melihat semua (null).
 */
export function cakupanCabang(u: Pengguna, pilihan?: string): number | null {
  if (u.cabangId !== null) return u.cabangId;
  const id = Number(pilihan);
  return Number.isInteger(id) && id > 0 ? id : null;
}
