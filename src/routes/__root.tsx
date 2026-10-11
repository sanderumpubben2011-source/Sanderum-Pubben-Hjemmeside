import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { getPub } from "@/lib/pub/api";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  beforeLoad: async () => ({ pub: await getPub() }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sanderum Pubben · Værtshus i Odense SV" },
      {
        name: "description",
        content:
          "Sanderum Pubben er et lokalt værtshus på Sanderumvej 1 i Odense SV. Se åbningstider, kalender, priser og kontakt.",
      },
      { name: "theme-color", content: "#14161a" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,560;0,9..144,650;1,9..144,560&family=Manrope:wght@400;500;600;700&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { pub } = Route.useRouteContext();
  const backdrop = pub.site.backdrop;
  return (
    <html lang="da" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body data-theme={pub.site.theme} className="bg-paper text-ink">
        <PreviewHostBridge />
        {backdrop ? (
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${JSON.stringify(backdrop)})` }}
          />
        ) : null}
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
