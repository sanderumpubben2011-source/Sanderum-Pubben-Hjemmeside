import { hashPassword } from "better-auth/crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { dbSource, getSql } from "@/lib/db";
import { copenhagenNow, isOpenAt } from "./format";
import type {
  DayHours,
  EditorData,
  AuditEntry,
  EditorLogin,
  EditorRole,
  Media,
  Price,
  PubData,
  PubEvent,
  Site,
  StaffMember,
  ThemeId,
} from "./types";

const MAX_IMAGE = 1_500_000;

const hoursSchema = z.object({
  day: z.string().trim().min(1).max(20),
  open: z.string().regex(/^\d{2}:\d{2}$/),
  close: z.string().regex(/^\d{2}:\d{2}$/),
  closed: z.boolean(),
});

const siteSchema = z.object({
  name: z.string().trim().min(1).max(80),
  tagline: z.string().trim().max(180),
  about: z.string().trim().max(4000),
  phone: z.string().trim().max(40),
  email: z.string().trim().max(120),
  address: z.string().trim().max(160),
  city: z.string().trim().max(80),
  facebook: z.string().trim().max(300),
  instagram: z.string().trim().max(300),
  youtube: z.string().trim().max(300),
  tiktok: z.string().trim().max(300),
  snapchat: z.string().trim().max(300),
  heroImage: z.string().max(MAX_IMAGE),
  logoImage: z.string().max(MAX_IMAGE),
  backdrop: z.string().max(MAX_IMAGE),
  theme: z.enum(["papir", "nat", "filt"]),
  hours: z.array(hoursSchema).length(7),
  hoursNote: z.string().trim().max(400),
  pricesNote: z.string().trim().max(400),
  pricesLive: z.boolean(),
  calendarLive: z.boolean(),
});

const eventSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^$|^\d{2}:\d{2}$/),
  image: z.string().max(MAX_IMAGE),
});

const priceSchema = z.object({
  category: z.string().trim().min(1).max(40),
  name: z.string().trim().min(1).max(80),
  priceKr: z.number().int().min(0).max(9999),
  note: z.string().trim().max(160),
});

const staffSchema = z.object({
  name: z.string().trim().min(1).max(80),
  role: z.string().trim().min(1).max(40),
  email: z.string().trim().max(120),
  phone: z.string().trim().max(40),
  image: z.string().max(MAX_IMAGE),
});

const mediaSchema = z.object({
  kind: z.enum(["image", "video"]),
  src: z.string().trim().min(1).max(3_500_000),
  caption: z.string().trim().max(160),
});

function parse<T extends z.ZodType>(schema: T, input: unknown): z.infer<T> {
  const result = schema.safeParse(input);
  if (!result.success) throw new Error("Tjek felterne og prøv igen.");
  return result.data;
}

function asIsoDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(value).slice(0, 10);
}

function num(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return n;
}

function assertImage(value: string, label: string) {
  if (!value) return;
  const data = /^data:image\/(jpeg|png|webp);base64,/.test(value);
  const path = value.startsWith("/media/") && !value.includes("..");
  const url = /^https:\/\/\S+$/.test(value) && value.length < 500;
  if (value.length > MAX_IMAGE) throw new Error(`${label} er for stort.`);
  if (!data && !path && !url) throw new Error(`${label} skal være et upload eller et https-link.`);
}

function assertVideo(value: string) {
  const data = /^data:video\/(mp4|webm);base64,/.test(value);
  const path = value.startsWith("/media/") && !value.includes("..");
  const url = /^https:\/\/\S+$/.test(value) && value.length < 500;
  if (value.length > 3_400_000) {
    throw new Error("Filmen er for stor. Hold den under ca. 2,5 MB, eller brug et YouTube-link.");
  }
  if (!data && !path && !url) throw new Error("Vælg en mp4-film, eller sæt et https-link ind.");
}

