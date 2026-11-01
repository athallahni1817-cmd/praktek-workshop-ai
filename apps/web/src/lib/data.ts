import "server-only";
import {
  BUCKET_UMUR,
  type BucketUmur,
  bucketUmur,
  fillRate,
  hariIni,
  rataWaktuDeploy,
  selisihHari,
  statusDokumen,
} from "@ips/shared";
import { and, asc, count, desc, eq, gte, isNull, lte, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  absensiHarian,
  cabang,
  dokumenLegal,
  formasi,
  invoice,
  karyawan,
  klien,
  kontrak,
  peluang,
  penempatan,
  posisi,
  site,
} from "@/db/schema";

export const tambahHari = (iso: string, n: number) =>
  new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

const awalBulan = (iso: string) => `${iso.slice(0, 8)}01`;
const awalBulanLalu = (iso: string) => awalBulan(tambahHari(awalBulan(iso), -1));

/** 31 Mar -> 28/29 Feb: tanggal yang sama di bulan lalu, dipotong ke akhir bulan. */
function tanggalSamaBulanLalu(iso: string) {
  const akhirBulanLalu = tambahHari(awalBulan(iso), -1);
  return `${akhirBulanLalu.slice(0, 8)}${String(Math.min(Number(iso.slice(8)), Number(akhirBulanLalu.slice(8)))).padStart(2, "0")}`;
}

/** Filter cabang lewat kontrak; null = semua cabang. */
const diCabang = (cabangId: number | null) => (cabangId ? eq(kontrak.cabangId, cabangId) : undefined);

export async function daftarCabang() {
  const db = await getDb();
  return db.select().from(cabang).orderBy(asc(cabang.id));
}

