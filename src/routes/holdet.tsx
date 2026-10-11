import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, StaffCards } from "@/components/content";
import { Shell, usePub } from "@/components/shell";

export const Route = createFileRoute("/holdet")({
  head: () => ({ meta: [{ title: "Medarbejdere · Sanderum Pubben" }] }),
  component: StaffPage,
});

function StaffPage() {
  const { staff } = usePub();
  return (
    <Shell>
      <main className="pb-16">
        <PageIntro
          kicker="Holdet"
          title="Medarbejdere"
          lede="Ejer, bartender, kasserer og den der passer de sociale medier."
        />
        <div className="mx-auto max-w-6xl px-5">
          <StaffCards people={staff} />
        </div>
      </main>
    </Shell>
  );
}
