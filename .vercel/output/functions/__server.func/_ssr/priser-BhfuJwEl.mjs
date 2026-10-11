import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Shell, r as usePub } from "./shell-BW6AaO-t.mjs";
import { a as Note, o as PageIntro, s as PriceMenu } from "./content-DuCc7oUk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/priser-BhfuJwEl.js
var import_jsx_runtime = require_jsx_runtime();
function PricesPage() {
	const { site, prices } = usePub();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "Priser",
			title: "Kortet",
			lede: "Øl, snaps, vin og det enkle køkken. Tallene sættes af huset."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl space-y-8 px-5",
			children: [!site.pricesLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: "Det her er et vejledende startkort, så siden ikke står tom. Ejeren retter priserne, så de matcher baren. Spørg, hvis du er i tvivl." }) : site.pricesNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, { children: site.pricesNote }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceMenu, { prices })]
		})]
	}) });
}
//#endregion
export { PricesPage as component };
