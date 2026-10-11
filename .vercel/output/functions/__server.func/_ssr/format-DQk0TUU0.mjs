//#region node_modules/.nitro/vite/services/ssr/assets/format-DQk0TUU0.js
var WEEK = {
	Mon: "Mandag",
	Tue: "Tirsdag",
	Wed: "Onsdag",
	Thu: "Torsdag",
	Fri: "Fredag",
	Sat: "Lørdag",
	Sun: "Søndag"
};
function cap(value) {
	return value ? value.charAt(0).toLocaleUpperCase("da-DK") + value.slice(1) : value;
}
function copenhagenNow(date = /* @__PURE__ */ new Date()) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Europe/Copenhagen",
		weekday: "short",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(date);
	const pick = (type) => parts.find((part) => part.type === type)?.value ?? "";
	return {
		weekday: WEEK[pick("weekday")] ?? "Mandag",
		iso: `${pick("year")}-${pick("month")}-${pick("day")}`,
		minuteOfDay: Number(pick("hour")) * 60 + Number(pick("minute"))
	};
}
function minutes(hhmm) {
	const [h, m] = hhmm.split(":").map(Number);
	if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
	return h * 60 + m;
}
function isOpenAt(hours, weekday, minuteOfDay) {
	const row = hours.find((item) => item.day.toLowerCase() === weekday.toLowerCase());
	if (!row || row.closed) return false;
	const open = minutes(row.open);
	const close = minutes(row.close);
	if (open == null || close == null) return false;
	if (close > open) return minuteOfDay >= open && minuteOfDay < close;
	return minuteOfDay >= open || minuteOfDay < close;
}
function todayHours(hours, weekday) {
	const row = hours.find((item) => item.day.toLowerCase() === weekday.toLowerCase());
	if (!row || row.closed) return "Lukket i dag";
	return `I dag ${row.open}–${row.close}`;
}
function longDate(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	if (!y || !m || !d) return iso;
	const dt = new Date(Date.UTC(y, m - 1, d, 12));
	return cap(new Intl.DateTimeFormat("da-DK", {
		timeZone: "UTC",
		weekday: "long",
		day: "numeric",
		month: "long"
	}).format(dt));
}
function monthLabel(year, month) {
	const dt = new Date(Date.UTC(year, month - 1, 1, 12));
	return cap(new Intl.DateTimeFormat("da-DK", {
		timeZone: "UTC",
		month: "long",
		year: "numeric"
	}).format(dt));
}
var WD_INDEX = {
	Mon: 0,
	Tue: 1,
	Wed: 2,
	Thu: 3,
	Fri: 4,
	Sat: 5,
	Sun: 6
};
function monthCells(year, month) {
	const first = new Date(Date.UTC(year, month - 1, 1, 12));
	const pad = WD_INDEX[new Intl.DateTimeFormat("en-GB", {
		timeZone: "UTC",
		weekday: "short"
	}).format(first)] ?? 0;
	const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
	const cells = [];
	for (let i = 0; i < pad; i += 1) cells.push({
		iso: null,
		day: null
	});
	for (let day = 1; day <= count; day += 1) {
		const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
		cells.push({
			iso,
			day
		});
	}
	while (cells.length % 7 !== 0) cells.push({
		iso: null,
		day: null
	});
	return cells;
}
function upcomingEvents(events, today) {
	return events.filter((event) => event.eventDate >= today).sort((a, b) => a.eventDate.localeCompare(b.eventDate) || a.startTime.localeCompare(b.startTime));
}
function kroner(value) {
	return `${new Intl.NumberFormat("da-DK").format(value)} kr`;
}
function groupPrices(prices) {
	const order = [];
	const map = /* @__PURE__ */ new Map();
	const sorted = [...prices].sort((a, b) => a.sort - b.sort || a.id - b.id);
	for (const price of sorted) {
		if (!map.has(price.category)) {
			map.set(price.category, []);
			order.push(price.category);
		}
		map.get(price.category)?.push(price);
	}
	return order.map((category) => ({
		category,
		items: map.get(category) ?? []
	}));
}
function phoneHref(phone) {
	const digits = phone.replace(/\D/g, "");
	if (digits.length === 8) return `tel:+45${digits}`;
	if (digits.startsWith("45")) return `tel:+${digits}`;
	return `tel:+${digits}`;
}
function paragraphs(text) {
	return text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
}
var MAP_SRC = "https://www.openstreetmap.org/export/embed.html?bbox=10.346072%2C55.362848%2C10.366072%2C55.372848&layer=mapnik&marker=55.367848%2C10.356072";
function mapsLink(address, city) {
	return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${address}, ${city}`)}`;
}
function osmLink() {
	return "https://www.openstreetmap.org/?mlat=55.367848&mlon=10.356072#map=17/55.367848/10.356072";
}
function videoView(src) {
	const yt = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
	if (yt) return {
		type: "youtube",
		src: `https://www.youtube-nocookie.com/embed/${yt[1]}`
	};
	const vimeo = src.match(/vimeo\.com\/(\d+)/);
	if (vimeo) return {
		type: "vimeo",
		src: `https://player.vimeo.com/video/${vimeo[1]}`
	};
	if (src.startsWith("/media/") || /\.mp4($|\?)/.test(src)) return {
		type: "file",
		src
	};
	return {
		type: "link",
		src
	};
}
async function fileToImageData(file) {
	if (!file.type.startsWith("image/")) throw new Error("Vælg et billede.");
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(bitmap.width * scale));
	canvas.height = Math.max(1, Math.round(bitmap.height * scale));
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Kunne ikke læse billedet.");
	ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();
	let url = canvas.toDataURL("image/jpeg", .82);
	if (url.length > 14e5) url = canvas.toDataURL("image/jpeg", .6);
	if (url.length > 15e5) throw new Error("Billedet er stadig for stort. Prøv et mindre.");
	return url;
}
function errText(error) {
	if (error instanceof Error && error.message) return error.message;
	return "Noget gik galt. Prøv igen.";
}
//#endregion
export { videoView as _, groupPrices as a, longDate as c, monthLabel as d, osmLink as f, upcomingEvents as g, todayHours as h, fileToImageData as i, mapsLink as l, phoneHref as m, copenhagenNow as n, isOpenAt as o, paragraphs as p, errText as r, kroner as s, MAP_SRC as t, monthCells as u };
