"use client";

import {
  Banknote,
  Building2,
  CalendarCheck,
  CalendarDays,
  ChartColumn,
  ClipboardCheck,
  Clock3,
  FileSignature,
  IdCard,
  KanbanSquare,
  LayoutGrid,
  LogOut,
  type LucideIcon,
  MapPin,
  Menu,
  Megaphone,
  Receipt,
  ShieldCheck,
  TriangleAlert,
  UserCheck,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { keluar, pilihCabang } from "@/app/(internal)/actions";
import { AKSES } from "@/lib/akses";
import type { Peran } from "@/lib/auth";

type Item = { label: string; href?: string; ikon: LucideIcon; peran?: readonly Peran[] };

// Item tanpa href = modul tahap berikutnya (TRD bagian 10).
const NAV: { grup?: string; item: Item[] }[] = [
  { item: [{ label: "Dashboard", href: "/", ikon: LayoutGrid }] },
  {
    grup: "Penjualan",
    item: [
      { label: "Leads", ikon: Megaphone },
      { label: "Pipeline", ikon: KanbanSquare },
      { label: "RAB & Penawaran", ikon: FileSignature },
    ],
  },
  {
    grup: "Klien",
    item: [
      { label: "Klien", href: "/klien", ikon: Building2, peran: AKSES.klien },
      { label: "Kontrak", href: "/kontrak", ikon: FileSignature, peran: AKSES.kontrak },
      { label: "Site", href: "/site", ikon: MapPin, peran: AKSES.site },
    ],
  },
  {
    grup: "Operasi",
    item: [
      { label: "Monitor Absensi", ikon: CalendarCheck },
      { label: "Jadwal", ikon: CalendarDays },
      { label: "Ceklis & Patroli", ikon: ClipboardCheck },
      { label: "Insiden", ikon: TriangleAlert },
    ],
  },
  {
    grup: "SDM",
    item: [
      { label: "Karyawan", href: "/karyawan", ikon: IdCard, peran: AKSES.karyawan },
      { label: "Penempatan", ikon: UserCheck },
    ],
  },
  {
    grup: "Keuangan",
    item: [
      { label: "Invoice", ikon: Receipt },
      { label: "Pembayaran", ikon: Wallet },
      { label: "Piutang", ikon: Banknote },
      { label: "Biaya & Laba-Rugi", ikon: ChartColumn },
    ],
  },
  {
    grup: "Kepatuhan",
    item: [{ label: "Dokumen Legal", href: "/dokumen", ikon: ShieldCheck, peran: AKSES.dokumen }],
  },
];

export function Shell({
  pengguna,
  cabang,
  children,
}: {
  pengguna: { nama: string; peran: Peran; labelPeran: string };
  cabang: { terikat: string | null; pilihan: { id: number; nama: string }[]; aktif: number | null };
  children: React.ReactNode;
}) {
  const [buka, setBuka] = useState(false);
  const path = usePathname();
  const [sibuk, mulai] = useTransition();

  const nav = NAV.map((g) => ({ ...g, item: g.item.filter((i) => !i.peran || i.peran.includes(pengguna.peran)) })).filter((g) => g.item.length);

  const sidebar = (
    <nav aria-label="Navigasi utama" className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-5">
        <span className="grid size-8 place-items-center rounded-md bg-brand-red text-sm font-extrabold text-white">IPS</span>
        <div className="leading-tight">
          <p className="font-bold text-brand-red">IPS One</p>
          <p className="text-xs font-semibold text-text-muted">Operasional Terpadu</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {nav.map((g, i) => (
          <div key={g.grup ?? i} className="mt-3">
            {g.grup && <p className="eyebrow px-3 pb-1 text-text-subtle">{g.grup}</p>}
            <ul className="space-y-0.5">
              {g.item.map((it) => {
                const aktif = it.href && (it.href === "/" ? path === "/" : path.startsWith(it.href));
                const isi = (
                  <>
                    <it.ikon className="size-5 shrink-0" aria-hidden />
                    <span className="flex-1 truncate">{it.label}</span>
                    {!it.href && <Clock3 className="size-3.5 shrink-0" aria-label="Segera" />}
                  </>
                );
                const kelas = "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold";
                return (
                  <li key={it.label}>
                    {it.href ? (
                      <Link
                        href={it.href}
                        onClick={() => setBuka(false)}
                        aria-current={aktif ? "page" : undefined}
                        className={`${kelas} ${aktif ? "bg-brand-red text-white shadow-[0_2px_4px_-1px_rgba(181,31,26,0.12)]" : "text-text-muted hover:bg-surface-muted hover:text-ink"}`}
                      >
                        {isi}
                      </Link>
                    ) : (
                      <span className={`${kelas} cursor-default text-text-subtle/70`} title="Dibangun di tahap berikutnya">
                        {isi}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <p className="mt-4 flex items-center gap-1.5 px-3 text-xs text-text-subtle">
          <Clock3 className="size-3.5" aria-hidden /> Modul tahap berikutnya
        </p>
      </div>
      <form action={keluar} className="border-t border-border p-3">
        <button className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-danger hover:bg-danger-bg">
          <LogOut className="size-5" aria-hidden />
          Keluar
        </button>
      </form>
    </nav>
  );

  return (
    <div className="min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-surface lg:block">{sidebar}</aside>

      {buka && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Tutup menu" className="absolute inset-0 bg-ink/40" onClick={() => setBuka(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-surface shadow-level-3">
            <button aria-label="Tutup menu" onClick={() => setBuka(false)} className="absolute top-3 right-3 grid size-10 place-items-center rounded-md hover:bg-surface-muted">
              <X className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6">
          <button aria-label="Buka menu" onClick={() => setBuka(true)} className="grid size-10 place-items-center rounded-md hover:bg-surface-muted lg:hidden">
            <Menu className="size-5" />
          </button>

          <div className="flex min-w-0 items-center gap-2 rounded-md bg-surface-muted px-3 py-1.5">
            <Building2 className="size-4 shrink-0 text-brand-red" aria-hidden />
            {cabang.terikat ? (
              <span className="truncate text-sm font-semibold">Cabang {cabang.terikat}</span>
            ) : (
              <label className="flex items-center gap-1 text-sm font-semibold">
                <span className="sr-only">Cakupan cabang</span>
                <select
                  className="max-w-44 truncate bg-transparent font-semibold outline-none sm:max-w-none"
                  value={cabang.aktif ?? ""}
                  disabled={sibuk}
                  onChange={(e) => mulai(() => pilihCabang(e.target.value))}
                >
                  <option value="">Semua cabang (Kantor Pusat — Sidoarjo)</option>
                  {cabang.pilihan.map((c) => (
                    <option key={c.id} value={c.id}>
                      Cabang {c.nama}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm leading-tight font-semibold">{pengguna.nama}</p>
              <p className="text-xs text-text-muted">{pengguna.labelPeran}</p>
            </div>
            <span aria-hidden className="grid size-8 place-items-center rounded-full bg-brand-red-tint text-xs font-bold text-brand-red">
              {pengguna.nama.split(" ").slice(0, 2).map((k) => k[0]).join("")}
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
