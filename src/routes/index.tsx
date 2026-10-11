import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, usePub } from "@/components/shell";
import { EventCards, GalleryGrid, HoursTable, Kicker, Note, PriceMenu, StaffCards } from "@/components/content";
import { paragraphs, phoneHref, todayHours, upcomingEvents } from "@/lib/pub/format";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Sanderum Pubben · Værtshus i Odense SV" }] }),
  component: Home,
});

function Home() {
  const { site, events, prices, gallery, staff, today, weekday, openNow } = usePub();
  const next = upcomingEvents(events, today).slice(0, 3);
  const previewPrices = prices.slice(0, 8);
  return (
    <Shell>
      <main>
        <section className="bg-walnut">
          <h1 className="sr-only">{site.name}</h1>
          <img
            src="/media/velkommen.jpg"
            alt="Velkommen til Sanderum Pubben. Gode øl, godt selskab og god stemning. Vi ses."
            className="w-full"
          />
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-4 px-5 py-6 text-cream">
            <p className="text-sm">
              <span className="mr-3 inline-flex min-h-8 items-center rounded-full bg-cream px-3 text-ink">
                {openNow ? "Åben nu" : "Lukket lige nu"}
              </span>
              <span className="text-cream/80">{todayHours(site.hours, weekday)}</span>
            </p>
            <div className="flex flex-wrap gap-3 sm:ml-auto">
              <Link
                to="/kalender"
                className="inline-flex min-h-11 items-center rounded-full bg-cream px-5 text-sm font-semibold text-ink"
              >
                Se kalenderen
              </Link>
              <a
                href={phoneHref(site.phone)}
                className="inline-flex min-h-11 items-center rounded-full border border-cream/40 px-5 text-sm font-semibold text-cream"
              >
                Ring {site.phone}
              </a>
            </div>
          </div>
        </section>

        <section className="bg-walnut text-cream">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 lg:grid-cols-2 lg:py-20">
            <img
              src="/media/facade.jpg"
              alt="Sanderum Pubben på Sanderumvej"
              className="mx-auto w-full max-w-lg rounded-card"
            />
            <div>
              <p className="text-xs font-semibold tracking-widest text-brass-solid uppercase">Billard</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">Skomager'turnering</h2>
              <p className="mt-4 max-w-md text-lg leading-8 text-cream/80">
                Husets egen turnering. Næste runde og tilmelding får I i baren.
              </p>
              <Link
                to="/kalender"
                className="mt-6 inline-flex min-h-11 items-center rounded-full bg-cream px-5 text-sm font-semibold text-ink"
              >
                Se kalenderen
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Kicker>Huset</Kicker>
            <h2 className="mt-3 font-display text-4xl">Stamstedet på Sanderumvej</h2>
            <div className="mt-6 space-y-4 text-lg leading-8">
              {paragraphs(site.about).map((part) => (
                <p key={part.slice(0, 24)}>{part}</p>
              ))}
            </div>
          </div>
          <div>
            <Kicker>Åbent</Kicker>
            <div className="mt-3">
              <HoursTable hours={site.hours} weekday={weekday} note={site.hoursNote} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>Holdet</Kicker>
              <h2 className="mt-3 font-display text-4xl">Medarbejdere</h2>
            </div>
            <Link to="/holdet" className="text-sm font-semibold text-brass">
              Hele holdet
            </Link>
          </div>
          <StaffCards people={staff.slice(0, 3)} />
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>Kalender</Kicker>
              <h2 className="mt-3 font-display text-4xl">Det næste</h2>
            </div>
            <Link to="/kalender" className="text-sm font-semibold text-brass">
              Hele kalenderen
            </Link>
          </div>
          {!site.calendarLive ? (
            <div className="mb-6">
              <Note>
                Programmet er eksempler, så kalenderen ikke står tom. Huset bekræfter de rigtige
                aftener. Ring gerne, hvis du er i tvivl.
              </Note>
            </div>
          ) : null}
          <EventCards events={next} />
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>Kortet</Kicker>
              <h2 className="mt-3 font-display text-4xl">Et udpluk</h2>
            </div>
            <Link to="/priser" className="text-sm font-semibold text-brass">
              Alle priser
            </Link>
          </div>
          {site.pricesNote ? (
            <div className="mb-6">
              <Note>{site.pricesNote}</Note>
            </div>
          ) : null}
          <PriceMenu prices={previewPrices} />
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <Kicker>Billeder</Kicker>
              <h2 className="mt-3 font-display text-4xl">Inde fra huset</h2>
            </div>
            <Link to="/galleri" className="text-sm font-semibold text-brass">
              Galleri
            </Link>
          </div>
          <GalleryGrid items={gallery.slice(0, 4)} />
        </section>
      </main>
    </Shell>
  );
}
