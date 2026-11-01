# PRD: Product Requirements Document
## IPS One — Platform Operasional Terintegrasi PT IPS

| | |
|---|---|
| Versi | 0.2 (draft) |
| Tanggal | 1 November 2026 |
| Dokumen terkait | [01-BRD.md](01-BRD.md) (alasan bisnis), [03-TRD.md](03-TRD.md) (desain teknis) |

---

## 1. Visi produk

> Satu sistem tempat setiap petugas, SPV, cabang, kantor pusat, dan klien melihat data yang sama: siapa yang bekerja di mana, seberapa bagus hasilnya, berapa yang harus ditagih, dan berapa yang sudah dibayar.

**Prinsip produk:**

1. **Input sekali, dipakai di mana-mana.** Absensi petugas = dasar invoice = dasar payroll = laporan klien.
2. **Lapangan dulu.** Aplikasi petugas harus bisa dipakai orang yang jarang memakai aplikasi, dengan sinyal lemah, dalam 10 detik.
3. **Angka yang bisa dijual.** Setiap fitur operasional menghasilkan metrik yang bisa ditunjukkan ke klien (bukti USP).
4. **Cabang mandiri, pusat melihat semua.** Data dipisah per cabang, direksi melihat gabungan.

## 2. Persona pengguna

| Persona | Perangkat | Kebutuhan utama | Frustrasi sekarang |
|---|---|---|---|
| **Pak Joko, petugas cleaning** di mal Surabaya | HP Android murah, kuota terbatas | Absen cepat, tahu jadwal & area, lapor selesai | Aplikasi lambat, GPS susah di basement |
| **Mbak Sari, Team Leader/SPV** 25 petugas di 3 site | HP Android | Lihat siapa belum datang, cari pengganti, isi ceklis & audit | Telepon satu-satu untuk cek kehadiran |
| **Pak Dedi, Kepala Cabang** Semarang | Laptop + HP | Fill rate, komplain, piutang cabang, lead baru | Laporan ke pusat dikerjakan manual tiap bulan |
| **Rina, Sales/Marketing** | Laptop + HP | Pipeline, RAB cepat, follow-up tidak terlewat | RAB di Excel, versi berceceran |
| **Bu Lina, Finance** pusat | Laptop | Invoice cepat & benar, piutang, rekonsiliasi | Menyalin rekap absensi ke Excel invoice |
| **Bu Mira, Direktur** | Laptop + HP | Revenue, margin, kas, kinerja 20 cabang dalam 1 layar | Menunggu laporan; angka beda-beda |
| **Bu Rina (klien), HR/GA jaringan resto** | Laptop | Bukti petugas hadir di tiap gerai, invoice satu pintu, dokumen kepatuhan vendor | Harus minta laporan ke vendor |

## 3. Peran & hak akses

| Peran | Cakupan data | Hak utama |
|---|---|---|
| Super Admin | Semua | Konfigurasi sistem, master data, pengguna |
| Direksi | Semua cabang | Lihat semua, approval kontrak & invoice di atas batas nilai |
| Kepala Cabang | Cabangnya | Kelola lead, kontrak, karyawan, jadwal, approval invoice cabang |
| Sales/Marketing | Cabangnya (atau lead miliknya) | Lead, pipeline, RAB, klien |
| HR | Semua / cabangnya | Karyawan, penempatan, dokumen, ekspor payroll |
| Ops Manager / Area Manager | Site di area-nya | Jadwal, absensi, koreksi absensi, audit, insiden |
| SPV / Team Leader | Site yang dipegang | Pantau absensi, tunjuk pengganti, isi ceklis/audit, setujui izin |
| Petugas | Dirinya sendiri | Absen, ceklis, patroli, insiden, ajukan izin |
| Finance | Semua / cabangnya | Invoice, pembayaran, jurnal, ekspor |
| Klien Admin | Site & kontrak miliknya | Lihat absensi, laporan, invoice; kelola pengguna klien |
| Klien Viewer | Site tertentu | Lihat saja |

Aturan: semua aksi yang mengubah data uang atau absensi tercatat di log audit (siapa, kapan, sebelum/sesudah).

## 4. Alur utama ujung ke ujung

