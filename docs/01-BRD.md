# BRD: Business Requirements Document
## IPS One — Platform Operasional Terintegrasi PT Indonesia Partner Solution

| | |
|---|---|
| Versi | 0.2 (draft) |
| Tanggal | 1 November 2026 |
| Pemilik dokumen | Manajemen PT IPS |
| Dokumen terkait | [00-brainstorming.md](00-brainstorming.md), [02-PRD.md](02-PRD.md), [03-TRD.md](03-TRD.md) |

---

## 1. Ringkasan eksekutif

PT IPS mengelola 3.500+ petugas cleaning dan security di 900+ klien dan 20 kota. Prosesnya sekarang tersebar: lead dan penawaran dicatat manual, absensi di aplikasi pihak ketiga, invoice dibuat dengan menyalin data absensi, laporan ke klien dibuat terpisah. Akibatnya:

- Manajemen tidak punya angka yang bisa dipercaya untuk margin per kontrak, piutang, atau kinerja cabang.
- Invoice lambat dan rawan salah karena data absensi disalin ulang.
- Alasan menang/kalah penawaran tidak tercatat, jadi tidak ada pelajaran.
- USP baru ("satu standar, 20 kota, aman dari aturan baru") belum bisa dibuktikan dengan angka.

**IPS One** adalah satu platform yang menyambungkan proses dari lead sampai uang masuk: marketing → CRM → kontrak & RAB → penempatan → absensi & aktivitas lapangan → invoice & piutang → laporan manajemen dan portal klien.

## 2. Latar belakang & masalah bisnis

| # | Masalah | Dampak bisnis | Bukti / sumber |
|---|---|---|---|
| P1 | Data absensi ada di aplikasi pihak ketiga, invoice disusun manual dari data itu | Invoice telat → arus kas tertekan (gaji dibayar dulu, klien bayar belakangan); risiko salah tagih | Payment flow di Company Profile; BMC blok Struktur Biaya |
| P2 | Alasan menang/kalah tidak dicatat | Tidak tahu harus memperbaiki apa; kalah karena "relasi" dan "kualitas petugas" terus berulang | USP & Persona: "Alasan kalah tidak dicatat" |
| P3 | Tidak ada angka bukti kualitas (skor audit, waktu deploy, turnover) | USP sama dengan klaim kompetitor; IPS terjebak perang harga | USP & Persona: tabel pilar USP, status "belum diukur" |
| P4 | Margin per kontrak/gerai tidak diketahui | Bisa rugi di kontrak gerai kecil tanpa sadar | USP & Persona: kritik no. 2 |
| P5 | Dokumen legal tidak terpantau masa berlakunya | APKLINDO kedaluwarsa 25-09-2026; merusak USP "aman dari aturan baru" | Company Profile, BMC |
| P6 | Porsi pendapatan dari posisi berisiko UU alih daya tidak diketahui | Tidak bisa merencanakan transisi | BMC: "Porsi tiap sumber pendapatan belum ada datanya" |
| P7 | Laporan ke klien dibuat manual dan tidak real-time | Klaim "monitoring real-time" lemah; klien sulit mengecek | Company Profile USP no. 2 |

## 3. Tujuan bisnis

| Kode | Tujuan | Ukuran (KPI) | Target 12 bulan setelah go-live penuh |
|---|---|---|---|
| G1 | Mempercepat siklus tagihan | Hari dari tutup periode absensi sampai invoice terkirim | ≤ 3 hari kerja (asumsi baseline: 7–14 hari, perlu diukur) |
| G2 | Memperbaiki arus kas | DSO (rata-rata hari piutang tertagih) | Turun 20% dari baseline |
| G3 | Mengurangi salah tagih | % invoice yang direvisi/dikomplain klien | < 2% |
| G4 | Membuat keputusan jualan berbasis data | % penawaran tertutup yang punya alasan menang/kalah | 100% |
| G5 | Menyediakan bukti untuk USP | Skor audit per site, waktu deploy, turnover, SLA komplain tersedia di dashboard dan portal klien | Tersedia untuk 100% site aktif |
| G6 | Kehadiran petugas terjamin | Fill rate (slot shift terisi ÷ slot wajib) | ≥ 98% |
| G7 | Kepatuhan tidak bolong | Dokumen legal kedaluwarsa tanpa diperpanjang | 0 |
| G8 | Mengetahui profitabilitas | Kontrak dengan margin kotor terhitung tiap bulan | 100% kontrak aktif |

> Baseline semua KPI harus diukur di Fase 0 (discovery). Target di atas adalah usulan awal dan perlu disepakati manajemen.

