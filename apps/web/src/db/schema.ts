// Subset model data TRD bagian 4 untuk tahap fondasi. Uang: numeric(18,2); tanggal kerja: date (string).
import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const uang = (name: string) => numeric(name, { precision: 18, scale: 2, mode: "number" });

export const peranEnum = pgEnum("peran", ["admin", "direksi", "kepala_cabang", "sales", "hr", "ops", "spv", "finance"]);
export const bidangEnum = pgEnum("bidang", ["kebersihan", "pengamanan", "angkutan", "penunjang", "berisiko"]);
export const statusAbsensiEnum = pgEnum("status_absensi", ["hadir", "telat", "izin", "sakit", "alfa", "diganti", "libur"]);
export const tahapPipelineEnum = pgEnum("tahap_pipeline", ["terkualifikasi", "survei", "penawaran", "negosiasi", "menang", "kalah"]);
export const statusInvoiceEnum = pgEnum("status_invoice", ["draft", "menunggu_approval", "terbit", "terkirim", "dibayar_sebagian", "lunas", "void"]);

export const cabang = pgTable("cabang", {
  id: serial("id").primaryKey(),
  kode: text("kode").notNull().unique(),
  nama: text("nama").notNull(),
  zonaWaktu: text("zona_waktu").notNull().default("Asia/Jakarta"),
});

export const pengguna = pgTable("pengguna", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  nama: text("nama").notNull(),
  peran: peranEnum("peran").notNull(),
  cabangId: integer("cabang_id").references(() => cabang.id), // null = semua cabang
  passwordHash: text("password_hash").notNull(),
  wajibGantiPassword: boolean("wajib_ganti_password").notNull().default(true),
  gagalLogin: integer("gagal_login").notNull().default(0),
  terkunciSampai: timestamp("terkunci_sampai", { withTimezone: true }),
  dibuatPada: timestamp("dibuat_pada", { withTimezone: true }).notNull().defaultNow(),
});

export const klien = pgTable("klien", {
  id: serial("id").primaryKey(),
  nama: text("nama").notNull(),
  segmen: text("segmen").notNull(),
  cabangId: integer("cabang_id").notNull().references(() => cabang.id),
});

export const kontrak = pgTable("kontrak", {
  id: serial("id").primaryKey(),
  nomor: text("nomor").notNull().unique(),
  klienId: integer("klien_id").notNull().references(() => klien.id),
  cabangId: integer("cabang_id").notNull().references(() => cabang.id),
  ditandatangani: date("ditandatangani").notNull(),
  mulai: date("mulai").notNull(),
  berakhir: date("berakhir").notNull(),
  nilaiBulanan: uang("nilai_bulanan").notNull(),
});

export const posisi = pgTable("posisi", {
  id: serial("id").primaryKey(),
  nama: text("nama").notNull().unique(),
  bidang: bidangEnum("bidang").notNull(),
});

export const site = pgTable("site", {
  id: serial("id").primaryKey(),
  kontrakId: integer("kontrak_id").notNull().references(() => kontrak.id),
  nama: text("nama").notNull(),
  alamat: text("alamat").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  radiusM: integer("radius_m").notNull().default(100),
});

export const formasi = pgTable("formasi", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").notNull().references(() => site.id),
  posisiId: integer("posisi_id").notNull().references(() => posisi.id),
  jumlah: integer("jumlah").notNull(),
  tarifBulanan: uang("tarif_bulanan").notNull(),
});

export const karyawan = pgTable("karyawan", {
  id: serial("id").primaryKey(),
  nik: text("nik").notNull().unique(),
  nama: text("nama").notNull(),
  cabangId: integer("cabang_id").notNull().references(() => cabang.id),
  posisiId: integer("posisi_id").notNull().references(() => posisi.id),
  masuk: date("masuk").notNull(),
  keluar: date("keluar"),
  alasanKeluar: text("alasan_keluar"),
});

export const penempatan = pgTable("penempatan", {
  id: serial("id").primaryKey(),
  karyawanId: integer("karyawan_id").notNull().references(() => karyawan.id),
  formasiId: integer("formasi_id").notNull().references(() => formasi.id),
  mulai: date("mulai").notNull(),
  selesai: date("selesai"),
});

export const absensiHarian = pgTable(
  "absensi_harian",
  {
    id: serial("id").primaryKey(),
    formasiId: integer("formasi_id").notNull().references(() => formasi.id),
    slot: integer("slot").notNull(),
    tanggal: date("tanggal").notNull(),
    karyawanId: integer("karyawan_id").references(() => karyawan.id),
    status: statusAbsensiEnum("status").notNull(),
    telatMenit: integer("telat_menit").notNull().default(0),
  },
  (t) => [uniqueIndex("absensi_slot_unik").on(t.formasiId, t.slot, t.tanggal), index("absensi_tanggal").on(t.tanggal)],
);

export const invoice = pgTable("invoice", {
  id: serial("id").primaryKey(),
  nomor: text("nomor").notNull().unique(),
  siteId: integer("site_id").notNull().references(() => site.id),
  periodeMulai: date("periode_mulai").notNull(),
  periodeSelesai: date("periode_selesai").notNull(),
  total: uang("total").notNull(),
  dibayar: uang("dibayar").notNull().default(0),
  terbit: date("terbit").notNull(),
  jatuhTempo: date("jatuh_tempo").notNull(),
  status: statusInvoiceEnum("status").notNull(),
});

export const peluang = pgTable("peluang", {
  id: serial("id").primaryKey(),
  namaProspek: text("nama_prospek").notNull(),
  cabangId: integer("cabang_id").notNull().references(() => cabang.id),
  tahap: tahapPipelineEnum("tahap").notNull(),
  nilai: uang("nilai").notNull(),
  alasan: text("alasan"), // wajib untuk menang/kalah (PRD CR-04)
  ditutup: date("ditutup"),
});

export const dokumenLegal = pgTable("dokumen_legal", {
  id: serial("id").primaryKey(),
  nama: text("nama").notNull(),
  nomor: text("nomor").notNull(),
  penerbit: text("penerbit").notNull(),
  berlakuSampai: date("berlaku_sampai"),
});

export const logAudit = pgTable("log_audit", {
  id: serial("id").primaryKey(),
  penggunaId: integer("pengguna_id").references(() => pengguna.id),
  aksi: text("aksi").notNull(),
  detail: jsonb("detail"),
  waktu: timestamp("waktu", { withTimezone: true }).notNull().default(sql`now()`),
});