```
[Lead] ──kualifikasi──> [Opportunity] ──survei──> [RAB/Penawaran] ──negosiasi──> MENANG / KALAH (alasan wajib)
                                                                                     │
                                                                                     ▼
                                    [Kontrak] ── berisi ──> [Site] ── berisi ──> [Formasi: posisi × jumlah × shift]
                                                                                     │
                                                                                     ▼
                                                            [Penempatan petugas] → [Jadwal shift]
                                                                                     │
                                                                                     ▼
                                        [Absensi] + [Ceklis] + [Patroli] + [Insiden]  (aplikasi HP)
                                                                                     │
                                                                  tutup periode (cut-off)
                                                                                     ▼
                                    [Draft invoice] → approval → [Invoice terbit] → kirim → [Pembayaran] → [Jurnal]
                                                                                     │
                                                                                     ▼
                                                               [Dashboard] & [Portal klien]
```

## 5. Kebutuhan fungsional per modul

Format: user story + kriteria penerimaan (KP). Prioritas: **MVP** / **F2** (Fase 2) / **F3**.

### M1. Marketing & Leads

| ID | User story | Prioritas |
|---|---|---|
| LD-01 | Sebagai calon klien, saya mengisi form di website/landing page dan data saya masuk ke sistem | MVP |
| LD-02 | Sebagai sales, saya menambah lead manual (dari WA, telepon, E-Katalog, MBIZ, SIPLAH, referral, event) | MVP |
| LD-03 | Sebagai kepala cabang, lead dari kota saya otomatis masuk ke cabang saya | MVP |
| LD-04 | Sebagai manajer marketing, saya melihat jumlah lead dan konversi per sumber/kampanye | MVP |
| LD-05 | Sebagai sales, saya diingatkan kalau lead belum direspons > 24 jam | MVP |
| LD-06 | Sebagai sistem, saya mendeteksi lead duplikat (nomor HP/email/nama perusahaan sama) | MVP |
| LD-07 | Sebagai marketer, saya membuat kampanye dengan tautan UTM dan melihat hasilnya | F2 |
| LD-08 | Lead dari WhatsApp Business masuk otomatis | F2 |

**KP utama:**
- Field lead: nama, perusahaan, jabatan, HP, email, kota, segmen (mal, RS, F&B, hotel, ritel, manufaktur, pendidikan, pemerintah, rumah tangga), layanan diminati, jumlah lokasi, sumber, kampanye, catatan.
- Pembagian otomatis berdasarkan kota → cabang terdekat; jika tidak cocok, masuk antrean pusat.
- Status lead: Baru → Dihubungi → Terkualifikasi (jadi opportunity) / Tidak terkualifikasi (alasan wajib).
- **Penanda anti-persona** (opsional): sistem memberi tanda jika lead meminta posisi berisiko UU (mis. tenaga produksi) atau hanya 1 gerai.

### M2. CRM & Pipeline

| ID | User story | Prioritas |
|---|---|---|
| CR-01 | Sebagai sales, saya melihat pipeline dalam bentuk kanban per tahap | MVP |
| CR-02 | Sebagai sales, saya mencatat aktivitas (telepon, kunjungan, meeting, WA) dan tugas follow-up dengan tanggal | MVP |
| CR-03 | Sebagai sales, saya mencatat hasil survei site (luas, jumlah lantai/toilet, jam operasional, foto) | MVP |
| CR-04 | Sebagai sales, saya **wajib** mengisi alasan dan pesaing ketika menandai opportunity menang/kalah | MVP |
| CR-05 | Sebagai direksi, saya melihat nilai pipeline, win rate, dan alasan kalah teratas per cabang/segmen | MVP |
| CR-06 | Sebagai sales, saya mengelola data klien: perusahaan induk, cabang/gerai, PIC (HR, GA, Ops, Finance) | MVP |
| CR-07 | Sebagai sales, saya melihat riwayat lengkap klien (kontrak, invoice, komplain) di satu halaman | MVP (dasar) |

