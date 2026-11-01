import { formatAngka, formatRupiah } from "@ips/shared";
import { Kosong, PageHeader, Tabel, Td, Th } from "@/components/ui";
import { AKSES } from "@/lib/akses";
import { daftarKlien } from "@/lib/data";
import { konteks } from "@/lib/konteks";

export const metadata = { title: "Klien" };

export default async function KlienPage() {
  const { cabangId } = await konteks(AKSES.klien);
  const rows = await daftarKlien(cabangId);

  return (
    <>
      <PageHeader overline="Klien" judul="Daftar klien" deskripsi={`${formatAngka(rows.length)} klien`} />
      {rows.length === 0 ? (
        <Kosong>Belum ada klien di cakupan ini.</Kosong>
      ) : (
        <Tabel>
          <thead>
            <tr>
              <Th>Klien</Th>
              <Th>Segmen</Th>
              <Th>Cabang</Th>
              <Th kanan>Site</Th>
              <Th kanan>Nilai kontrak aktif / bln</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((k) => (
              <tr key={k.id} className="hover:bg-[#fafafa]">
                <Td className="font-semibold">{k.nama}</Td>
                <Td>{k.segmen}</Td>
                <Td>{k.cabang}</Td>
                <Td kanan>{formatAngka(k.jumlahSite)}</Td>
                <Td kanan>{formatRupiah(k.nilaiBulanan)}</Td>
              </tr>
            ))}
          </tbody>
        </Tabel>
      )}
    </>
  );
}
