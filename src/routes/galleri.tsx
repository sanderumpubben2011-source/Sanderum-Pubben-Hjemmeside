import { createFileRoute } from "@tanstack/react-router";
import { GalleryGrid, PageIntro } from "@/components/content";
import { Shell, usePub } from "@/components/shell";

export const Route = createFileRoute("/galleri")({
  head: () => ({ meta: [{ title: "Galleri · Sanderum Pubben" }] }),
  component: GalleryPage,
});

function GalleryPage() {
  const { gallery } = usePub();
  return (
    <Shell>
      <main className="pb-16">
        <PageIntro
          kicker="Galleri"
          title="Billeder og film"
          lede="Billard, dart, terrasse og baren."
        />
        <div className="mx-auto max-w-6xl px-5">
          <GalleryGrid items={gallery} />
        </div>
      </main>
    </Shell>
  );
}
