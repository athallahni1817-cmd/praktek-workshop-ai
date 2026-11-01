// Mengisi database lokal dengan data contoh. Jalankan: pnpm db:seed (hentikan `pnpm dev` dulu).
// Cabang & dokumen legal = data asli dari Company Profile IPS 2026. Klien, karyawan, dan angka = fiktif.
import { hariIni } from "@ips/shared";
import { sql } from "drizzle-orm";
import { hashPassword } from "../lib/password";
import { getDb } from "./index";
import * as s from "./schema";

const password = process.env.SEED_PASSWORD;
if (!password || password.length < 8) throw new Error("Isi SEED_PASSWORD (minimal 8 karakter) di apps/web/.env.local");

// Acak tapi bisa diulang (mulberry32), supaya hasil seed selalu sama.
let state = 20261101;
const acak = () => {
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const antara = (min: number, max: number) => Math.floor(min + acak() * (max - min + 1));
const pilih = <T,>(xs: readonly T[]) => xs[Math.floor(acak() * xs.length)];
const tambah = (iso: string, n: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const dalamBatch = async <T,>(rows: T[], simpan: (b: T[]) => Promise<unknown>) => {
  for (let i = 0; i < rows.length; i += 500) await simpan(rows.slice(i, i + 500));
};

const HARI = hariIni();

/** Tanggal cut-off (tgl 25) periode yang sudah selesai, mundur `mundur` bulan dari yang terakhir. */
function cutOff(mundur: number) {
  const [y, m, d] = HARI.split("-").map(Number);
  const bulan = m - 1 - (d >= 25 ? 0 : 1) - mundur;
  return new Date(Date.UTC(y, bulan, 25)).toISOString().slice(0, 10);
}

const CABANG = [
  ["JKT1", "Jakarta 1"], ["JKT2", "Jakarta 2"], ["BDG", "Bandung"], ["CRB", "Cirebon"], ["TGL", "Tegal"],
  ["PWT", "Purwokerto"], ["PLM", "Palembang"], ["SMG", "Semarang"], ["SOC", "Solo"], ["YOG", "Yogyakarta"],
  ["MAD", "Madiun"], ["KDR", "Kediri"], ["MLG", "Malang"], ["JBR", "Jember"], ["LMG", "Lamongan"],
  ["SBY", "Surabaya"], ["DPS", "Denpasar"], ["BJM", "Banjarmasin"], ["SMD", "Samarinda"], ["MKS", "Makassar"],
] as const;
const WITA = new Set(["DPS", "BJM", "SMD", "MKS"]);

const POSISI = [
  { nama: "Cleaner", bidang: "kebersihan", tarif: 5_400_000 },
  { nama: "Team Leader Cleaning", bidang: "kebersihan", tarif: 6_300_000 },
  { nama: "Satpam", bidang: "pengamanan", tarif: 6_100_000 },
  { nama: "Danru Satpam", bidang: "pengamanan", tarif: 6_900_000 },
  { nama: "Gardener", bidang: "penunjang", tarif: 5_200_000 },
  { nama: "Driver Angkutan Pekerja", bidang: "angkutan", tarif: 5_900_000 },
  { nama: "Front Office", bidang: "berisiko", tarif: 5_600_000 },
  { nama: "Tenaga Produksi", bidang: "berisiko", tarif: 5_300_000 },
] as const;

// Cabang yang punya klien contoh, dengan "kualitas" yang berbeda agar perbandingan antar-cabang terlihat.
const CABANG_AKTIF: Record<string, { klien: number; kualitas: number }> = {
  SBY: { klien: 9, kualitas: 0.97 }, JKT1: { klien: 5, kualitas: 0.95 }, MLG: { klien: 3, kualitas: 0.98 },
  SMG: { klien: 3, kualitas: 0.93 }, DPS: { klien: 3, kualitas: 0.9 }, BDG: { klien: 2, kualitas: 0.96 },
  YOG: { klien: 2, kualitas: 0.94 }, MKS: { klien: 2, kualitas: 0.88 },
};

const SEGMEN = [
  { segmen: "Mal & properti", site: [1, 2], posisi: ["Cleaner", "Team Leader Cleaning", "Satpam", "Danru Satpam"] },
  { segmen: "Rumah sakit", site: [1, 1], posisi: ["Cleaner", "Team Leader Cleaning", "Satpam", "Gardener"] },
  { segmen: "Jaringan F&B", site: [3, 6], posisi: ["Cleaner", "Satpam"] },
  { segmen: "Hotel", site: [2, 4], posisi: ["Cleaner", "Satpam", "Front Office"] },
  { segmen: "Manufaktur", site: [1, 1], posisi: ["Satpam", "Driver Angkutan Pekerja", "Tenaga Produksi", "Cleaner"] },
  { segmen: "Pendidikan", site: [1, 2], posisi: ["Cleaner", "Satpam", "Gardener"] },
] as const;

const NAMA_DEPAN = ["Agus", "Budi", "Citra", "Dewi", "Eko", "Fitri", "Gilang", "Hendra", "Indah", "Joko", "Kartika", "Lukman", "Maya", "Nur", "Oki", "Putri", "Rizky", "Sari", "Teguh", "Umi", "Wahyu", "Yuni"];
const NAMA_BELAKANG = ["Santoso", "Wijaya", "Lestari", "Pratama", "Hidayat", "Saputra", "Wulandari", "Nugroho", "Rahayu", "Setiawan", "Kurniawan", "Anggraini"];
const ALASAN_KELUAR = ["Resign", "Habis kontrak", "Mangkir", "Diberhentikan"];
const ALASAN_KALAH = ["Harga", "Relasi pesaing", "Kualitas/riwayat petugas", "Cakupan kota", "Legalitas/dokumen", "Klien kerjakan sendiri"];
const ALASAN_MENANG = ["Cakupan multi-kota", "Harga", "Kualitas", "Rekomendasi", "Kepatuhan"];

async function main() {
  const db = await getDb();
  await db.execute(sql`truncate table log_audit, absensi_harian, invoice, penempatan, karyawan, formasi, site, kontrak, klien, peluang, pengguna, posisi, cabang, dokumen_legal restart identity cascade`);

  const cabang = await db
    .insert(s.cabang)
    .values(CABANG.map(([kode, nama]) => ({ kode, nama, zonaWaktu: WITA.has(kode) ? "Asia/Makassar" : "Asia/Jakarta" })))
    .returning();
  const idCabang = Object.fromEntries(cabang.map((c) => [c.kode, c.id]));

  const posisi = await db.insert(s.posisi).values(POSISI.map(({ nama, bidang }) => ({ nama, bidang }))).returning();
  const posisiByNama = Object.fromEntries(posisi.map((p) => [p.nama, p]));
  const tarif = Object.fromEntries(POSISI.map((p) => [p.nama, p.tarif]));

  const passwordHash = await hashPassword(password!);
  await db.insert(s.pengguna).values([
    { username: "admin", nama: "Admin Sistem", peran: "admin", passwordHash },
    { username: "direksi", nama: "Direksi IPS", peran: "direksi", passwordHash },
    { username: "kacab.sby", nama: "Kepala Cabang Surabaya", peran: "kepala_cabang", cabangId: idCabang.SBY, passwordHash },
    { username: "finance", nama: "Finance Pusat", peran: "finance", passwordHash },
    { username: "hr", nama: "HR Pusat", peran: "hr", passwordHash },
  ]);

  await db.insert(s.dokumenLegal).values([
    { nama: "Akta Pendirian & SK Kemenkumham", nomor: "AHU-5862.AH.01.01.Tahun 2010", penerbit: "Kemenkumham", berlakuSampai: null },
    { nama: "NIB", nomor: "0220004651399", penerbit: "OSS", berlakuSampai: null },
    { nama: "SIO Badan Usaha Jasa Pengamanan", nomor: "02200046513990003", penerbit: "Polda Jatim", berlakuSampai: null },
    { nama: "NPWP", nomor: "0031-0561-2064-3000", penerbit: "DJP · KPP Pratama Sidoarjo Utara", berlakuSampai: null },
    { nama: "Kartu Anggota APKLINDO", nomor: "006.23092025", penerbit: "APKLINDO", berlakuSampai: "2026-09-25" },
    { nama: "Sertifikat Anggota ABUJAPI", nomor: "00.16/06661/00384/02-03-2026/01", penerbit: "ABUJAPI", berlakuSampai: "2027-03-01" },
  ]);

  let noKlien = 0;
  let noNik = 0;
  const karyawanBaru: (typeof s.karyawan.$inferInsert & { _formasi?: number; _mulai?: string; _kualitas: number })[] = [];
  const invoiceBaru: (typeof s.invoice.$inferInsert)[] = [];

  const namaOrang = () => `${pilih(NAMA_DEPAN)} ${pilih(NAMA_BELAKANG)}`;
  const nikBaru = () => `IPS-${String(++noNik).padStart(5, "0")}`;

  for (const [kode, { klien: jumlahKlien, kualitas }] of Object.entries(CABANG_AKTIF)) {
    for (let k = 0; k < jumlahKlien; k++) {
      const seg = pilih(SEGMEN);
      const label = String.fromCharCode(65 + (noKlien % 26)) + (noKlien >= 26 ? Math.floor(noKlien / 26) : "");
      noKlien++;
      const [kl] = await db.insert(s.klien).values({ nama: `Klien Contoh ${label}`, segmen: seg.segmen, cabangId: idCabang[kode] }).returning();

      const ditandatangani = tambah(HARI, -antara(20, 700));
      const mulai = tambah(ditandatangani, antara(3, 21)); // waktu deploy
      const berakhir = acak() < 0.25 ? tambah(HARI, antara(5, 90)) : tambah(mulai, 365 * antara(1, 3));
      const [kt] = await db
        .insert(s.kontrak)
        .values({ nomor: `PKS/${kode}/${ditandatangani.slice(0, 4)}/${String(noKlien).padStart(3, "0")}`, klienId: kl.id, cabangId: idCabang[kode], ditandatangani, mulai, berakhir, nilaiBulanan: 0 })
        .returning();

      let nilaiKontrak = 0;
      const jumlahSite = antara(seg.site[0], seg.site[1]);
      for (let st = 1; st <= jumlahSite; st++) {
        const [sitebaru] = await db
          .insert(s.site)
          .values({ kontrakId: kt.id, nama: jumlahSite > 1 ? `${kl.nama} · Lokasi ${st}` : kl.nama, alamat: `${CABANG.find((c) => c[0] === kode)![1]}`, lat: -7.3 + acak(), lng: 112.7 + acak(), radiusM: 100 })
          .returning();

        const daftarPosisi = seg.segmen === "Jaringan F&B" ? seg.posisi : seg.posisi.slice(0, antara(2, seg.posisi.length));
        let nilaiSite = 0;
        for (const namaPosisi of daftarPosisi) {
          const jumlah = seg.segmen === "Jaringan F&B" ? antara(1, 2) : antara(2, 8);
          const [fm] = await db.insert(s.formasi).values({ siteId: sitebaru.id, posisiId: posisiByNama[namaPosisi].id, jumlah, tarifBulanan: tarif[namaPosisi] }).returning();
          nilaiSite += jumlah * tarif[namaPosisi];
          for (let slot = 1; slot <= jumlah; slot++) {
            const mulaiTugas = tambah(mulai, st === 1 ? 0 : antara(0, 30));
            karyawanBaru.push({ nik: nikBaru(), nama: namaOrang(), cabangId: idCabang[kode], posisiId: posisiByNama[namaPosisi].id, masuk: tambah(mulaiTugas, -antara(3, 14)), _formasi: fm.id, _mulai: mulaiTugas, _kualitas: kualitas });
          }
        }
        nilaiKontrak += nilaiSite;

        // Invoice per site, 6 periode terakhir (cut-off tgl 25)
        for (let m = 6; m >= 1; m--) {
          const akhirPeriode = cutOff(m - 1);
          if (akhirPeriode < mulai) continue;
          const terbit = tambah(akhirPeriode, antara(2, 6));
          if (terbit > HARI) continue;
          const jatuhTempo = tambah(terbit, 30);
          const total = Math.round(nilaiSite * (1 - acak() * 0.02) * 1.11);
          const lewat = (Date.parse(HARI) - Date.parse(jatuhTempo)) / 86_400_000;
          const lunas = lewat > 0 && acak() < (kualitas > 0.92 ? 0.85 : 0.55);
          const sebagian = !lunas && lewat > 0 && acak() < 0.3;
          invoiceBaru.push({
            nomor: `INV/${kode}/${terbit.slice(0, 4)}/${terbit.slice(5, 7)}/${String(invoiceBaru.length + 1).padStart(4, "0")}`,
            siteId: sitebaru.id,
            periodeMulai: tambah(akhirPeriode, -29),
            periodeSelesai: akhirPeriode,
            total,
            dibayar: lunas ? total : sebagian ? Math.round(total * 0.5) : 0,
            terbit,
            jatuhTempo,
            status: lunas ? "lunas" : sebagian ? "dibayar_sebagian" : "terkirim",
          });
        }
      }
      await db.update(s.kontrak).set({ nilaiBulanan: Math.round(nilaiKontrak * 1.11) }).where(sql`id = ${kt.id}`);
    }

    // Karyawan yang sudah keluar dalam 12 bulan terakhir (untuk turnover)
    const keluar = Math.round(karyawanBaru.filter((k) => k.cabangId === idCabang[kode]).length * (1 - kualitas) * 3);
    for (let i = 0; i < keluar; i++) {
      const tglKeluar = tambah(HARI, -antara(1, 360));
      karyawanBaru.push({ nik: nikBaru(), nama: namaOrang(), cabangId: idCabang[kode], posisiId: pilih(posisi).id, masuk: tambah(tglKeluar, -antara(60, 700)), keluar: tglKeluar, alasanKeluar: pilih(ALASAN_KELUAR), _kualitas: kualitas });
    }
  }

  const tersimpan = await db.insert(s.karyawan).values(karyawanBaru.map(({ _formasi, _mulai, _kualitas, ...k }) => k)).returning({ id: s.karyawan.id, nik: s.karyawan.nik });
  const idByNik = Object.fromEntries(tersimpan.map((k) => [k.nik, k.id]));

  // Penempatan + absensi 45 hari terakhir
  const penempatanBaru: (typeof s.penempatan.$inferInsert)[] = [];
  const absensiBaru: (typeof s.absensiHarian.$inferInsert)[] = [];
  const slotKe = new Map<number, number>();
  for (const k of karyawanBaru) {
    if (!k._formasi || !k._mulai) continue;
    const karyawanId = idByNik[k.nik];
    const slot = (slotKe.get(k._formasi) ?? 0) + 1;
    slotKe.set(k._formasi, slot);
    penempatanBaru.push({ karyawanId, formasiId: k._formasi, mulai: k._mulai });

    for (let d = 44; d >= 0; d--) {
      const tanggal = tambah(HARI, -d);
      if (tanggal < k._mulai) continue;
      let status: (typeof s.statusAbsensiEnum.enumValues)[number];
      if ((slot + d) % 7 === 0) status = "libur";
      else {
        const r = acak();
        const meleset = 1 - k._kualitas;
        status = r < meleset * 0.45 ? "alfa" : r < meleset * 0.7 ? "izin" : r < meleset ? "sakit" : r < meleset + 0.03 ? "diganti" : r < meleset + 0.08 ? "telat" : "hadir";
      }
      absensiBaru.push({ formasiId: k._formasi, slot, tanggal, karyawanId: status === "diganti" ? null : karyawanId, status, telatMenit: status === "telat" ? antara(5, 40) : 0 });
    }
  }
  await dalamBatch(penempatanBaru, (b) => db.insert(s.penempatan).values(b));
  await dalamBatch(absensiBaru, (b) => db.insert(s.absensiHarian).values(b));
  await dalamBatch(invoiceBaru, (b) => db.insert(s.invoice).values(b));

  // Pipeline penjualan
  const kodeAktif = Object.keys(CABANG_AKTIF);
  const peluangBaru = Array.from({ length: 36 }, (_, i) => {
    const tahap = pilih(["terkualifikasi", "survei", "penawaran", "negosiasi", "menang", "kalah", "kalah", "menang"] as const);
    const tertutup = tahap === "menang" || tahap === "kalah";
    return {
      namaProspek: `Prospek Contoh ${i + 1}`,
      cabangId: idCabang[pilih(kodeAktif)],
      tahap,
      nilai: antara(4, 60) * 5_000_000,
      alasan: tahap === "menang" ? pilih(ALASAN_MENANG) : tahap === "kalah" ? pilih(ALASAN_KALAH) : null,
      ditutup: tertutup ? tambah(HARI, -antara(1, 330)) : null,
    };
  });
  await db.insert(s.peluang).values(peluangBaru);

  console.log(
    `Seed selesai (${HARI}): ${cabang.length} cabang, ${noKlien} klien, ${tersimpan.length} karyawan, ${absensiBaru.length} baris absensi, ${invoiceBaru.length} invoice.`,
  );
  console.log("Pengguna: admin, direksi, kacab.sby, finance, hr — password awal = SEED_PASSWORD, wajib diganti saat login pertama.");
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
