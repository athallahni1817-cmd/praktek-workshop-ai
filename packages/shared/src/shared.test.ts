import { describe, expect, it } from "vitest";
import {
  bucketUmur,
  fillRate,
  formatAngka,
  formatPersen,
  formatRupiah,
  formatRupiahSingkat,
  formatTanggal,
  hariIni,
  rataWaktuDeploy,
  selisihHari,
  statusDokumen,
} from "./index.ts";

// Intl memakai spasi tak-putus di beberapa runtime; samakan dulu.
const norm = (s: string) => s.replace(/ /g, " ");

describe("format id-ID", () => {
  it("angka, persen, rupiah", () => {
    expect(formatAngka(3582)).toBe("3.582");
    expect(formatPersen(0.978)).toBe("97,8%");
    expect(formatRupiah(45_000_000)).toBe("Rp 45.000.000");
    expect(formatRupiah(-600_000)).toBe("−Rp 600.000");
  });
  it("rupiah singkat", () => {
    expect(norm(formatRupiahSingkat(1_200_000_000))).toBe("Rp 1,2 M");
    expect(norm(formatRupiahSingkat(450_400_000))).toBe("Rp 450 jt");
    expect(formatRupiahSingkat(750_000)).toBe("Rp 750.000");
  });
  it("tanggal", () => {
    expect(norm(formatTanggal("2026-11-01"))).toBe("1 Nov 2026");
  });
  it("hari ini mengikuti zona waktu site", () => {
    const now = new Date("2026-11-01T16:30:00Z"); // 23.30 WIB, 00.30 WITA
    expect(hariIni("Asia/Jakarta", now)).toBe("2026-11-01");
    expect(hariIni("Asia/Makassar", now)).toBe("2026-11-02");
  });
});

describe("KPI", () => {
  it("selisih hari melewati akhir bulan", () => {
    expect(selisihHari("2026-10-25", "2026-11-01")).toBe(7);
  });

  it("fill rate: diganti dihitung terisi, libur tidak dihitung", () => {
    expect(fillRate(["hadir", "telat", "diganti", "alfa", "izin", "libur"])).toBe(3 / 5);
    expect(fillRate(["libur"])).toBeNull();
    expect(fillRate([])).toBeNull();
  });

  it("umur piutang di batas bucket", () => {
    const hari = "2026-11-01";
    expect(bucketUmur("2026-12-01", hari)).toBe("0-30"); // belum jatuh tempo
    expect(bucketUmur("2026-10-02", hari)).toBe("0-30"); // lewat 30
    expect(bucketUmur("2026-10-01", hari)).toBe("31-60"); // lewat 31
    expect(bucketUmur("2026-09-01", hari)).toBe("61-90"); // lewat 61
    expect(bucketUmur("2026-08-01", hari)).toBe(">90");
  });

  it("status dokumen: APKLINDO yang lewat 25-09-2026 terbaca kedaluwarsa", () => {
    expect(statusDokumen("2026-09-25", "2026-11-01")).toEqual({ status: "kedaluwarsa", sisaHari: -37 });
    expect(statusDokumen("2026-12-01", "2026-11-01")).toEqual({ status: "segera", sisaHari: 30 });
    expect(statusDokumen("2027-03-01", "2026-11-01").status).toBe("berlaku");
    expect(statusDokumen(null, "2026-11-01")).toEqual({ status: "berlaku", sisaHari: null });
  });

  it("waktu deploy rata-rata mengabaikan kontrak yang belum ada petugas", () => {
    expect(
      rataWaktuDeploy([
        { ditandatangani: "2026-10-01", penempatanPertama: "2026-10-05" },
        { ditandatangani: "2026-10-01", penempatanPertama: "2026-10-11" },
        { ditandatangani: "2026-10-20", penempatanPertama: null },
      ]),
    ).toBe(7);
    expect(rataWaktuDeploy([])).toBeNull();
  });
});