**Tahap pipeline:** Terkualifikasi → Survei → Penawaran/RAB terkirim → Negosiasi → Menang / Kalah.
**Daftar alasan kalah (bisa dikonfigurasi):** harga, relasi pesaing, kualitas/riwayat petugas, cakupan kota, legalitas/dokumen, waktu respons, klien kerjakan sendiri, lainnya (teks).
**Daftar alasan menang:** harga, cakupan multi-kota, kualitas, rekomendasi, kepatuhan, kenalan, lainnya.

### M3. Kontrak, RAB & Site

| ID | User story | Prioritas |
|---|---|---|
| KT-01 | Sebagai sales, saya membuat RAB dari template: posisi × jumlah × gaji pokok (UMK kota) + tunjangan + BPJS + THR + seragam/APD + chemical/peralatan + management fee + pajak | MVP |
| KT-02 | Sebagai sales, saya melihat estimasi margin kotor RAB sebelum mengirim penawaran; sistem memberi peringatan bila margin di bawah batas minimum | MVP |
| KT-03 | Sebagai sales, saya mencetak penawaran PDF berkop IPS dari RAB | MVP |
| KT-04 | Sebagai kepala cabang, saat opportunity menang, saya mengubah RAB menjadi kontrak dengan site dan formasi tanpa input ulang | MVP |
| KT-05 | Sebagai admin, saya mengatur aturan tagih per kontrak: tetap bulanan, per kepala, atau prorata kehadiran; tanggal cut-off; termin pembayaran; PPN; PPh 23 | MVP |
| KT-06 | Sebagai admin, saya menggambar geofence site di peta (radius atau poligon) dan menaruh titik patroli | MVP |
| KT-07 | Sebagai sistem, saya mengingatkan kontrak yang akan berakhir 90/60/30 hari sebelumnya | MVP |
| KT-08 | Sebagai admin, saya mencatat adendum (tambah/kurang site, formasi, nilai) dengan tanggal berlaku | MVP |
| KT-09 | Setiap posisi di formasi diberi **label bidang** (kebersihan, pengamanan, angkutan pekerja, penunjang lain, berisiko) | MVP |
| KT-10 | Sebagai sales, saya menambah gerai baru ke kontrak jaringan yang sudah ada dengan template formasi standar ("paket buka cabang") | F2 |

**Catatan:** UMK per kota (20 kota) disimpan sebagai master data per tahun, sehingga RAB tahun berikutnya bisa dihitung ulang otomatis.

### M4. Karyawan & Penempatan

| ID | User story | Prioritas |
|---|---|---|
| KR-01 | Sebagai HR, saya mengelola data karyawan: identitas, kontak, cabang, jabatan, status (PKWT/lainnya), tanggal masuk/keluar, BPJS, rekening, dokumen (KTP, KK, ijazah, sertifikat Gada) | MVP |
| KR-02 | Sebagai HR, saya mengimpor data karyawan dari Excel (migrasi dari aplikasi lama) | MVP |
| KR-03 | Sebagai kepala cabang, saya menempatkan karyawan ke slot formasi di site | MVP |
| KR-04 | Sebagai sistem, saya menampilkan slot formasi yang kosong (belum terisi) per site | MVP |
| KR-05 | Sebagai HR, saya mencatat karyawan keluar dengan alasan (resign, habis kontrak, diberhentikan, mangkir) untuk menghitung turnover | MVP |
| KR-06 | Sebagai sistem, saya mengingatkan dokumen karyawan yang kedaluwarsa (KTA satpam, sertifikat) | MVP |
| KR-07 | Pipeline rekrutmen, psikotes, pelatihan pra-penempatan | F2 |

### M5. Absensi (aplikasi HP + web)

