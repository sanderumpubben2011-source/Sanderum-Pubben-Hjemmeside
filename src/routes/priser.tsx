import { createFileRoute } from "@tanstack/react-router";
import { Note, PageIntro, PriceMenu } from "@/components/content";
import { Shell, usePub } from "@/components/shell";

export const Route = createFileRoute("/priser")({
  head: () => ({ meta: [{ title: "Priser · Sanderum Pubben" }] }),
  component: PricesPage,
});

function PricesPage() {
  const { site, prices } = usePub();
  return (
    <Shell>
      <main className="pb-16">
        <PageIntro
          kicker="Priser"
          title="Kortet"
          lede="Priser og tilbud fra huset."
        />
        <div className="mx-auto max-w-6xl space-y-8 px-5">
          {!site.pricesLive ? (
            <Note>
              Tallene er vejledende, indtil kortet er sat endeligt. Spørg i baren, hvis du er i tvivl.
            </Note>
          ) : site.pricesNote ? (
            <Note>{site.pricesNote}</Note>
          ) : null}
          <PriceMenu prices={prices} />
        </div>
      </main>
    </Shell>
  );
}
