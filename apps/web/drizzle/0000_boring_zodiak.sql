CREATE TYPE "public"."bidang" AS ENUM('kebersihan', 'pengamanan', 'angkutan', 'penunjang', 'berisiko');--> statement-breakpoint
CREATE TYPE "public"."peran" AS ENUM('admin', 'direksi', 'kepala_cabang', 'sales', 'hr', 'ops', 'spv', 'finance');--> statement-breakpoint
CREATE TYPE "public"."status_absensi" AS ENUM('hadir', 'telat', 'izin', 'sakit', 'alfa', 'diganti', 'libur');--> statement-breakpoint
CREATE TYPE "public"."status_invoice" AS ENUM('draft', 'menunggu_approval', 'terbit', 'terkirim', 'dibayar_sebagian', 'lunas', 'void');--> statement-breakpoint
CREATE TYPE "public"."tahap_pipeline" AS ENUM('terkualifikasi', 'survei', 'penawaran', 'negosiasi', 'menang', 'kalah');--> statement-breakpoint
CREATE TABLE "absensi_harian" (
	"id" serial PRIMARY KEY NOT NULL,
	"formasi_id" integer NOT NULL,
	"slot" integer NOT NULL,
	"tanggal" date NOT NULL,
	"karyawan_id" integer,
	"status" "status_absensi" NOT NULL,
	"telat_menit" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cabang" (
	"id" serial PRIMARY KEY NOT NULL,
	"kode" text NOT NULL,
	"nama" text NOT NULL,
	"zona_waktu" text DEFAULT 'Asia/Jakarta' NOT NULL,
	CONSTRAINT "cabang_kode_unique" UNIQUE("kode")
);
--> statement-breakpoint
CREATE TABLE "dokumen_legal" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"nomor" text NOT NULL,
	"penerbit" text NOT NULL,
	"berlaku_sampai" date
);
--> statement-breakpoint
CREATE TABLE "formasi" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"posisi_id" integer NOT NULL,
	"jumlah" integer NOT NULL,
	"tarif_bulanan" numeric(18, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" serial PRIMARY KEY NOT NULL,
	"nomor" text NOT NULL,
	"site_id" integer NOT NULL,
	"periode_mulai" date NOT NULL,
	"periode_selesai" date NOT NULL,
	"total" numeric(18, 2) NOT NULL,
	"dibayar" numeric(18, 2) DEFAULT 0 NOT NULL,
	"terbit" date NOT NULL,
	"jatuh_tempo" date NOT NULL,
	"status" "status_invoice" NOT NULL,
	CONSTRAINT "invoice_nomor_unique" UNIQUE("nomor")
);
--> statement-breakpoint
CREATE TABLE "karyawan" (
	"id" serial PRIMARY KEY NOT NULL,
	"nik" text NOT NULL,
	"nama" text NOT NULL,
	"cabang_id" integer NOT NULL,
	"posisi_id" integer NOT NULL,
	"masuk" date NOT NULL,
	"keluar" date,
	"alasan_keluar" text,
	CONSTRAINT "karyawan_nik_unique" UNIQUE("nik")
);
--> statement-breakpoint
CREATE TABLE "klien" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"segmen" text NOT NULL,
	"cabang_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kontrak" (
	"id" serial PRIMARY KEY NOT NULL,
	"nomor" text NOT NULL,
	"klien_id" integer NOT NULL,
	"cabang_id" integer NOT NULL,
	"ditandatangani" date NOT NULL,
	"mulai" date NOT NULL,
	"berakhir" date NOT NULL,
	"nilai_bulanan" numeric(18, 2) NOT NULL,
	CONSTRAINT "kontrak_nomor_unique" UNIQUE("nomor")
);
--> statement-breakpoint
CREATE TABLE "log_audit" (
	"id" serial PRIMARY KEY NOT NULL,
	"pengguna_id" integer,
	"aksi" text NOT NULL,
	"detail" jsonb,
	"waktu" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "peluang" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama_prospek" text NOT NULL,
	"cabang_id" integer NOT NULL,
	"tahap" "tahap_pipeline" NOT NULL,
	"nilai" numeric(18, 2) NOT NULL,
	"alasan" text,
	"ditutup" date
);
--> statement-breakpoint
CREATE TABLE "penempatan" (
	"id" serial PRIMARY KEY NOT NULL,
	"karyawan_id" integer NOT NULL,
	"formasi_id" integer NOT NULL,
	"mulai" date NOT NULL,
	"selesai" date
);
--> statement-breakpoint
CREATE TABLE "pengguna" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"nama" text NOT NULL,
	"peran" "peran" NOT NULL,
	"cabang_id" integer,
	"password_hash" text NOT NULL,
	"wajib_ganti_password" boolean DEFAULT true NOT NULL,
	"gagal_login" integer DEFAULT 0 NOT NULL,
	"terkunci_sampai" timestamp with time zone,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pengguna_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "posisi" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"bidang" "bidang" NOT NULL,
	CONSTRAINT "posisi_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "site" (
	"id" serial PRIMARY KEY NOT NULL,
	"kontrak_id" integer NOT NULL,
	"nama" text NOT NULL,
	"alamat" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"radius_m" integer DEFAULT 100 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "absensi_harian" ADD CONSTRAINT "absensi_harian_formasi_id_formasi_id_fk" FOREIGN KEY ("formasi_id") REFERENCES "public"."formasi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "absensi_harian" ADD CONSTRAINT "absensi_harian_karyawan_id_karyawan_id_fk" FOREIGN KEY ("karyawan_id") REFERENCES "public"."karyawan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formasi" ADD CONSTRAINT "formasi_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formasi" ADD CONSTRAINT "formasi_posisi_id_posisi_id_fk" FOREIGN KEY ("posisi_id") REFERENCES "public"."posisi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_cabang_id_cabang_id_fk" FOREIGN KEY ("cabang_id") REFERENCES "public"."cabang"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_posisi_id_posisi_id_fk" FOREIGN KEY ("posisi_id") REFERENCES "public"."posisi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "klien" ADD CONSTRAINT "klien_cabang_id_cabang_id_fk" FOREIGN KEY ("cabang_id") REFERENCES "public"."cabang"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kontrak" ADD CONSTRAINT "kontrak_klien_id_klien_id_fk" FOREIGN KEY ("klien_id") REFERENCES "public"."klien"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kontrak" ADD CONSTRAINT "kontrak_cabang_id_cabang_id_fk" FOREIGN KEY ("cabang_id") REFERENCES "public"."cabang"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_audit" ADD CONSTRAINT "log_audit_pengguna_id_pengguna_id_fk" FOREIGN KEY ("pengguna_id") REFERENCES "public"."pengguna"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peluang" ADD CONSTRAINT "peluang_cabang_id_cabang_id_fk" FOREIGN KEY ("cabang_id") REFERENCES "public"."cabang"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penempatan" ADD CONSTRAINT "penempatan_karyawan_id_karyawan_id_fk" FOREIGN KEY ("karyawan_id") REFERENCES "public"."karyawan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penempatan" ADD CONSTRAINT "penempatan_formasi_id_formasi_id_fk" FOREIGN KEY ("formasi_id") REFERENCES "public"."formasi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pengguna" ADD CONSTRAINT "pengguna_cabang_id_cabang_id_fk" FOREIGN KEY ("cabang_id") REFERENCES "public"."cabang"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site" ADD CONSTRAINT "site_kontrak_id_kontrak_id_fk" FOREIGN KEY ("kontrak_id") REFERENCES "public"."kontrak"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "absensi_slot_unik" ON "absensi_harian" USING btree ("formasi_id","slot","tanggal");--> statement-breakpoint
CREATE INDEX "absensi_tanggal" ON "absensi_harian" USING btree ("tanggal");