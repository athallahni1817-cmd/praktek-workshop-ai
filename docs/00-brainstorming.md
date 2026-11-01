# Brainstorming: Platform Operasional PT IPS ("IPS One")

> Versi 0.2 · 1 November 2026 · Status: draft, pertanyaan terbuka utama sudah dijawab
> Nama "IPS One" hanya nama kerja, boleh diganti.

Dokumen ini adalah titik awal. Isinya ringkasan konteks bisnis, keputusan yang sudah diambil, peta modul, dan ide tambahan. Detailnya ada di:

- [01-BRD.md](01-BRD.md): kenapa sistem ini dibuat dan apa ukuran berhasilnya (sisi bisnis)
- [02-PRD.md](02-PRD.md): fitur apa saja, untuk siapa, dan alur kerjanya (sisi produk)
- [03-TRD.md](03-TRD.md): bagaimana sistem dibangun (sisi teknis)

---

## 1. Konteks singkat

Sumber: vault Obsidian (Company Profile IPS 2026, BMC IPS, USP & Persona IPS).

- **PT Indonesia Partner Solution (IPS)**: facility services & outsourcing, kantor pusat Waru, Sidoarjo, berdiri 2010.
- **Skala (klaim):** 3.500+ karyawan aktif, 900+ klien, 20 kantor perwakilan dari Palembang sampai Makassar.
- **Layanan utama:** cleaning service dan security (kontrak bulanan), ditambah building maintenance, penyediaan SDM, chemical & peralatan, training.
- **Alur pembayaran saat ini:** RAB → sinkronisasi absensi di site → invoice sesuai MOU → kirim ke klien → jatuh tempo sesuai kontrak.
- **Arah strategis 2027:** fokus ke klien jaringan F&B, hotel, ritel. USP usulan: *"satu kontrak, satu standar, satu invoice di 20 kota, aman dari aturan alih daya baru."*
- **Masalah yang terlihat dari data:**
  - Alasan menang/kalah tender tidak dicatat.
  - Belum ada angka bukti: skor audit per cabang, waktu dari kontrak sampai petugas siap di lokasi, turnover.
  - Dokumen legal tidak konsisten (APKLINDO sudah kedaluwarsa per 25-09-2026).
  - Lini penyediaan SDM umum berisiko kena UU Pelindungan Ketenagakerjaan.

**Benang merahnya:** USP baru IPS butuh *bukti angka*, dan angka itu hanya bisa muncul kalau semua proses (jualan, penempatan, absensi, audit, invoice) tercatat di satu sistem. Jadi dashboard ini bukan sekadar alat administrasi. Dashboard ini adalah **mesin bukti untuk USP**.

## 2. Keputusan yang sudah diambil (1 Nov 2026)

| Topik | Keputusan |
|---|---|
| Aplikasi absensi lama | **Diganti.** Absensi, patroli, ceklis area dibangun sendiri |
| Kedalaman pembukuan | **Invoice + piutang + jurnal sederhana.** Laporan pajak resmi tetap lewat konsultan/software akuntansi (sistem menyediakan ekspor) |
| Pengguna | Manajemen & admin kantor, petugas lapangan (aplikasi HP), **dan portal klien** |
| Prioritas MVP | Keempatnya: Leads & CRM, Absensi & aktivitas lapangan, Invoice & piutang, Dashboard eksekutif |
| Pembangun | **Pemilik sendiri dibantu AI** (1 orang). Stack ringkas: Supabase + Next.js + Expo |
| HP petugas | Hampir semua punya Android sendiri. Mode HP bersama hanya cadangan |
| Petugas tidak hadir & tidak diganti | **Invoice dipotong per hari/shift** |
| Pilot | **Surabaya + 1 cabang luar Jatim** (usulan: Denpasar untuk uji zona WITA, atau Jakarta) |
| Target go-live | Fleksibel, tanpa tenggat keras |
| Invoice | **Satu invoice per site** secara default |
| Foto selfie di portal klien | **Tidak ditampilkan.** Klien hanya melihat status, jam, dan lokasi. Foto hanya untuk internal IPS |
| Login petugas | **Username + password awal dari admin, wajib diganti saat login pertama** |
| Batas approval direksi | Dibuat bisa diatur; angkanya ditentukan saat go-live |
| Koreksi absensi setelah invoice terbit | **Nota kredit/debit, disetujui Finance.** Invoice asli tidak diubah |

