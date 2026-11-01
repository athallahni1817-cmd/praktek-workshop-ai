---
name: IPS One Design System
version: 0.1
updated: 2026-11-01
basedOn: "Stitch template: Executive Workforce Operations System (stitch_outsourcing_analytics_dashboard.zip)"
colors:
  # Brand
  brand-red: '#B51F1A'          # primary: aksi, navigasi aktif, angka KPI utama
  brand-red-strong: '#84141A'   # hover primary, banner direksi, kartu KPI kritis
  brand-red-tint: '#FDF2F2'     # wadah ikon, latar chip brand
  brand-red-tint-strong: '#FFDAD5'
  logo-red: '#FE0000'           # HANYA untuk logo
  highlight: '#FFDE59'          # aksen prioritas, offline banner, peringatan SLA
  on-highlight: '#111111'
  # Neutral
  ink: '#111111'                # teks utama, angka
  text-muted: '#4B5563'         # label, teks sekunder
  text-subtle: '#6B7280'        # placeholder, metadata
  canvas: '#F8F9FA'             # latar halaman (level 0)
  surface: '#FFFFFF'            # kartu, tabel, panel (level 1)
  surface-muted: '#F3F4F6'      # hover, input pencarian, header tabel alternatif
  surface-subtle: '#F9FAFB'     # header tabel
  border: '#E5E7EB'
  border-strong: '#D1D5DB'
  divider: '#F3F4F6'
  on-brand: '#FFFFFF'
  # Status (selalu dipasangkan dengan ikon + teks, tidak boleh warna saja)
  success: '#065F46'
  success-bg: '#ECFDF5'
  warning: '#92400E'
  warning-bg: '#FFFBEB'
  danger: '#991B1B'
  danger-bg: '#FEE2E2'
  neutral: '#374151'
  neutral-bg: '#F3F4F6'
  focus-ring: '#B51F1A'
  # Grafik
  chart-primary: '#B51F1A'
  chart-primary-strong: '#84141A'
  chart-comparison: '#D1D5DB'
  chart-target: '#111111'
  chart-highlight: '#FFDE59'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 2.5rem
    fontWeight: '800'
    lineHeight: 3rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '800'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.375rem
    fontWeight: '700'
    lineHeight: 1.875rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '700'
    lineHeight: 1.625rem
  tagline-italic:
    fontFamily: Lora
    fontSize: 1.125rem
    fontWeight: '400'
    fontStyle: italic
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Inter
    fontSize: 1.0625rem
    fontWeight: '400'
    lineHeight: 1.625rem
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  overline:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.05em
    textTransform: uppercase
  metric-num:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '800'
    lineHeight: 2.5rem
    letterSpacing: -0.03em
    fontVariantNumeric: tabular-nums
  metric-num-sm:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '800'
    lineHeight: 2rem
    letterSpacing: -0.02em
    fontVariantNumeric: tabular-nums
rounded:
  sm: 0.25rem    # checkbox
  md: 0.5rem     # tombol, input, chip persegi, item navigasi
  lg: 0.75rem    # kartu & panel
  xl: 1rem       # banner, wadah besar, bottom sheet
  full: 9999px   # status pill, avatar, counter
spacing:
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
elevation:
  level-0: none
  level-1: '0 1px 3px rgba(17,17,17,0.04), 0 1px 2px rgba(17,17,17,0.02)'
  level-2: '0 8px 16px -2px rgba(181,31,26,0.08), 0 2px 4px -1px rgba(17,17,17,0.04)'
  level-3: '0 20px 25px -5px rgba(17,17,17,0.10), 0 10px 10px -5px rgba(17,17,17,0.04)'
---

# IPS One Design System

Sistem desain untuk **IPS One**, platform operasional PT Indonesia Partner Solution. Dokumen ini berlaku untuk tiga permukaan: web internal, portal klien, dan aplikasi petugas/SPV. Dasarnya template Stitch *Executive Workforce Operations System*, lalu dirapikan supaya konsisten dan sesuai kebutuhan di [docs/02-PRD.md](docs/02-PRD.md) dan [docs/03-TRD.md](docs/03-TRD.md).

