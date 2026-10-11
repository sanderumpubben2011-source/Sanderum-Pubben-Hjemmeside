import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as getSql, t as authMiddleware } from "./middleware-BnXcl8v6.mjs";
import { n as copenhagenNow, o as isOpenAt } from "./format-DQk0TUU0.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CXnStV2S.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var MAX_IMAGE = 15e5;
var hoursSchema = object({
	day: string().trim().min(1).max(20),
	open: string().regex(/^\d{2}:\d{2}$/),
	close: string().regex(/^\d{2}:\d{2}$/),
	closed: boolean()
});
var siteSchema = object({
	name: string().trim().min(1).max(80),
	tagline: string().trim().max(180),
	about: string().trim().max(4e3),
	phone: string().trim().max(40),
	email: string().trim().max(120),
	address: string().trim().max(160),
	city: string().trim().max(80),
	facebook: string().trim().max(300),
	instagram: string().trim().max(300),
	heroImage: string().max(MAX_IMAGE),
	logoImage: string().max(MAX_IMAGE),
	backdrop: string().max(MAX_IMAGE),
	theme: _enum([
		"papir",
		"nat",
		"filt"
	]),
	hours: array(hoursSchema).length(7),
	hoursNote: string().trim().max(400),
	pricesNote: string().trim().max(400),
	pricesLive: boolean(),
	calendarLive: boolean()
});
var eventSchema = object({
	title: string().trim().min(1).max(120),
	description: string().trim().max(2e3),
	eventDate: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	startTime: string().regex(/^\d{2}:\d{2}$/),
	endTime: string().regex(/^$|^\d{2}:\d{2}$/),
	image: string().max(MAX_IMAGE)
});
var priceSchema = object({
	category: string().trim().min(1).max(40),
	name: string().trim().min(1).max(80),
	priceKr: number().int().min(0).max(9999),
	note: string().trim().max(160)
});
var mediaSchema = object({
	kind: _enum(["image", "video"]),
	src: string().trim().min(1).max(MAX_IMAGE),
	caption: string().trim().max(160)
});
function parse(schema, input) {
	const result = schema.safeParse(input);
	if (!result.success) throw new Error("Tjek felterne og prøv igen.");
	return result.data;
}
function asIsoDate(value) {
	if (value instanceof Date && !Number.isNaN(value.getTime())) return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
	return String(value).slice(0, 10);
}
function num(value) {
	const n = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(n)) return 0;
	return n;
}
function assertImage(value, label) {
	if (!value) return;
	const data = /^data:image\/(jpeg|png|webp);base64,/.test(value);
	const path = value.startsWith("/media/") && !value.includes("..");
	const url = /^https:\/\/\S+$/.test(value) && value.length < 500;
	if (value.length > MAX_IMAGE) throw new Error(`${label} er for stort.`);
	if (!data && !path && !url) throw new Error(`${label} skal være et upload eller et https-link.`);
}
function assertVideo(value) {
	const path = value.startsWith("/media/") && value.endsWith(".mp4") && !value.includes("..");
	const url = /^https:\/\/\S+$/.test(value) && value.length < 500;
	if (!path && !url) throw new Error("Video skal være et https-link eller en film på siden.");
}
function cleanSocial(value, host) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	if (/^https:\/\/\S+$/.test(trimmed)) return trimmed.slice(0, 300);
	const handle = trimmed.replace(/^@/, "").replace(/\s/g, "");
	if (!/^[\w.-]{1,80}$/.test(handle)) throw new Error("Skriv et brugernavn eller et https-link.");
	return `https://${host}/${handle}`;
}
function mapSite(row) {
	let hours = [];
	try {
		const parsed = JSON.parse(row.hours_json);
		if (Array.isArray(parsed)) hours = parsed;
	} catch {
		hours = [];
	}
	const theme = row.theme === "nat" || row.theme === "filt" || row.theme === "papir" ? row.theme : "papir";
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
		heroImage: row.hero_image || "/media/hero.jpg",
		logoImage: row.logo_image ?? "",
		backdrop: row.backdrop ?? "",
		theme,
		hours,
		hoursNote: row.hours_note,
		pricesNote: row.prices_note,
		pricesLive: Boolean(row.prices_live),
		calendarLive: Boolean(row.calendar_live)
	};
}
async function loadPub() {
	const sql = await getSql();
	const siteRow = (await sql`
    select name, tagline, about, phone, email, address, city, facebook, instagram,
           hero_image, logo_image, backdrop, theme, hours_json, hours_note, prices_note,
           prices_live, calendar_live
    from pub_site where id = 1
  `)[0];
	if (!siteRow) throw new Error("Pubben kunne ikke indlæses.");
	const site = mapSite(siteRow);
	const eventRows = await sql`
    select id, title, description, event_date, start_time, end_time, image
    from events order by event_date, start_time, id
  `;
	const priceRows = await sql`select id, category, name, price_kr, note, sort from prices order by sort, id`;
	const mediaRows = await sql`select id, kind, src, caption, sort from gallery order by sort, id`;
	const events = eventRows.map((row) => ({
		id: num(row.id),
		title: row.title,
		description: row.description,
		eventDate: asIsoDate(row.event_date),
		startTime: row.start_time,
		endTime: row.end_time,
		image: row.image
	}));
	const prices = priceRows.map((row) => ({
		id: num(row.id),
		category: row.category,
		name: row.name,
		priceKr: num(row.price_kr),
		note: row.note,
		sort: num(row.sort)
	}));
	const gallery = mediaRows.map((row) => ({
		id: num(row.id),
		kind: row.kind === "video" ? "video" : "image",
		src: row.src,
		caption: row.caption,
		sort: num(row.sort)
	}));
	const now = copenhagenNow();
	return {
		site,
		events,
		prices,
		gallery,
		today: now.iso,
		weekday: now.weekday,
		openNow: isOpenAt(site.hours, now.weekday, now.minuteOfDay)
	};
}
async function requireOwner(userId) {
	const rows = await (await getSql())`select owner_id from pub_site where id = 1`;
	if (!rows[0]?.owner_id || rows[0].owner_id !== userId) throw new Error("Kun ejeren kan redigere siden.");
}
async function roleFor(userId) {
	const owner = (await (await getSql())`select owner_id from pub_site where id = 1`)[0]?.owner_id;
	if (!owner) return "ledig";
	return owner === userId ? "ejer" : "anden";
}
var getPub_createServerFn_handler = createServerRpc({
	id: "d544a0d14115f95a3d9f80227803d1acd7b98bf15e0b2698768cb5cd3fb8cd75",
	name: "getPub",
	filename: "src/lib/pub/api.ts"
}, (opts) => getPub.__executeServer(opts));
var getPub = createServerFn({ method: "GET" }).handler(getPub_createServerFn_handler, async () => {
	return loadPub();
});
var getEditor_createServerFn_handler = createServerRpc({
	id: "9bde071436748d638bc1762db7917fdec4bcfd5f07581ef3db9cc331524c1e43",
	name: "getEditor",
	filename: "src/lib/pub/api.ts"
}, (opts) => getEditor.__executeServer(opts));
var getEditor = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getEditor_createServerFn_handler, async ({ context }) => {
	const pub = await loadPub();
	const role = await roleFor(context.userId);
	return {
		...pub,
		role
	};
});
var claimSite_createServerFn_handler = createServerRpc({
	id: "a2b756616332a2c6dda85af1e7ac107676a96d76e4d5dc29aacd63171788e4cd",
	name: "claimSite",
	filename: "src/lib/pub/api.ts"
}, (opts) => claimSite.__executeServer(opts));
var claimSite = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(claimSite_createServerFn_handler, async ({ context }) => {
	await (await getSql())`update pub_site set owner_id = ${context.userId} where id = 1 and owner_id is null`;
	if (await roleFor(context.userId) !== "ejer") throw new Error("Siden har allerede en ejer.");
	return { ok: true };
});
var updateSite_createServerFn_handler = createServerRpc({
	id: "a5fedf997f485a774bbb6cd7bffb49f84ab1e48385ea7adaa41c4072ad5907a2",
	name: "updateSite",
	filename: "src/lib/pub/api.ts"
}, (opts) => updateSite.__executeServer(opts));
var updateSite = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(siteSchema, input)).handler(updateSite_createServerFn_handler, async ({ data, context }) => {
	await requireOwner(context.userId);
	assertImage(data.heroImage, "Forsidebilledet");
	assertImage(data.logoImage, "Logoet");
	assertImage(data.backdrop, "Baggrunden");
	if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error("E-mailen ser ikke rigtig ud.");
	const facebook = cleanSocial(data.facebook, "facebook.com");
	const instagram = cleanSocial(data.instagram, "instagram.com");
	await (await getSql())`
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
	return { ok: true };
});
var createEvent_createServerFn_handler = createServerRpc({
	id: "850f1f06ebb75facea4e02c653ac13ddd19dfe1da794ecd35a77f53fd813b597",
	name: "createEvent",
	filename: "src/lib/pub/api.ts"
}, (opts) => createEvent.__executeServer(opts));
var createEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(eventSchema, input)).handler(createEvent_createServerFn_handler, async ({ data, context }) => {
	await requireOwner(context.userId);
	assertImage(data.image, "Eventbilledet");
	await (await getSql())`
      insert into events (title, description, event_date, start_time, end_time, image)
      values (${data.title}, ${data.description}, ${data.eventDate}, ${data.startTime}, ${data.endTime}, ${data.image})
    `;
	return { ok: true };
});
var updateEvent_createServerFn_handler = createServerRpc({
	id: "cf872a58857f88898b14f22c36189b8e98fe3b7cc3cca7e46b6d7c95a89c6915",
	name: "updateEvent",
	filename: "src/lib/pub/api.ts"
}, (opts) => updateEvent.__executeServer(opts));
var updateEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(eventSchema.extend({ id: number().int().positive() }), input)).handler(updateEvent_createServerFn_handler, async ({ data, context }) => {
	await requireOwner(context.userId);
	assertImage(data.image, "Eventbilledet");
	await (await getSql())`
      update events set
        title = ${data.title},
        description = ${data.description},
        event_date = ${data.eventDate},
        start_time = ${data.startTime},
        end_time = ${data.endTime},
        image = ${data.image}
      where id = ${data.id}
    `;
	return { ok: true };
});
var deleteEvent_createServerFn_handler = createServerRpc({
	id: "90890aa5f73b63470f965bfa1a2a7a7b9132c1b35cc56ae23e615b75f46b228f",
	name: "deleteEvent",
	filename: "src/lib/pub/api.ts"
}, (opts) => deleteEvent.__executeServer(opts));
var deleteEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(object({ id: number().int().positive() }), input)).handler(deleteEvent_createServerFn_handler, async ({ data, context }) => {
	await requireOwner(context.userId);
	await (await getSql())`delete from events where id = ${data.id}`;
	return { ok: true };
});
var createPrice_createServerFn_handler = createServerRpc({
	id: "9a7559737ca5a9b1a6699e152bcaf87754241f584698dea7d769671749d86ebb",
	name: "createPrice",
	filename: "src/lib/pub/api.ts"
}, (opts) => createPrice.__executeServer(opts));
var createPrice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(priceSchema, input)).handler(createPrice_createServerFn_handler, async ({ data, context }) => {
	await requireOwner(context.userId);
	const sql = await getSql();
	const sort = num((await sql`select coalesce(max(sort), 0) as sort from prices`)[0]?.sort) + 10;
	await sql`
      insert into prices (category, name, price_kr, note, sort)
      values (${data.category}, ${data.name}, ${data.priceKr}, ${data.note}, ${sort})
    `;
	return { ok: true };
});
var updatePrice_createServerFn_handler = createServerRpc({
	id: "dd7dd769257779ac490f1891b4d6a7413f9c8642658fc5f0f5dd3c9ba7cb4dc9",
	name: "updatePrice",
	filename: "src/lib/pub/api.ts"
}, (opts) => updatePrice.__executeServer(opts));
var updatePrice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(priceSchema.extend({ id: number().int().positive() }), input)).handler(updatePrice_createServerFn_handler, async ({ data, context }) => {
	await requireOwner(context.userId);
	await (await getSql())`
      update prices set
        category = ${data.category},
        name = ${data.name},
        price_kr = ${data.priceKr},
        note = ${data.note}
      where id = ${data.id}
    `;
	return { ok: true };
});
var deletePrice_createServerFn_handler = createServerRpc({
	id: "c48e9873ec3c6e5695735469b81c3212d97a93d0ad8610b863e6d29ffbebacb8",
	name: "deletePrice",
	filename: "src/lib/pub/api.ts"
}, (opts) => deletePrice.__executeServer(opts));
var deletePrice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(object({ id: number().int().positive() }), input)).handler(deletePrice_createServerFn_handler, async ({ data, context }) => {
	await requireOwner(context.userId);
	await (await getSql())`delete from prices where id = ${data.id}`;
	return { ok: true };
});
var createMedia_createServerFn_handler = createServerRpc({
	id: "cc27ee479f2618c3bfef3fc75e7940132e3d1285348a6c2416d042c95b99ee2a",
	name: "createMedia",
	filename: "src/lib/pub/api.ts"
}, (opts) => createMedia.__executeServer(opts));
var createMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(mediaSchema, input)).handler(createMedia_createServerFn_handler, async ({ data, context }) => {
	await requireOwner(context.userId);
	if (data.kind === "image") assertImage(data.src, "Billedet");
	else assertVideo(data.src);
	const sql = await getSql();
	const sort = num((await sql`select coalesce(max(sort), 0) as sort from gallery`)[0]?.sort) + 10;
	await sql`
      insert into gallery (kind, src, caption, sort)
      values (${data.kind}, ${data.src}, ${data.caption}, ${sort})
    `;
	return { ok: true };
});
var updateMedia_createServerFn_handler = createServerRpc({
	id: "9ea103f401acddc24aafa6cb1b2709bff71db06bc73687ed280d5f93c815a174",
	name: "updateMedia",
	filename: "src/lib/pub/api.ts"
}, (opts) => updateMedia.__executeServer(opts));
var updateMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(mediaSchema.extend({ id: number().int().positive() }), input)).handler(updateMedia_createServerFn_handler, async ({ data, context }) => {
	await requireOwner(context.userId);
	if (data.kind === "image") assertImage(data.src, "Billedet");
	else assertVideo(data.src);
	await (await getSql())`
      update gallery set kind = ${data.kind}, src = ${data.src}, caption = ${data.caption}
      where id = ${data.id}
    `;
	return { ok: true };
});
var deleteMedia_createServerFn_handler = createServerRpc({
	id: "9ff606b3eb8f4538c2860608b0de80a822c8a055e497ca408dd4b527b1e93636",
	name: "deleteMedia",
	filename: "src/lib/pub/api.ts"
}, (opts) => deleteMedia.__executeServer(opts));
var deleteMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(object({ id: number().int().positive() }), input)).handler(deleteMedia_createServerFn_handler, async ({ data, context }) => {
	await requireOwner(context.userId);
	await (await getSql())`delete from gallery where id = ${data.id}`;
	return { ok: true };
});
var moveItem_createServerFn_handler = createServerRpc({
	id: "652d9b23d48a6175d3f0d00011770c6eddccde5b2e8dd34698b379b496739bfe",
	name: "moveItem",
	filename: "src/lib/pub/api.ts"
}, (opts) => moveItem.__executeServer(opts));
var moveItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(object({
	table: _enum(["prices", "gallery"]),
	id: number().int().positive(),
	dir: _enum(["up", "down"])
}), input)).handler(moveItem_createServerFn_handler, async ({ data, context }) => {
	await requireOwner(context.userId);
	const sql = await getSql();
	const list = (data.table === "prices" ? await sql`select id, sort from prices order by sort, id` : await sql`select id, sort from gallery order by sort, id`).map((row) => ({
		id: num(row.id),
		sort: num(row.sort)
	}));
	const index = list.findIndex((row) => row.id === data.id);
	const nextIndex = data.dir === "up" ? index - 1 : index + 1;
	if (index < 0 || nextIndex < 0 || nextIndex >= list.length) return { ok: true };
	const swapped = list.slice();
	const [item] = swapped.splice(index, 1);
	if (!item) return { ok: true };
	swapped.splice(nextIndex, 0, item);
	for (let i = 0; i < swapped.length; i += 1) {
		const sort = (i + 1) * 10;
		const id = swapped[i]?.id;
		if (!id) continue;
		if (data.table === "prices") await sql`update prices set sort = ${sort} where id = ${id}`;
		else await sql`update gallery set sort = ${sort} where id = ${id}`;
	}
	return { ok: true };
});
//#endregion
export { claimSite_createServerFn_handler, createEvent_createServerFn_handler, createMedia_createServerFn_handler, createPrice_createServerFn_handler, deleteEvent_createServerFn_handler, deleteMedia_createServerFn_handler, deletePrice_createServerFn_handler, getEditor_createServerFn_handler, getPub_createServerFn_handler, moveItem_createServerFn_handler, updateEvent_createServerFn_handler, updateMedia_createServerFn_handler, updatePrice_createServerFn_handler, updateSite_createServerFn_handler };