**Konsekuensi yang perlu disadari:**

1. Empat modul sekaligus di MVP itu besar, apalagi untuk satu orang. Strateginya: tiap modul dibuat **irisan tipis** yang tetap tersambung ujung ke ujung (lead → kontrak → absensi → invoice → dashboard), dibangun **berurutan** (lihat TRD bagian "Urutan pengerjaan"), lalu **pilot di 2 cabang** dulu sebelum 20 kota.
3. Invoice per site berarti klien jaringan dengan 50 gerai menerima 50 invoice. Ini berlawanan dengan USP "satu invoice di 20 kota". Usulan: Fase 1 per site sesuai keputusan, lalu **opsi invoice gabungan** ditambahkan di Fase 2 untuk klien jaringan.
2. Aplikasi lama juga mengurus **payroll, cuti, kasbon, reimbursement**. Kalau absensinya diganti, payroll perlu sumber data baru. Usulan: di Fase 1 sistem baru mengekspor rekap absensi ke format payroll yang dipakai sekarang, lalu modul payroll penuh masuk Fase 2. Aplikasi lama tetap jalan paralel selama masa transisi.

## 3. Peta modul

```
                 ┌──────────────────────────────────────────────┐
                 │          DASHBOARD EKSEKUTIF & LAPORAN        │
                 └──────────────────────────────────────────────┘
                     ▲            ▲              ▲            ▲
 ┌────────────┐  ┌────────┐  ┌──────────┐  ┌───────────┐  ┌──────────┐
 │ Marketing  │→ │  CRM & │→ │ Kontrak, │→ │ Operasi   │→ │ Invoice, │
 │ & Leads    │  │ Pipeline│  │ RAB, Site│  │ Lapangan  │  │ Piutang, │
 └────────────┘  └────────┘  │ & Formasi│  │ (absensi, │  │ Jurnal   │
                             └──────────┘  │ patroli,  │  └──────────┘
                                   │       │ ceklis,   │        ▲
                                   ▼       │ insiden)  │        │
                             ┌──────────┐  └───────────┘        │
                             │ SDM:     │        │              │
                             │ karyawan,│────────┘   rekap absensi
                             │ penempatan│──────────────────────┘
                             └──────────┘
          Portal Klien: lihat absensi, skor audit, laporan, invoice, ajukan komplain
```

**Satu sumber data:** absensi yang dicatat petugas langsung menjadi dasar invoice ke klien, dasar payroll ke karyawan, dan dasar laporan ke klien. Tidak ada input ulang.

## 4. Modul inti (sesuai permintaan)

| # | Modul | Isi utama | Fase |
|---|---|---|---|
| M1 | Marketing & Leads | Form lead (web, WA, E-Katalog, MBIZ, referral), sumber/kampanye, pembagian lead ke cabang, SLA respons | 1 |
| M2 | CRM & Pipeline | Tahap penjualan, survei site, aktivitas & follow-up, **alasan menang/kalah wajib**, data klien & PIC | 1 |
| M3 | Kontrak, RAB & Site | Kalkulator RAB, kontrak/MOU, daftar site per kontrak, **formasi** (posisi × jumlah × shift), geofence site, pengingat perpanjangan | 1 |
| M4 | Karyawan & Penempatan | Data karyawan, dokumen, penempatan ke site, petugas pengganti (backup) | 1 |
| M5 | Absensi | Check-in/out GPS + selfie, shift & jadwal, izin/sakit, anti fake GPS, mode offline | 1 |
| M6 | Aktivitas Lapangan | Ceklis area (foto sebelum/sesudah), patroli QR, laporan insiden, kunjungan SPV | 1 |
| M7 | Invoice & Piutang | Invoice otomatis dari kontrak + absensi, approval, PDF, kirim email/WA, pembayaran, umur piutang, PPh 23 | 1 |
| M8 | Jurnal sederhana | Kas/bank, biaya, laba-rugi per kontrak/cabang, ekspor ke akuntansi/pajak | 1 (dasar) – 2 |
| M9 | Dashboard eksekutif | KPI lintas cabang dan kontrak | 1 |
| M10 | Portal Klien | Absensi real-time, laporan, invoice (Fase 1 baca saja), komplain (Fase 2) | 1–2 |