Token di frontmatter adalah **sumber kebenaran**. Kalau uraian di bawah berbeda dengan token, yang dipakai adalah token.

---

## 1. Karakter brand

**Tegas, melayani, bisa dibuktikan.** IPS One adalah "mesin bukti" untuk USP IPS: setiap layar harus menjawab "berapa angkanya, dan dari mana datanya?"

- **Angka lebih penting dari hiasan.** Ilustrasi, foto stok, blob blur, dan gradien dekoratif tidak dipakai. Ruang visual diberikan untuk angka KPI, status, dan tabel.
- **Merah sebagai jangkar, bukan latar.** Merah menandai aksi, posisi aktif, dan angka utama. Sebagian besar layar tetap putih/abu muda.
- **Jujur dengan data.** Klaim seperti "100% retensi", "SLA 98,4%", atau "3.500+" hanya boleh muncul kalau dihitung dari data sistem. Tidak boleh ada angka statis yang ditanam di UI.
- **"Your Service Partner"** adalah tanda tangan brand, ditulis dengan Lora italic. Hanya muncul di header login, banner dashboard direksi, dan kop PDF.

## 2. Warna

### 2.1 Proporsi

Mengikuti panduan brand IPS (menurut template): **60% putih/abu muda · 30% keluarga merah · 7% hitam · 3% kuning sorot.** Dalam praktik layar data, porsi merah biasanya lebih kecil dari 30%. Itu wajar, yang penting merah tidak dipakai sebagai latar luas selain banner direksi.

### 2.2 Peran warna

| Token | Hex | Dipakai untuk | Tidak boleh |
|---|---|---|---|
| `brand-red` | `#B51F1A` | Tombol primary, link, item navigasi aktif, ring fokus, seri utama grafik | Teks paragraf panjang; status negatif (pakai `danger`) |
| `brand-red-strong` | `#84141A` | Hover/pressed primary, banner dashboard direksi, kartu KPI kritis | Latar halaman |
| `brand-red-tint` | `#FDF2F2` | Wadah ikon KPI, chip brand, sorot baris terpilih | — |
| `logo-red` | `#FE0000` | Logo IPS saja | Apa pun selain logo, karena warnanya bergetar di layar |
| `highlight` | `#FFDE59` | Badge prioritas di atas merah/gelap, banner offline di app, penanda "perlu tindakan" | Teks berwarna kuning; latar luas |
| `ink` | `#111111` | Teks utama, angka besar, ikon | — |
| `text-muted` | `#4B5563` | Label, teks sekunder, header tabel | Angka utama |
| `canvas` / `surface` | `#F8F9FA` / `#FFFFFF` | Latar halaman / kartu | — |

### 2.3 Status

Status **selalu** ditampilkan sebagai ikon + teks, tidak pernah warna saja. Ini juga yang memisahkan "merah brand" dari "merah bahaya".

| Makna | Teks / latar | Contoh di IPS One |
|---|---|---|
| Sukses | `success` / `success-bg` | Hadir, Lunas, Menang, Dokumen berlaku |
| Peringatan | `warning` / `warning-bg` | Telat, Jatuh tempo ≤ 7 hari, Perlu tinjau, Dokumen ≤ 30 hari kedaluwarsa, Posisi **berisiko UU** |
| Bahaya | `danger` / `danger-bg` | Alfa, Lewat jatuh tempo > 60 hari, Kalah, Dokumen kedaluwarsa, Insiden berat |
| Netral | `neutral` / `neutral-bg` | Draft, Libur, Izin, Sakit, Belum mulai |
| Brand | `brand-red` / `brand-red-tint` | Diganti (petugas pengganti), Baru, label informatif milik IPS |
| Prioritas | `on-highlight` / `highlight` | Eskalasi SLA, offline belum tersinkron, butuh approval direksi |

