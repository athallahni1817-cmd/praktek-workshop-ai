import { formatAngka, formatRupiah, formatTanggal } from "@ips/shared";
import { CircleCheck, Clock, TimerOff } from "lucide-react";
import { Chip, Kosong, PageHeader, Tabel, Td, Th } from "@/components/ui";
import { AKSES } from "@/lib/akses";
import { daftarKontrak } from "@/lib/data";
import { konteks } from "@/lib/konteks";

export const metadata = { title: "Kontrak" };

function ChipSisa({ sisaHari }: { sisaHari: number }) {
  if (sisaHari < 0) return <Chip nada="neutral" ikon={TimerOff}>Berakhir</Chip>;
  if (sisaHari <= 30) return <Chip nada="danger" ikon={Clock}>{sisaHari} hari lagi</Chip>;
  if (sisaHari <= 90) return <Chip nada="warning" ikon={Clock}>{sisaHari} hari lagi</Chip>;
  return <Chip nada="success" ikon={CircleCheck}>Aktif</Chip>;
}

export default async function KontrakPage() {
  const { cabangId } = await konteks(AKSES.kontrak);
  const rows = await daftarKontrak(cabangId);

  return (
    <>
      <PageHeader overline="Klien" judul="Kontrak" deskripsi={`${formatAngka(rows.length)} kontrak · diurutkan dari yang paling cepat berakhir`} />
      {rows.length === 0 ? (
        <Kosong>Belum ada kontrak di cakupan ini.</Kosong>
      ) : (
        <Tabel>
          <thead>
            <tr>
              <Th>Nomor</Th>
              <Th>Klien</Th>
              <Th>Cabang</Th>
              <Th>Periode</Th>
              <Th kanan>Nilai / bln</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((k) => (
              <tr key={k.id} className="hover:bg-[#fafafa]">
                <Td className="tabular text-xs font-semibold">{k.nomor}</Td>
                <Td className="font-semibold">{k.klien}</Td>
                <Td>{k.cabang}</Td>
                <Td className="tabular whitespace-nowrap">
                  {formatTanggal(k.mulai)} – {formatTanggal(k.berakhir)}
                </Td>
                <Td kanan>{formatRupiah(k.nilaiBulanan)}</Td>
                <Td>
                  <ChipSisa sisaHari={k.sisaHari} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Tabel>
      )}
    </>
  );
}
