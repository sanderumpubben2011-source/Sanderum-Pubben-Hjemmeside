import { o as __toESM } from "../_runtime.mjs";
import { C as useRouter, Z as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as fileToImageData, r as errText, s as kroner } from "./format-DQk0TUU0.mjs";
import { a as createPrice, c as deletePrice, d as updateEvent, f as updateMedia, i as createMedia, l as getEditor, m as updateSite, n as claimSite, o as deleteEvent, p as updatePrice, r as createEvent, s as deleteMedia, u as moveItem } from "./router-BdJWMHQw.mjs";
import { n as useCurrentUserState } from "./use-current-user-B7Cbrtsy.mjs";
import { n as Shell, t as RedirectToSignIn } from "./shell-BW6AaO-t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ejer-qo8Z6UYa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var field = "mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3 text-ink";
function EditorPage() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto min-h-[50vh] max-w-3xl px-5 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-48 animate-pulse rounded-full bg-paper-2" })
	}) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, { userId: user.id });
}
function Editor({ userId }) {
	const router = useRouter();
	const [pack, setPack] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [panel, setPanel] = (0, import_react.useState)("hus");
	const [error, setError] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function refresh() {
		const next = await getEditor();
		setPack(next);
		setDraft(next.site);
		await router.invalidate();
	}
	(0, import_react.useEffect)(() => {
		let cancel = false;
		getEditor().then((next) => {
			if (cancel) return;
			setPack(next);
			setDraft(next.site);
		}).catch((err) => {
			if (!cancel) setError(errText(err));
		});
		return () => {
			cancel = true;
		};
	}, [userId]);
	async function run(task) {
		setBusy(true);
		setError("");
		setMessage("");
		try {
			await task();
			await refresh();
			setMessage("Gemt.");
		} catch (err) {
			setError(errText(err));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-5 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-widest text-brass uppercase",
				children: "Ejer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl leading-none",
				children: "Rediger huset"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-6 text-muted",
				children: "Her lægger du events ind, retter priser og skifter billeder, video, logo og baggrund."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-brass",
				children: error
			}) : null,
			message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm",
				children: message
			}) : null,
			!pack || !draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-muted",
				children: "Henter…"
			}) : pack.role === "anden" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 rounded-card border border-line bg-paper-2 p-5",
				children: "Siden har allerede en ejer. Du er logget ind med en anden konto."
			}) : pack.role === "ledig" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-card border border-line bg-paper-2 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: "Overtag siden"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-6 text-muted",
						children: "Den første, der overtager siden, kan redigere alt. Det bør være huset."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						className: "mt-5 min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper",
						onClick: () => void run(() => claimSite()),
						children: "Overtag som ejer"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex gap-2 overflow-x-auto",
				children: [
					["hus", "Huset"],
					["kalender", "Kalender"],
					["priser", "Priser"],
					["galleri", "Billeder"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setPanel(id);
						setMessage("");
						setError("");
					},
					className: `min-h-11 shrink-0 rounded-full px-4 text-sm ${panel === id ? "bg-walnut text-cream" : "border border-line"}`,
					children: label
				}, id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [
					panel === "hus" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HouseForm, {
						draft,
						setDraft,
						busy,
						onSave: () => run(() => updateSite({ data: draft }))
					}) : null,
					panel === "kalender" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarForm, {
						pack,
						busy,
						run
					}) : null,
					panel === "priser" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceForm, {
						pack,
						busy,
						run
					}) : null,
					panel === "galleri" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryForm, {
						pack,
						busy,
						run
					}) : null
				]
			})] })
		]
	}) });
}
function HouseForm({ draft, setDraft, busy, onSave }) {
	function patch(partial) {
		setDraft({
			...draft,
			...partial
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: (event) => {
			event.preventDefault();
			onSave();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm",
				children: ["Navn", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: field,
					value: draft.name,
					onChange: (event) => patch({ name: event.target.value })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm",
				children: ["Undertitel", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: field,
					value: draft.tagline,
					onChange: (event) => patch({ tagline: event.target.value })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm",
				children: ["Om huset", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: `${field} min-h-40`,
					value: draft.about,
					onChange: (event) => patch({ about: event.target.value })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Telefon", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field,
							value: draft.phone,
							onChange: (event) => patch({ phone: event.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["E-mail", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field,
							value: draft.email,
							onChange: (event) => patch({ email: event.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Adresse", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field,
							value: draft.address,
							onChange: (event) => patch({ address: event.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["By", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field,
							value: draft.city,
							onChange: (event) => patch({ city: event.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Facebook", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field,
							placeholder: "@side eller link",
							value: draft.facebook,
							onChange: (event) => patch({ facebook: event.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Instagram", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field,
							placeholder: "@navn eller link",
							value: draft.instagram,
							onChange: (event) => patch({ instagram: event.target.value })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
				className: "text-sm",
				children: "Baggrund"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-3 gap-2",
				children: [
					["papir", "Papir"],
					["nat", "Nat"],
					["filt", "Filt"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => patch({ theme: id }),
					className: `min-h-11 rounded-full border text-sm ${draft.theme === id ? "border-brass-solid bg-walnut text-cream" : "border-line"}`,
					children: label
				}, id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePicker, {
				label: "Forsidebillede",
				value: draft.heroImage,
				onChange: (heroImage) => patch({ heroImage })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePicker, {
				label: "Logo",
				value: draft.logoImage,
				onChange: (logoImage) => patch({ logoImage })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePicker, {
				label: "Baggrundsbillede",
				value: draft.backdrop,
				onChange: (backdrop) => patch({ backdrop })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Logo og baggrund kan stå tomme. Så bruges husets mærke og den valgte farve."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: "Åbningstider"
				}), draft.hours.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-24 text-sm",
							children: row.day
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "time",
							className: "rounded-xl border border-line bg-paper px-2 py-2",
							value: row.open,
							disabled: row.closed,
							onChange: (event) => patch({ hours: setHour(draft.hours, index, { open: event.target.value }) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "time",
							className: "rounded-xl border border-line bg-paper px-2 py-2",
							value: row.close,
							disabled: row.closed,
							onChange: (event) => patch({ hours: setHour(draft.hours, index, { close: event.target.value }) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: row.closed,
								onChange: (event) => patch({ hours: setHour(draft.hours, index, { closed: event.target.checked }) })
							}), "Lukket"]
						})
					]
				}, row.day))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm",
				children: ["Note til åbningstider", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: field,
					value: draft.hoursNote,
					onChange: (event) => patch({ hoursNote: event.target.value })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm",
				children: ["Note til priser", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: field,
					value: draft.pricesNote,
					onChange: (event) => patch({ pricesNote: event.target.value })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: busy,
				className: "min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper",
				children: "Gem huset"
			})
		]
	});
}
function setHour(hours, index, partial) {
	return hours.map((row, i) => i === index ? {
		...row,
		...partial
	} : row);
}
function ImagePicker({ label, value, onChange }) {
	const [localError, setLocalError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: label
		}),
		value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: value,
			alt: "",
			className: "mt-2 h-36 w-full rounded-card object-cover"
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			accept: "image/*",
			className: "mt-2 block w-full text-sm",
			onChange: (event) => {
				const file = event.target.files?.[0];
				if (!file) return;
				fileToImageData(file).then(onChange).catch((err) => setLocalError(errText(err)));
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: field,
			placeholder: "eller https-link",
			value: value.startsWith("data:") ? "" : value,
			onChange: (event) => onChange(event.target.value)
		}),
		value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "mt-2 text-sm text-brass",
			onClick: () => onChange(""),
			children: "Fjern"
		}) : null,
		localError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-brass",
			children: localError
		}) : null
	] });
}
function CalendarForm({ pack, busy, run }) {
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		description: "",
		eventDate: pack.today,
		startTime: "19:00",
		endTime: "22:00",
		image: ""
	});
	const [editing, setEditing] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-card border border-line bg-paper-2 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-6",
					children: pack.site.calendarLive ? "Kalenderen vises som husets program." : "Gæster kan se, at aftenerne er eksempler, indtil du bekræfter programmet."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					className: "mt-3 min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper",
					onClick: () => void run(() => updateSite({ data: {
						...pack.site,
						calendarLive: !pack.site.calendarLive
					} })),
					children: pack.site.calendarLive ? "Vis som foreløbigt igen" : "Bekræft at det her er programmet"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (event) => {
					event.preventDefault();
					const payload = {
						...form,
						endTime: form.endTime
					};
					run(async () => {
						if (editing) await updateEvent({ data: {
							...payload,
							id: editing
						} });
						else await createEvent({ data: payload });
						setEditing(null);
						setForm({
							...form,
							title: "",
							description: "",
							image: ""
						});
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: editing ? "Ret event" : "Nyt event"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: field,
						placeholder: "Titel",
						required: true,
						value: form.title,
						onChange: (event) => setForm({
							...form,
							title: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: `${field} min-h-24`,
						placeholder: "Beskrivelse",
						value: form.description,
						onChange: (event) => setForm({
							...form,
							description: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								className: field,
								required: true,
								value: form.eventDate,
								onChange: (event) => setForm({
									...form,
									eventDate: event.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "time",
								className: field,
								required: true,
								value: form.startTime,
								onChange: (event) => setForm({
									...form,
									startTime: event.target.value
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "time",
								className: field,
								value: form.endTime,
								onChange: (event) => setForm({
									...form,
									endTime: event.target.value
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePicker, {
						label: "Billede til eventet",
						value: form.image,
						onChange: (image) => setForm({
							...form,
							image
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy,
							className: "min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper",
							children: editing ? "Gem event" : "Opret event"
						}), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 px-3 text-sm",
							onClick: () => setEditing(null),
							children: "Annuller"
						}) : null]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: pack.events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center justify-between gap-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: event.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted tabular-nums",
						children: [
							event.eventDate,
							" · ",
							event.startTime
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => fillEvent(event, setForm, setEditing),
							children: "Ret"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								if (window.confirm("Slet eventet?")) run(() => deleteEvent({ data: { id: event.id } }));
							},
							children: "Slet"
						})]
					})]
				}, event.id))
			})
		]
	});
}
function fillEvent(event, setForm, setEditing) {
	setEditing(event.id);
	setForm({
		title: event.title,
		description: event.description,
		eventDate: event.eventDate,
		startTime: event.startTime,
		endTime: event.endTime,
		image: event.image
	});
}
function PriceForm({ pack, busy, run }) {
	const [form, setForm] = (0, import_react.useState)({
		category: "Øl",
		name: "",
		priceKr: "",
		note: ""
	});
	const [editing, setEditing] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-card border border-line bg-paper-2 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-6",
					children: pack.site.pricesLive ? "Priserne vises som husets kort." : "Gæster kan se, at tallene er vejledende, indtil du bekræfter kortet."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					className: "mt-3 min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper",
					onClick: () => void run(() => updateSite({ data: {
						...pack.site,
						pricesLive: !pack.site.pricesLive
					} })),
					children: pack.site.pricesLive ? "Vis som vejledende igen" : "Bekræft at priserne er rigtige"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3 sm:grid-cols-2",
				onSubmit: (event) => {
					event.preventDefault();
					const payload = {
						category: form.category,
						name: form.name,
						priceKr: Number(form.priceKr),
						note: form.note
					};
					run(async () => {
						if (editing) await updatePrice({ data: {
							...payload,
							id: editing
						} });
						else await createPrice({ data: payload });
						setEditing(null);
						setForm({
							...form,
							name: "",
							priceKr: "",
							note: ""
						});
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: field,
						placeholder: "Kategori",
						required: true,
						value: form.category,
						onChange: (event) => setForm({
							...form,
							category: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: field,
						placeholder: "Navn",
						required: true,
						value: form.name,
						onChange: (event) => setForm({
							...form,
							name: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: field,
						placeholder: "Pris i kr",
						required: true,
						inputMode: "numeric",
						value: form.priceKr,
						onChange: (event) => setForm({
							...form,
							priceKr: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: field,
						placeholder: "Note",
						value: form.note,
						onChange: (event) => setForm({
							...form,
							note: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper sm:col-span-2",
						children: editing ? "Gem pris" : "Tilføj pris"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line",
				children: pack.prices.map((price) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center justify-between gap-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						price.category,
						" · ",
						price.name
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm tabular-nums text-muted",
						children: kroner(price.priceKr)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void run(() => moveItem({ data: {
									table: "prices",
									id: price.id,
									dir: "up"
								} })),
								children: "Op"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void run(() => moveItem({ data: {
									table: "prices",
									id: price.id,
									dir: "down"
								} })),
								children: "Ned"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => fillPrice(price, setForm, setEditing),
								children: "Ret"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									if (window.confirm("Slet prisen?")) run(() => deletePrice({ data: { id: price.id } }));
								},
								children: "Slet"
							})
						]
					})]
				}, price.id))
			})
		]
	});
}
function fillPrice(price, setForm, setEditing) {
	setEditing(price.id);
	setForm({
		category: price.category,
		name: price.name,
		priceKr: String(price.priceKr),
		note: price.note
	});
}
function GalleryForm({ pack, busy, run }) {
	const [kind, setKind] = (0, import_react.useState)("image");
	const [src, setSrc] = (0, import_react.useState)("");
	const [caption, setCaption] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: (event) => {
				event.preventDefault();
				run(async () => {
					const payload = {
						kind,
						src,
						caption
					};
					if (editing) await updateMedia({ data: {
						...payload,
						id: editing
					} });
					else await createMedia({ data: payload });
					setEditing(null);
					setSrc("");
					setCaption("");
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: editing ? "Ret medie" : "Nyt billede eller video"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `min-h-11 rounded-full px-4 text-sm ${kind === "image" ? "bg-walnut text-cream" : "border border-line"}`,
						onClick: () => setKind("image"),
						children: "Billede"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `min-h-11 rounded-full px-4 text-sm ${kind === "video" ? "bg-walnut text-cream" : "border border-line"}`,
						onClick: () => setKind("video"),
						children: "Video"
					})]
				}),
				kind === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePicker, {
					label: "Billede",
					value: src,
					onChange: setSrc
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm",
					children: ["Videolink", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: field,
						placeholder: "YouTube, Vimeo eller mp4-link",
						value: src,
						onChange: (event) => setSrc(event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm",
					children: ["Billedtekst", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: field,
						value: caption,
						onChange: (event) => setCaption(event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: busy,
					className: "min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper",
					children: editing ? "Gem" : "Læg ind"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-4",
			children: pack.gallery.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3 rounded-card border border-line p-3",
				children: [item.kind === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: item.src,
					alt: "",
					className: "h-20 w-28 rounded-lg object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-20 w-28 place-items-center rounded-lg bg-walnut text-xs text-cream",
					children: "Video"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm",
						children: item.caption || "Uden tekst"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void run(() => moveItem({ data: {
									table: "gallery",
									id: item.id,
									dir: "up"
								} })),
								children: "Op"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void run(() => moveItem({ data: {
									table: "gallery",
									id: item.id,
									dir: "down"
								} })),
								children: "Ned"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setEditing(item.id);
									setKind(item.kind);
									setSrc(item.src);
									setCaption(item.caption);
								},
								children: "Ret"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									if (window.confirm("Slet fra galleriet?")) run(() => deleteMedia({ data: { id: item.id } }));
								},
								children: "Slet"
							})
						]
					})]
				})]
			}, item.id))
		})]
	});
}
//#endregion
export { EditorPage as component };