### 2.4 Grafik

- **Seri utama:** `chart-primary`. **Periode/entitas yang disorot:** `chart-primary-strong`. **Pembanding** (bulan lalu, cabang lain): `chart-comparison`. Kontrasnya hanya ±1,5:1 terhadap putih, jadi nilainya **wajib** ditulis langsung di grafik, dan informasi penting tidak boleh hanya bergantung pada seri ini.
- **Garis target:** `chart-target`, putus-putus 1px, dengan label "Target 98%".
- **Kuning** hanya untuk satu titik yang perlu perhatian, bukan untuk seri.
- **Lebih dari 3 kategori** (mis. 20 cabang): jangan beri warna berbeda per kategori. Pakai bar horizontal terurut dengan satu warna, dan sorot yang relevan.
- Format sumbu dan tooltip mengikuti aturan angka di bagian 9.

## 3. Tipografi

- **Inter** untuk semua antarmuka. Bobot yang dipakai hanya 400, 600, 700, dan 800.
- **Lora Italic** hanya untuk tagline *"Your Service Partner"*. Tidak boleh di tabel, form, tombol, atau angka.
- **Angka** selalu `tabular-nums`, supaya digit tidak bergeser saat angka live berubah dan kolom tabel sejajar.
- `overline` (11px kapital, tracking 0.05em) dipakai untuk label kecil di atas judul kartu dan header tabel, mis. "OPERASI LAPANGAN".
- Minimum ukuran teks: 12px di web, **16px di aplikasi petugas**.

## 4. Layout

### 4.1 Web internal

| Breakpoint | Struktur |
|---|---|
| ≥ 1280px | Sidebar tetap 256px · header 64px · grid 12 kolom · gutter 24px · margin 32px |
| 768–1279px | Sidebar ikon 72px (label sebagai tooltip) · grid 8 kolom · gutter 16px · margin 24px · kartu KPI 2×2 |
| < 768px | Sidebar jadi drawer dari tombol menu · 1 kolom · margin 16px · tabel jadi daftar kartu |

- Jarak antar-blok `space-lg` (24px), padding kartu `space-md`–`space-lg`.
- Pola dashboard: **baris KPI (4 kartu)** → **grid 8 + 4 kolom** (konten utama kiri, panel pendukung kanan) → **tabel aktivitas**.
- Kepala cabang sering membuka dari HP, jadi semua halaman wajib bisa dipakai di 375px tanpa scroll horizontal (kecuali isi tabel, yang di-scroll di dalam wadahnya).

### 4.2 Navigasi web internal

Sidebar dikelompokkan sesuai modul PRD. Item muncul sesuai peran pengguna.

```
[Logo IPS] IPS One
           Operasional Terpadu
─────────────────────────────
Dashboard
PENJUALAN      Leads · Pipeline · RAB & Penawaran
KLIEN          Klien · Kontrak · Site
OPERASI        Monitor Absensi · Jadwal · Ceklis & Patroli · Insiden
SDM            Karyawan · Penempatan
KEUANGAN       Invoice · Pembayaran · Piutang · Biaya & Laba-Rugi
KEPATUHAN      Dokumen Legal
─────────────────────────────
Pengaturan · Keluar
```

**Header:** pencarian global (karyawan, klien, no. kontrak, no. invoice), **pemilih cakupan cabang** ("Semua cabang" atau cabang tertentu, sesuai hak akses; label default "Kantor Pusat — Sidoarjo"), notifikasi, dan profil (nama + peran).

Badge counter di item navigasi hanya untuk hal yang perlu tindakan, mis. "Invoice · 3" untuk menunggu approval atau "Monitor Absensi · 12" untuk perlu tinjau. Tidak dipakai untuk angka pajangan seperti "900+".

### 4.3 Portal klien

