// Rumus KPI dari PRD (M9) dan BRD (bagian 3). Semua tanggal berupa string "YYYY-MM-DD".

export const STATUS_ABSENSI = ["hadir", "telat", "izin", "sakit", "alfa", "diganti", "libur"] as const;
export type StatusAbsensi = (typeof STATUS_ABSENSI)[number];

const TERISI: ReadonlySet<StatusAbsensi> = new Set(["hadir", "telat", "diganti"]);

/** Selisih hari kalender b - a. */
export const selisihHari = (a: string, b: string) =>
  Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);

/** Fill rate = slot terisi (hadir, telat, diganti) ÷ slot wajib (semua kecuali libur). Null jika tidak ada slot wajib. */
export function fillRate(statuses: Iterable<StatusAbsensi>): number | null {
  let wajib = 0;
  let terisi = 0;
  for (const s of statuses) {
    if (s === "libur") continue;
    wajib++;
    if (TERISI.has(s)) terisi++;
  }
  return wajib === 0 ? null : terisi / wajib;
}

export const BUCKET_UMUR = ["0-30", "31-60", "61-90", ">90"] as const;
export type BucketUmur = (typeof BUCKET_UMUR)[number];

/** Umur piutang berdasarkan hari lewat jatuh tempo; yang belum jatuh tempo masuk "0-30". */
export function bucketUmur(jatuhTempo: string, hari: string): BucketUmur {
  const lewat = selisihHari(jatuhTempo, hari);
  if (lewat <= 30) return "0-30";
  if (lewat <= 60) return "31-60";
  if (lewat <= 90) return "61-90";
  return ">90";
}

export type StatusDokumen = "berlaku" | "segera" | "kedaluwarsa";

/** Status dokumen legal: "segera" bila berakhir ≤ 30 hari lagi. Tanpa tanggal berakhir = berlaku. */
export function statusDokumen(berlakuSampai: string | null, hari: string): { status: StatusDokumen; sisaHari: number | null } {
  if (!berlakuSampai) return { status: "berlaku", sisaHari: null };
  const sisaHari = selisihHari(hari, berlakuSampai);
  if (sisaHari < 0) return { status: "kedaluwarsa", sisaHari };
  return { status: sisaHari <= 30 ? "segera" : "berlaku", sisaHari };
}

/** Waktu deploy rata-rata: hari dari kontrak ditandatangani sampai petugas pertama aktif. Kontrak tanpa penempatan diabaikan. */
export function rataWaktuDeploy(kontrak: { ditandatangani: string; penempatanPertama: string | null }[]): number | null {
  const hari = kontrak.flatMap((k) => (k.penempatanPertama ? [selisihHari(k.ditandatangani, k.penempatanPertama)] : []));
  return hari.length === 0 ? null : hari.reduce((a, b) => a + b, 0) / hari.length;
}
