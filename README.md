# IPS One

Platform operasional terintegrasi PT Indonesia Partner Solution. Rencana lengkap ada di [docs/](docs/), panduan visual di [DESIGN.md](DESIGN.md).

## Status

Tahap fondasi (TRD bagian 10, tahap 1–3 versi baca saja):

- Login username + password, wajib ganti password awal, kunci 15 menit setelah 5 kali gagal, log audit
- Peran & cakupan cabang (pengguna cabang hanya melihat cabangnya; pusat bisa memilih cabang)
- Dashboard direksi: fill rate, tagihan, umur piutang, waktu deploy, pipeline, dokumen legal, kontrak berakhir, porsi pendapatan berisiko UU, turnover
- Daftar klien, kontrak, site, karyawan, dokumen legal

Belum ada: form tambah/ubah data, aplikasi petugas, invoice, CRM, portal klien (lihat item "Segera" di sidebar).

## Menjalankan

Butuh Node.js ≥ 22 dan pnpm 10.

```bash
pnpm install
```

```bash
cp apps/web/.env.example apps/web/.env.local
```

Isi `SESSION_SECRET` dan `SEED_PASSWORD` di `apps/web/.env.local`, lalu:

```bash
pnpm db:seed
```

```bash
pnpm dev
```

Buka http://localhost:3000. Pengguna contoh: `admin`, `direksi`, `kacab.sby` (hanya cabang Surabaya), `finance`, `hr`. Password awal semuanya = `SEED_PASSWORD`, dan wajib diganti saat login pertama.

> Database lokal memakai PGlite (folder `apps/web/.data/`). Hanya satu proses yang boleh membukanya: **hentikan `pnpm dev` sebelum `pnpm db:seed`.** Seed menghapus dan mengisi ulang semua data; jalankan ulang bila ingin data absensi sampai hari ini.

## Struktur

```
apps/web/            Next.js: web internal (portal klien menyusul)
  src/db/            skema Drizzle, koneksi PGlite, seed
  src/lib/           auth, akses per peran, query data
  src/app/(internal) halaman setelah login
packages/shared/     fungsi murni + tes: format id-ID, fill rate, umur piutang, status dokumen, waktu deploy
```

Ubah skema → `pnpm db:generate` → migrasi baru di `apps/web/drizzle/` diterapkan otomatis saat aplikasi atau seed berjalan.

## Tes

```bash
pnpm test
```

```bash
pnpm typecheck
```