## 4. Ruang lingkup

### 4.1 Dalam lingkup (keseluruhan program)

1. Manajemen lead dan kampanye marketing
2. CRM: pipeline penjualan, aktivitas, alasan menang/kalah, data klien
3. Kontrak, RAB, site, formasi, perpanjangan kontrak
4. Data karyawan dan penempatan ke site
5. Aplikasi HP petugas: absensi, ceklis area, patroli, insiden
6. Invoice otomatis, piutang, penerimaan pembayaran, PPh 23
7. Jurnal sederhana: kas/bank, biaya, laba-rugi per kontrak & cabang
8. Dashboard eksekutif dan laporan per cabang
9. Portal klien
10. Brankas dokumen kepatuhan
11. (Fase 2+) Payroll, BPJS, cuti, kasbon, reimburse; rekrutmen & training; tiket komplain & SLA; skor audit; notifikasi WhatsApp
12. (Fase 3) Inventori seragam/APD/chemical; pembayaran virtual account

### 4.2 Di luar lingkup

- Akuntansi penuh (neraca resmi, tutup buku, e-Faktur langsung ke Coretax). Sistem hanya menyediakan **ekspor** untuk konsultan/software akuntansi.
- Pelaporan SPT dan pajak penghasilan karyawan (PPh 21) di Fase 1.
- Website company profile publik (hanya form lead yang ditanam ke website).
- Integrasi langsung ke E-Katalog/SIPLAH/MBIZ (lead dari kanal ini dicatat manual atau via email).

## 5. Pemangku kepentingan

| Pihak | Peran | Kepentingan utama |
|---|---|---|
| Direksi (Dirut & Direktur) | Sponsor, pengambil keputusan | Revenue, margin, arus kas, kinerja cabang, risiko regulasi |
| Marketing & Sales | Pengguna CRM | Lead masuk cepat, pipeline jelas, RAB cepat dibuat |
| Kepala Cabang (20 kota) | Pengguna utama per cabang | Kinerja cabang, fill rate, komplain, piutang cabang |
| Operasional (Ops Manager, Area Manager, SPV/Team Leader) | Pengguna lapangan & web | Jadwal, absensi, ceklis, patroli, insiden, audit |
| Petugas (cleaner, satpam, dll.) | Pengguna aplikasi HP | Absen mudah, cepat, tetap jalan saat sinyal lemah; slip & cuti (Fase 2) |
| HR | Pengguna web | Data karyawan, penempatan, turnover, dokumen, payroll (Fase 2) |
| Finance | Pengguna web | Invoice, piutang, pembayaran, jurnal, ekspor pajak |
| Klien (HR/GA, Building Manager, Direktur Ops) | Pengguna portal | Bukti kehadiran, kualitas, invoice, kepatuhan vendor |
| Konsultan pajak/akuntan | Penerima ekspor data | Data rapi dan bisa diaudit |

## 6. Kebutuhan bisnis (tingkat tinggi)

Prioritas: **W** = wajib (MVP), **P** = penting (Fase 2), **B** = bagus kalau ada (Fase 3).

| ID | Kebutuhan | Prioritas |
|---|---|---|
| BR-01 | Semua lead dari semua kanal tercatat di satu tempat, dengan sumber dan cabang penanggung jawab | W |
| BR-02 | Setiap penawaran yang ditutup wajib mencatat hasil (menang/kalah) beserta alasan dan pesaing | W |
| BR-03 | RAB dapat dihitung di sistem dan menjadi dasar nilai kontrak | W |
| BR-04 | Kontrak memuat site, formasi, nilai, aturan tagih, jatuh tempo, dan tanggal berakhir; sistem mengingatkan perpanjangan | W |
| BR-05 | Kehadiran petugas tercatat dengan bukti lokasi dan wajah, dan tahan terhadap kecurangan dasar (fake GPS, titip absen) | W |
| BR-06 | Aktivitas lapangan (ceklis, patroli, insiden) tercatat dengan foto dan waktu | W |
| BR-07 | Invoice dihasilkan otomatis dari kontrak + absensi periode berjalan, melalui persetujuan sebelum dikirim | W |
| BR-08 | Piutang terpantau per klien, cabang, dan umur; pembayaran dan potongan PPh 23 tercatat | W |
| BR-09 | Manajemen melihat KPI lintas cabang tanpa meminta laporan manual | W |
| BR-10 | Klien dapat melihat kehadiran petugas (status, jam, lokasi; tanpa foto wajah) dan invoice mereka secara mandiri | W |
| BR-11 | Dokumen legal perusahaan terpantau masa berlakunya | W |
| BR-12 | Margin kotor per kontrak dan per site dapat dihitung | W |
| BR-13 | Porsi pendapatan dari posisi yang berisiko UU alih daya terlihat | W |
| BR-14 | Rekap absensi dapat diekspor untuk payroll selama payroll belum di sistem | W |
| BR-15 | Payroll, BPJS, cuti, kasbon, reimburse dikelola di sistem | P |
| BR-16 | Komplain klien tercatat dengan SLA respons dan penyelesaian | P |
| BR-17 | Skor audit kualitas per site, dapat dibagikan ke klien | P |
| BR-18 | Rekrutmen dan pelatihan pra-penempatan tercatat | P |
| BR-19 | Notifikasi lewat WhatsApp | P |
| BR-20 | Stok seragam, APD, dan chemical per cabang/site | B |
| BR-21 | Pembayaran klien lewat virtual account tercatat otomatis | B |