| ID | User story | Prioritas |
|---|---|---|
| AB-01 | Sebagai petugas, saya melihat jadwal shift saya hari ini dan minggu ini | MVP |
| AB-02 | Sebagai petugas, saya check-in/out dengan **selfie + lokasi GPS** dalam ≤ 3 ketukan | MVP |
| AB-03 | Sebagai petugas, saya tetap bisa absen saat tidak ada sinyal; data terkirim otomatis saat online, dengan waktu asli dari perangkat yang tervalidasi | MVP |
| AB-04 | Sebagai sistem, saya menolak/menandai absen di luar geofence, dengan fake GPS, atau dari HP yang di-root | MVP |
| AB-05 | Sebagai sistem, saya mencocokkan selfie dengan foto profil (face match) dan menandai yang meragukan untuk ditinjau | MVP |
| AB-06 | Sebagai SPV, saya melihat secara real-time siapa yang sudah/belum hadir di site saya, dan menerima notifikasi bila petugas belum check-in 15 menit setelah shift mulai | MVP |
| AB-07 | Sebagai SPV, saya menunjuk **petugas pengganti** untuk slot yang kosong | MVP |
| AB-08 | Sebagai petugas, saya mengajukan izin/sakit dengan lampiran; SPV menyetujui | MVP |
| AB-09 | Sebagai Ops Manager, saya mengoreksi absensi dengan alasan wajib (tercatat di log audit) | MVP |
| AB-10 | Sebagai SPV, saya memakai **mode HP bersama** di site (cadangan, untuk petugas yang HP-nya rusak/hilang): beberapa petugas absen di satu HP dengan selfie masing-masing | MVP |
| AB-14 | Sebagai admin/HR, saya membuat akun petugas dengan **username dan password awal**; petugas **wajib mengganti password** saat login pertama. SPV/HR dapat me-reset password | MVP |
| AB-11 | Sebagai HR, saya mengekspor rekap absensi per periode (hadir, telat, lembur, izin, alfa) ke Excel untuk payroll | MVP |
| AB-12 | Sebagai admin, saya mengatur shift (pagi/siang/malam, lintas tengah malam), toleransi telat, dan aturan lembur per site | MVP |
| AB-13 | Cuti, kasbon, reimburse, slip gaji di aplikasi | F2 |

**Status harian per slot:** Hadir · Telat · Pulang cepat · Izin · Sakit · Alfa · Diganti (oleh siapa) · Libur.
**Fill rate** = slot terisi (hadir/telat/diganti) ÷ slot wajib formasi.

### M6. Aktivitas Lapangan

| ID | User story | Prioritas |
|---|---|---|
| AL-01 | Sebagai admin, saya membuat template ceklis area (mis. toilet lt. 2: lantai, wastafel, cermin, tisu, bau) dan jadwalnya (tiap jam/shift) | MVP |
| AL-02 | Sebagai petugas, saya mengisi ceklis dengan foto sebelum/sesudah | MVP |
| AL-03 | Sebagai satpam, saya memindai **QR titik patroli** sesuai rute dan jadwal; sistem mencatat titik yang terlewat | MVP |
| AL-04 | Sebagai petugas, saya melaporkan insiden (kehilangan, kerusakan, kecelakaan, keamanan) dengan foto, lokasi, dan tingkat keparahan; SPV dan kepala cabang langsung diberi tahu | MVP |
| AL-05 | Sebagai SPV, saya mencatat kunjungan/inspeksi site | MVP |
| AL-06 | Sebagai SPV/Area Manager, saya mengisi **audit kualitas** dengan skor per kategori; skor rata-rata per site/cabang tampil di dashboard dan portal klien | F2 |
| AL-07 | Sebagai klien, saya menandatangani **Voice of Customer** digital di portal | F2 |
| AL-08 | Sebagai klien, saya membuat **tiket komplain**; sistem mengukur SLA respons & penyelesaian dan mengeskalasi bila lewat batas | F2 |

### M7. Invoice & Piutang