function cleanSocial(value: string, host: string, prefix = "") {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https:\/\/\S+$/i.test(trimmed)) return trimmed.slice(0, 300);
  if (/^http:\/\/\S+$/i.test(trimmed)) return trimmed.replace(/^http:\/\//i, "https://").slice(0, 300);
  if (/^www\.\S+$/i.test(trimmed)) return `https://${trimmed}`.slice(0, 300);
  const handle = trimmed.replace(/^@/, "").replace(/\s/g, "");
  if (!/^[\w.-]{1,80}$/.test(handle)) throw new Error("Skriv et brugernavn eller et https-link.");
  return `https://${host}/${prefix}${handle}`;
}

type SiteRow = {
  name: string;
  tagline: string;
  about: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  snapchat: string;
  hero_image: string;
  logo_image: string;
  backdrop: string;
  theme: string;
  hours_json: string;
  hours_note: string;
  prices_note: string;
  prices_live: boolean;
  calendar_live: boolean;
};

function mapSite(row: SiteRow): Site {
  let hours: DayHours[] = [];
  try {
    const parsed = JSON.parse(row.hours_json) as DayHours[];
    if (Array.isArray(parsed)) hours = parsed;
  } catch {
    hours = [];
  }
  const theme: ThemeId =
    row.theme === "nat" || row.theme === "filt" || row.theme === "papir" ? row.theme : "papir";
  return {
    name: row.name,
    tagline: row.tagline,
    about: row.about,
    phone: row.phone,
    email: row.email,
    address: row.address,
    city: row.city,
    facebook: row.facebook,
    instagram: row.instagram,
    youtube: row.youtube ?? "",
    tiktok: row.tiktok ?? "",
    snapchat: row.snapchat ?? "",
    heroImage: row.hero_image || "/media/hero.jpg",
    logoImage: row.logo_image ?? "",
    backdrop: row.backdrop ?? "",
    theme,
    hours,
    hoursNote: row.hours_note,
    pricesNote: row.prices_note,
    pricesLive: Boolean(row.prices_live),
    calendarLive: Boolean(row.calendar_live),
  };
}

async function loadPub(): Promise<PubData> {
  const sql = await getSql();
  const siteRows = await sql<SiteRow>`
    select name, tagline, about, phone, email, address, city, facebook, instagram,
           youtube, tiktok, snapchat,
           hero_image, logo_image, backdrop, theme, hours_json, hours_note, prices_note,
           prices_live, calendar_live
    from pub_site where id = 1
  `;
  const siteRow = siteRows[0];
  if (!siteRow) throw new Error("Pubben kunne ikke indlæses.");
  const site = mapSite(siteRow);
  const eventRows = await sql<{
    id: number;
    title: string;
    description: string;
    event_date: string;
    start_time: string;
    end_time: string;
    image: string;
  }>`
    select id, title, description, event_date, start_time, end_time, image
    from events order by event_date, start_time, id
  `;
  const priceRows = await sql<{
    id: number;
    category: string;
    name: string;
    price_kr: number;
    note: string;
    sort: number;
  }>`select id, category, name, price_kr, note, sort from prices order by sort, id`;
  const mediaRows = await sql<{
    id: number;
    kind: string;
    src: string;
    caption: string;
    sort: number;
  }>`select id, kind, src, caption, sort from gallery order by sort, id`;
  const events: PubEvent[] = eventRows.map((row) => ({
    id: num(row.id),
    title: row.title,
    description: row.description,
    eventDate: asIsoDate(row.event_date),
    startTime: row.start_time,
    endTime: row.end_time,
    image: row.image,
  }));
  const prices: Price[] = priceRows.map((row) => ({
    id: num(row.id),
    category: row.category,
    name: row.name,
    priceKr: num(row.price_kr),
    note: row.note,
    sort: num(row.sort),
  }));
  const gallery: Media[] = mediaRows.map((row) => ({
    id: num(row.id),
    kind: row.kind === "video" ? "video" : "image",
    src: row.src,
    caption: row.caption,
    sort: num(row.sort),
  }));
  const staffRows = await sql<{
    id: number;
    name: string;
    role: string;
    email: string;
    phone: string;
    image: string;
    sort: number;
  }>`select id, name, role, email, phone, image, sort from staff order by sort, id`;
  const staff: StaffMember[] = staffRows.map((row) => ({
    id: num(row.id),
    name: row.name,
    role: row.role,
    email: row.email ?? "",
    phone: row.phone ?? "",
    image: row.image ?? "",
    sort: num(row.sort),
  }));
  const now = copenhagenNow();
  return {
    site,
    events,
    prices,
    gallery,
    staff,
    today: now.iso,
    weekday: now.weekday,
    openNow: isOpenAt(site.hours, now.weekday, now.minuteOfDay),
  };
}