## 7. Proses bisnis

### 7.1 Kondisi sekarang (as-is, berdasarkan dokumen yang ada)

```
Lead (kenalan/WA/E-Katalog) → penawaran manual (Excel/Word) → kontrak/MOU kertas
→ rekrut & tempatkan petugas → absen di aplikasi pihak ketiga
→ admin unduh rekap absensi → hitung invoice di Excel → kirim invoice (email/kurir)
→ catat pembayaran manual → laporan ke direksi dibuat manual per cabang
```

Titik lemah: setiap panah adalah perpindahan data manual.

### 7.2 Kondisi yang diinginkan (to-be)

```
Lead masuk (form/WA/manual) → otomatis dibagi ke cabang → pipeline CRM
→ RAB di sistem → menang (alasan dicatat) → kontrak + site + formasi dibuat dari RAB
→ petugas ditempatkan → absen/ceklis/patroli di aplikasi HP
→ tutup periode → draft invoice otomatis → approval Finance → PDF terkirim (email/portal)
→ pembayaran dicatat & dicocokkan → jurnal & dashboard ter-update otomatis
→ klien melihat semuanya di portal
```

## 8. Manfaat yang diharapkan

| Manfaat | Jenis | Penjelasan |
|---|---|---|
| Invoice lebih cepat | Kas | Setiap hari invoice lebih cepat terkirim = modal kerja yang tidak tertahan. Dengan 900+ klien, selisih beberapa hari berarti dana besar |
| Lebih sedikit salah tagih | Biaya & reputasi | Data absensi tidak disalin ulang |
| Biaya admin turun | Biaya | Rekap absensi dan invoice tidak dikerjakan manual di tiap cabang |
| Tidak bayar langganan aplikasi absensi | Biaya | Diganti sistem sendiri (dibandingkan dengan biaya hosting & pemeliharaan) |
| Win rate naik | Pendapatan | Alasan kalah tercatat → perbaikan terarah |
| USP terbukti | Pendapatan | Skor audit, waktu deploy, SLA, turnover menjadi materi jualan ke jaringan F&B/hotel/ritel |
| Klien lebih lengket | Retensi | Portal klien dan data yang menyatu membuat klien "repot kalau pindah" (economic moat) |
| Risiko regulasi terlihat | Risiko | Porsi pendapatan berisiko UU alih daya terukur |

> Estimasi nilai rupiah (ROI) belum bisa dihitung karena baseline belum ada. Diisi setelah Fase 0.

## 9. Asumsi

1. Hampir semua petugas punya HP Android sendiri dengan kamera dan GPS (dikonfirmasi pemilik, 1 Nov 2026). Mode "HP bersama" hanya cadangan.
2. Struktur kontrak klien cukup seragam untuk dimodelkan dengan beberapa tipe aturan tagih (tetap, per kepala, prorata kehadiran). Slot yang kosong dan tidak diganti **dipotong per hari/shift**.
3. Aplikasi absensi lama tetap berjalan paralel selama pilot dan masa transisi payroll.
4. Laporan pajak resmi tetap dikerjakan konsultan/software akuntansi.
5. Data karyawan dan klien saat ini bisa diekspor (Excel/CSV) untuk migrasi.
6. Klien bersedia memakai portal (minimal PIC utama).

## 10. Batasan

