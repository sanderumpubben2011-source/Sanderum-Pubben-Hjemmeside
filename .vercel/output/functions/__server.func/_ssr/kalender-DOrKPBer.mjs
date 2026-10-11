import { o as __toESM } from "../_runtime.mjs";
import { Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as longDate, d as monthLabel, g as upcomingEvents, u as monthCells } from "./format-DQk0TUU0.mjs";
import { n as Shell, r as usePub } from "./shell-BW6AaO-t.mjs";
import { a as Note, o as PageIntro } from "./content-DuCc7oUk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kalender-DOrKPBer.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HEADS = [
	"Ma",
	"Ti",
	"On",
	"To",
	"Fr",
	"Lø",
	"Sø"
];
function MonthCalendar({ events, today }) {
	const [startYear, startMonth] = today.split("-").map(Number);
	const [cursor, setCursor] = (0, import_react.useState)({
		year: startYear || 2026,
		month: startMonth || 1
	});
	const [selected, setSelected] = (0, import_react.useState)(today);
	const cells = monthCells(cursor.year, cursor.month);
	const byDay = /* @__PURE__ */ new Map();
	for (const event of events) {
		const list = byDay.get(event.eventDate) ?? [];
		list.push(event);
		byDay.set(event.eventDate, list);
	}
	const chosen = byDay.get(selected) ?? [];
	function shift(delta) {
		setCursor((current) => {
			const date = new Date(Date.UTC(current.year, current.month - 1 + delta, 1));
			return {
				year: date.getUTCFullYear(),
				month: date.getUTCMonth() + 1
			};
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-[1.3fr_0.7fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-card border border-line bg-paper-2 p-4 sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 rounded-full border border-line px-4",
							onClick: () => shift(-1),
							children: "Forrige"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: monthLabel(cursor.year, cursor.month)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 rounded-full border border-line px-4",
							onClick: () => shift(1),
							children: "Næste"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-1 text-center text-xs tracking-widest text-muted uppercase",
					children: HEADS.map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-2",
						children: label
					}, label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-1",
					children: cells.map((cell, index) => {
						if (!cell.iso || !cell.day) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}, `e-${index}`);
						const has = (byDay.get(cell.iso) ?? []).length > 0;
						const active = cell.iso === selected;
						const isToday = cell.iso === today;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSelected(cell.iso),
							className: `flex min-h-12 flex-col items-center justify-center rounded-2xl text-sm tabular-nums ${active ? "bg-walnut text-cream" : isToday ? "border border-brass-solid" : "hover:bg-paper"}`,
							children: [cell.day, has ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-1 h-1.5 w-1.5 rounded-full ${active ? "bg-brass-solid" : "bg-brass"}` }) : null]
						}, cell.iso);
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "rounded-card border border-line p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-brass",
				children: longDate(selected)
			}), chosen.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-5",
				children: chosen.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl",
						children: event.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm tabular-nums text-muted",
						children: [event.startTime, event.endTime ? `–${event.endTime}` : ""]
					}),
					event.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-6",
						children: event.description
					}) : null
				] }, event.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted",
				children: "Ingen aftener den dag. Baren kan stadig være åben."
			})]
		})]
	});
}
function CalendarPage() {
	const { site, events, today } = usePub();
	const next = upcomingEvents(events, today);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "Kalender",
			title: "Hvad der sker",
			lede: next[0] ? `Næste gang er ${next[0].title.toLowerCase()}. Resten ligger i måneden herunder.` : "Der er ingen kommende aftener lagt ind endnu."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl space-y-6 px-5",
			children: [!site.calendarLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Aftenerne herunder er eksempler, indtil ejeren har bekræftet programmet. Spørg i baren, eller ring, hvis du vil være sikker." }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthCalendar, {
				events,
				today
			})]
		})]
	}) });
}
//#endregion
export { CalendarPage as component };
