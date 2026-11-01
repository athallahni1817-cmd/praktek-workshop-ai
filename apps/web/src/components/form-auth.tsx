"use client";

import { CircleAlert } from "lucide-react";
import { useActionState } from "react";
import type { StatusForm } from "@/app/login/actions";

type Field = { name: string; label: string; type?: string; autoComplete: string; bantuan?: string };

/** Form login / ganti password: label di atas field, error menjelaskan cara memperbaiki (DESIGN.md 6.5). */
export function FormAuth({ aksi, fields, tombol }: { aksi: (s: StatusForm, fd: FormData) => Promise<StatusForm>; fields: Field[]; tombol: string }) {
  const [status, kirim, sibuk] = useActionState(aksi, undefined);
  return (
    <form action={kirim} className="space-y-4">
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="mb-1.5 block text-sm font-semibold">
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type={f.type ?? "text"}
            autoComplete={f.autoComplete}
            required
            className="h-11 w-full rounded-md border border-border-strong bg-surface px-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
          />
          {f.bantuan && <p className="mt-1 text-[0.8125rem] text-text-subtle">{f.bantuan}</p>}
        </div>
      ))}
      {status?.pesan && (
        <p role="alert" className="flex items-start gap-2 rounded-md bg-danger-bg px-3 py-2 text-sm font-semibold text-danger">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {status.pesan}
        </p>
      )}
      <button
        disabled={sibuk}
        className="h-11 w-full rounded-md bg-brand-red font-semibold text-white hover:bg-brand-red-strong disabled:opacity-60"
      >
        {sibuk ? "Memproses…" : tombol}
      </button>
    </form>
  );
}
