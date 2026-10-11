import { w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as upcomingEvents, h as todayHours, m as phoneHref, p as paragraphs } from "./format-DQk0TUU0.mjs";
import { n as Shell, r as usePub } from "./shell-BW6AaO-t.mjs";
import { a as Note, i as Kicker, n as GalleryGrid, r as HoursTable, s as PriceMenu, t as EventCards } from "./content-DuCc7oUk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BUXN0F2B.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { site, events, prices, gallery, today, weekday, openNow } = usePub();
	const next = upcomingEvents(events, today).slice(0, 3);
	const previewPrices = prices.slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "order-2 flex flex-col justify-center px-5 py-14 lg:order-1 lg:px-10 lg:py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Værtshus · Odense SV · siden 2011" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-6xl leading-none sm:text-7xl",
						children: site.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-md text-lg leading-8 text-muted",
						children: site.tagline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/kalender",
							className: "inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-paper",
							children: "Se kalenderen"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: phoneHref(site.phone),
							className: "inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-semibold",
							children: ["Ring ", site.phone]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-8 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-3 inline-flex min-h-8 items-center rounded-full bg-walnut px-3 text-cream",
							children: openNow ? "Åben nu" : "Lukket lige nu"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: todayHours(site.hours, weekday)
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "order-1 lg:order-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: site.heroImage,
					alt: "Baren på Sanderum Pubben",
					className: "h-80 w-full object-cover sm:h-96 lg:h-full lg:min-h-screen"
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Huset" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-4xl",
					children: "Stamstedet på Sanderumvej"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-4 text-lg leading-8",
					children: paragraphs(site.about).map((part) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: part }, part.slice(0, 24)))
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Åbent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoursTable, {
					hours: site.hours,
					weekday,
					note: site.hoursNote
				})
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-line bg-paper-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-6xl gap-px sm:grid-cols-2 lg:grid-cols-4",
				children: [
					[
						"01",
						"Billard",
						"Et bord til en rolig omgang, eller til turneringen når den er sat."
					],
					[
						"02",
						"Dart",
						"Tavlen hænger klar. 501, og plads til nye spillere."
					],
					[
						"03",
						"Rafle",
						"Terningerne kommer frem, når selskabet er til det."
					],
					[
						"04",
						"Terrasse",
						"Borde ude foran, når vejret på Sanderumvej er med."
					]
				].map(([n, title, text]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "px-5 py-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl text-brass",
							children: n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 font-display text-2xl",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-6 text-muted",
							children: text
						})
					]
				}, n))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-5 py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Kalender" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-4xl",
						children: "Det næste"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/kalender",
						className: "text-sm font-semibold text-brass",
						children: "Hele kalenderen"
					})]
				}),
				!site.calendarLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Programmet er eksempler, så kalenderen ikke står tom. Huset bekræfter de rigtige aftener. Ring gerne, hvis du er i tvivl." })
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCards, { events: next })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-5 pb-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Kortet" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-4xl",
						children: "Et udpluk"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/priser",
						className: "text-sm font-semibold text-brass",
						children: "Alle priser"
					})]
				}),
				!site.pricesLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Tallene er et vejledende startkort, indtil huset har bekræftet priserne. Spørg i baren." })
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceMenu, { prices: previewPrices })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-5 pb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Billeder" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-4xl",
					children: "Inde fra huset"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/galleri",
					className: "text-sm font-semibold text-brass",
					children: "Galleri"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryGrid, { items: gallery.slice(0, 4) })]
		})
	] }) });
}
//#endregion
export { Home as component };
