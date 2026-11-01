import { Shell } from "@/components/shell";
import { LABEL_PERAN } from "@/lib/akses";
import { daftarCabang } from "@/lib/data";
import { konteks } from "@/lib/konteks";

export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  const { pengguna, cabangId } = await konteks();
  const cabang = await daftarCabang();
  const terikat = pengguna.cabangId !== null ? (cabang.find((c) => c.id === pengguna.cabangId)?.nama ?? null) : null;

  return (
    <Shell
      pengguna={{ nama: pengguna.nama, peran: pengguna.peran, labelPeran: LABEL_PERAN[pengguna.peran] }}
      cabang={{ terikat, pilihan: cabang.map(({ id, nama }) => ({ id, nama })), aktif: cabangId }}
    >
      {children}
    </Shell>
  );
}