async function requireEditor(userId: string) {
  const role = await roleFor(userId);
  if (role !== "ejer" && role !== "redaktor") {
    throw new Error("Kun husets folk kan redigere siden.");
  }
}

async function requireSiteOwner(userId: string) {
  const role = await roleFor(userId);
  if (role !== "ejer") throw new Error("Kun ejeren kan oprette logins.");
}

async function roleFor(userId: string): Promise<EditorRole> {
  const sql = await getSql();
  const rows = await sql<{ owner_id: string | null }>`select owner_id from pub_site where id = 1`;
  const owner = rows[0]?.owner_id;
  if (!owner) return "ledig";
  if (owner === userId) return "ejer";
  const extra = await sql<{ user_id: string }>`select user_id from editors where user_id = ${userId}`;
  if (extra.length > 0) return "redaktor";
  return "anden";
}

function clip(value: string) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean) return "tom";
  return clean.length > 70 ? `${clean.slice(0, 70)}…` : clean;
}

function dayLabel(value: unknown) {
  const text = value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? "");
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (!match) return text;
  return `${Number(match[3])}/${Number(match[2])}`;
}

function clock(value: unknown) {
  return String(value ?? "").slice(0, 5);
}

function change(label: string, before: string, after: string, long = false) {
  if (before === after) return "";
  if (long || before.length > 70 || after.length > 70) return `${label} er ændret`;
  return `${label}: ${clip(before)} → ${clip(after)}`;
}

async function writeLog(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  area: string,
  detail: string,
) {
  const rows = await sql<{ name: string }>`select "name" from "user" where "id" = ${userId}`;
  const userName = rows[0]?.name?.trim() || "Ukendt";
  await sql`
    insert into audit_log (user_id, user_name, area, detail)
    values (${userId}, ${userName}, ${area}, ${detail})
  `;
}

export const getPub = createServerFn({ method: "GET" }).handler(async (): Promise<PubData> => {
  return loadPub();
});

export const getEditor = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<EditorData> => {
    const pub = await loadPub();
    const role = await roleFor(context.userId);
    const editors =
      role === "ejer"
        ? (
            await getSql().then((sql) =>
              sql<{ user_id: string; name: string; email: string }>`
                select user_id, name, email from editors order by created_at, email
              `,
            )
          ).map(
            (row): EditorLogin => ({
              userId: row.user_id,
              name: row.name,
              email: row.email,
            }),
          )
        : [];
    const log =
      role === "ejer" || role === "redaktor"
        ? (
            await getSql().then((sql) =>
              sql<{ id: number; user_name: string; area: string; detail: string; created_at: string | Date }>`
                select id, user_name, area, detail, created_at
                from audit_log
                order by id desc
                limit 100
              `,
            )
          ).map(
            (row): AuditEntry => ({
              id: num(row.id),
              userName: row.user_name,
              area: row.area,
              detail: row.detail,
              createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
            }),
          )
        : [];
    return { ...pub, role, durable: dbSource === "neon", editors, log };
  });

export const claimSite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`update pub_site set owner_id = ${context.userId} where id = 1 and owner_id is null`;
    const role = await roleFor(context.userId);
    if (role !== "ejer") throw new Error("Siden har allerede en ejer.");
    return { ok: true as const };
  });

