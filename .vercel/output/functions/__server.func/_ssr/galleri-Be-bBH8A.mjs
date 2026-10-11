import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Shell, r as usePub } from "./shell-BW6AaO-t.mjs";
import { n as GalleryGrid, o as PageIntro } from "./content-DuCc7oUk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/galleri-Be-bBH8A.js
var import_jsx_runtime = require_jsx_runtime();
function GalleryPage() {
	const { gallery } = usePub();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "Galleri",
			title: "Billeder og film",
			lede: "Billard, dart, terrasse og baren. Ejeren kan lægge nye billeder og videoer ind."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-6xl px-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryGrid, { items: gallery })
		})]
	}) });
}
//#endregion
export { GalleryPage as component };
