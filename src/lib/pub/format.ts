import type { DayHours, Price, PubEvent } from "./types";

const WEEK: Record<string, string> = {
  Mon: "Mandag",
  Tue: "Tirsdag",
  Wed: "Onsdag",
  Thu: "Torsdag",
  Fri: "Fredag",
  Sat: "Lørdag",
  Sun: "Søndag",
};

export function cap(value: string) {
  return value ? value.charAt(0).toLocaleUpperCase("da-DK") + value.slice(1) : value;
}

export function copenhagenNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Copenhagen",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const weekday = WEEK[pick("weekday")] ?? "Mandag";
  const iso = `${pick("year")}-${pick("month")}-${pick("day")}`;
  const minuteOfDay = Number(pick("hour")) * 60 + Number(pick("minute"));
  return { weekday, iso, minuteOfDay };
}

export function minutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

export function isOpenAt(hours: DayHours[], weekday: string, minuteOfDay: number) {
  const row = hours.find((item) => item.day.toLowerCase() === weekday.toLowerCase());
  if (!row || row.closed) return false;
  const open = minutes(row.open);
  const close = minutes(row.close);
  if (open == null || close == null) return false;
  if (close > open) return minuteOfDay >= open && minuteOfDay < close;
  return minuteOfDay >= open || minuteOfDay < close;
}

export function todayHours(hours: DayHours[], weekday: string) {
  const row = hours.find((item) => item.day.toLowerCase() === weekday.toLowerCase());
  if (!row || row.closed) return "Lukket i dag";
  return `I dag ${row.open}–${row.close}`;
}

export function longDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  return cap(
    new Intl.DateTimeFormat("da-DK", {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(dt),
  );
}

export function monthLabel(year: number, month: number) {
  const dt = new Date(Date.UTC(year, month - 1, 1, 12));
  return cap(
    new Intl.DateTimeFormat("da-DK", {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
    }).format(dt),
  );
}

const WD_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

export function monthCells(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1, 12));
  const wd = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short" }).format(first);
  const pad = WD_INDEX[wd] ?? 0;
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: { iso: string | null; day: number | null }[] = [];
  for (let i = 0; i < pad; i += 1) cells.push({ iso: null, day: null });
  for (let day = 1; day <= count; day += 1) {
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({ iso, day });
  }
  while (cells.length % 7 !== 0) cells.push({ iso: null, day: null });
  return cells;
}

export function upcomingEvents(events: PubEvent[], today: string) {
  return events
    .filter((event) => event.eventDate >= today)
    .sort(
      (a, b) =>
        a.eventDate.localeCompare(b.eventDate) || a.startTime.localeCompare(b.startTime),
    );
}

export function kroner(value: number) {
  return `${new Intl.NumberFormat("da-DK").format(value)} kr`;
}

export function groupPrices(prices: Price[]) {
  const order: string[] = [];
  const map = new Map<string, Price[]>();
  const sorted = [...prices].sort((a, b) => a.sort - b.sort || a.id - b.id);
  for (const price of sorted) {
    if (!map.has(price.category)) {
      map.set(price.category, []);
      order.push(price.category);
    }
    map.get(price.category)?.push(price);
  }
  return order.map((category) => ({ category, items: map.get(category) ?? [] }));
}

export function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 8) return `tel:+45${digits}`;
  if (digits.startsWith("45")) return `tel:+${digits}`;
  return `tel:+${digits}`;
}

export function paragraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export const MAP_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=10.346072%2C55.362848%2C10.366072%2C55.372848&layer=mapnik&marker=55.367848%2C10.356072";

export function mapsLink(address: string, city: string) {
  const q = encodeURIComponent(`${address}, ${city}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

export function osmLink() {
  return "https://www.openstreetmap.org/?mlat=55.367848&mlon=10.356072#map=17/55.367848/10.356072";
}

export type VideoView =
  | { type: "file"; src: string }
  | { type: "youtube"; src: string }
  | { type: "vimeo"; src: string }
  | { type: "link"; src: string };

export function videoView(src: string): VideoView {
  const yt = src.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/,
  );
  if (yt) return { type: "youtube", src: `https://www.youtube-nocookie.com/embed/${yt[1]}` };
  const vimeo = src.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { type: "vimeo", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  if (src.startsWith("data:video/") || src.startsWith("/media/") || /\.(mp4|webm)($|\?)/i.test(src)) {
    return { type: "file", src };
  }
  return { type: "link", src };
}

export async function fileToImageData(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Vælg et billede.");
  const bitmap = await createImageBitmap(file);
  const maxEdge = 1600;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Kunne ikke læse billedet.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  let url = canvas.toDataURL("image/jpeg", 0.82);
  if (url.length > 1_400_000) url = canvas.toDataURL("image/jpeg", 0.6);
  if (url.length > 1_500_000) throw new Error("Billedet er stadig for stort. Prøv et mindre.");
  return url;
}

export function fileToVideoData(file: File) {
  const allowed = file.type === "video/mp4" || file.type === "video/webm" || /\.(mp4|webm)$/i.test(file.name);
  if (!allowed) throw new Error("Vælg en mp4-film. Den virker på telefonen.");
  if (file.size > 2_400_000) {
    throw new Error("Filmen er for stor. Hold den under ca. 2,5 MB, eller sæt et YouTube-link ind.");
  }
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      if (!result.startsWith("data:video/")) reject(new Error("Kunne ikke læse filmen."));
      else resolve(result);
    };
    reader.onerror = () => reject(new Error("Kunne ikke læse filmen."));
    reader.readAsDataURL(file);
  });
}

export function errText(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Noget gik galt. Prøv igen.";
}
