// Komponen dasar sesuai DESIGN.md bagian 6.
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function PageHeader({ overline, judul, deskripsi, aksi }: { overline?: string; judul: string; deskripsi?: string; aksi?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {overline && <p className="eyebrow text-text-muted">{overline}</p>}
        <h1 className="text-[1.375rem] leading-[1.875rem] font-bold tracking-[-0.01em] lg:text-[1.75rem] lg:leading-9 lg:font-extrabold lg:tracking-[-0.02em]">{judul}</h1>
        {deskripsi && <p className="mt-1 text-text-muted">{deskripsi}</p>}
      </div>
      {aksi}
    </div>
  );
}

export function Card({ overline, judul, aksi, children, className }: { overline?: string; judul?: string; aksi?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cx("rounded-lg border border-border bg-surface p-4 shadow-level-1 sm:p-5", className)}>
      {(judul || overline) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {overline && <p className="eyebrow text-text-muted">{overline}</p>}
            {judul && <h2 className="text-lg leading-[1.625rem] font-bold">{judul}</h2>}
          </div>
          {aksi}
        </div>
      )}
      {children}
    </section>
  );
}

type Makna = "baik" | "buruk" | "netral";

export function KpiCard({
  label,
  ikon: Ikon,
  nilai,
  satuan,
  keterangan,
  delta,
  href,
  kritis,
}: {
  label: string;
  ikon: LucideIcon;
  nilai: string;
  satuan?: string;
  keterangan?: string;
  delta?: { teks: string; naik: boolean; makna: Makna };
  href?: string;
  kritis?: boolean;
}) {
  const isi = (
    <>
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className={cx("eyebrow", kritis ? "text-brand-red-tint-strong" : "text-text-muted")}>{label}</p>
        <span className={cx("grid size-9 shrink-0 place-items-center rounded-md", kritis ? "bg-white/10 text-white" : "bg-brand-red-tint text-brand-red")}>
          <Ikon className="size-5" aria-hidden />
        </span>
      </div>
      <p className="flex items-baseline gap-1.5">
        <span className="tabular text-4xl leading-10 font-extrabold tracking-[-0.03em]">{nilai}</span>
        {satuan && <span className={cx("text-sm font-semibold", kritis ? "text-brand-red-tint-strong" : "text-text-muted")}>{satuan}</span>}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs font-semibold">
        {delta && (
          <span
            className={cx(
              "inline-flex items-center gap-1",
              kritis ? "text-highlight" : delta.makna === "baik" ? "text-success" : delta.makna === "buruk" ? "text-danger" : "text-text-muted",
            )}
          >
            {delta.naik ? <ArrowUpRight className="size-3.5" aria-hidden /> : <ArrowDownRight className="size-3.5" aria-hidden />}
            {delta.teks}
          </span>
        )}
        {keterangan && <span className={kritis ? "text-brand-red-tint-strong" : "text-text-muted"}>{keterangan}</span>}
      </div>
    </>
  );
  const kelas = cx(
    "flex flex-col justify-between rounded-lg border p-5 transition-shadow",
    kritis ? "border-transparent bg-brand-red-strong text-white" : "border-border bg-surface shadow-level-1",
    href && !kritis && "hover:shadow-level-2",
  );
  return href ? (
    <Link href={href} className={kelas}>
      {isi}
    </Link>
  ) : (
    <div className={kelas}>{isi}</div>
  );
}

export type Nada = "success" | "warning" | "danger" | "neutral" | "brand" | "priority";

const NADA: Record<Nada, string> = {
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  neutral: "bg-neutral-bg text-neutral",
  brand: "bg-brand-red-tint text-brand-red",
  priority: "bg-highlight text-on-highlight",
};

/** Status selalu ikon + teks (DESIGN.md 2.3). */
export function Chip({ nada, ikon: Ikon, children }: { nada: Nada; ikon?: LucideIcon; children: React.ReactNode }) {
  return (
    <span className={cx("inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap", NADA[nada])}>
      {Ikon && <Ikon className="size-3.5" aria-hidden />}
      {children}
    </span>
  );
}

export function Tabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-level-1">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, kanan }: { children?: React.ReactNode; kanan?: boolean }) {
  return <th className={cx("eyebrow h-11 border-b border-border bg-surface-subtle px-4 text-text-muted", kanan && "text-right")}>{children}</th>;
}

export function Td({ children, kanan, className }: { children?: React.ReactNode; kanan?: boolean; className?: string }) {
  return <td className={cx("h-14 border-b border-divider px-4 align-middle", kanan && "tabular text-right", className)}>{children}</td>;
}

export function Kosong({ children }: { children: React.ReactNode }) {
  return <p className="rounded-md bg-surface-subtle px-4 py-6 text-center text-sm text-text-muted">{children}</p>;
}

export function Avatar({ nama }: { nama: string }) {
  const inisial = nama
    .split(" ")
    .slice(0, 2)
    .map((k) => k[0])
    .join("")
    .toUpperCase();
  return (
    <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-red-tint text-xs font-bold text-brand-red">
      {inisial}
    </span>
  );
}
