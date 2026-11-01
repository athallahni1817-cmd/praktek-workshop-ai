import { mkdirSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "./schema";

// shortcut: PGlite (Postgres di dalam proses Node) untuk tahap awal; ganti ke Supabase Postgres saat pilot (TRD ADR-1).
// Hanya satu proses yang boleh membuka folder data: hentikan `pnpm dev` sebelum `pnpm db:seed`.
const dataDir = process.env.PGLITE_DIR ?? path.join(process.cwd(), ".data", "pglite");

function buat() {
  mkdirSync(dataDir, { recursive: true });
  return drizzle(new PGlite(dataDir), { schema });
}

export type Db = ReturnType<typeof buat>;

// Disimpan di globalThis agar hot reload Next.js tidak membuka database dua kali.
const g = globalThis as unknown as { __ipsDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  g.__ipsDb ??= (async () => {
    const db = buat();
    await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    return db;
  })();
  return g.__ipsDb;
}
