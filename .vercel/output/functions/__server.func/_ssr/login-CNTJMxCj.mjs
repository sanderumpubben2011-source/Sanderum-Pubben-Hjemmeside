import { o as __toESM } from "../_runtime.mjs";
import { S as Navigate, Z as require_react, w as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
import { t as GROK_PROVIDERS } from "./server-Bx0G2JrM.mjs";
import { n as useCurrentUserState } from "./use-current-user-B7Cbrtsy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CNTJMxCj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { className: "min-h-dvh bg-walnut" });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/ejer" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginForm, {});
}
function LoginForm() {
	const [mode, setMode] = (0, import_react.useState)("ind");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		try {
			if (mode === "opret") {
				const { error: signError } = await authClient.signUp.email({
					email,
					password,
					name: name || "Ejer",
					callbackURL: "/ejer"
				});
				if (signError) throw new Error(signError.message || "Kunne ikke oprette kontoen.");
			} else {
				const { error: signError } = await authClient.signIn.email({
					email,
					password,
					callbackURL: "/ejer"
				});
				if (signError) throw new Error(signError.message || "Kunne ikke logge ind.");
			}
			window.location.href = "/ejer";
		} catch (err) {
			setError(danishAuth(err instanceof Error ? err.message : "Noget gik galt."));
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid min-h-dvh lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col justify-center bg-paper px-6 py-16 text-ink",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-sm text-muted",
						children: "Tilbage til pubben"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-6 font-display text-5xl leading-none",
						children: "Ejerlogin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-6 text-muted",
						children: "Log ind for at lægge events ind, rette priser og skifte billeder, logo og baggrund. Den første konto, der overtager siden, bliver ejer."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid grid-cols-2 rounded-full bg-paper-2 p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `min-h-11 rounded-full text-sm ${mode === "ind" ? "bg-walnut text-cream" : ""}`,
							onClick: () => setMode("ind"),
							children: "Log ind"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `min-h-11 rounded-full text-sm ${mode === "opret" ? "bg-walnut text-cream" : ""}`,
							onClick: () => setMode("opret"),
							children: "Opret konto"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-6 space-y-3",
						onSubmit,
						children: [
							mode === "opret" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["Navn", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3",
									value: name,
									onChange: (event) => setName(event.target.value),
									autoComplete: "name"
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["E-mail", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									required: true,
									className: "mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3",
									value: email,
									onChange: (event) => setEmail(event.target.value),
									autoComplete: "email"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["Adgangskode", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									required: true,
									minLength: 8,
									className: "mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3",
									value: password,
									onChange: (event) => setPassword(event.target.value),
									autoComplete: mode === "opret" ? "new-password" : "current-password"
								})]
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-brass",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								className: "min-h-11 w-full rounded-full bg-ink text-sm font-semibold text-paper disabled:opacity-60",
								children: busy ? "Vent…" : mode === "opret" ? "Opret og fortsæt" : "Log ind"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-6 flex items-center gap-3 text-xs tracking-widest text-muted uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" }),
							"eller",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "min-h-11 w-full rounded-full border border-line text-sm",
							onClick: () => {
								signIn(provider.providerId, { callbackURL: "/ejer" }).catch((err) => {
									setError(err instanceof Error ? err.message : "Login fejlede.");
								});
							},
							children: ["Fortsæt med ", provider.label]
						}, provider.providerId))
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/media/hero.jpg",
			alt: "",
			className: "hidden h-full w-full object-cover lg:block"
		})]
	});
}
function danishAuth(message) {
	const text = message.toLowerCase();
	if (text.includes("already") || text.includes("exist")) return "Der findes allerede en konto med den e-mail.";
	if (text.includes("password") || text.includes("invalid") || text.includes("credential")) return "Tjek e-mail og adgangskode. Den skal være mindst 8 tegn.";
	return message;
}
//#endregion
export { LoginPage as component };
