import { o as __toESM } from "../_runtime.mjs";
import { S as Navigate, Z as require_react, b as getRouteApi, p as useRouterState, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as phoneHref } from "./format-DQk0TUU0.mjs";
import { i as signOut } from "./client-1vAx-gM_.mjs";
import { a as hasGateSessionMarker } from "./server-Bx0G2JrM.mjs";
import { r as Menu, t as X } from "../_libs/lucide-react.mjs";
import { n as useCurrentUserState, t as useCurrentUser } from "./use-current-user-B7Cbrtsy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-BW6AaO-t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var root = getRouteApi("__root__");
var NAV = [
	{
		to: "/",
		label: "Hjem"
	},
	{
		to: "/kalender",
		label: "Kalender"
	},
	{
		to: "/priser",
		label: "Priser"
	},
	{
		to: "/galleri",
		label: "Galleri"
	},
	{
		to: "/kontakt",
		label: "Kontakt"
	}
];
function usePub() {
	return root.useRouteContext().pub;
}
function OwnerSlot({ onDark }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-9 w-16 animate-pulse rounded-full bg-cream/15" });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `flex items-center gap-3 ${onDark ? "text-cream" : "text-ink"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/ejer",
			className: "rounded-full bg-brass-solid px-4 py-2 text-sm font-semibold text-walnut",
			children: "Rediger"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "rounded-full border border-cream/30 px-4 py-2 text-sm text-cream",
		children: "Ejer"
	});
}
function Shell({ children }) {
	const { site } = usePub();
	const path = useRouterState({ select: (state) => state.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setOpen(false);
	}, [path]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (event) => {
			if (event.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 border-b border-brass-solid/40 bg-walnut text-cream",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-6xl items-center gap-4 px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: site.logoImage || "/favicon.svg",
								alt: "",
								className: "h-10 w-10 shrink-0 rounded-lg object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate font-display text-xl leading-none",
								children: site.name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "ml-auto hidden items-center gap-1 lg:flex",
							children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								activeOptions: { exact: item.to === "/" },
								className: "rounded-full px-3 py-2 text-sm text-cream/75 hover:text-cream data-[status=active]:bg-cream/10 data-[status=active]:text-cream",
								children: item.label
							}, item.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerSlot, { onDark: true })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ml-auto grid h-11 w-11 place-items-center rounded-full border border-cream/25 lg:hidden",
							"aria-expanded": open,
							"aria-label": open ? "Luk menu" : "Åbn menu",
							onClick: () => setOpen((value) => !value),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
						})
					]
				}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-cream/10 px-5 py-4 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-col",
						children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							activeOptions: { exact: item.to === "/" },
							className: "border-b border-cream/10 py-3 text-lg text-cream data-[status=active]:text-brass-solid",
							children: item.label
						}, item.to))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerSlot, { onDark: true })
					})]
				}) : null]
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-20 bg-walnut text-cream",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl",
							children: site.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-xs text-sm text-cream/75",
							children: site.tagline
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm leading-7",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: site.address }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: site.city }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "mt-2 block text-brass-solid",
									href: phoneHref(site.phone),
									children: site.phone
								}),
								site.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "block text-cream/80",
									href: `mailto:${site.email}`,
									children: site.email
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm leading-7 text-cream/75",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "CVR 33340826" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Siden redigeres af huset." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "text-cream",
									children: "Ejerlogin"
								})
							]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Shell as n, usePub as r, RedirectToSignIn as t };
