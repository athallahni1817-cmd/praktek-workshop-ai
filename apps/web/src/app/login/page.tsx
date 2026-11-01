import { redirect } from "next/navigation";
import { FormAuth } from "@/components/form-auth";
import { KartuAuth } from "@/components/kartu-auth";
import { penggunaSaatIni } from "@/lib/auth";
import { masuk } from "./actions";

export const metadata = { title: "Masuk" };

export default async function LoginPage() {
  if (await penggunaSaatIni()) redirect("/");
  return (
    <KartuAuth judul="Masuk" deskripsi="Gunakan username dan password dari admin.">
      <FormAuth
        aksi={masuk}
        tombol="Masuk"
        fields={[
          { name: "username", label: "Username", autoComplete: "username" },
          { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
        ]}
      />
    </KartuAuth>
  );
}