- Memakai token yang sama, tapi tanpa sidebar penuh. Header berisi logo IPS + nama klien, dengan tab: **Ringkasan · Site · Invoice · Laporan · Dokumen**.
- Tidak ada banner merah besar. Kartu ringkasan per site memakai `surface`.
- Teks kecil di footer: *"Dilayani oleh PT Indonesia Partner Solution — Your Service Partner"*.
- **Foto selfie petugas tidak pernah tampil.** Avatar petugas berupa inisial. Kehadiran ditampilkan sebagai status + jam + "Di lokasi ✓".

### 4.4 Aplikasi petugas/SPV (Expo, Android)

Dipakai di lapangan, sering di bawah terik matahari atau di basement, oleh orang yang jarang memakai aplikasi.

- **Satu aksi utama per layar.** Di beranda, tombol **Absen Masuk / Absen Pulang** lebar penuh, tinggi 64px, `brand-red`, teks 18px tebal.
- Target sentuh minimal **48×48dp**, jarak antar-target minimal 8dp.
- Teks minimal 16px, label tombol 17–18px. Kontras tinggi: teks `ink` di `surface`.
- **Bottom tab** maksimal 4 item: Beranda · Tugas (ceklis/patroli) · Lapor · Akun. SPV mendapat tab tambahan **Tim**.
- **Status koneksi** selalu terlihat. Saat offline atau ada data belum terkirim, muncul strip `highlight` di atas: "Offline · 3 data menunggu dikirim".
- Ikon selalu disertai teks; tidak ada tombol ikon saja kecuali kembali/tutup.
- Kamera selfie: bingkai oval panduan wajah, instruksi satu kalimat ("Lihat ke kamera, lalu kedipkan mata").
- Hasil aksi selalu jelas: layar konfirmasi penuh berwarna `success-bg` dengan centang besar, jam, dan nama site.

## 5. Elevasi & bentuk

| Level | Pemakaian | Nilai |
|---|---|---|
| 0 | Latar halaman `canvas` | tanpa bayangan |
| 1 | Kartu, tabel, panel: `surface` + border 1px `border` | `level-1` |
| 2 | Kartu yang di-hover/bisa diklik | `level-2` (bayangan bernuansa merah tipis) |
| 3 | Dropdown, popover, dialog, drawer | `level-3` |

Banner direksi memakai `brand-red-strong` tanpa bayangan dan tanpa dekorasi blur.

**Radius:** kontrol (tombol, input, item navigasi) `md` 8px · kartu `lg` 12px · banner & wadah besar `xl` 16px · status & avatar `full`. Potongan diagonal khas brand hanya dipakai di kop PDF dan materi pemasaran, tidak di UI aplikasi.

## 6. Komponen

### 6.1 Tombol

| Varian | Tampilan | Pemakaian |
|---|---|---|
| Primary | `brand-red`, teks putih 600, tinggi 40px (web) / 56–64px (app), radius `md`; hover `brand-red-strong`; fokus ring 2px offset 2px | Satu per area: "Simpan", "Terbitkan Invoice" |
| Secondary | `surface`, border `border-strong`, teks `ink`; hover `surface-muted` | Aksi pendamping: "Ekspor", "Batal" |
| Ghost / ikon | Transparan, ikon `ink` 20px, kotak 36–40px; hover `surface-muted` | Toolbar, aksi baris tabel (wajib `aria-label`) |
| Destruktif | `danger`, teks putih | Void invoice, hapus akses, akhiri penempatan |
| Di atas merah | `surface` dengan teks `brand-red` | Tombol di banner direksi |

Aksi yang tidak bisa dibatalkan (terbitkan invoice, tutup periode, void) **wajib** lewat dialog konfirmasi yang menyebut dampaknya, mis. "Periode 26 Okt–25 Nov akan dikunci. Koreksi setelah ini menjadi nota kredit/debit."

### 6.2 Kartu KPI