## 5. Ide tambahan ("feel free to add")

Dipilih karena langsung mendukung USP atau menutup masalah yang tercatat di vault.

| Ide | Kenapa penting untuk IPS | Fase |
|---|---|---|
| **Skor audit per site/cabang** | Bukti pilar USP "satu standar, 20 kota". Bisa dijual: "skor kebersihan cabang Anda bulan ini 92" | 2 |
| **Tiket komplain + SLA** | USP "respon cepat & SLA jelas" jadi terukur (waktu respons, waktu selesai) | 2 |
| **Brankas dokumen kepatuhan + pengingat kedaluwarsa** | APKLINDO sudah lewat masa berlaku tanpa ada yang sadar. Sistem mengingatkan 60/30/7 hari sebelumnya. Paket dokumen kepatuhan bisa diunduh klien dari portal | 1 (dasar) |
| **Metrik "waktu deploy"** | Hari dari kontrak ditandatangani sampai petugas aktif di site. Bukti pilar "cepat ikut buka cabang" | 1 (otomatis dari data) |
| **Analitik turnover** | Satu-satunya bukti yang IPS punya; sekarang belum dihitung rapi | 1 (dasar) |
| **Margin per kontrak & per gerai** | Vault menyebut gerai kecil (1–2 petugas) mahal diurus; perlu angka sebelum janji harga | 1 |
| **Payroll, BPJS, cuti, kasbon, reimburse** | Pengganti fitur aplikasi lama | 2 |
| **Rekrutmen & training** | Pipeline kandidat, psikotes, pelatihan pra-penempatan, sertifikat Gada Pratama untuk satpam | 2 |
| **Inventori seragam, APD, chemical** | Biaya per site jadi akurat; jual chemical tercatat | 3 |
| **Penanda risiko UU alih daya** | Setiap posisi/formasi diberi label bidang (kebersihan, pengamanan, dll). Dashboard menampilkan porsi pendapatan dari posisi berisiko. Menjawab pertanyaan terbuka "berapa porsi pendapatan yang berisiko" | 1 |
| **Notifikasi WhatsApp** | Pengingat absen, invoice terkirim, eskalasi komplain. Hampir semua pengguna di Indonesia aktif di WA | 2 |
| **Pembayaran virtual account** | Klien bayar lewat VA, otomatis tercatat lunas | 3 |
| **Paket "buka cabang"** | Template kontrak multi-site; tambah gerai baru di kontrak yang sama dalam beberapa klik | 2 |

## 6. Pertanyaan terbuka

Sebagian besar sudah terjawab 1 Nov 2026 (lihat bagian 2). Sisa yang harus dicek di Fase 0:

1. **Software akuntansi dan payroll yang dipakai sekarang** (belum diketahui). Menentukan format ekspor payroll dan jurnal. Tanyakan ke tim finance.
2. **Nama aplikasi absensi lama** dan apakah datanya bisa diekspor (untuk migrasi data karyawan).
3. **Besar potongan per hari/shift:** tarif harian = tarif bulanan ÷ hari kerja, atau angka tetap di MOU? Kumpulkan 10–20 contoh MOU.
4. Cabang luar Jatim untuk pilot: Denpasar atau Jakarta?
5. Anggaran biaya server dan layanan pihak ketiga per bulan.