export async function dataDashboard(cabangId: number | null) {
  const db = await getDb();
  const hari = hariIni();
  const kemarin = tambahHari(hari, -1);
  const bulanIni = awalBulan(hari);

  const [cabangList, absensi, tagihan, deploy, berakhir, pipeline, nilaiBidang, sdm] = await Promise.all([
    daftarCabang(),

    db
      .select({ tanggal: absensiHarian.tanggal, status: absensiHarian.status, cabangId: kontrak.cabangId })
      .from(absensiHarian)
      .innerJoin(formasi, eq(absensiHarian.formasiId, formasi.id))
      .innerJoin(site, eq(formasi.siteId, site.id))
      .innerJoin(kontrak, eq(site.kontrakId, kontrak.id))
      .where(and(gte(absensiHarian.tanggal, kemarin < bulanIni ? kemarin : bulanIni), lte(absensiHarian.tanggal, hari), diCabang(cabangId))),

    db
      .select({ total: invoice.total, dibayar: invoice.dibayar, terbit: invoice.terbit, jatuhTempo: invoice.jatuhTempo, status: invoice.status })
      .from(invoice)
      .innerJoin(site, eq(invoice.siteId, site.id))
      .innerJoin(kontrak, eq(site.kontrakId, kontrak.id))
      .where(diCabang(cabangId)),

    db
      .select({ ditandatangani: kontrak.ditandatangani, penempatanPertama: sql<string | null>`min(${penempatan.mulai})` })
      .from(kontrak)
      .leftJoin(site, eq(site.kontrakId, kontrak.id))
      .leftJoin(formasi, eq(formasi.siteId, site.id))
      .leftJoin(penempatan, eq(penempatan.formasiId, formasi.id))
      .where(and(gte(kontrak.ditandatangani, tambahHari(hari, -365)), diCabang(cabangId)))
      .groupBy(kontrak.id),

    db
      .select({ id: kontrak.id, nomor: kontrak.nomor, klien: klien.nama, berakhir: kontrak.berakhir, nilaiBulanan: kontrak.nilaiBulanan })
      .from(kontrak)
      .innerJoin(klien, eq(kontrak.klienId, klien.id))
      .where(and(gte(kontrak.berakhir, hari), lte(kontrak.berakhir, tambahHari(hari, 90)), diCabang(cabangId)))
      .orderBy(asc(kontrak.berakhir)),

    db
      .select({ tahap: peluang.tahap, nilai: peluang.nilai, alasan: peluang.alasan, ditutup: peluang.ditutup })
      .from(peluang)
      .where(cabangId ? eq(peluang.cabangId, cabangId) : undefined),

    db
      .select({ bidang: posisi.bidang, nilai: sql<number>`sum(${formasi.jumlah} * ${formasi.tarifBulanan})`.mapWith(Number) })
      .from(formasi)
      .innerJoin(posisi, eq(formasi.posisiId, posisi.id))
      .innerJoin(site, eq(formasi.siteId, site.id))
      .innerJoin(kontrak, eq(site.kontrakId, kontrak.id))
      .where(and(gte(kontrak.berakhir, hari), diCabang(cabangId)))
      .groupBy(posisi.bidang),

    db
      .select({ keluar: karyawan.keluar })
      .from(karyawan)
      .where(cabangId ? eq(karyawan.cabangId, cabangId) : undefined),
  ]);

  // Absensi
  const statusPada = (tgl: string) => absensi.filter((a) => a.tanggal === tgl).map((a) => a.status);
  const hariIniStatus = statusPada(hari);
  const wajibHariIni = hariIniStatus.filter((s) => s !== "libur").length;
  const perCabang = cabangList
    .map((c) => ({
      id: c.id,
      nama: c.nama,
      fillRate: fillRate(absensi.filter((a) => a.cabangId === c.id && a.tanggal >= bulanIni).map((a) => a.status)),
    }))
    .filter((c): c is typeof c & { fillRate: number } => c.fillRate !== null)
    .sort((a, b) => a.fillRate - b.fillRate);

  // Tagihan & piutang
  const ditagih = (dari: string, sampai: string) =>
    tagihan.filter((t) => t.terbit >= dari && t.terbit < sampai && t.status !== "void" && t.status !== "draft").reduce((s, t) => s + t.total, 0);
  const umur = Object.fromEntries(BUCKET_UMUR.map((b) => [b, 0])) as Record<BucketUmur, number>;
  for (const t of tagihan) {
    if (t.status !== "terbit" && t.status !== "terkirim" && t.status !== "dibayar_sebagian") continue;
    umur[bucketUmur(t.jatuhTempo, hari)] += t.total - t.dibayar;
  }

  // Pipeline (12 bulan terakhir untuk win rate)
  const setahunLalu = tambahHari(hari, -365);
  const tertutup = pipeline.filter((p) => (p.tahap === "menang" || p.tahap === "kalah") && p.ditutup && p.ditutup >= setahunLalu);
  const menang = tertutup.filter((p) => p.tahap === "menang").length;
  const alasanKalah = new Map<string, number>();
  for (const p of tertutup) if (p.tahap === "kalah" && p.alasan) alasanKalah.set(p.alasan, (alasanKalah.get(p.alasan) ?? 0) + 1);
  const TAHAP_TERBUKA = ["terkualifikasi", "survei", "penawaran", "negosiasi"] as const;

  // Risiko UU alih daya
  const totalNilai = nilaiBidang.reduce((s, b) => s + b.nilai, 0);
  const nilaiBerisiko = nilaiBidang.find((b) => b.bidang === "berisiko")?.nilai ?? 0;

  // SDM
  const aktif = sdm.filter((k) => !k.keluar).length;
  const keluar12 = sdm.filter((k) => k.keluar && k.keluar >= setahunLalu).length;

  return {
    hari,
    absensi: {
      fillRateHariIni: fillRate(hariIniStatus),
      fillRateKemarin: fillRate(statusPada(kemarin)),
      terisiHariIni: hariIniStatus.filter((s) => s === "hadir" || s === "telat" || s === "diganti").length,
      wajibHariIni,
      alfaHariIni: hariIniStatus.filter((s) => s === "alfa").length,
      perCabang,
    },
    keuangan: {
      ditagihBulanIni: ditagih(bulanIni, tambahHari(hari, 1)),
      // Pembanding yang adil untuk bulan berjalan: bulan lalu sampai tanggal yang sama.
      ditagihBulanLaluSdTanggal: ditagih(awalBulanLalu(hari), tambahHari(tanggalSamaBulanLalu(hari), 1)),
      ditagihBulanLalu: ditagih(awalBulanLalu(hari), bulanIni),
      umur,
      piutangLewat60: umur["61-90"] + umur[">90"],
      totalPiutang: BUCKET_UMUR.reduce((s, b) => s + umur[b], 0),
    },
    waktuDeploy: { rataHari: rataWaktuDeploy(deploy), jumlahKontrak: deploy.filter((d) => d.penempatanPertama).length },
    kontrakBerakhir: berakhir.map((k) => ({ ...k, sisaHari: selisihHari(hari, k.berakhir) })),
    pipeline: {
      perTahap: TAHAP_TERBUKA.map((tahap) => {
        const isi = pipeline.filter((p) => p.tahap === tahap);
        return { tahap, jumlah: isi.length, nilai: isi.reduce((s, p) => s + p.nilai, 0) };
      }),
      winRate: tertutup.length ? menang / tertutup.length : null,
      jumlahTertutup: tertutup.length,
      alasanKalah: [...alasanKalah].sort((a, b) => b[1] - a[1]).slice(0, 3),
    },
    risikoUU: { porsi: totalNilai ? nilaiBerisiko / totalNilai : null, nilaiBerisiko, totalNilai },
    sdm: { aktif, keluar12, turnover: aktif + keluar12 ? keluar12 / (aktif + keluar12) : null },
    dokumen: await daftarDokumen(),
  };
}

