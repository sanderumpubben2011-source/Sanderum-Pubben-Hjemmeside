import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { DayHours, Media, Price, PubEvent, Site, StaffMember } from "@/lib/pub/types";
import { groupPrices, kroner, longDate, phoneHref, videoView } from "@/lib/pub/format";

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest text-brass uppercase">{children}</p>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-4 border-brass-solid bg-paper-2 px-4 py-3 text-sm leading-6 whitespace-pre-line">{children}</p>
  );
}

const SOCIALS = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
  { key: "snapchat", label: "Snapchat" },
] as const;

function SocialMark({ name }: { name: (typeof SOCIALS)[number]["key"] }) {
  const common = { viewBox: "0 0 24 24", className: "h-5 w-5", "aria-hidden": true } as const;
  if (name === "facebook") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M14.2 8.5V6.9c0-.6.1-1 1.1-1H17V3h-2.1C12.2 3 11.2 4.2 11.2 6.5v2H9v2.7h2.2V21h3V11.2h2.4l.4-2.7h-2.8z" />
      </svg>
    );
  }
  if (name === "instagram") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "youtube") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M22 12.2s0-3-.4-4.3c-.2-.8-.9-1.5-1.7-1.7C18.4 5.8 12 5.8 12 5.8s-6.4 0-7.9.4c-.8.2-1.5.9-1.7 1.7C2 9.2 2 12.2 2 12.2s0 3 .4 4.3c.2.8.9 1.5 1.7 1.7 1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4c.8-.2 1.5-.9 1.7-1.7.4-1.3.4-4.3.4-4.3zM10 15.2V9.2l5.2 3-5.2 3z" />
      </svg>
    );
  }
  if (name === "tiktok") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="currentColor">
      <path d="M12 3c-2.8 0-4.6 2-4.6 5 0 1.3.1 2.3-.4 3.1-.3.5-.6.7-1 .9-.2.2-.4.4-.3.7.1.3.5.4.9.5.5.1.8.4.8.8 0 .6-.4.9-1 1.2-.3.2-.4.4-.2.7.2.3.7.4 1.2.4.4 0 .6.2.7.5.2.5.6.8 1.3 1.1.4.2.9.3 1.6.3s1.2-.1 1.6-.3c.7-.3 1.1-.6 1.3-1.1.1-.3.3-.5.7-.5.5 0 1-.1 1.2-.4.2-.3.1-.5-.2-.7-.6-.3-1-.6-1-1.2 0-.4.3-.7.8-.8.4-.1.8-.2.9-.5.1-.3-.1-.5-.3-.7-.4-.2-.7-.4-1-.9-.5-.8-.4-1.8-.4-3.1C16.6 5 14.8 3 12 3z" />
    </svg>
  );
}

