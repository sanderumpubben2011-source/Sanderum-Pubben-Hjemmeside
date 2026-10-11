import { o as __toESM } from "../_runtime.mjs";
import { C as useRouter, Z as require_react, _ as lazyRouteComponent, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, v as createFileRoute, w as require_jsx_runtime, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BnXcl8v6.mjs";
import { bn as union, cn as _enum, dn as boolean, gn as object, hn as number, pn as literal, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-Bx0G2JrM.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BdJWMHQw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var getPub = createServerFn({ method: "GET" }).handler(createSsrRpc("d544a0d14115f95a3d9f80227803d1acd7b98bf15e0b2698768cb5cd3fb8cd75"));
var getEditor = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9bde071436748d638bc1762db7917fdec4bcfd5f07581ef3db9cc331524c1e43"));
var claimSite = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("a2b756616332a2c6dda85af1e7ac107676a96d76e4d5dc29aacd63171788e4cd"));
var updateSite = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(siteSchema, input)).handler(createSsrRpc("a5fedf997f485a774bbb6cd7bffb49f84ab1e48385ea7adaa41c4072ad5907a2"));
var createEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(eventSchema, input)).handler(createSsrRpc("850f1f06ebb75facea4e02c653ac13ddd19dfe1da794ecd35a77f53fd813b597"));
var updateEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(eventSchema.extend({ id: number().int().positive() }), input)).handler(createSsrRpc("cf872a58857f88898b14f22c36189b8e98fe3b7cc3cca7e46b6d7c95a89c6915"));
var deleteEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(object({ id: number().int().positive() }), input)).handler(createSsrRpc("90890aa5f73b63470f965bfa1a2a7a7b9132c1b35cc56ae23e615b75f46b228f"));
var createPrice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(priceSchema, input)).handler(createSsrRpc("9a7559737ca5a9b1a6699e152bcaf87754241f584698dea7d769671749d86ebb"));
var updatePrice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(priceSchema.extend({ id: number().int().positive() }), input)).handler(createSsrRpc("dd7dd769257779ac490f1891b4d6a7413f9c8642658fc5f0f5dd3c9ba7cb4dc9"));
var deletePrice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(object({ id: number().int().positive() }), input)).handler(createSsrRpc("c48e9873ec3c6e5695735469b81c3212d97a93d0ad8610b863e6d29ffbebacb8"));
var createMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(mediaSchema, input)).handler(createSsrRpc("cc27ee479f2618c3bfef3fc75e7940132e3d1285348a6c2416d042c95b99ee2a"));
var updateMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(mediaSchema.extend({ id: number().int().positive() }), input)).handler(createSsrRpc("9ea103f401acddc24aafa6cb1b2709bff71db06bc73687ed280d5f93c815a174"));
var deleteMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(object({ id: number().int().positive() }), input)).handler(createSsrRpc("9ff606b3eb8f4538c2860608b0de80a822c8a055e497ca408dd4b527b1e93636"));
var moveItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => parse(object({
	table: _enum(["prices", "gallery"]),
	id: number().int().positive(),
	dir: _enum(["up", "down"])
}), input)).handler(createSsrRpc("652d9b23d48a6175d3f0d00011770c6eddccde5b2e8dd34698b379b496739bfe"));
var styles_default = "/assets/styles-BhWCk_5O.css";
var Route$8 = createRootRoute({
	beforeLoad: async () => ({ pub: await getPub() }),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Sanderum Pubben · Værtshus i Odense SV" },
			{
				name: "description",
				content: "Sanderum Pubben er et lokalt værtshus på Sanderumvej 1 i Odense SV. Se åbningstider, kalender, priser og kontakt."
			},
			{
				name: "theme-color",
				content: "#261910"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,560;0,9..144,650;1,9..144,560&family=Manrope:wght@400;500;600;700&display=swap"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: RootComponent
});
function RootComponent() {
	const { pub } = Route$8.useRouteContext();
	const backdrop = pub.site.backdrop;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "da",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			"data-theme": pub.site.theme,
			className: "bg-paper text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				backdrop ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": true,
					className: "pointer-events-none fixed inset-0 bg-cover bg-center opacity-20",
					style: { backgroundImage: `url(${JSON.stringify(backdrop)})` }
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$6 = () => import("./routes-BUXN0F2B.mjs");
var Route$7 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Sanderum Pubben · Værtshus i Odense SV" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./ejer-qo8Z6UYa.mjs");
var Route$6 = createFileRoute("/ejer")({
	head: () => ({ meta: [{ title: "Rediger · Sanderum Pubben" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./galleri-Be-bBH8A.mjs");
var Route$5 = createFileRoute("/galleri")({
	head: () => ({ meta: [{ title: "Galleri · Sanderum Pubben" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./kalender-DOrKPBer.mjs");
var Route$4 = createFileRoute("/kalender")({
	head: () => ({ meta: [{ title: "Kalender · Sanderum Pubben" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./kontakt-ydGIySvs.mjs");
var Route$3 = createFileRoute("/kontakt")({
	head: () => ({ meta: [{ title: "Kontakt · Sanderum Pubben" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./login-CNTJMxCj.mjs");
var Route$2 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Ejerlogin · Sanderum Pubben" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./priser-BhfuJwEl.mjs");
var Route$1 = createFileRoute("/priser")({
	head: () => ({ meta: [{ title: "Priser · Sanderum Pubben" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	EjerRoute: Route$6.update({
		id: "/ejer",
		path: "/ejer",
		getParentRoute: () => Route$8
	}),
	GalleriRoute: Route$5.update({
		id: "/galleri",
		path: "/galleri",
		getParentRoute: () => Route$8
	}),
	KalenderRoute: Route$4.update({
		id: "/kalender",
		path: "/kalender",
		getParentRoute: () => Route$8
	}),
	KontaktRoute: Route$3.update({
		id: "/kontakt",
		path: "/kontakt",
		getParentRoute: () => Route$8
	}),
	LoginRoute: Route$2.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$8
	}),
	PriserRoute: Route$1.update({
		id: "/priser",
		path: "/priser",
		getParentRoute: () => Route$8
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { createPrice as a, deletePrice as c, updateEvent as d, updateMedia as f, createMedia as i, getEditor as l, updateSite as m, claimSite as n, deleteEvent as o, updatePrice as p, createEvent as r, deleteMedia as s, router_exports as t, moveItem as u };