- Sistem dibangun **oleh satu orang (pemilik) dibantu AI**. Lingkup tiap fase harus disesuaikan dengan kapasitas ini; tidak ada tenggat keras.
- Anggaran belum ditentukan.
- Software akuntansi dan payroll yang dipakai sekarang belum diketahui (dicek di Fase 0).
- Data pribadi karyawan (termasuk foto wajah) tunduk pada **UU No. 27/2022 tentang Pelindungan Data Pribadi (UU PDP)**.
- Ketentuan **UU Pelindungan Ketenagakerjaan** (disahkan 6 Okt 2026) dan **Permenaker 7/2026** masih punya ketidakjelasan jumlah bidang yang dibolehkan (6 vs 5 vs 4). Sistem harus membuat label bidang posisi bisa diubah tanpa ubah kode.
- Konektivitas di sebagian site (basement mal, rumah sakit) lemah.

## 11. Risiko

| Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|
| Petugas menolak/kesulitan memakai aplikasi baru | Sedang | Tinggi | UI sangat sederhana, bahasa Indonesia, pelatihan oleh SPV, mode HP bersama, pilot dulu |
| MVP terlalu besar (4 modul) | Tinggi | Tinggi | Irisan tipis per modul, dibangun berurutan (TRD bagian 10), pilot 2 cabang, rilis bertahap |
| Payroll terganggu saat aplikasi lama dimatikan | Sedang | Sangat tinggi | Jalan paralel; jangan matikan aplikasi lama sebelum payroll Fase 2 lolos uji 2 periode |
| Aturan tagih per kontrak terlalu beragam | Sedang | Tinggi | Inventarisasi 20–30 kontrak contoh di Fase 0; sediakan baris tagihan manual sebagai jalan keluar |
| Kecurangan absen (fake GPS, titip absen) | Tinggi | Sedang | Deteksi mock location, selfie + liveness, geofence, audit acak SPV |
| Kebocoran data pribadi | Rendah | Sangat tinggi | Enkripsi, hak akses per cabang/klien, log audit, kebijakan retensi foto |
| Klien tidak memakai portal | Sedang | Sedang | Kirim ringkasan bulanan otomatis via email/WA berisi tautan portal |
| Data awal kotor (duplikat klien, karyawan) | Tinggi | Sedang | Pembersihan data di Fase 0, aturan validasi saat impor |
| Bergantung pada satu pembangun (sakit, sibuk mengurus bisnis) | Tinggi | Tinggi | Pakai layanan terkelola (Supabase), kode & dokumen rapi di repositori, uji otomatis untuk logika uang, backup otomatis; siapkan dana cadangan untuk freelancer bila macet |
| Invoice per site membanjiri klien jaringan | Sedang | Sedang | Opsi invoice gabungan per klien di Fase 2 |

## 12. Fase & jadwal tingkat tinggi

| Fase | Isi | Perkiraan durasi* |
|---|---|---|
| 0. Discovery | Ukur baseline KPI, kumpulkan contoh kontrak/RAB/invoice, cek software akuntansi & payroll, inventarisasi data, finalisasi PRD/TRD | 3–4 minggu |
| 1. MVP | Irisan tipis 4 modul prioritas + portal klien baca saja + brankas dokumen, dibangun berurutan; pilot **Surabaya + 1 cabang luar Jatim** | 6–9 bulan |
| 1b. Roll-out | Perluasan bertahap ke 20 cabang (gelombang 3–5 cabang) | 3–4 bulan |
| 2. Pengembangan | Payroll & HR, komplain & SLA, skor audit, rekrutmen & training, notifikasi WA, invoice gabungan, jurnal lebih lengkap | 6–9 bulan |
| 3. Optimasi | Inventori, virtual account, analitik lanjutan | Berjalan |

\* Untuk satu pembangun dibantu AI, bekerja paruh waktu sampai penuh waktu. Tidak ada tenggat keras; urutan lebih penting daripada tanggal. Roll-out ke cabang berikutnya hanya setelah gate pilot (bagian 13) terpenuhi.

## 13. Kriteria keberhasilan pilot (gate sebelum roll-out)

- ≥ 95% petugas di cabang pilot absen lewat aplikasi baru selama 2 periode berturut-turut.
- Invoice periode pilot dihasilkan dari sistem dengan selisih ≤ 0,5% dibanding perhitungan manual (diuji paralel).
- Semua lead dan penawaran baru cabang pilot masuk CRM, 100% penawaran tertutup punya alasan.
- Direksi memakai dashboard di rapat bulanan tanpa laporan Excel tambahan.
- Minimal 3 klien pilot aktif login portal.

## 14. Persetujuan

| Nama | Jabatan | Tanda tangan | Tanggal |
|---|---|---|---|
| | Direktur Utama | | |
| | Direktur | | |
| | Kepala Operasional | | |
| | Kepala Keuangan | | |
