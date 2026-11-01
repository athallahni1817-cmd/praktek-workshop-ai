import { formatAngka, formatPersen } from "@ips/shared";
import { TriangleAlert } from "lucide-react";
import { Chip, Kosong, PageHeader, Tabel, Td, Th } from "@/components/ui";
import { AKSES } from "@/lib/akses";
import { daftarSite } from "@/lib/data";
import { konteks } from "@/lib/konteks";

export const metadata = { title: "Site" };

export default async function SitePage() {
  const { cabangId } = await konteks(AKSES.site);
  const rows = await daftarSite(cabangId);

  return (
    <>
      <PageHeader overline="Klien" judul="Site" deskripsi={`${formatAngka(rows.length)} lokasi kerja · fill rate dihitung sejak awal bulan`} />
      {rows.length === 0 ? (
        <Kosong>Belum ada site di cakupan ini.</Kosong>
      ) : (
        <Tabel>
          <thead>
            <tr>
              <Th>Site</Th>
              <Th>Cabang</Th>
              <Th kanan>Petugas (formasi)</Th>
              <Th>Fill rate bulan ini</Th>
              <Th>Catatan</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="hover:bg-[#fafafa]">
                <Td>
                  <span className="block font-semibold">{s.nama}</span>
                </Td>
                <Td>{s.cabang}</Td>
                <Td kanan>{formatAngka(s.petugas)}</Td>
                <Td>
                  {s.fillRate === null ? (
                    <span className="text-text-subtle">—</span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <span className="h-2 w-24 rounded-full bg-surface-muted">
                        <span className={`block h-full rounded-full ${s.fillRate < 0.95 ? "bg-brand-red-strong" : "bg-brand-red"}`} style={{ width: `${s.fillRate * 100}%` }} />
                      </span>
                      <span className={`tabular font-semibold ${s.fillRate < 0.95 ? "text-danger" : ""}`}>{formatPersen(s.fillRate)}</span>
                    </span>
                  )}
                </Td>
                <Td>
                  {s.posisiBerisiko > 0 && (
                    <Chip nada="warning" ikon={TriangleAlert}>
                      {s.posisiBerisiko} posisi berisiko UU
                    </Chip>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Tabel>
      )}
    </>
  );
}