| ID | User story | Prioritas |
|---|---|---|
| IV-01 | Sebagai Finance, saat periode ditutup, sistem membuat **draft invoice per site** berdasarkan aturan tagih dan rekap absensi | MVP |
| IV-02 | Sebagai Finance, saya melihat rincian perhitungan setiap baris (slot wajib, terisi, potongan) dan dapat menambah baris manual (proyek tambahan, chemical) | MVP |
| IV-03 | Sebagai kepala cabang/Finance, saya menyetujui invoice; invoice di atas batas nilai butuh approval direksi. **Batas nilai diatur di pengaturan** (angka ditentukan saat go-live) | MVP |
| IV-04 | Setelah disetujui, invoice mendapat nomor resmi, PDF dibuat (kop, rincian, rekening bank, lampiran rekap absensi), dan periode absensi terkunci | MVP |
| IV-05 | Sebagai Finance, saya mengirim invoice ke email PIC klien langsung dari sistem; klien juga melihatnya di portal | MVP |
| IV-06 | Sebagai Finance, saya mencatat pembayaran (penuh/sebagian), potongan PPh 23 dan nomor bukti potong, dan mengalokasikannya ke satu/beberapa invoice | MVP |
| IV-07 | Sebagai Finance, saya mengimpor mutasi rekening (CSV BCA/Mandiri) dan sistem menyarankan pencocokan dengan invoice | MVP (dasar) |
| IV-08 | Sebagai Finance, saya melihat **umur piutang** (0–30, 31–60, 61–90, >90 hari) per klien/cabang, dan sistem mengirim pengingat jatuh tempo ke klien | MVP |
| IV-09 | Sebagai Finance, saya membuat **nota kredit atau nota debit** tanpa mengubah invoice asli. Koreksi absensi pada periode yang sudah ditagih otomatis menghasilkan draft nota kredit/debit yang **harus disetujui Finance** | MVP |
| IV-10 | Sebagai Finance, saya mengekspor data invoice untuk e-Faktur/Coretax dan software akuntansi | MVP |
| IV-11 | **Satu invoice gabungan** untuk klien jaringan dengan banyak site di banyak kota, dengan lampiran per site (opsi per kontrak; default tetap per site) | F2 |
| IV-12 | Pembayaran via virtual account otomatis tercatat | F3 |

**Aturan tagih yang didukung:**

| Tipe | Rumus | Contoh |
|---|---|---|
| Tetap bulanan | Nilai MOU | Rp 45.000.000 / bulan |
| Per kepala | Tarif × jumlah formasi | 12 cleaner × Rp 5.200.000 |
| Potongan per hari/shift **(default)** | Nilai MOU − (jumlah slot kosong tidak diganti × tarif potongan per slot) | 3 shift alfa × Rp 200.000 = potongan Rp 600.000 |
| Prorata kehadiran | Tarif × (slot terisi ÷ slot wajib) | Untuk kontrak yang menagih murni berdasarkan kehadiran |
| Baris manual | Diisi Finance | General cleaning, pest control, chemical |

Tarif potongan per slot bisa diisi angka tetap dari MOU atau dihitung otomatis (tarif bulanan per posisi ÷ hari kerja). Slot berstatus **Diganti** tidak dipotong. Izin dan sakit yang tidak diganti diperlakukan sama dengan alfa, kecuali kontrak mengatur lain.

Pajak: PPN (tarif & dasar pengenaan dapat dikonfigurasi, termasuk opsi DPP hanya management fee), PPh 23 dicatat sebagai potongan yang diharapkan.

### M8. Jurnal sederhana

| ID | User story | Prioritas |
|---|---|---|
| JR-01 | Sistem membuat jurnal otomatis saat invoice terbit dan pembayaran diterima (piutang, pendapatan, PPN keluaran, kas/bank, PPh 23 dibayar dimuka) | MVP |
| JR-02 | Sebagai Finance, saya mencatat biaya (operasional cabang, seragam, chemical) dengan kategori, cabang, dan (opsional) kontrak/site | MVP |
| JR-03 | Sebagai Finance, saya mengimpor biaya gaji per site per periode (dari payroll) agar margin per kontrak bisa dihitung | MVP |
| JR-04 | Sebagai direksi, saya melihat laba-rugi sederhana per bulan, per cabang, dan **margin kotor per kontrak/site** | MVP |
| JR-05 | Sebagai Finance, saya mengekspor jurnal ke format software akuntansi (CSV/Excel) | MVP |
| JR-06 | Bagan akun yang bisa dikonfigurasi, buku besar, rekonsiliasi bank penuh | F2 |

### M9. Dashboard eksekutif & laporan

**Halaman utama direksi (MVP):**

