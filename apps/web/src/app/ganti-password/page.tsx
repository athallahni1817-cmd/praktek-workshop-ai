import { FormAuth } from "@/components/form-auth";
import { KartuAuth } from "@/components/kartu-auth";
import { wajibLogin } from "@/lib/auth";
import { keluar } from "../(internal)/actions";
import { gantiPassword } from "../login/actions";

export const metadata = { title: "Ganti password" };

export default async function GantiPasswordPage() {
  const u = await wajibLogin({ bolehPasswordAwal: true });
  return (
    <KartuAuth
      judul="Ganti password"
      deskripsi={u.wajibGantiPassword ? `Halo ${u.nama}, kamu masih memakai password awal. Ganti dulu sebelum lanjut.` : "Masukkan password saat ini dan password baru."}
    >
      <FormAuth
        aksi={gantiPassword}
        tombol="Simpan password baru"
        fields={[
          { name: "lama", label: "Password saat ini", type: "password", autoComplete: "current-password" },
          { name: "baru", label: "Password baru", type: "password", autoComplete: "new-password", bantuan: "Minimal 8 karakter, berbeda dari password saat ini." },
          { name: "ulang", label: "Ulangi password baru", type: "password", autoComplete: "new-password" },
        ]}
      />
      <form action={keluar} className="mt-3 text-center">
        <button className="text-sm font-semibold text-text-muted hover:text-ink hover:underline">Bukan kamu? Keluar</button>
      </form>
    </KartuAuth>
  );
}