export function SocialLinks({ site, tone = "light" }: { site: Site; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ul className="flex flex-wrap gap-2">
      {SOCIALS.map((item) => {
        const href = site[item.key];
        const className = `grid h-11 w-11 place-items-center rounded-full border ${
          href
            ? dark
              ? "border-cream/40 text-cream hover:border-brass-solid hover:text-brass-solid"
              : "border-line text-ink hover:border-brass hover:text-brass"
            : dark
              ? "border-cream/15 text-cream/35"
              : "border-line text-muted"
        }`;
        const mark = <SocialMark name={item.key} />;
        return (
          <li key={item.key}>
            {href ? (
              <a href={href} target="_blank" rel="noreferrer" aria-label={item.label} className={className}>
                {mark}
              </a>
            ) : (
              <span className={className} title={`${item.label} mangler et link`} aria-label={item.label}>
                {mark}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function HoursTable({
  hours,
  weekday,
  note,
}: {
  hours: DayHours[];
  weekday: string;
  note?: string;
}) {
  return (
    <div>
      <ul className="divide-y divide-line">
        {hours.map((row) => {
          const today = row.day.toLowerCase() === weekday.toLowerCase();
          return (
            <li
              key={row.day}
              className={`flex items-center justify-between gap-4 rounded-xl px-3 py-3 ${today ? "bg-walnut font-semibold text-cream" : ""}`}
            >
              <span>{row.day}</span>
              <span className={`tabular-nums ${today ? "text-brass-solid" : "text-muted"}`}>
                {row.closed ? "Lukket" : `${row.open}–${row.close}`}
                {today ? " · i dag" : ""}
              </span>
            </li>
          );
        })}
      </ul>
      {note ? <p className="mt-4 text-sm text-muted">{note}</p> : null}
    </div>
  );
}

export function PriceMenu({ prices }: { prices: Price[] }) {
  const groups = groupPrices(prices);
  if (!groups.length) {
    return <p className="text-muted">Kortet er tomt lige nu. Spørg i baren.</p>;
  }
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {groups.map((group) => (
        <section key={group.category}>
          <h2 className="font-display text-3xl">{group.category}</h2>
          <ul className="mt-4">
            {group.items.map((item) => (
              <li key={item.id} className="flex items-baseline gap-3 py-3">
                <span>
                  <span className="block">{item.name}</span>
                  {item.note ? <span className="block text-sm text-muted">{item.note}</span> : null}
                </span>
                <span className="mb-1 min-w-6 flex-1 border-b border-dotted border-line" />
                <span className="font-display text-xl tabular-nums">{kroner(item.priceKr)}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function EventCards({ events }: { events: PubEvent[] }) {
  if (!events.length) {
    return (
      <p className="text-muted">
        Ingen kommende aftener i kalenderen. Kig forbi alligevel, eller ring til huset.
      </p>
    );
  }
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {events.map((event) => (
        <article key={event.id} className="overflow-hidden rounded-card border border-line bg-paper-2">
          {event.image ? (
            <img src={event.image} alt="" className="h-44 w-full object-cover" />
          ) : (
            <div className="h-24 bg-walnut" />
          )}
          <div className="p-5">
            <p className="text-sm text-brass">{longDate(event.eventDate)}</p>
            <h3 className="mt-1 font-display text-2xl">{event.title}</h3>
            <p className="mt-2 text-sm tabular-nums text-muted">
              {event.startTime}
              {event.endTime ? `–${event.endTime}` : ""}
            </p>
            {event.description ? <p className="mt-3 text-sm leading-6">{event.description}</p> : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function MediaTile({ item, large }: { item: Media; large?: boolean }) {
  const frame =
    item.kind === "image" ? (
      <img
        src={item.src}
        alt={item.caption || "Billede fra Sanderum Pubben"}
        className={`w-full object-cover ${large ? "h-80 sm:h-96" : "h-64"}`}
      />
    ) : (
      <Video item={item} />
    );
  return (
    <figure className="overflow-hidden rounded-card border border-line bg-paper-2">
      {frame}
      {item.caption ? <figcaption className="px-4 py-3 text-sm">{item.caption}</figcaption> : null}
    </figure>
  );
}

function Video({ item }: { item: Media }) {
  const view = videoView(item.src);
  if (view.type === "file") {
    return (
      <video
        src={view.src}
        controls
        playsInline
        poster="/media/facade.jpg"
        className="aspect-video w-full bg-walnut object-cover"
      />
    );
  }
  if (view.type === "youtube" || view.type === "vimeo") {
    return (
      <iframe
        src={view.src}
        title={item.caption || "Video"}
        className="aspect-video w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <a href={view.src} className="grid aspect-video place-items-center bg-walnut px-6 text-center text-cream">
      Se videoen
    </a>
  );
}

export function GalleryGrid({ items }: { items: Media[] }) {
  if (!items.length) return <p className="text-muted">Galleri kommer, når huset lægger billeder ind.</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <div key={item.id} className={index === 0 ? "sm:col-span-2" : undefined}>
          <MediaTile item={item} large={index === 0} />
        </div>
      ))}
    </div>
  );
}

export function StaffCards({ people }: { people: StaffMember[] }) {
  if (!people.length) {
    return <p className="text-muted">Huset har ikke sat holdet ind endnu.</p>;
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => (
        <li key={person.id} className="rounded-card border border-line bg-paper p-5">
          <div className="flex items-center gap-4">
            {person.image ? (
              <img src={person.image} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-walnut font-display text-2xl text-cream">
                {initials(person.name)}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-widest text-brass uppercase">{person.role}</p>
              <h3 className="mt-1 truncate font-display text-2xl">{person.name}</h3>
            </div>
          </div>
          {person.phone || person.email ? (
            <div className="mt-4 text-sm leading-6">
              {person.phone ? (
                <a className="block" href={phoneHref(person.phone)}>
                  {person.phone}
                </a>
              ) : null}
              {person.email ? (
                <a className="block break-all text-brass" href={`mailto:${person.email}`}>
                  {person.email}
                </a>
              ) : null}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase("da-DK"))
    .join("");
}

export function PageIntro({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="mx-auto max-w-6xl px-5 pt-14 pb-8">
      <Kicker>{kicker}</Kicker>
      <h1 className="mt-3 max-w-3xl font-display text-5xl leading-none sm:text-6xl">{title}</h1>
      {lede ? <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{lede}</p> : null}
    </header>
  );
}

export function MoreLink({ to, children }: { to: "/" | "/kalender" | "/priser" | "/galleri" | "/kontakt"; children: string }) {
  return (
    <Link to={to} className="text-sm font-semibold text-brass">
      {children}
    </Link>
  );
}
