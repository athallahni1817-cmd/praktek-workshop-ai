import type { StatusDokumen } from "@ips/shared";
import { CircleAlert, CircleCheck, ShieldAlert, TriangleAlert } from "lucide-react";
import type { bidangEnum } from "@/db/schema";
import { Chip } from "./ui";

export function ChipDokumen({ status, sisaHari }: { status: StatusDokumen; sisaHari: number | null }) {
  if (status === "kedaluwarsa")
    return (
      <Chip nada="danger" ikon={ShieldAlert}>
        Kedaluwarsa {Math.abs(sisaHari ?? 0)} hari
      </Chip>
    );
  if (status === "segera")
    return (
      <Chip nada="warning" ikon={CircleAlert}>
        {sisaHari} hari lagi
      </Chip>
    );
  return (
    <Chip nada="success" ikon={CircleCheck}>
      Berlaku
    </Chip>
  );
}

const LABEL_BIDANG = {
  kebersihan: "Kebersihan",
  pengamanan: "Pengamanan",
  angkutan: "Angkutan Pekerja",
  penunjang: "Penunjang",
  berisiko: "Berisiko UU",
} satisfies Record<(typeof bidangEnum.enumValues)[number], string>;

/** Label bidang posisi terhadap UU alih daya (DESIGN.md 6.4). */
export function ChipBidang({ bidang }: { bidang: keyof typeof LABEL_BIDANG }) {
  return bidang === "berisiko" ? (
    <Chip nada="warning" ikon={TriangleAlert}>
      {LABEL_BIDANG[bidang]}
    </Chip>
  ) : (
    <Chip nada="neutral">{LABEL_BIDANG[bidang]}</Chip>
  );
}
