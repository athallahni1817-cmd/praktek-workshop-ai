import { BUCKET_UMUR, formatAngka, formatPersen, formatRupiah, formatRupiahSingkat, formatTanggal } from "@ips/shared";
import { Clock, Receipt, Rocket, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { ChipDokumen } from "@/components/chips";
import { Card, Chip, KpiCard, Kosong } from "@/components/ui";
import { dataDashboard } from "@/lib/data";
import { konteks } from "@/lib/konteks";

export const metadata = { title: "Dashboard" };

const TARGET_FILL = 0.98;
const LABEL_TAHAP = { terkualifikasi: "Terkualifikasi", survei: "Survei", penawaran: "Penawaran", negosiasi: "Negosiasi" } as const;
const WARNA_UMUR: Record<(typeof BUCKET_UMUR)[number], string> = {
  "0-30": "bg-chart-comparison",
  "31-60": "bg-highlight",
  "61-90": "bg-brand-red",
  ">90": "bg-brand-red-strong",
};

const persenAtauStrip = (r: number | null) => (r === null ? "—" : formatPersen(r));

export default async function DashboardPage() {
  const { pengguna, cabangId } = await konteks();
  const d = await dataDashboard(cabangId);
  const { absensi: a, keuangan: k } = d;
  const pusat = pengguna.peran === "direksi" || pengguna.peran === "admin";

  const deltaFill = a.fillRateHariIni !== null && a.fillRateKemarin !== null ? a.fillRateHariIni - a.fillRateKemarin : null;
  const deltaTagih = k.ditagihBulanLaluSdTanggal ? k.ditagihBulanIni / k.ditagihBulanLaluSdTanggal - 1 : null;
  const maxPipeline = Math.max(1, ...d.pipeline.perTahap.map((t) => t.nilai));

  return (
    <>
      {pusat ? (
        <section className="rounded-xl bg-brand-red-strong p-6 text-white lg:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow rounded-full bg-highlight px-2.5 py-0.5 text-on-highlight">Operasional terpadu</span>
            <span className="font-tagline text-lg text-brand-red-tint-strong italic">PT IPS — “Your Service Partner”</span>
          </div>
          <h1 className="mt-3 text-[1.75rem] leading-9 font-extrabold tracking-[-0.02em] lg:text-[2.5rem] lg:leading-[3rem] lg:tracking-[-0.025em]">
            Ringkasan operasional {formatTanggal(d.hari)}
          </h1>
          <p className="mt-2 max-w-3xl text-brand-red-tint-strong">
            {a.wajibHariIni
              ? `Hari ini ${formatAngka(a.terisiHariIni)} dari ${formatAngka(a.wajibHariIni)} slot terisi, ${formatAngka(a.alfaHariIni)} alfa.`
              : "Belum ada data absensi hari ini."}{" "}
            Piutang lewat 60 hari {formatRupiah(k.piutangLewat60)} dari total piutang {formatRupiah(k.totalPiutang)}.
          </p>
        </section>
      ) : (
        <div>
          <p className="eyebrow text-text-muted">Dashboard</p>
          <h1 className="text-[1.75rem] leading-9 font-extrabold tracking-[-0.02em]">Ringkasan {formatTanggal(d.hari)}</h1>
        </div>
      )}

      <section aria-label="Indikator utama" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Fill rate hari ini"
          ikon={Users}
          nilai={persenAtauStrip(a.fillRateHariIni)}
          keterangan={`Target ${formatPersen(TARGET_FILL)}`}
          kritis={a.fillRateHariIni !== null && a.fillRateHariIni < 0.95}
          delta={deltaFill === null ? undefined : { teks: `${deltaFill >= 0 ? "+" : "−"}${formatPersen(Math.abs(deltaFill)).replace("%", " poin")} vs kemarin`, naik: deltaFill >= 0, makna: deltaFill >= 0 ? "baik" : "buruk" }}
        />
        <KpiCard
          label="Ditagih bulan ini"
          ikon={Receipt}
          nilai={formatRupiahSingkat(k.ditagihBulanIni).replace(/^Rp /, "")}
          satuan="Rp"
          keterangan={`Bulan lalu penuh ${formatRupiahSingkat(k.ditagihBulanLalu)}`}
          delta={deltaTagih === null ? undefined : { teks: `${formatPersen(Math.abs(deltaTagih))} vs periode sama bulan lalu`, naik: deltaTagih >= 0, makna: deltaTagih >= 0 ? "baik" : "buruk" }}
        />
        <KpiCard
          label="Piutang > 60 hari"
          ikon={Wallet}
          nilai={formatRupiahSingkat(k.piutangLewat60).replace(/^Rp /, "")}
          satuan="Rp"
          keterangan={k.totalPiutang ? `${formatPersen(k.piutangLewat60 / k.totalPiutang)} dari total piutang` : "Tidak ada piutang"}
        />
        <KpiCard
          label="Waktu deploy rata-rata"
          ikon={Rocket}
          nilai={d.waktuDeploy.rataHari === null ? "—" : d.waktuDeploy.rataHari.toLocaleString("id-ID", { maximumFractionDigits: 1 })}
          satuan="hari"
          keterangan={`Kontrak → petugas aktif · ${d.waktuDeploy.jumlahKontrak} kontrak 12 bln`}
        />
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Card overline="Operasi lapangan" judul="Fill rate per cabang bulan ini" aksi={<span className="text-xs font-semibold text-text-muted">Garis = target {formatPersen(TARGET_FILL)}</span>}>
            {a.perCabang.length === 0 ? (
              <Kosong>Belum ada data absensi bulan ini.</Kosong>
            ) : (
              <ul className="space-y-3">
                {a.perCabang.map((c) => (
                  <li key={c.id} className="grid grid-cols-[7rem_1fr_4rem] items-center gap-3 text-sm sm:grid-cols-[9rem_1fr_4.5rem]">
                    <span className="truncate font-semibold">{c.nama}</span>
                    <span className="relative h-3 rounded-full bg-surface-muted" role="img" aria-label={`${c.nama} ${formatPersen(c.fillRate)}`}>
                      <span className={`absolute inset-y-0 left-0 rounded-full ${c.fillRate < 0.95 ? "bg-brand-red-strong" : "bg-brand-red"}`} style={{ width: `${c.fillRate * 100}%` }} />
                      <span className="absolute -inset-y-1 w-px bg-ink" style={{ left: `${TARGET_FILL * 100}%` }} />
                    </span>
                    <span className={`tabular text-right font-semibold ${c.fillRate < 0.95 ? "text-danger" : ""}`}>{formatPersen(c.fillRate)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card overline="Keuangan" judul="Umur piutang" aksi={<span className="tabular text-sm font-bold">{formatRupiah(k.totalPiutang)}</span>}>
            {k.totalPiutang === 0 ? (
              <Kosong>Tidak ada piutang terbuka.</Kosong>
            ) : (
              <>
                <div className="flex h-4 overflow-hidden rounded-full" role="img" aria-label="Komposisi umur piutang">
                  {BUCKET_UMUR.map((b) => (
                    <span key={b} className={WARNA_UMUR[b]} style={{ width: `${(k.umur[b] / k.totalPiutang) * 100}%` }} />
                  ))}
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {BUCKET_UMUR.map((b) => (
                    <div key={b} className="rounded-md bg-surface-subtle p-3">
                      <dt className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                        <span className={`size-2.5 rounded-full ${WARNA_UMUR[b]}`} aria-hidden />
                        {b === ">90" ? "> 90" : b.replace("-", "–")} hari
                      </dt>
                      <dd className="tabular mt-1 font-bold">{formatRupiahSingkat(k.umur[b])}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-text-subtle">Dihitung dari hari lewat jatuh tempo; invoice yang belum jatuh tempo masuk 0–30.</p>
              </>
            )}
          </Card>

          <Card
            overline="Penjualan"
            judul="Pipeline terbuka"
            aksi={
              <span className="text-right text-xs font-semibold text-text-muted">
                Win rate 12 bln <span className="tabular block text-base font-bold text-ink">{persenAtauStrip(d.pipeline.winRate)}</span>
              </span>
            }
          >
            <ul className="space-y-3">
              {d.pipeline.perTahap.map((t) => (
                <li key={t.tahap} className="grid grid-cols-[7rem_1fr_6rem] items-center gap-3 text-sm sm:grid-cols-[9rem_1fr_7rem]">
                  <span className="font-semibold">
                    {LABEL_TAHAP[t.tahap]} <span className="font-normal text-text-subtle">· {t.jumlah}</span>
                  </span>
                  <span className="h-3 rounded-full bg-surface-muted">
                    <span className="block h-full rounded-full bg-brand-red" style={{ width: `${(t.nilai / maxPipeline) * 100}%` }} />
                  </span>
                  <span className="tabular text-right font-semibold">{formatRupiahSingkat(t.nilai)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-divider pt-4">
              <p className="eyebrow mb-2 text-text-muted">Alasan kalah teratas ({d.pipeline.jumlahTertutup} penawaran ditutup)</p>
              {d.pipeline.alasanKalah.length ? (
                <div className="flex flex-wrap gap-2">
                  {d.pipeline.alasanKalah.map(([alasan, n]) => (
                    <Chip key={alasan} nada="neutral">
                      {alasan} · {n}
                    </Chip>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">Belum ada penawaran yang kalah.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Card overline="Kepatuhan" judul="Dokumen legal" aksi={<Link href="/dokumen" className="text-sm font-semibold text-brand-red hover:underline">Semua</Link>}>
            <ul className="divide-y divide-divider">
              {d.dokumen.slice(0, 4).map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{doc.nama}</span>
                    <span className="block text-xs text-text-subtle">{doc.berlakuSampai ? `s/d ${formatTanggal(doc.berlakuSampai)}` : "Tanpa masa berlaku"}</span>
                  </span>
                  <ChipDokumen status={doc.status} sisaHari={doc.sisaHari} />
                </li>
              ))}
            </ul>
          </Card>

          <Card overline="Kontrak" judul="Berakhir ≤ 90 hari">
            {d.kontrakBerakhir.length === 0 ? (
              <Kosong>Tidak ada kontrak yang segera berakhir.</Kosong>
            ) : (
              <ul className="divide-y divide-divider">
                {d.kontrakBerakhir.slice(0, 6).map((kt) => (
                  <li key={kt.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{kt.klien}</span>
                      <span className="tabular block text-xs text-text-subtle">
                        {formatTanggal(kt.berakhir)} · {formatRupiahSingkat(kt.nilaiBulanan)}/bln
                      </span>
                    </span>
                    <Chip nada={kt.sisaHari <= 30 ? "danger" : "warning"} ikon={Clock}>
                      {kt.sisaHari} hari
                    </Chip>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card overline="Risiko regulasi" judul="Pendapatan dari posisi berisiko UU">
            <p className="tabular text-4xl font-extrabold tracking-[-0.03em]">{persenAtauStrip(d.risikoUU.porsi)}</p>
            <p className="mt-1 text-sm text-text-muted">
              {formatRupiahSingkat(d.risikoUU.nilaiBerisiko)} dari {formatRupiahSingkat(d.risikoUU.totalNilai)} nilai formasi bulanan aktif, posisi berlabel “berisiko” (UU Pelindungan Ketenagakerjaan).
            </p>
          </Card>

          <Card overline="SDM" judul="Karyawan">
            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-surface-subtle p-3">
                <dt className="text-xs font-semibold text-text-muted">Aktif</dt>
                <dd className="tabular text-2xl font-extrabold">{formatAngka(d.sdm.aktif)}</dd>
              </div>
              <div className="rounded-md bg-surface-subtle p-3">
                <dt className="text-xs font-semibold text-text-muted">Turnover 12 bln</dt>
                <dd className="tabular text-2xl font-extrabold">{persenAtauStrip(d.sdm.turnover)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-text-subtle">Turnover = keluar 12 bulan ÷ (aktif + keluar). {formatAngka(d.sdm.keluar12)} orang keluar.</p>
          </Card>
        </div>
      </div>
    </>
  );
}
