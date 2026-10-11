import { createFileRoute } from "@tanstack/react-router";
import { MonthCalendar } from "@/components/calendar";
import { Note, PageIntro } from "@/components/content";
import { Shell, usePub } from "@/components/shell";
import { upcomingEvents } from "@/lib/pub/format";

export const Route = createFileRoute("/kalender")({
  head: () => ({ meta: [{ title: "Kalender · Sanderum Pubben" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const { site, events, today } = usePub();
  const next = upcomingEvents(events, today);
  return (
    <Shell>
      <main className="pb-16">
        <PageIntro
          kicker="Kalender"
          title="Hvad der sker"
          lede={
            next[0]
              ? `Næste gang er ${next[0].title.toLowerCase()}. Resten ligger i måneden herunder.`
              : "Der er ingen kommende aftener lagt ind endnu."
          }
        />
        <div className="mx-auto max-w-6xl space-y-6 px-5">
          {!site.calendarLive ? (
            <Note>
              Aftenerne herunder er eksempler, indtil programmet er bekræftet. Spørg i baren, eller
              ring, hvis du vil være sikker.
            </Note>
          ) : null}
          <MonthCalendar events={events} today={today} />
        </div>
      </main>
    </Shell>
  );
}
