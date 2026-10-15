// All text and data for Tallow & Tape (fictional studio, concept website). Prices and years are samples.
export const nav = [
  { id: "rooms", label: "Rooms" },
  { id: "services", label: "Services" },
  { id: "gear", label: "Gear" },
  { id: "sessions", label: "Sessions" },
  { id: "book", label: "Book" },
];

export const hook = "Studios: this is your website.";

export const heroLabels = ["Control room", "The door", "Live room", "Lamp glow", "Vocal booth"];

export const rooms = [
  { n: "01", name: "Control room", img: "/images/tallow-tape/k1.jpg", spec: "32-channel desk, treated walls, one lamp. 28 m².", pos: "50% 50%" },
  { n: "02", name: "Live room", img: "/images/tallow-tape/k4.jpg", spec: "Wood floor, drum riser, room for a five-piece. 64 m².", pos: "50% 50%" },
  { n: "03", name: "Vocal booth", img: "/images/tallow-tape/k6.jpg", spec: "Velvet walls, tube mic, one stool. 6 m².", pos: "50% 50%" },
];

export const services = [
  { n: "01", name: "Recording", note: "Tracking day with an engineer, tape optional.", price: "from ₹9,000 / day", unit: "sample" },
  { n: "02", name: "Mixing", note: "One song, two revisions, stems back to you.", price: "from ₹6,000 / song", unit: "sample" },
  { n: "03", name: "Mastering", note: "Loud enough, still alive. Ready for release.", price: "from ₹2,500 / song", unit: "sample" },
  { n: "04", name: "Rehearsal", note: "The live room, amps and a drum kit included.", price: "₹900 / hour", unit: "sample" },
];

// gear: generic words only, no brand names. Years are made up and always labelled "sample".
export const gear = [
  { id: "g1", name: "Tube mic", year: 1962, pos: "50% 50%", zoom: 1 },
  { id: "g2", name: "Vintage mic", year: 1948, pos: "50% 50%", zoom: 1 },
  { id: "g3", name: "2-inch tape machine", year: 1974, pos: "50% 50%", zoom: 1 },
  { id: "g4", name: "Pre-amp", year: 1969, pos: "50% 50%", zoom: 1 },
  { id: "g5", name: "Compressor", year: 1966, pos: "50% 50%", zoom: 1 },
  { id: "g6", name: "Studio monitors", year: 1981, pos: "50% 50%", zoom: 1 },
  { id: "g7", name: "Upright piano", year: 1923, pos: "50% 50%", zoom: 1 },
  // centre crop: the lamp sliver at the right edge of the picture is pushed out of the tile
  { id: "g8", name: "Drum kit", year: 1965, pos: "42% 50%", zoom: 1.2 },
];

export const sessions = [
  { n: "01", title: "Night Bus (live take)", genre: "Folk rock", len: "3:42" },
  { n: "02", title: "Salt Field", genre: "Folk", len: "4:10" },
  { n: "03", title: "Low Tide EP", genre: "Indie", len: "2:58" },
];

export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const slots = ["10–14", "14–18", "18–22", "Full day"];

export const footer = {
  word: "TALLOW & TAPE",
  note: "Concept website by Triozen Tech",
  hours: "Open 10:00 – 22:00 · every day",
};