export const updateSite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => parse(siteSchema, input))
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    assertImage(data.heroImage, "Forsidebilledet");
    assertImage(data.logoImage, "Logoet");
    assertImage(data.backdrop, "Baggrunden");
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error("E-mailen ser ikke rigtig ud.");
    }
    const facebook = cleanSocial(data.facebook, "facebook.com");
    const instagram = cleanSocial(data.instagram, "instagram.com");
    const youtube = cleanSocial(data.youtube, "www.youtube.com", "@");
    const tiktok = cleanSocial(data.tiktok, "www.tiktok.com", "@");
    const snapchat = cleanSocial(data.snapchat, "www.snapchat.com", "add/");
    const sql = await getSql();
    const before = await sql<{
      name: string;
      tagline: string;
      about: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      facebook: string;
      instagram: string;
      youtube: string;
      tiktok: string;
      snapchat: string;
      hero_image: string;
      logo_image: string;
      backdrop: string;
      theme: string;
      hours_json: string;
      hours_note: string;
      prices_note: string;
      prices_live: boolean;
      calendar_live: boolean;
    }>`
      select name, tagline, about, phone, email, address, city, facebook, instagram, youtube, tiktok,
        snapchat, hero_image, logo_image, backdrop, theme, hours_json, hours_note, prices_note,
        prices_live, calendar_live
      from pub_site where id = 1
    `;
    const old = before[0];
    await sql`
      update pub_site set
        name = ${data.name},
        tagline = ${data.tagline},
        about = ${data.about},
        phone = ${data.phone},
        email = ${data.email},
        address = ${data.address},
        city = ${data.city},
        facebook = ${facebook},
        instagram = ${instagram},
        youtube = ${youtube},
        tiktok = ${tiktok},
        snapchat = ${snapchat},
        hero_image = ${data.heroImage || "/media/hero.jpg"},
        logo_image = ${data.logoImage},
        backdrop = ${data.backdrop},
        theme = ${data.theme},
        hours_json = ${JSON.stringify(data.hours)},
        hours_note = ${data.hoursNote},
        prices_note = ${data.pricesNote},
        prices_live = ${data.pricesLive},
        calendar_live = ${data.calendarLive},
        updated_at = now()
      where id = 1
    `;
    if (old) {
      const sameHours = (() => {
        try {
          return JSON.stringify(JSON.parse(old.hours_json)) === JSON.stringify(data.hours);
        } catch {
          return false;
        }
      })();
      const bits = [
        change("Navn", old.name, data.name),
        change("Undertitel", old.tagline, data.tagline),
        change("Tekst", old.about, data.about, true),
        change("Telefon", old.phone, data.phone),
        change("E-mail", old.email, data.email),
        change("Adresse", `${old.address}, ${old.city}`, `${data.address}, ${data.city}`),
        change("Facebook", old.facebook, facebook),
        change("Instagram", old.instagram, instagram),
        change("YouTube", old.youtube, youtube),
        change("TikTok", old.tiktok, tiktok),
        change("Snapchat", old.snapchat, snapchat),
        old.hero_image === (data.heroImage || "/media/hero.jpg") ? "" : "Forsidebilledet er skiftet",
        old.logo_image === data.logoImage ? "" : "Logoet er skiftet",
        old.backdrop === data.backdrop ? "" : "Baggrunden er skiftet",
        change("Udtryk", old.theme, data.theme),
        sameHours ? "" : "Åbningstiderne er ændret",
        change("Note til åbningstider", old.hours_note, data.hoursNote, true),
        change("Note til priser", old.prices_note, data.pricesNote, true),
        Boolean(old.prices_live) === data.pricesLive ? "" : data.pricesLive ? "Priserne er markeret som de rigtige" : "Priserne er markeret som eksempler",
        Boolean(old.calendar_live) === data.calendarLive
          ? ""
          : data.calendarLive
            ? "Kalenderen er markeret som den rigtige"
            : "Kalenderen er markeret som eksempler",
      ].filter(Boolean);
      if (bits.length) await writeLog(sql, context.userId, "Huset", bits.join(". ") + ".");
    }
    return { ok: true as const };
  });

export const createEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => parse(eventSchema, input))
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    assertImage(data.image, "Eventbilledet");
    const sql = await getSql();
    await sql`
      insert into events (title, description, event_date, start_time, end_time, image)
      values (${data.title}, ${data.description}, ${data.eventDate}, ${data.startTime}, ${data.endTime}, ${data.image})
    `;
    await writeLog(
      sql,
      context.userId,
      "Event",
      `Oprettede ${data.title} den ${dayLabel(data.eventDate)}.`,
    );
    return { ok: true as const };
  });