- `surface`, radius `lg`, border, padding 20px.
- Baris atas: label `overline` (`text-muted`) + wadah ikon 36px (`brand-red-tint`, ikon `brand-red`).
- Angka `metric-num` `ink` + satuan `label-md` `text-muted` ("Orang", "Site", "Rp").
- Baris bawah: delta (panah + teks, mis. "▲ 124 vs bulan lalu") dan pembanding target ("Target 98%").
- Delta naik **tidak otomatis hijau**. Warna mengikuti makna: piutang naik = `danger`, fill rate naik = `success`.
- **Varian kritis:** latar `brand-red-strong`, teks putih, badge `highlight`. Maksimal satu per dashboard.
- Seluruh kartu bisa diklik dan membuka rincian (level 2 saat hover).

KPI baris pertama dashboard direksi (sesuai PRD M9): **Fill rate hari ini · Pendapatan ditagih bulan ini · Piutang > 60 hari · Waktu deploy rata-rata.**

### 6.3 Tabel data

- Wadah radius `lg`, border `border`. Header `surface-subtle`, teks `overline` `text-muted`.
- Tinggi baris 52px (padat) atau 56px (default), garis pemisah `divider`, hover `#FAFAFA`.
- Kolom angka rata kanan dan `tabular-nums`; kolom uang selalu dengan "Rp".
- Kolom pertama berisi identitas utama (avatar inisial + nama + ID kecil `text-subtle`).
- Toolbar di atas tabel: pencarian, filter (chip), pemilih periode, tombol Ekspor.
- Paginasi di bawah: "1–25 dari 3.582".
- Di bawah 768px tabel berubah menjadi daftar kartu.

### 6.4 Chip & badge status

Tinggi 24px, radius `full`, teks `label-sm`, ikon 14px di kiri. Isinya mengikuti tabel 2.3. Label memakai istilah PRD: Hadir, Telat, Izin, Sakit, Alfa, Diganti, Libur · Draft, Menunggu Approval, Terbit, Terkirim, Dibayar Sebagian, Lunas, Void · Baru, Terkualifikasi, Survei, Penawaran, Negosiasi, Menang, Kalah.

**Label bidang posisi** (risiko UU alih daya) memakai chip netral bertuliskan bidangnya: Kebersihan, Pengamanan, Angkutan Pekerja, Penunjang. Posisi berisiko memakai chip `warning` dengan teks "Berisiko UU".

### 6.5 Input & form

- Tinggi 40px (web) / 52px (app), radius `md`, border `border-strong`; fokus border `brand-red` + ring 2px.
- Label selalu di atas field (bukan placeholder sebagai label). Teks bantuan `body-sm` `text-subtle`.
- Error: border `danger` + pesan di bawah field yang menjelaskan cara memperbaiki ("NIK harus 16 digit").
- Field uang: prefix "Rp", pemisah ribuan otomatis saat diketik.
- Field wajib yang menyangkut kepatuhan (alasan kalah, alasan koreksi absensi) ditandai jelas dan tidak bisa dilewati.

### 6.6 Komponen khusus IPS One

| Komponen | Spesifikasi |
|---|---|
| **Kartu site (monitor absensi)** | Nama site + klien, bar fill rate (`brand-red` di atas `surface-muted`), "18/20 hadir", chip jumlah alfa & perlu tinjau, jam update terakhir. Klik membuka daftar slot |
| **Baris slot absensi** | Posisi · petugas · jam masuk/keluar · status chip · ikon flag (fake GPS, di luar lokasi, jam berbeda) dengan tooltip penjelasan · aksi "Tunjuk pengganti" |
| **Tinjau selfie (internal)** | Grid foto 3:4 dengan nama & jam; tombol Setujui/Tolak besar. Hanya untuk peran internal |
| **Kanban pipeline** | Kolom per tahap dengan total nilai di header; kartu berisi klien, nilai Rp, jumlah lokasi, tanggal follow-up (merah bila lewat). Pindah ke Menang/Kalah membuka dialog alasan wajib |
| **Rincian invoice** | Tabel baris: pokok, potongan (angka negatif `danger` dengan rincian tanggal & slot), baris manual, subtotal, PPN, total, PPh 23 diharapkan. Bilah approval menempel di bawah layar |
| **Umur piutang** | Bar bertumpuk 4 segmen (0–30, 31–60, 61–90, >90) dari netral sampai `danger`, nilai Rp tertulis di tiap segmen |
| **Dokumen legal** | Baris dokumen dengan hitung mundur ("Berakhir dalam 23 hari") dan chip status berlaku/segera/kedaluwarsa |
| **Banner direksi** | `brand-red-strong`, overline "OPERASIONAL TERPADU", tagline Lora, judul `headline-lg` putih, ringkasan satu kalimat dari data, maksimal 2 tombol. Hanya di dashboard direksi |

