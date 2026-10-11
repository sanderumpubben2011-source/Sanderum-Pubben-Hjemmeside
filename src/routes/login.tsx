import { useState, type FormEvent } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log ind · Sanderum Pubben" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <main className="min-h-dvh bg-walnut" />;
  if (user) return <Navigate to="/ejer" />;
  return <LoginForm />;
}

function LoginForm() {
  const [mode, setMode] = useState<"ind" | "opret">("ind");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "opret") {
        const { error: signError } = await authClient.signUp.email({
          email,
          password,
          name: name || "Personale",
          callbackURL: "/ejer",
        });
        if (signError) throw new Error(signError.message || "Kunne ikke oprette kontoen.");
      } else {
        const { error: signError } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/ejer",
        });
        if (signError) throw new Error(signError.message || "Kunne ikke logge ind.");
      }
      window.location.href = "/ejer";
    } catch (err) {
      setError(danishAuth(err instanceof Error ? err.message : "Noget gik galt."));
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-paper px-6 py-16 text-ink">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="text-sm text-muted">
            Tilbage til pubben
          </Link>
          <h1 className="mt-6 font-display text-5xl leading-none">Log ind</h1>
          <p className="mt-4 text-sm leading-6 text-muted">Kun til dem, der arbejder i huset.</p>
          <div className="mt-8 grid grid-cols-2 rounded-full bg-paper-2 p-1">
            <button
              type="button"
              className={`min-h-11 rounded-full text-sm ${mode === "ind" ? "bg-walnut text-cream" : ""}`}
              onClick={() => setMode("ind")}
            >
              Log ind
            </button>
            <button
              type="button"
              className={`min-h-11 rounded-full text-sm ${mode === "opret" ? "bg-walnut text-cream" : ""}`}
              onClick={() => setMode("opret")}
            >
              Opret konto
            </button>
          </div>
          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            {mode === "opret" ? (
              <label className="block text-sm">
                Navn
                <input
                  className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                />
              </label>
            ) : null}
            <label className="block text-sm">
              E-mail
              <input
                type="email"
                required
                className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </label>
            <label className="block text-sm">
              Adgangskode
              <input
                type="password"
                required
                minLength={8}
                className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-3"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "opret" ? "new-password" : "current-password"}
              />
            </label>
            {error ? <p className="text-sm text-brass">{error}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="min-h-11 w-full rounded-full bg-ink text-sm font-semibold text-paper disabled:opacity-60"
            >
              {busy ? "Vent…" : mode === "opret" ? "Opret og fortsæt" : "Log ind"}
            </button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs tracking-widest text-muted uppercase">
            <span className="h-px flex-1 bg-line" />
            eller
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="space-y-2">
            {GROK_PROVIDERS.map((provider) => (
              <button
                key={provider.providerId}
                type="button"
                className="min-h-11 w-full rounded-full border border-line text-sm"
                onClick={() => {
                  void signIn(provider.providerId, { callbackURL: "/ejer" }).catch((err: unknown) => {
                    setError(err instanceof Error ? err.message : "Login fejlede.");
                  });
                }}
              >
                Fortsæt med {provider.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <img src="/media/facade.jpg" alt="" className="hidden h-full w-full object-cover lg:block" />
    </main>
  );
}

function danishAuth(message: string) {
  const text = message.toLowerCase();
  if (text.includes("already") || text.includes("exist")) return "Der findes allerede en konto med den e-mail.";
  if (text.includes("password") || text.includes("invalid") || text.includes("credential")) {
    return "Tjek e-mail og adgangskode. Den skal være mindst 8 tegn.";
  }
  return message;
}
