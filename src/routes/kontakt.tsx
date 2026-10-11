import { createFileRoute } from "@tanstack/react-router";
import { HoursTable, Kicker, PageIntro, SocialLinks } from "@/components/content";
import { Shell, usePub } from "@/components/shell";
import { MAP_SRC, mapsLink, osmLink, phoneHref } from "@/lib/pub/format";

export const Route = createFileRoute("/kontakt")({
  head: () => ({ meta: [{ title: "Kontakt · Sanderum Pubben" }] }),
  component: ContactPage,
});

function ContactPage() {
  const { site, weekday } = usePub();
  return (
    <Shell>
      <main className="pb-16">
        <PageIntro
          kicker="Kontakt"
          title="Vi ses"
          lede="Håber, at vi mødes på Sanderum Pubben."
        />
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2">
          <div>
            <a href={phoneHref(site.phone)} className="font-display text-5xl leading-none sm:text-6xl">
              {site.phone}
            </a>
            {site.email ? (
              <a href={`mailto:${site.email}`} className="mt-4 block text-lg text-brass">
                {site.email}
              </a>
            ) : null}
            <p className="mt-6 text-lg">
              {site.address}
              <br />
              {site.city}
            </p>
            <p className="mt-6 font-display text-2xl">Hilsen Irene</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={mapsLink(site.address, site.city)}
                className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-paper"
              >
                Rutevejledning
              </a>
              <a
                href={osmLink()}
                className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-semibold"
              >
                Åbn kort
              </a>
            </div>
            <div className="mt-10">
              <Kicker>Sociale medier</Kicker>
              <div className="mt-3">
                <SocialLinks site={site} />
              </div>
            </div>
            <div className="mt-10">
              <Kicker>Åbningstider</Kicker>
              <HoursTable hours={site.hours} weekday={weekday} note={site.hoursNote} />
            </div>
          </div>
          <iframe
            title="Kort til Sanderum Pubben, Sanderumvej 1"
            src={MAP_SRC}
            className="h-96 w-full rounded-card border border-line"
            loading="lazy"
          />
        </div>
      </main>
    </Shell>
  );
}
