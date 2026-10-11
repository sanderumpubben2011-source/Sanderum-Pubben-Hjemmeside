import { useState } from "react";
import type { PubEvent } from "@/lib/pub/types";
import { longDate, monthCells, monthLabel } from "@/lib/pub/format";

const HEADS = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"];

export function MonthCalendar({ events, today }: { events: PubEvent[]; today: string }) {
  const [startYear, startMonth] = today.split("-").map(Number);
  const [cursor, setCursor] = useState({ year: startYear || 2026, month: startMonth || 1 });
  const [selected, setSelected] = useState(today);
  const cells = monthCells(cursor.year, cursor.month);
  const byDay = new Map<string, PubEvent[]>();
  for (const event of events) {
    const list = byDay.get(event.eventDate) ?? [];
    list.push(event);
    byDay.set(event.eventDate, list);
  }
  const chosen = byDay.get(selected) ?? [];

  function shift(delta: number) {
    setCursor((current) => {
      const date = new Date(Date.UTC(current.year, current.month - 1 + delta, 1));
      return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-card border border-line bg-paper-2 p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button type="button" className="min-h-11 rounded-full border border-line px-4" onClick={() => shift(-1)}>
            Forrige
          </button>
          <h2 className="font-display text-2xl">{monthLabel(cursor.year, cursor.month)}</h2>
          <button type="button" className="min-h-11 rounded-full border border-line px-4" onClick={() => shift(1)}>
            Næste
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs tracking-widest text-muted uppercase">
          {HEADS.map((label) => (
            <div key={label} className="py-2">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, index) => {
            if (!cell.iso || !cell.day) return <div key={`e-${index}`} />;
            const has = (byDay.get(cell.iso) ?? []).length > 0;
            const active = cell.iso === selected;
            const isToday = cell.iso === today;
            return (
              <button
                key={cell.iso}
                type="button"
                onClick={() => setSelected(cell.iso!)}
                className={`flex min-h-12 flex-col items-center justify-center rounded-2xl text-sm tabular-nums ${
                  active
                    ? "bg-walnut text-cream"
                    : isToday
                      ? "border border-brass-solid"
                      : "hover:bg-paper"
                }`}
              >
                {cell.day}
                {has ? <span className={`mt-1 h-1.5 w-1.5 rounded-full ${active ? "bg-brass-solid" : "bg-brass"}`} /> : null}
              </button>
            );
          })}
        </div>
      </div>
      <aside className="rounded-card border border-line p-5">
        <p className="text-sm text-brass">{longDate(selected)}</p>
        {chosen.length ? (
          <ul className="mt-4 space-y-5">
            {chosen.map((event) => (
              <li key={event.id}>
                <h3 className="font-display text-2xl">{event.title}</h3>
                <p className="mt-1 text-sm tabular-nums text-muted">
                  {event.startTime}
                  {event.endTime ? `–${event.endTime}` : ""}
                </p>
                {event.description ? <p className="mt-2 text-sm leading-6">{event.description}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-muted">Ingen aftener den dag. Baren kan stadig være åben.</p>
        )}
      </aside>
    </div>
  );
}
