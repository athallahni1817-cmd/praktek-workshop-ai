// Format angka, uang, dan tanggal sesuai DESIGN.md bagian 9 (id-ID).

const angka = new Intl.NumberFormat("id-ID");
const satuDesimal = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const formatAngka = (n: number) => angka.format(n);

/** 0.978 -> "97,8%" */
export const formatPersen = (rasio: number) => `${satuDesimal.format(rasio * 100)}%`;

/** 45000000 -> "Rp 45.000.000" */
export const formatRupiah = (n: number) => `${n < 0 ? "−" : ""}Rp ${angka.format(Math.round(Math.abs(n)))}`;

/** 1200000000 -> "Rp 1,2 M", 450000000 -> "Rp 450 jt" (untuk kartu KPI) */
export function formatRupiahSingkat(n: number) {
  const abs = Math.abs(n);
  const tanda = n < 0 ? "−" : "";
  if (abs >= 1e9) return `${tanda}Rp ${satuDesimal.format(abs / 1e9)} M`;
  if (abs >= 1e6) return `${tanda}Rp ${angka.format(Math.round(abs / 1e6))} jt`;
  return formatRupiah(n);
}

const tanggal = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "2026-11-01" -> "1 Nov 2026" */
export const formatTanggal = (isoDate: string) => tanggal.format(new Date(`${isoDate}T00:00:00Z`));

/** Tanggal hari ini (YYYY-MM-DD) di zona waktu site, mis. "Asia/Makassar". */
export const hariIni = (timeZone = "Asia/Jakarta", now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
