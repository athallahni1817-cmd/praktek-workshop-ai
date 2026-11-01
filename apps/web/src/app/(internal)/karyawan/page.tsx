import { formatAngka, formatTanggal } from "@ips/shared";
import Link from "next/link";
import { ChipBidang } from "@/components/chips";
import { Avatar, Kosong, PageHeader, Tabel, Td, Th } from "@/components/ui";
import { AKSES } from "@/lib/akses";
import { PER_HALAMAN, daftarKaryawan } from "@/lib/data";
import { konteks } from "@/lib/konteks";

export const metadata = { title: "Karyawan" };

export default async function KaryawanPage({ searchParams }: { searchParams: Promise<{ hal?: string; status?: string }> }) {
  const { cabangId } = await konteks(AKSES.karyawan);
  const sp = await searchParams;
  const status = sp.status === "keluar" ? "keluar" : "aktif";
  const halaman = Math.max(1, Math.floor(Number(sp.hal)) || 1);
  const { rows, total } = await daftarKaryawan(cabangId, halaman, status);
  const jumlahHalaman = Math.max(1, Math.ceil(total / PER_HALAMAN));
  const tautan = (h: number, s = status) => `/karyawan?status=${s}&hal=${h}`;

  return (
    <>
      <PageHeader overline="SDM" judul="Karyawan" deskripsi={`${formatAngka(total)} karyawan ${status}`} />

      <div role="tablist" aria-label="Status karyawan" className="flex gap-2">
        {(["aktif", "keluar"] as const).map((s) => (
          <Link
            key={s}
            role="tab"
            aria-selected={s === status}
            href={tautan(1, s)}
            className={`h-8 rounded-full px-4 text-sm leading-8 font-semibold ${s === status ? "bg-brand-red text-white" : "bg-surface-muted text-ink hover:bg-border"}`}
          >
            {s === "aktif" ? "Aktif" : "Sudah keluar"}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <Kosong>Tidak ada karyawan {status} di cakupan ini.</Kosong>
      ) : (
        <Tabel>
          <thead>
            <tr>
              <Th>Karyawan</Th>
              <Th>Posisi</Th>
              <Th>Bidang</Th>
              <Th>Cabang</Th>
              <Th>{status === "aktif" ? "Masuk" : "Keluar"}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((k) => (
              <tr key={k.id} className="hover:bg-[#fafafa]">
                <Td>
                  <span className="flex items-center gap-3">
                    <Avatar nama={k.nama} />
                    <span>
                      <span className="block font-semibold">{k.nama}</span>
                      <span className="tabular block text-xs text-text-subtle">{k.nik}</span>
                    </span>
                  </span>
                </Td>
                <Td>{k.posisi}</Td>
                <Td>
                  <ChipBidang bidang={k.bidang} />
                </Td>
                <Td>{k.cabang}</Td>
                <Td className="tabular whitespace-nowrap">
                  {status === "aktif" ? formatTanggal(k.masuk) : `${formatTanggal(k.keluar!)} · ${k.alasanKeluar ?? "—"}`}
                </Td>
              </tr>
            ))}
          </tbody>
        </Tabel>
      )}

      {jumlahHalaman > 1 && (
        <nav aria-label="Halaman" className="flex items-center justify-between text-sm">
          <span className="tabular text-text-muted">
            {formatAngka((halaman - 1) * PER_HALAMAN + 1)}–{formatAngka(Math.min(halaman * PER_HALAMAN, total))} dari {formatAngka(total)}
          </span>
          <span className="flex gap-2">
            {halaman > 1 && (
              <Link href={tautan(halaman - 1)} className="h-9 rounded-md border border-border-strong bg-surface px-3 leading-9 font-semibold hover:bg-surface-muted">
                Sebelumnya
              </Link>
            )}
            {halaman < jumlahHalaman && (
              <Link href={tautan(halaman + 1)} className="h-9 rounded-md border border-border-strong bg-surface px-3 leading-9 font-semibold hover:bg-surface-muted">
                Berikutnya
              </Link>
            )}
          </span>
        </nav>
      )}
    </>
  );
}
