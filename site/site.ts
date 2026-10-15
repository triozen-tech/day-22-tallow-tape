import type { SiteMeta, Theme } from "@/lib/site";

export const meta: SiteMeta = {
  name: "Tallow & Tape",
  title: "Tallow & Tape — recording + rehearsal studio (concept)",
  description: "A recording, mixing and rehearsal studio with three rooms and a lot of warm light. Concept website by Triozen Tech.",
  loaderText: "TALLOW & TAPE",
  loader: false, // site/components/Shutter.tsx is the loader (I29)
  cursor: true,
  record: { duration: 36 },
};

export const theme: Theme = {
  bg: "#0e0a09",
  surface: "#17100e",
  text: "#eadbc0",
  muted: "#a39580",
  accent: "#d4432b",
  accentText: "#0e0a09",
  line: "#3a2e27",
  fontDisplay: "'League Gothic Variable', 'League Gothic', Impact, sans-serif",
  fontBody: "'JetBrains Mono Variable', ui-monospace, monospace",
  radius: 0,
  uppercaseHeadings: true,
};