| Kelompok | Metrik |
|---|---|
| Penjualan | Lead baru, nilai pipeline per tahap, win rate, alasan kalah teratas, kontrak akan berakhir |
| Operasi | Petugas aktif, fill rate hari ini & bulan ini, telat/alfa, insiden terbuka, ceklis terselesaikan (%), patroli terlewat |
| Keuangan | Pendapatan ditagih bulan ini, piutang & umurnya, DSO, kas masuk, margin kotor per kontrak (top & bottom 10) |
| SDM | Turnover bulanan & 12 bulan, karyawan masuk/keluar, slot kosong |
| Bukti USP | **Waktu deploy** (hari kontrak → petugas aktif), skor audit (F2), SLA komplain (F2) |
| Risiko | % pendapatan dari posisi berlabel berisiko UU, dokumen legal yang akan kedaluwarsa |

**Fitur:** filter cabang/segmen/klien/periode, klik angka untuk melihat rincian, ekspor Excel/PDF, peta 20 cabang dengan indikator warna.

**Dashboard per peran:** kepala cabang (versi cabang), SPV (site-nya hari ini), sales (pipeline & tugas), Finance (piutang & invoice tertunda).

### M10. Portal klien

| ID | User story | Prioritas |
|---|---|---|
| PK-01 | Sebagai klien, saya login dan melihat semua site saya di semua kota | MVP |
| PK-02 | Sebagai klien, saya melihat kehadiran petugas hari ini dan riwayatnya per site: nama, posisi, status, jam masuk/keluar, dan tanda "di dalam lokasi". **Foto selfie tidak ditampilkan** ke klien (hanya untuk internal IPS) | MVP |
| PK-03 | Sebagai klien, saya melihat ceklis, patroli, dan insiden di site saya | MVP |
| PK-04 | Sebagai klien, saya mengunduh invoice dan melihat status pembayaran | MVP |
| PK-05 | Sebagai klien, saya mengunduh **paket dokumen kepatuhan** IPS (NIB, SIO, BPJS, sertifikat asosiasi) yang masih berlaku | MVP |
| PK-06 | Sebagai klien, saya menerima laporan bulanan otomatis per site (PDF) | MVP |
| PK-07 | Sebagai klien, saya membuat komplain dan memantau penyelesaiannya | F2 |
| PK-08 | Sebagai klien, saya melihat skor audit dan menandatangani VoC | F2 |

### M11. Brankas dokumen kepatuhan

| ID | User story | Prioritas |
|---|---|---|
| DK-01 | Sebagai admin, saya mengunggah dokumen perusahaan (NIB, SIO, NPWP, akta, SK, APKLINDO, ABUJAPI, BPJS) dengan nomor dan tanggal berlaku | MVP |
| DK-02 | Sistem mengingatkan 60/30/7 hari sebelum kedaluwarsa ke admin dan direksi | MVP |
| DK-03 | Dokumen yang kedaluwarsa otomatis disembunyikan dari portal klien | MVP |
| DK-04 | Sebagai admin, saya mencatat dokumen per kontrak (pencatatan perjanjian alih daya ke dinas, dll.) | F2 |

### M12. Pengaturan & master data

Cabang (20 kota), UMK per kota per tahun, posisi & label bidang, shift, template ceklis, alasan menang/kalah, kategori biaya, tarif pajak, penomoran invoice, batas approval, rekening bank, kop surat, pengguna & peran.

## 6. Kebutuhan non-fungsional (ringkas; detail di TRD)

| Area | Kebutuhan |
|---|---|
| Kinerja | Check-in selesai ≤ 3 detik saat online; dashboard tampil ≤ 3 detik; aplikasi HP ≤ 30 MB, berjalan di Android 8+ dengan RAM 2 GB |
| Offline | Absen, ceklis, patroli, insiden bisa dicatat offline hingga 72 jam |
| Ketersediaan | 99,5% bulanan; jam sibuk 05.00–09.00 dan 17.00–22.00 WIB tidak boleh ada maintenance |
| Skala | 5.000 petugas, 1.500 site, 100 pengguna kantor, 500 pengguna klien (ruang tumbuh dari kondisi sekarang) |
| Keamanan & privasi | Kepatuhan UU PDP; foto wajah dianggap data sensitif; akses dibatasi per cabang/klien; log audit |
| Bahasa & zona waktu | Bahasa Indonesia; WIB, WITA (Bali, Kalimantan, Makassar) per site |
| Aksesibilitas | Tombol besar, ikon + teks, kontras tinggi di aplikasi petugas |

