import { useEffect, useState, type ReactNode } from "react";
import { Link, getRouteApi, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { phoneHref } from "@/lib/pub/format";
import { SocialLinks } from "@/components/content";

const root = getRouteApi("__root__");

const NAV = [
  { to: "/", label: "Hjem" },
  { to: "/kalender", label: "Kalender" },
  { to: "/priser", label: "Priser" },
  { to: "/galleri", label: "Galleri" },
  { to: "/holdet", label: "Holdet" },
  { to: "/kontakt", label: "Kontakt" },
] as const;

export function usePub() {
  return root.useRouteContext().pub;
}

function OwnerSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending || !user) return null;
  return (
    <span className="flex items-center gap-3 text-cream">
      <Link to="/ejer" className="text-sm text-cream/70 hover:text-cream">
        Rediger
      </Link>
      <UserButton />
    </span>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const { site } = usePub();
  const logo = site.logoImage || "/media/logo.png";
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-brass-solid/40 bg-walnut text-cream">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
          <Link to="/" className="flex min-w-0 items-center">
            <img src={logo} alt={site.name} className="h-12 w-auto max-w-[42vw] object-contain object-left sm:h-14" />
          </Link>
          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-full px-3 py-2 text-sm text-cream/75 hover:text-cream data-[status=active]:bg-cream/10 data-[status=active]:text-cream"
              >
                {item.label}
              </Link>
            ))}
            <span className="ml-2">
              <OwnerSlot />
            </span>
          </nav>
          <button
            type="button"
            className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-cream/25 lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Luk menu" : "Åbn menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open ? (
          <div className="border-t border-cream/10 px-5 py-4 lg:hidden">
            <nav className="flex flex-col">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="border-b border-cream/10 py-3 text-lg text-cream data-[status=active]:text-brass-solid"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="pt-4">
              <OwnerSlot />
            </div>
          </div>
        ) : null}
      </header>
      {children}
      <footer className="mt-20 bg-walnut text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
          <div>
            <img src={logo} alt="" className="h-16 w-auto sm:h-20" />
            <p className="mt-4 max-w-xs text-sm text-cream/75">{site.tagline}</p>
          </div>
          <div className="text-sm leading-7">
            <p>{site.address}</p>
            <p>{site.city}</p>
            <a className="mt-2 block text-brass-solid" href={phoneHref(site.phone)}>
              {site.phone}
            </a>
            {site.email ? (
              <a className="block text-cream/80" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            ) : null}
          </div>
          <div className="text-sm leading-7 text-cream/75">
            <p className="text-xs font-semibold tracking-widest text-brass-solid uppercase">Følg med</p>
            <div className="mt-3">
              <SocialLinks site={site} tone="dark" />
            </div>
            <p className="mt-6">CVR 33340826</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
