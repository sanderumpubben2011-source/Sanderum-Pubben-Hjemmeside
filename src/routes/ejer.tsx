import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  claimSite,
  createEvent,
  createMedia,
  createPrice,
  createStaff,
  deleteEvent,
  deleteMedia,
  deletePrice,
  deleteStaff,
  moveItem,
  getEditor,
  updateEvent,
  updateMedia,
  updatePrice,
  updateSite,
  updateStaff,
} from "@/lib/pub/api";
import { errText, fileToImageData, kroner } from "@/lib/pub/format";
import type { DayHours, EditorData, Price, PubEvent, Site, ThemeId } from "@/lib/pub/types";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/ejer")({
  head: () => ({ meta: [{ title: "Rediger · Sanderum Pubben" }] }),
  component: EditorPage,
});

const field = "mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3 text-ink";

function EditorPage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <Shell>
        <main className="mx-auto min-h-[50vh] max-w-3xl px-5 py-16">
          <div className="h-10 w-48 animate-pulse rounded-full bg-paper-2" />
        </main>
      </Shell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  return <Editor userId={user.id} />;
}

function Editor({ userId }: { userId: string }) {
  const router = useRouter();
  const [pack, setPack] = useState<EditorData | null>(null);
  const [draft, setDraft] = useState<Site | null>(null);
  const [panel, setPanel] = useState<"hus" | "kalender" | "priser" | "galleri" | "holdet">("hus");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const next = await getEditor();
    setPack(next);
    setDraft(next.site);
    await router.invalidate();
  }

  useEffect(() => {
    let cancel = false;
    getEditor()
      .then((next) => {
        if (cancel) return;
        setPack(next);
        setDraft(next.site);
      })
      .catch((err: unknown) => {
        if (!cancel) setError(errText(err));
      });
    return () => {
      cancel = true;
    };
  }, [userId]);

  async function run(task: () => Promise<unknown>) {
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

  return (
    <Shell>
      <main className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-xs font-semibold tracking-widest text-brass uppercase">Huset</p>
        <h1 className="mt-2 font-display text-5xl leading-none">Rediger huset</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Her lægger du events ind, retter priser og skifter billeder, video, logo og baggrund.
        </p>
        {pack && !pack.durable ? (
          <p className="mt-4 rounded-card border border-brass-solid bg-paper-2 p-4 text-sm leading-6">
            Login huskes i browseren, men rettelser bliver ikke gemt. Databasen er ikke koblet til siden,
            så den starter forfra ved næste besøg. Sæt <span className="font-semibold">DATABASE_URL</span> fra
            Neon i Vercel, og deploy igen.
          </p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-brass">{error}</p> : null}
        {message ? <p className="mt-4 text-sm">{message}</p> : null}
        {!pack || !draft ? (
          <p className="mt-8 text-muted">Henter…</p>
        ) : pack.role === "anden" ? (
          <p className="mt-8 rounded-card border border-line bg-paper-2 p-5">
            Siden har allerede en ejer. Du er logget ind med en anden konto.
          </p>
        ) : pack.role === "ledig" ? (
          <div className="mt-8 rounded-card border border-line bg-paper-2 p-6">
            <h2 className="font-display text-3xl">Overtag siden</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Den første, der overtager siden, kan redigere alt. Det bør være huset.
            </p>
            <button
              type="button"
              disabled={busy}
              className="mt-5 min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper"
              onClick={() => void run(() => claimSite())}
            >
              Overtag som ejer
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 flex gap-2 overflow-x-auto">
              {(
                [
                  ["hus", "Huset"],
                  ["kalender", "Kalender"],
                  ["priser", "Priser"],
                  ["galleri", "Billeder"],
                  ["holdet", "Holdet"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setPanel(id);
                    setMessage("");
                    setError("");
                  }}
                  className={`min-h-11 shrink-0 rounded-full px-4 text-sm ${
                    panel === id ? "bg-walnut text-cream" : "border border-line"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-8">
              {panel === "hus" ? (
                <HouseForm draft={draft} setDraft={setDraft} busy={busy} onSave={() => run(() => updateSite({ data: draft }))} />
              ) : null}
              {panel === "kalender" ? (
                <CalendarForm pack={pack} busy={busy} run={run} />
              ) : null}
              {panel === "priser" ? <PriceForm pack={pack} busy={busy} run={run} /> : null}
              {panel === "galleri" ? <GalleryForm pack={pack} busy={busy} run={run} /> : null}
              {panel === "holdet" ? <StaffForm pack={pack} busy={busy} run={run} /> : null}
            </div>
          </>
        )}
      </main>
    </Shell>
  );
}

function HouseForm({
  draft,
  setDraft,
  busy,
  onSave,
}: {
  draft: Site;
  setDraft: (site: Site) => void;
  busy: boolean;
  onSave: () => void;
}) {
  function patch(partial: Partial<Site>) {
    setDraft({ ...draft, ...partial });
  }
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <label className="block text-sm">
        Navn
        <input className={field} value={draft.name} onChange={(event) => patch({ name: event.target.value })} />
      </label>
      <label className="block text-sm">
        Undertitel
        <input className={field} value={draft.tagline} onChange={(event) => patch({ tagline: event.target.value })} />
      </label>
      <label className="block text-sm">
        Om huset
        <textarea className={`${field} min-h-40`} value={draft.about} onChange={(event) => patch({ about: event.target.value })} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Telefon
          <input className={field} value={draft.phone} onChange={(event) => patch({ phone: event.target.value })} />
        </label>
        <label className="block text-sm">
          E-mail
          <input className={field} value={draft.email} onChange={(event) => patch({ email: event.target.value })} />
        </label>
        <label className="block text-sm">
          Adresse
          <input className={field} value={draft.address} onChange={(event) => patch({ address: event.target.value })} />
        </label>
        <label className="block text-sm">
          By
          <input className={field} value={draft.city} onChange={(event) => patch({ city: event.target.value })} />
        </label>
        <label className="block text-sm">
          Facebook
          <input className={field} placeholder="link eller @side" value={draft.facebook} onChange={(event) => patch({ facebook: event.target.value })} />
        </label>
        <label className="block text-sm">
          Instagram
          <input className={field} placeholder="link eller @navn" value={draft.instagram} onChange={(event) => patch({ instagram: event.target.value })} />
        </label>
        <label className="block text-sm">
          YouTube
          <input className={field} placeholder="link eller @kanal" value={draft.youtube} onChange={(event) => patch({ youtube: event.target.value })} />
        </label>
        <label className="block text-sm">
          TikTok
          <input className={field} placeholder="link eller @navn" value={draft.tiktok} onChange={(event) => patch({ tiktok: event.target.value })} />
        </label>
        <label className="block text-sm sm:col-span-2">
          Snapchat
          <input className={field} placeholder="link eller brugernavn" value={draft.snapchat} onChange={(event) => patch({ snapchat: event.target.value })} />
        </label>
      </div>
      <fieldset>
        <legend className="text-sm">Baggrund</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(
            [
              ["papir", "Papir"],
              ["nat", "Nat"],
              ["filt", "Filt"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => patch({ theme: id satisfies ThemeId })}
              className={`min-h-11 rounded-full border text-sm ${draft.theme === id ? "border-brass-solid bg-walnut text-cream" : "border-line"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      <ImagePicker
        label="Forsidebillede"
        value={draft.heroImage}
        onChange={(heroImage) => patch({ heroImage })}
      />
      <ImagePicker label="Logo" contain value={draft.logoImage} onChange={(logoImage) => patch({ logoImage })} />
      <ImagePicker
        label="Baggrundsbillede"
        value={draft.backdrop}
        onChange={(backdrop) => patch({ backdrop })}
      />
      <p className="text-sm text-muted">Logo og baggrund kan stå tomme. Så bruges husets mærke og den valgte farve.</p>
      <div className="space-y-3">
        <p className="text-sm font-semibold">Åbningstider</p>
        {draft.hours.map((row, index) => (
          <div key={row.day} className="flex flex-wrap items-center gap-2">
            <span className="w-24 text-sm">{row.day}</span>
            <input
              type="time"
              className="rounded-xl border border-line bg-paper px-2 py-2"
              value={row.open}
              disabled={row.closed}
              onChange={(event) => patch({ hours: setHour(draft.hours, index, { open: event.target.value }) })}
            />
            <input
              type="time"
              className="rounded-xl border border-line bg-paper px-2 py-2"
              value={row.close}
              disabled={row.closed}
              onChange={(event) => patch({ hours: setHour(draft.hours, index, { close: event.target.value }) })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={row.closed}
                onChange={(event) => patch({ hours: setHour(draft.hours, index, { closed: event.target.checked }) })}
              />
              Lukket
            </label>
          </div>
        ))}
      </div>
      <label className="block text-sm">
        Note til åbningstider
        <input className={field} value={draft.hoursNote} onChange={(event) => patch({ hoursNote: event.target.value })} />
      </label>
      <label className="block text-sm">
        Note til priser
        <input className={field} value={draft.pricesNote} onChange={(event) => patch({ pricesNote: event.target.value })} />
      </label>
      <button type="submit" disabled={busy} className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper">
        Gem huset
      </button>
    </form>
  );
}

function setHour(hours: DayHours[], index: number, partial: Partial<DayHours>) {
  return hours.map((row, i) => (i === index ? { ...row, ...partial } : row));
}

function ImagePicker({
  label,
  value,
  onChange,
  contain = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  contain?: boolean;
}) {
  const [localError, setLocalError] = useState("");
  return (
    <div>
      <p className="text-sm">{label}</p>
      {value ? (
        <img
          src={value}
          alt=""
          className={`mt-2 h-36 w-full rounded-card bg-walnut ${contain ? "object-contain" : "object-cover"}`}
        />
      ) : null}
      <input
        type="file"
        accept="image/*"
        className="mt-2 block w-full text-sm"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          void fileToImageData(file)
            .then(onChange)
            .catch((err: unknown) => setLocalError(errText(err)));
        }}
      />
      {value ? (
        <p className="mt-1 text-sm text-muted">Billedet er valgt. Tryk Gem huset, så det bliver hængende.</p>
      ) : null}
      <input
        className={field}
        placeholder="eller https-link"
        value={value.startsWith("data:") ? "" : value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value ? (
        <button type="button" className="mt-2 text-sm text-brass" onClick={() => onChange("")}>
          Fjern
        </button>
      ) : null}
      {localError ? <p className="mt-1 text-sm text-brass">{localError}</p> : null}
    </div>
  );
}

function CalendarForm({
  pack,
  busy,
  run,
}: {
  pack: EditorData;
  busy: boolean;
  run: (task: () => Promise<unknown>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventDate: pack.today,
    startTime: "19:00",
    endTime: "22:00",
    image: "",
  });
  const [editing, setEditing] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-line bg-paper-2 p-4">
        <p className="text-sm leading-6">
          {pack.site.calendarLive
            ? "Kalenderen vises som husets program."
            : "Gæster kan se, at aftenerne er eksempler, indtil du bekræfter programmet."}
        </p>
        <button
          type="button"
          disabled={busy}
          className="mt-3 min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper"
          onClick={() =>
            void run(() => updateSite({ data: { ...pack.site, calendarLive: !pack.site.calendarLive } }))
          }
        >
          {pack.site.calendarLive ? "Vis som foreløbigt igen" : "Bekræft at det her er programmet"}
        </button>
      </div>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          const payload = { ...form, endTime: form.endTime };
          void run(async () => {
            if (editing) await updateEvent({ data: { ...payload, id: editing } });
            else await createEvent({ data: payload });
            setEditing(null);
            setForm({ ...form, title: "", description: "", image: "" });
          });
        }}
      >
        <h2 className="font-display text-3xl">{editing ? "Ret event" : "Nyt event"}</h2>
        <input className={field} placeholder="Titel" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <textarea className={`${field} min-h-24`} placeholder="Beskrivelse" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <div className="grid grid-cols-3 gap-2">
          <input type="date" className={field} required value={form.eventDate} onChange={(event) => setForm({ ...form, eventDate: event.target.value })} />
          <input type="time" className={field} required value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} />
          <input type="time" className={field} value={form.endTime} onChange={(event) => setForm({ ...form, endTime: event.target.value })} />
        </div>
        <ImagePicker label="Billede til eventet" value={form.image} onChange={(image) => setForm({ ...form, image })} />
        <div className="flex gap-3">
          <button type="submit" disabled={busy} className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper">
            {editing ? "Gem event" : "Opret event"}
          </button>
          {editing ? (
            <button type="button" className="min-h-11 px-3 text-sm" onClick={() => setEditing(null)}>
              Annuller
            </button>
          ) : null}
        </div>
      </form>
      <ul className="divide-y divide-line">
        {pack.events.map((event) => (
          <li key={event.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-muted tabular-nums">
                {event.eventDate} · {event.startTime}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <button type="button" onClick={() => fillEvent(event, setForm, setEditing)}>
                Ret
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Slet eventet?")) void run(() => deleteEvent({ data: { id: event.id } }));
                }}
              >
                Slet
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function fillEvent(
  event: PubEvent,
  setForm: (value: {
    title: string;
    description: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    image: string;
  }) => void,
  setEditing: (id: number) => void,
) {
  setEditing(event.id);
  setForm({
    title: event.title,
    description: event.description,
    eventDate: event.eventDate,
    startTime: event.startTime,
    endTime: event.endTime,
    image: event.image,
  });
}

function PriceForm({
  pack,
  busy,
  run,
}: {
  pack: EditorData;
  busy: boolean;
  run: (task: () => Promise<unknown>) => Promise<void>;
}) {
  const [form, setForm] = useState({ category: "Øl", name: "", priceKr: "", note: "" });
  const [editing, setEditing] = useState<number | null>(null);
  return (
    <div className="space-y-6">
      <div className="rounded-card border border-line bg-paper-2 p-4">
        <p className="text-sm leading-6">
          {pack.site.pricesLive
            ? "Priserne vises som husets kort."
            : "Gæster kan se, at tallene er vejledende, indtil du bekræfter kortet."}
        </p>
        <button
          type="button"
          disabled={busy}
          className="mt-3 min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper"
          onClick={() => void run(() => updateSite({ data: { ...pack.site, pricesLive: !pack.site.pricesLive } }))}
        >
          {pack.site.pricesLive ? "Vis som vejledende igen" : "Bekræft at priserne er rigtige"}
        </button>
      </div>
      <form
        className="grid gap-3 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const payload = {
            category: form.category,
            name: form.name,
            priceKr: Number(form.priceKr),
            note: form.note,
          };
          void run(async () => {
            if (editing) await updatePrice({ data: { ...payload, id: editing } });
            else await createPrice({ data: payload });
            setEditing(null);
            setForm({ ...form, name: "", priceKr: "", note: "" });
          });
        }}
      >
        <input className={field} placeholder="Kategori" required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
        <input className={field} placeholder="Navn" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input className={field} placeholder="Pris i kr" required inputMode="numeric" value={form.priceKr} onChange={(event) => setForm({ ...form, priceKr: event.target.value })} />
        <input className={field} placeholder="Note" value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} />
        <button type="submit" disabled={busy} className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper sm:col-span-2">
          {editing ? "Gem pris" : "Tilføj pris"}
        </button>
      </form>
      <ul className="divide-y divide-line">
        {pack.prices.map((price) => (
          <li key={price.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p>
                {price.category} · {price.name}
              </p>
              <p className="text-sm tabular-nums text-muted">{kroner(price.priceKr)}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button type="button" onClick={() => void run(() => moveItem({ data: { table: "prices", id: price.id, dir: "up" } }))}>
                Op
              </button>
              <button type="button" onClick={() => void run(() => moveItem({ data: { table: "prices", id: price.id, dir: "down" } }))}>
                Ned
              </button>
              <button type="button" onClick={() => fillPrice(price, setForm, setEditing)}>
                Ret
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Slet prisen?")) void run(() => deletePrice({ data: { id: price.id } }));
                }}
              >
                Slet
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function fillPrice(
  price: Price,
  setForm: (value: { category: string; name: string; priceKr: string; note: string }) => void,
  setEditing: (id: number) => void,
) {
  setEditing(price.id);
  setForm({
    category: price.category,
    name: price.name,
    priceKr: String(price.priceKr),
    note: price.note,
  });
}

function GalleryForm({
  pack,
  busy,
  run,
}: {
  pack: EditorData;
  busy: boolean;
  run: (task: () => Promise<unknown>) => Promise<void>;
}) {
  const [kind, setKind] = useState<"image" | "video">("image");
  const [src, setSrc] = useState("");
  const [caption, setCaption] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  return (
    <div className="space-y-6">
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void run(async () => {
            const payload = { kind, src, caption };
            if (editing) await updateMedia({ data: { ...payload, id: editing } });
            else await createMedia({ data: payload });
            setEditing(null);
            setSrc("");
            setCaption("");
          });
        }}
      >
        <h2 className="font-display text-3xl">{editing ? "Ret medie" : "Nyt billede eller video"}</h2>
        <div className="flex gap-2">
          <button type="button" className={`min-h-11 rounded-full px-4 text-sm ${kind === "image" ? "bg-walnut text-cream" : "border border-line"}`} onClick={() => setKind("image")}>
            Billede
          </button>
          <button type="button" className={`min-h-11 rounded-full px-4 text-sm ${kind === "video" ? "bg-walnut text-cream" : "border border-line"}`} onClick={() => setKind("video")}>
            Video
          </button>
        </div>
        {kind === "image" ? (
          <ImagePicker label="Billede" value={src} onChange={setSrc} />
        ) : (
          <label className="block text-sm">
            Videolink
            <input className={field} placeholder="YouTube, Vimeo eller mp4-link" value={src} onChange={(event) => setSrc(event.target.value)} />
          </label>
        )}
        <label className="block text-sm">
          Billedtekst
          <input className={field} value={caption} onChange={(event) => setCaption(event.target.value)} />
        </label>
        <button type="submit" disabled={busy} className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper">
          {editing ? "Gem" : "Læg ind"}
        </button>
      </form>
      <ul className="space-y-4">
        {pack.gallery.map((item) => (
          <li key={item.id} className="flex gap-3 rounded-card border border-line p-3">
            {item.kind === "image" ? (
              <img src={item.src} alt="" className="h-20 w-28 rounded-lg object-cover" />
            ) : (
              <div className="grid h-20 w-28 place-items-center rounded-lg bg-walnut text-xs text-cream">Video</div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{item.caption || "Uden tekst"}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                <button type="button" onClick={() => void run(() => moveItem({ data: { table: "gallery", id: item.id, dir: "up" } }))}>
                  Op
                </button>
                <button type="button" onClick={() => void run(() => moveItem({ data: { table: "gallery", id: item.id, dir: "down" } }))}>
                  Ned
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(item.id);
                    setKind(item.kind);
                    setSrc(item.src);
                    setCaption(item.caption);
                  }}
                >
                  Ret
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Slet fra galleriet?")) void run(() => deleteMedia({ data: { id: item.id } }));
                  }}
                >
                  Slet
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const ROLES = ["Ejer", "Bartender", "Kasserer", "SoMe-manager"];

function StaffForm({
  pack,
  busy,
  run,
}: {
  pack: EditorData;
  busy: boolean;
  run: (task: () => Promise<unknown>) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Bartender");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [editing, setEditing] = useState<number | null>(null);

  function clear() {
    setEditing(null);
    setName("");
    setRole("Bartender");
    setEmail("");
    setPhone("");
    setImage("");
  }

  return (
    <div className="space-y-6">
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void run(async () => {
            const payload = { name, role, email, phone, image };
            if (editing) await updateStaff({ data: { ...payload, id: editing } });
            else await createStaff({ data: payload });
            clear();
          });
        }}
      >
        <h2 className="font-display text-3xl">{editing ? "Ret medarbejder" : "Ny medarbejder"}</h2>
        <p className="text-sm text-muted">
          Telefon og e-mail vises kun, hvis du skriver dem. Billedet kan stå tomt.
        </p>
        <label className="block text-sm">
          Navn
          <input className={field} value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <div>
          <p className="text-sm">Rolle</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ROLES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRole(item)}
                className={`min-h-11 rounded-full px-4 text-sm ${role === item ? "bg-walnut text-cream" : "border border-line"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <input
            className={field}
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="Eller skriv en anden titel"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            Telefon
            <input className={field} value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <label className="block text-sm">
            E-mail
            <input className={field} value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
        </div>
        <ImagePicker label="Billede" value={image} onChange={setImage} />
        <button type="submit" disabled={busy} className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper">
          {editing ? "Gem" : "Tilføj"}
        </button>
      </form>
      <ul className="space-y-3">
        {pack.staff.map((person) => (
          <li key={person.id} className="flex items-center gap-3 rounded-card border border-line p-3">
            {person.image ? (
              <img src={person.image} alt="" className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <span className="grid h-14 w-14 place-items-center rounded-full bg-walnut text-sm text-cream">
                {person.name.slice(0, 1)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{person.name}</p>
              <p className="text-sm text-muted">{person.role}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <button type="button" onClick={() => void run(() => moveItem({ data: { table: "staff", id: person.id, dir: "up" } }))}>
                Op
              </button>
              <button type="button" onClick={() => void run(() => moveItem({ data: { table: "staff", id: person.id, dir: "down" } }))}>
                Ned
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(person.id);
                  setName(person.name);
                  setRole(person.role);
                  setEmail(person.email);
                  setPhone(person.phone);
                  setImage(person.image);
                }}
              >
                Ret
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Slet medarbejderen?")) void run(() => deleteStaff({ data: { id: person.id } }));
                }}
              >
                Slet
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