### 6.7 Umpan balik

- **Toast** di kanan bawah (web) atau atas (app), hilang dalam 5 detik, kecuali error yang harus ditutup manual.
- **Skeleton** untuk kartu dan tabel saat memuat; tidak memakai spinner di tengah halaman.
- **Empty state:** satu kalimat penjelasan + satu tombol aksi ("Belum ada site. Tambah site pertama"). Tanpa ilustrasi.
- **Error:** jelaskan apa yang terjadi dan apa yang bisa dilakukan, tanpa kode teknis di depan pengguna.

## 7. Ikon

**Lucide** (bawaan shadcn/ui di web; `lucide-react-native` di app), stroke 1.75–2, ukuran 16/20/24. Template memakai Material Symbols; padanannya:

| Template | Lucide | Pemakaian |
|---|---|---|
| `grid_view` | `LayoutGrid` | Dashboard |
| `assignment_ind` | `UserCheck` | Penempatan |
| `apartment` | `Building2` | Klien / Site |
| `badge` | `IdCard` | Karyawan |
| `payments` | `Wallet` | Pembayaran |
| `monitoring` | `ChartLine` | Laporan |
| `how_to_reg` | `CalendarCheck` | Absensi |
| — | `Receipt` | Invoice |
| — | `ShieldCheck` | Dokumen legal / Pengamanan |
| — | `QrCode` | Patroli |
| — | `TriangleAlert` | Insiden / flag |

## 8. Foto & gambar

- Tidak memakai foto stok atau gambar hasil AI di aplikasi.
- Foto yang tampil hanya foto operasional asli (ceklis sebelum/sesudah, insiden), dalam wadah rasio tetap, radius `md`, dan bisa diperbesar.
- Avatar: inisial dua huruf di `brand-red-tint` dengan teks `brand-red`.

## 9. Konten & bahasa

- Bahasa Indonesia baku tapi ringkas; kalimat aktif; sapaan "Anda" di portal klien, tanpa sapaan di web internal, "kamu" tidak dipakai.
- Istilah konsisten dengan PRD: *site, formasi, slot, fill rate, waktu deploy, tutup periode, nota kredit/debit*.
- **Angka (id-ID):** `3.582` · `97,8%` · `Rp 45.000.000` · singkatan di kartu: `Rp 1,2 M`, `Rp 450 jt`.
- **Tanggal & jam:** `1 Nov 2026` di tabel, `Sabtu, 1 November 2026` di judul; jam `07:15 WIB`. Zona waktu (WIB/WITA) wajib ditulis bila site berbeda zona dengan pengguna.
- **Data contoh** di desain dan seed memakai klien IPS yang nyata atau nama yang jelas fiktif ("Klien Contoh A"). Jangan mencampur nama perusahaan nyata dengan angka karangan.

## 10. Aksesibilitas

- Kontras teks minimal 4.5:1. Pasangan token di dokumen ini sudah memenuhinya; jangan menaruh teks `text-subtle` di atas `surface-muted` untuk informasi penting.
- Fokus keyboard selalu terlihat (ring `focus-ring`).
- Status tidak pernah hanya warna (ikon + teks).
- Semua tombol ikon punya `aria-label`. Grafik punya ringkasan teks atau tabel alternatif.

## 11. Implementasi