export const updateEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => parse(eventSchema.extend({ id: z.number().int().positive() }), input))
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    assertImage(data.image, "Eventbilledet");
    const sql = await getSql();
    const before = await sql<{
      title: string;
      description: string;
      event_date: string | Date;
      start_time: string;
      end_time: string;
      image: string;
    }>`select title, description, event_date, start_time, end_time, image from events where id = ${data.id}`;
    const old = before[0];
    await sql`
      update events set
        title = ${data.title},
        description = ${data.description},
        event_date = ${data.eventDate},
        start_time = ${data.startTime},
        end_time = ${data.endTime},
        image = ${data.image}
      where id = ${data.id}
    `;
    if (old) {
      const bits = [
        change("Titel", old.title, data.title),
        change("Dato", dayLabel(old.event_date), dayLabel(data.eventDate)),
        change("Start", clock(old.start_time), data.startTime),
        change("Slut", clock(old.end_time), data.endTime),
        change("Tekst", old.description, data.description, true),
        old.image === data.image ? "" : "Billedet er skiftet",
      ].filter(Boolean);
      if (bits.length) await writeLog(sql, context.userId, "Event", `Ændrede ${old.title}. ${bits.join(". ")}.`);
    }
    return { ok: true as const };
  });

export const deleteEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => parse(z.object({ id: z.number().int().positive() }), input))
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    const sql = await getSql();
    const before = await sql<{ title: string }>`select title from events where id = ${data.id}`;
    await sql`delete from events where id = ${data.id}`;
    if (before[0]) await writeLog(sql, context.userId, "Event", `Slettede ${before[0].title}.`);
    return { ok: true as const };
  });

export const createPrice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => parse(priceSchema, input))
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    const sql = await getSql();
    const rows = await sql<{ sort: number }>`select coalesce(max(sort), 0) as sort from prices`;
    const sort = num(rows[0]?.sort) + 10;
    await sql`
      insert into prices (category, name, price_kr, note, sort)
      values (${data.category}, ${data.name}, ${data.priceKr}, ${data.note}, ${sort})
    `;
    await writeLog(sql, context.userId, "Pris", `Oprettede ${data.name} til ${data.priceKr} kr.`);
    return { ok: true as const };
  });

export const updatePrice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => parse(priceSchema.extend({ id: z.number().int().positive() }), input))
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    const sql = await getSql();
    const before = await sql<{ category: string; name: string; price_kr: number; note: string }>`
      select category, name, price_kr, note from prices where id = ${data.id}
    `;
    const old = before[0];
    await sql`
      update prices set
        category = ${data.category},
        name = ${data.name},
        price_kr = ${data.priceKr},
        note = ${data.note}
      where id = ${data.id}
    `;
    if (old) {
      const bits = [
        change("Navn", old.name, data.name),
        change("Kategori", old.category, data.category),
        change("Pris", `${num(old.price_kr)} kr`, `${data.priceKr} kr`),
        change("Note", old.note, data.note, true),
      ].filter(Boolean);
      if (bits.length) await writeLog(sql, context.userId, "Pris", `Ændrede ${old.name}. ${bits.join(". ")}.`);
    }
    return { ok: true as const };
  });

export const deletePrice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => parse(z.object({ id: z.number().int().positive() }), input))
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    const sql = await getSql();
    const before = await sql<{ name: string }>`select name from prices where id = ${data.id}`;
    await sql`delete from prices where id = ${data.id}`;
    if (before[0]) await writeLog(sql, context.userId, "Pris", `Slettede ${before[0].name}.`);
    return { ok: true as const };
  });