export async function daftarDokumen() {
  const db = await getDb();
  const hari = hariIni();
  const rows = await db.select().from(dokumenLegal);
  return rows
    .map((d) => ({ ...d, ...statusDokumen(d.berlakuSampai, hari) }))
    .sort((a, b) => (a.sisaHari ?? Infinity) - (b.sisaHari ?? Infinity));
}

export async function daftarKlien(cabangId: number | null) {
  const db = await getDb();
  const hari = hariIni();
  return db
    .select({
      id: klien.id,
      nama: klien.nama,
      segmen: klien.segmen,
      cabang: cabang.nama,
      jumlahSite: sql<number>`count(distinct ${site.id})`.mapWith(Number),
      nilaiBulanan: sql<number>`(select coalesce(sum(k.nilai_bulanan), 0) from kontrak k where k.klien_id = ${klien.id} and k.berakhir >= ${hari})`.mapWith(Number),
    })
    .from(klien)
    .innerJoin(cabang, eq(klien.cabangId, cabang.id))
    .leftJoin(kontrak, eq(kontrak.klienId, klien.id))
    .leftJoin(site, eq(site.kontrakId, kontrak.id))
    .where(cabangId ? eq(klien.cabangId, cabangId) : undefined)
    .groupBy(klien.id, cabang.nama)
    .orderBy(asc(klien.nama));
}

export async function daftarKontrak(cabangId: number | null) {
  const db = await getDb();
  const hari = hariIni();
  const rows = await db
    .select({
      id: kontrak.id,
      nomor: kontrak.nomor,
      klien: klien.nama,
      cabang: cabang.nama,
      mulai: kontrak.mulai,
      berakhir: kontrak.berakhir,
      nilaiBulanan: kontrak.nilaiBulanan,
    })
    .from(kontrak)
    .innerJoin(klien, eq(kontrak.klienId, klien.id))
    .innerJoin(cabang, eq(kontrak.cabangId, cabang.id))
    .where(diCabang(cabangId))
    .orderBy(asc(kontrak.berakhir));
  return rows.map((k) => ({ ...k, sisaHari: selisihHari(hari, k.berakhir) }));
}

export async function daftarSite(cabangId: number | null) {
  const db = await getDb();
  const hari = hariIni();
  const [rows, absensi] = await Promise.all([
    db
      .select({
        id: site.id,
        nama: site.nama,
        alamat: site.alamat,
        klien: klien.nama,
        cabang: cabang.nama,
        petugas: sql<number>`coalesce(sum(${formasi.jumlah}), 0)`.mapWith(Number),
        posisiBerisiko: sql<number>`count(*) filter (where ${posisi.bidang} = 'berisiko')`.mapWith(Number),
      })
      .from(site)
      .innerJoin(kontrak, eq(site.kontrakId, kontrak.id))
      .innerJoin(klien, eq(kontrak.klienId, klien.id))
      .innerJoin(cabang, eq(kontrak.cabangId, cabang.id))
      .leftJoin(formasi, eq(formasi.siteId, site.id))
      .leftJoin(posisi, eq(formasi.posisiId, posisi.id))
      .where(diCabang(cabangId))
      .groupBy(site.id, klien.nama, cabang.nama)
      .orderBy(asc(cabang.nama), asc(site.nama)),
    db
      .select({ siteId: formasi.siteId, status: absensiHarian.status })
      .from(absensiHarian)
      .innerJoin(formasi, eq(absensiHarian.formasiId, formasi.id))
      .where(gte(absensiHarian.tanggal, awalBulan(hari))),
  ]);
  return rows.map((s) => ({ ...s, fillRate: fillRate(absensi.filter((a) => a.siteId === s.id).map((a) => a.status)) }));
}

export const PER_HALAMAN = 50;

export async function daftarKaryawan(cabangId: number | null, halaman: number, status: "aktif" | "keluar") {
  const db = await getDb();
  const filter = and(cabangId ? eq(karyawan.cabangId, cabangId) : undefined, status === "aktif" ? isNull(karyawan.keluar) : sql`${karyawan.keluar} is not null`);
  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: karyawan.id,
        nik: karyawan.nik,
        nama: karyawan.nama,
        posisi: posisi.nama,
        bidang: posisi.bidang,
        cabang: cabang.nama,
        masuk: karyawan.masuk,
        keluar: karyawan.keluar,
        alasanKeluar: karyawan.alasanKeluar,
      })
      .from(karyawan)
      .innerJoin(posisi, eq(karyawan.posisiId, posisi.id))
      .innerJoin(cabang, eq(karyawan.cabangId, cabang.id))
      .where(filter)
      .orderBy(status === "aktif" ? asc(karyawan.nama) : desc(karyawan.keluar))
      .limit(PER_HALAMAN)
      .offset((halaman - 1) * PER_HALAMAN),
    db.select({ total: count() }).from(karyawan).where(filter),
  ]);
  return { rows, total };
}
