import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as videoView, a as groupPrices, c as longDate, s as kroner } from "./format-DQk0TUU0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content-DuCc7oUk.js
var import_jsx_runtime = require_jsx_runtime();
function Kicker({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs font-semibold tracking-widest text-brass uppercase",
		children
	});
}
function Note({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "border-l-4 border-brass-solid bg-paper-2 px-4 py-3 text-sm leading-6",
		children
	});
}
function HoursTable({ hours, weekday, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-line",
		children: hours.map((row) => {
			const today = row.day.toLowerCase() === weekday.toLowerCase();
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: `flex items-center justify-between gap-4 py-3 ${today ? "font-semibold" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.day }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums text-muted",
					children: [row.closed ? "Lukket" : `${row.open}–${row.close}`, today ? " · i dag" : ""]
				})]
			}, row.day);
		})
	}), note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-4 text-sm text-muted",
		children: note
	}) : null] });
}
function PriceMenu({ prices }) {
	const groups = groupPrices(prices);
	if (!groups.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Kortet er tomt. Ejeren kan lægge priser ind."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-12 lg:grid-cols-2",
		children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-3xl",
			children: group.category
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4",
			children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-baseline gap-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block",
						children: item.name
					}), item.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm text-muted",
						children: item.note
					}) : null] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mb-1 min-w-6 flex-1 border-b border-dotted border-line" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl tabular-nums",
						children: kroner(item.priceKr)
					})
				]
			}, item.id))
		})] }, group.category))
	});
}
function EventCards({ events }) {
	if (!events.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Ingen kommende aftener i kalenderen. Kig forbi alligevel, eller ring til huset."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-5 md:grid-cols-3",
		children: events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "overflow-hidden rounded-card border border-line bg-paper-2",
			children: [event.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: event.image,
				alt: "",
				className: "h-44 w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 bg-walnut" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-brass",
						children: longDate(event.eventDate)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 font-display text-2xl",
						children: event.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm tabular-nums text-muted",
						children: [event.startTime, event.endTime ? `–${event.endTime}` : ""]
					}),
					event.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-6",
						children: event.description
					}) : null
				]
			})]
		}, event.id))
	});
}
function MediaTile({ item, large }) {
	const frame = item.kind === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: item.src,
		alt: item.caption || "Billede fra Sanderum Pubben",
		className: `w-full object-cover ${large ? "h-80 sm:h-96" : "h-64"}`
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { item });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "overflow-hidden rounded-card border border-line bg-paper-2",
		children: [frame, item.caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
			className: "px-4 py-3 text-sm",
			children: item.caption
		}) : null]
	});
}
function Video({ item }) {
	const view = videoView(item.src);
	if (view.type === "file") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		src: view.src,
		controls: true,
		playsInline: true,
		poster: "/media/hero.jpg",
		className: "aspect-video w-full bg-walnut object-cover"
	});
	if (view.type === "youtube" || view.type === "vimeo") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
		src: view.src,
		title: item.caption || "Video",
		className: "aspect-video w-full",
		allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
		allowFullScreen: true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: view.src,
		className: "grid aspect-video place-items-center bg-walnut px-6 text-center text-cream",
		children: "Se videoen"
	});
}
function GalleryGrid({ items }) {
	if (!items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Galleri kommer, når huset lægger billeder ind."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
		children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: index === 0 ? "sm:col-span-2" : void 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaTile, {
				item,
				large: index === 0
			})
		}, item.id))
	});
}
function PageIntro({ kicker, title, lede }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mx-auto max-w-6xl px-5 pt-14 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: kicker }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 max-w-3xl font-display text-5xl leading-none sm:text-6xl",
				children: title
			}),
			lede ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-2xl text-lg leading-8 text-muted",
				children: lede
			}) : null
		]
	});
}
//#endregion
export { Note as a, Kicker as i, GalleryGrid as n, PageIntro as o, HoursTable as r, PriceMenu as s, EventCards as t };
