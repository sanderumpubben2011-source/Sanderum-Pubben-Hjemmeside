# Sanderum Pubben

Kildekoden til værtshus-siden. Zip-filen indeholder sider, billeder, video og ejer-redigeringen. `node_modules` er udeladt, så filen kan hentes.

## Sådan kører den

Kræver Node 22.

```bash
npm install
npm run dev
```

Siden ligger på port 8080.

## Ejer

Log ind findes ikke i menuen. Personalet går direkte til `/login`. Den første konto, der trykker **Overtag som ejer**, kan redigere huset, kalender, priser og billeder.

## Hvad ejeren kan rette

- Navn, undertitel og teksten om huset
- Telefon, e-mail, adresse, by
- Facebook og Instagram
- Åbningstider og noter
- Logo, forsidebillede og baggrund
- Farvetema: Papir, Nat eller Filt
- Events (tekst, dato, billede)
- Priser
- Galleri: billeder og video

De fire bokse på forsiden (Billard, Dart, Rafle, Terrasse) og menupunkterne er en fast del af designet og rettes ikke i ejerpanelet.
