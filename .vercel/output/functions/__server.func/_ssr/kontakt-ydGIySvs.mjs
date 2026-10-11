import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as osmLink, l as mapsLink, m as phoneHref, t as MAP_SRC } from "./format-DQk0TUU0.mjs";
import { n as Shell, r as usePub } from "./shell-BW6AaO-t.mjs";
import { i as Kicker, o as PageIntro, r as HoursTable } from "./content-DuCc7oUk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kontakt-ydGIySvs.js
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const { site, weekday } = usePub();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "Kontakt",
			title: "Kig forbi",
			lede: `${site.address}, ${site.city}. Ring, hvis du vil høre, om der er plads til selskabet.`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: phoneHref(site.phone),
					className: "font-display text-5xl leading-none sm:text-6xl",
					children: site.phone
				}),
				site.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `mailto:${site.email}`,
					className: "mt-4 block text-lg text-brass",
					children: site.email
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-lg",
					children: [
						site.address,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						site.city
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: mapsLink(site.address, site.city),
						className: "inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-paper",
						children: "Rutevejledning"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: osmLink(),
						className: "inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-semibold",
						children: "Åbn kort"
					})]
				}),
				(site.facebook || site.instagram) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Sociale medier" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2",
						children: [site.facebook ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "text-lg",
							href: site.facebook,
							children: "Facebook"
						}) }) : null, site.instagram ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "text-lg",
							href: site.instagram,
							children: "Instagram"
						}) }) : null]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Åbningstider" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoursTable, {
						hours: site.hours,
						weekday,
						note: site.hoursNote
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				title: "Kort til Sanderum Pubben, Sanderumvej 1",
				src: MAP_SRC,
				className: "h-96 w-full rounded-card border border-line",
				loading: "lazy"
			})]
		})]
	}) });
}
//#endregion
export { ContactPage as component };