## 7. Ruang lingkup rilis

### MVP (Fase 1) — "irisan tipis yang tersambung"

- M1 lengkap kecuali kampanye UTM & WA otomatis
- M2 lengkap
- M3 lengkap kecuali paket buka cabang
- M4 kecuali rekrutmen
- M5 lengkap kecuali cuti/kasbon/slip
- M6: ceklis, patroli, insiden, kunjungan SPV
- M7 kecuali invoice gabungan dan virtual account
- M8 dasar
- M9 halaman direksi + versi cabang
- M10 baca saja
- M11 dasar

**Pilot:** Surabaya + 1 cabang luar Jatim (Denpasar atau Jakarta), absensi lama berjalan paralel.

### Fase 2

Invoice gabungan per klien, payroll & BPJS, cuti/kasbon/reimburse, rekrutmen & training, skor audit + VoC digital, tiket komplain + SLA, notifikasi WhatsApp, kampanye marketing, paket buka cabang, jurnal lebih lengkap.

### Fase 3

Inventori seragam/APD/chemical, virtual account, analitik lanjutan (prediksi turnover, prediksi telat bayar).

## 8. Metrik keberhasilan produk

| Metrik | Target pilot |
|---|---|
| Petugas aktif absen via aplikasi | ≥ 95% |
| Rata-rata waktu check-in | ≤ 20 detik |
| Absen ditandai mencurigakan | Terukur; ditinjau 100% |
| Invoice dari sistem tanpa revisi | ≥ 95% |
| Penawaran tertutup dengan alasan | 100% |
| Klien pilot login portal ≥ 1×/bulan | ≥ 3 klien |
| Direksi membuka dashboard | ≥ 1×/minggu |

## 9. Daftar layar (perkiraan)

**Web internal:** Login · Dashboard (direksi, cabang, sales, finance) · Lead (daftar, detail) · Pipeline kanban · Opportunity detail · RAB builder · Klien (daftar, detail 360°) · Kontrak (daftar, detail, adendum) · Site (detail, peta geofence, formasi, titik patroli) · Karyawan (daftar, detail, impor) · Penempatan · Jadwal shift (kalender) · Monitor absensi real-time · Koreksi absensi · Ceklis & patroli (template, hasil) · Insiden · Tutup periode · Invoice (draft, approval, detail, PDF) · Pembayaran & pencocokan mutasi · Piutang (aging) · Biaya · Laba-rugi & margin · Dokumen kepatuhan · Pengaturan & master data · Pengguna & peran · Log audit.

**Aplikasi HP petugas/SPV:** Login (username + password) · Ganti password pertama kali · Beranda (shift hari ini, tombol absen besar) · Check-in/out (kamera) · Ceklis · Patroli (pindai QR) · Lapor insiden · Izin/sakit · Riwayat absen · (SPV) Monitor tim · (SPV) Tunjuk pengganti · (SPV) Kunjungan · Mode HP bersama.

**Portal klien:** Login · Ringkasan semua site · Detail site (kehadiran, ceklis, patroli, insiden) · Invoice & pembayaran · Laporan bulanan · Dokumen kepatuhan · Pengguna klien.

## 10. Keputusan produk (1 Nov 2026)

| Pertanyaan | Keputusan |
|---|---|
| Invoice per site atau gabungan? | Per site (default). Gabungan jadi opsi di Fase 2 |
| Aturan potongan alfa | Dipotong per hari/shift untuk slot yang kosong dan tidak diganti |
| Klien lihat foto selfie? | Tidak. Cukup status, jam, dan lokasi |
| Koreksi absensi setelah invoice terbit | Nota kredit/debit, disetujui Finance |
| Login petugas | Username + password awal dari admin, wajib diganti saat login pertama |
| Batas approval direksi | Bisa diatur; angka ditentukan saat go-live |

**Masih terbuka:**
1. Tarif potongan per slot: angka tetap di MOU atau dihitung dari tarif bulanan ÷ hari kerja? Apakah ada toleransi (mis. 1 slot/bulan tidak dipotong)?
2. Apakah izin/sakit yang tidak diganti juga dipotong?
3. Telat berapa menit dianggap alfa untuk keperluan potongan?
