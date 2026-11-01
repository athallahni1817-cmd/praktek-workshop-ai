export function KartuAuth({ judul, deskripsi, children }: { judul: string; deskripsi: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-brand-red text-sm font-extrabold text-white">IPS</span>
          <div className="leading-tight">
            <p className="text-lg font-bold text-brand-red">IPS One</p>
            <p className="font-tagline text-text-muted italic">Your Service Partner</p>
          </div>
        </div>
        <section className="rounded-lg border border-border bg-surface p-6 shadow-level-1">
          <h1 className="text-[1.375rem] leading-[1.875rem] font-bold">{judul}</h1>
          <p className="mt-1 mb-5 text-sm text-text-muted">{deskripsi}</p>
          {children}
        </section>
        <p className="mt-4 text-center text-xs text-text-subtle">PT Indonesia Partner Solution · Waru, Sidoarjo</p>
      </div>
    </main>
  );
}