### 11.1 Web (Next.js + Tailwind + shadcn/ui)

Token dipetakan ke variabel CSS shadcn di `app/globals.css`:

```css
:root {
  --background: #F8F9FA;      /* canvas */
  --foreground: #111111;      /* ink */
  --card: #FFFFFF;
  --card-foreground: #111111;
  --popover: #FFFFFF;
  --popover-foreground: #111111;
  --primary: #B51F1A;
  --primary-foreground: #FFFFFF;
  --secondary: #F3F4F6;
  --secondary-foreground: #111111;
  --muted: #F3F4F6;
  --muted-foreground: #4B5563;
  --accent: #FDF2F2;
  --accent-foreground: #84141A;
  --destructive: #991B1B;
  --border: #E5E7EB;
  --input: #D1D5DB;
  --ring: #B51F1A;
  --radius: 0.75rem;          /* kartu; kontrol memakai calc(var(--radius) - 4px) */
  --chart-1: #B51F1A;
  --chart-2: #84141A;
  --chart-3: #D1D5DB;
  --chart-4: #FFDE59;
  --chart-5: #111111;
}
```

Token tambahan (`brand-red-strong`, `highlight`, status, elevasi) didaftarkan sebagai variabel `@theme` Tailwind dengan nama yang sama seperti di frontmatter, mis. `bg-highlight`, `text-success`, `shadow-level-2`.

Font dimuat dengan `next/font/google` (Inter 400/600/700/800, Lora italic 400).

### 11.2 Mobile (Expo)

Token diekspor dari `packages/shared/design-tokens.ts` (dihasilkan dari frontmatter ini) dan dipakai di app. Font dimuat dengan `expo-font`.

### 11.3 Mode gelap

Belum ada di MVP. Web internal dan portal hanya terang. Nama token sengaja dibuat semantik (`surface`, `ink`, `canvas`) supaya mode gelap bisa ditambahkan nanti tanpa mengubah komponen.

## 12. Perubahan dari template Stitch

| Template | IPS One | Alasan |
|---|---|---|
| Token `primary: #900006`, uraian bilang Brand Red `#B51F1A` | `brand-red: #B51F1A` sebagai primary; `#900006` dihapus | Token dan uraian di template tidak cocok |
| Deep Red `#84141A` hanya di uraian | Dijadikan token `brand-red-strong` | Dipakai untuk hover & banner |
| Skala Material (`surface-container-*`, `tertiary`, dst.) | Token semantik ringkas | Lebih mudah dipetakan ke shadcn dan dipelihara satu orang |
| Radius token 8/16px, tapi kode 4/8/12px | 8 kontrol · 12 kartu · 16 wadah besar | Disamakan dengan tampilan di screenshot |
| Status hijau/amber hanya di uraian | Token status lengkap + aturan ikon + teks | Status absensi, invoice, pipeline butuh semantik jelas |
| Banner dengan blob blur dekoratif | Banner flat `brand-red-strong`, hanya di dashboard direksi | Uraian template sendiri melarang dekorasi |
| Foto stok pekerja di kartu sektor | Tanpa foto stok; kartu site berbasis data | Sesuai prinsip "bisa dibuktikan" |
| Sektor logistik, BPO, operator produksi | Fokus kebersihan & pengamanan, label "Berisiko UU" | Sesuai strategi IPS dan UU alih daya |
| "Kantor Pusat – Jakarta Selatan" | "Kantor Pusat — Sidoarjo" | Kantor pusat IPS di Waru, Sidoarjo |
| Angka `97.8%` | `97,8%` | Format id-ID |
| Material Symbols | Lucide | Bawaan shadcn, ringan, tersedia untuk React Native |
| Hanya dashboard web | + portal klien & aplikasi petugas | Tiga permukaan di PRD |
| Navigasi: Penempatan, Rekrutmen, Presensi & Payroll, dll. | Navigasi mengikuti modul PRD M1–M12 | Payroll & rekrutmen baru di Fase 2 |