export const createMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => parse(mediaSchema, input))
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    if (data.kind === "image") assertImage(data.src, "Billedet");
    else assertVideo(data.src);
    const sql = await getSql();
    const rows = await sql<{ sort: number }>`select coalesce(max(sort), 0) as sort from gallery`;
    const sort = num(rows[0]?.sort) + 10;
    await sql`
      insert into gallery (kind, src, caption, sort)
      values (${data.kind}, ${data.src}, ${data.caption}, ${sort})
    `;
    const kind = data.kind === "video" ? "videoen" : "billedet";
    await writeLog(sql, context.userId, "Galleri", `Tilføjede ${kind}${data.caption ? `: ${clip(data.caption)}` : ""}.`);
    return { ok: true as const };
  });

export const updateMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    parse(mediaSchema.extend({ id: z.number().int().positive() }), input),
  )
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    if (data.kind === "image") assertImage(data.src, "Billedet");
    else assertVideo(data.src);
    const sql = await getSql();
    const before = await sql<{ kind: string; caption: string; src: string }>`
      select kind, caption, src from gallery where id = ${data.id}
    `;
    const old = before[0];
    await sql`
      update gallery set kind = ${data.kind}, src = ${data.src}, caption = ${data.caption}
      where id = ${data.id}
    `;
    if (old) {
      const bits = [
        change("Tekst", old.caption, data.caption),
        old.src === data.src ? "" : "Filen er skiftet",
      ].filter(Boolean);
      if (bits.length) {
        const kind = old.kind === "video" ? "videoen" : "billedet";
        await writeLog(sql, context.userId, "Galleri", `Ændrede ${kind}${old.caption ? ` ${clip(old.caption)}` : ""}. ${bits.join(". ")}.`);
      }
    }
    return { ok: true as const };
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => parse(z.object({ id: z.number().int().positive() }), input))
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    const sql = await getSql();
    const before = await sql<{ kind: string; caption: string }>`select kind, caption from gallery where id = ${data.id}`;
    await sql`delete from gallery where id = ${data.id}`;
    if (before[0]) {
      const kind = before[0].kind === "video" ? "videoen" : "billedet";
      await writeLog(
        sql,
        context.userId,
        "Galleri",
        `Slettede ${kind}${before[0].caption ? `: ${clip(before[0].caption)}` : ""}.`,
      );
    }
    return { ok: true as const };
  });

export const createStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => parse(staffSchema, input))
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error("E-mailen ser ikke rigtig ud.");
    }
    assertImage(data.image, "Billedet");
    const sql = await getSql();
    const rows = await sql<{ sort: number }>`select coalesce(max(sort), 0) as sort from staff`;
    const sort = num(rows[0]?.sort) + 10;
    await sql`
      insert into staff (name, role, email, phone, image, sort)
      values (${data.name}, ${data.role}, ${data.email}, ${data.phone}, ${data.image}, ${sort})
    `;
    await writeLog(sql, context.userId, "Holdet", `Tilføjede ${data.name} som ${data.role}.`);
    return { ok: true as const };
  });

export const updateStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => parse(staffSchema.extend({ id: z.number().int().positive() }), input))
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error("E-mailen ser ikke rigtig ud.");
    }
    assertImage(data.image, "Billedet");
    const sql = await getSql();
    const before = await sql<{ name: string; role: string; email: string; phone: string; image: string }>`
      select name, role, email, phone, image from staff where id = ${data.id}
    `;
    const old = before[0];
    await sql`
      update staff set
        name = ${data.name},
        role = ${data.role},
        email = ${data.email},
        phone = ${data.phone},
        image = ${data.image}
      where id = ${data.id}
    `;
    if (old) {
      const bits = [
        change("Navn", old.name, data.name),
        change("Rolle", old.role, data.role),
        change("E-mail", old.email, data.email),
        change("Telefon", old.phone, data.phone),
        old.image === data.image ? "" : "Billedet er skiftet",
      ].filter(Boolean);
      if (bits.length) await writeLog(sql, context.userId, "Holdet", `Ændrede ${old.name}. ${bits.join(". ")}.`);
    }
    return { ok: true as const };
  });

