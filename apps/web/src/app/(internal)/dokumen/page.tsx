import { formatTanggal } from "@ips/shared";
import { ChipDokumen } from "@/components/chips";
import { PageHeader, Tabel, Td, Th } from "@/components/ui";
import { AKSES } from "@/lib/akses";
import { daftarDokumen } from "@/lib/data";
import { konteks } from "@/lib/konteks";

export const metadata = { title: "Dokumen Legal" };

export default async function DokumenPage() {
  await konteks(AKSES.dokumen);
  const rows = await daftarDokumen();
  const bermasalah = rows.filter((d) => d.status !== "berlaku").length;

  return (
    <>
      <PageHeader
        overline="Kepatuhan"
        judul="Dokumen legal perusahaan"
        deskripsi={bermasalah ? `${bermasalah} dokumen perlu diperpanjang. Dokumen kedaluwarsa tidak ditampilkan ke portal klien.` : "Semua dokumen berlaku."}
      />
      <Tabel>
        <thead>
          <tr>
            <Th>Dokumen</Th>
            <Th>Nomor</Th>
            <Th>Penerbit</Th>
            <Th>Berlaku s/d</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.id} className="hover:bg-[#fafafa]">
              <Td className="font-semibold">{d.nama}</Td>
              <Td className="tabular text-xs">{d.nomor}</Td>
              <Td>{d.penerbit}</Td>
              <Td className="tabular whitespace-nowrap">{d.berlakuSampai ? formatTanggal(d.berlakuSampai) : "—"}</Td>
              <Td>
                <ChipDokumen status={d.status} sisaHari={d.sisaHari} />
              </Td>
            </tr>
          ))}
        </tbody>
      </Tabel>
    </>
  );
}