export const deleteStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => parse(z.object({ id: z.number().int().positive() }), input))
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    const sql = await getSql();
    const before = await sql<{ name: string }>`select name from staff where id = ${data.id}`;
    await sql`delete from staff where id = ${data.id}`;
    if (before[0]) await writeLog(sql, context.userId, "Holdet", `Slettede ${before[0].name}.`);
    return { ok: true as const };
  });

export const moveItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    parse(
      z.object({
        table: z.enum(["prices", "gallery", "staff"]),
        id: z.number().int().positive(),
        dir: z.enum(["up", "down"]),
      }),
      input,
    ),
  )
  .handler(async ({ data, context }) => {
    await requireEditor(context.userId);
    const sql = await getSql();
    const rows =
      data.table === "prices"
        ? await sql<{ id: number; sort: number }>`select id, sort from prices order by sort, id`
        : data.table === "gallery"
          ? await sql<{ id: number; sort: number }>`select id, sort from gallery order by sort, id`
          : await sql<{ id: number; sort: number }>`select id, sort from staff order by sort, id`;
    const list = rows.map((row) => ({ id: num(row.id), sort: num(row.sort) }));
    const index = list.findIndex((row) => row.id === data.id);
    const nextIndex = data.dir === "up" ? index - 1 : index + 1;
    if (index < 0 || nextIndex < 0 || nextIndex >= list.length) return { ok: true as const };
    const swapped = list.slice();
    const [item] = swapped.splice(index, 1);
    if (!item) return { ok: true as const };
    swapped.splice(nextIndex, 0, item);
    for (let i = 0; i < swapped.length; i += 1) {
      const sort = (i + 1) * 10;
      const id = swapped[i]?.id;
      if (!id) continue;
      if (data.table === "prices") await sql`update prices set sort = ${sort} where id = ${id}`;
      else if (data.table === "gallery") await sql`update gallery set sort = ${sort} where id = ${id}`;
      else await sql`update staff set sort = ${sort} where id = ${id}`;
    }
    return { ok: true as const };
  });

export const signupOpen = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ owner_id: string | null }>`select owner_id from pub_site where id = 1`;
  return { open: !rows[0]?.owner_id };
});

export const createEditor = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    parse(
      z.object({
        name: z.string().trim().min(1).max(80),
        email: z.string().trim().max(120).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Skriv en rigtig e-mail."),
        password: z.string().min(8).max(128),
      }),
      input,
    ),
  )
  .handler(async ({ data, context }) => {
    await requireSiteOwner(context.userId);
    const sql = await getSql();
    const email = data.email.toLowerCase();
    const existing = await sql<{ id: string }>`select "id" from "user" where lower("email") = ${email}`;
    if (existing.length > 0) throw new Error("Der findes allerede en konto med den e-mail.");
    const id = crypto.randomUUID();
    const hash = await hashPassword(data.password);
    await sql`
      insert into "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
      values (${id}, ${data.name}, ${email}, true, now(), now())
    `;
    await sql`
      insert into "account" (
        "id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt"
      )
      values (${crypto.randomUUID()}, ${id}, 'credential', ${id}, ${hash}, now(), now())
    `;
    await sql`
      insert into editors (user_id, name, email) values (${id}, ${data.name}, ${email})
    `;
    await writeLog(sql, context.userId, "Adgang", `Oprettede login til ${data.name} (${email}).`);
    return { ok: true as const };
  });

export const deleteEditor = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => parse(z.object({ userId: z.string().trim().min(1).max(80) }), input))
  .handler(async ({ data, context }) => {
    await requireSiteOwner(context.userId);
    if (data.userId === context.userId) throw new Error("Du kan ikke slette din egen konto her.");
    const sql = await getSql();
    const before = await sql<{ name: string; email: string }>`select name, email from editors where user_id = ${data.userId}`;
    await sql`delete from "session" where "userId" = ${data.userId}`;
    await sql`delete from "account" where "userId" = ${data.userId}`;
    await sql`delete from editors where user_id = ${data.userId}`;
    await sql`delete from "user" where "id" = ${data.userId}`;
    if (before[0]) await writeLog(sql, context.userId, "Adgang", `Slettede login til ${before[0].name} (${before[0].email}).`);
    return { ok: true as const };
  });
