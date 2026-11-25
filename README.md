# Pour Decisions

Website van de whiskyclub Pour Decisions: proeverijen, whiskyreizen en alles eromheen (landen, regio's, distilleries, whisky's met proefnotities). Puur informatief: geen aanmelding, betalingen, inlog of formulieren. Taal van de site: Nederlands.

## Stack

- Nuxt 4 (Vue 3, Nitro) + TypeScript, Tailwind CSS v4, `@nuxt/image`, `@nuxt/fonts` (Fraunces + Inter), `@nuxtjs/sitemap`
- Contentful als headless CMS (`contentful` SDK, rich text server-side naar HTML)
- MapLibre GL voor kaarten (OpenStreetMap-rastertegels, geen API-key)
- Vitest voor unit tests, ESLint via `@nuxt/eslint`
- **Node 22.12+ vereist** (`.nvmrc` = 24). Nuxt 4 draait niet op Node 20.10: de Nuxt CLI gebruikt `util.styleText` (Node 20.12+) en Nuxt vereist 20.19+/22.12+.

## Lokaal draaien

```bash
nvm use            # Node 24
npm install
npm run dev        # http://localhost:3000
```

Zonder Contentful-gegevens gebruikt de site automatisch de voorbeeldcontent in `content/fixtures/*.json`.

| Script | Doel |
| --- | --- |
| `npm run dev` / `build` / `preview` | ontwikkelen, bouwen, build bekijken |
| `npm run lint` | ESLint |
| `npm run typecheck` | `nuxt typecheck` (vue-tsc) |
| `npm test` | Vitest |

## Omgevingsvariabelen

Zie `.env.example`. Tokens zijn alleen server-side (privé `runtimeConfig`), nooit committen.

| Variabele | Omschrijving |
| --- | --- |
| `NUXT_PUBLIC_SITE_URL` | publieke URL (canonical, sitemap, Open Graph) |
| `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT` | space en environment (standaard `master`) |
| `CONTENTFUL_DELIVERY_TOKEN` | Content Delivery API-token (gepubliceerde content) |
| `CONTENTFUL_PREVIEW_TOKEN` + `CONTENTFUL_USE_PREVIEW=true` | concepten bekijken via de Preview API |

Staan `CONTENTFUL_SPACE_ID` en een token niet beide ingesteld, dan worden de fixtures getoond.

## Contentful koppelen

De site past zich aan jouw bestaande content models aan; de site maakt of wijzigt niets in Contentful (alleen de read-only Delivery/Preview API).

1. Maak in je space (*Settings → API keys*) een Delivery- en Preview-token. De site leest de default locale (nu `en-US`).
2. Kopieer `.env.example` naar `.env` en vul `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT`, `CONTENTFUL_DELIVERY_TOKEN` (en optioneel `CONTENTFUL_PREVIEW_TOKEN`) in.
3. Start de site opnieuw: de content komt nu uit Contentful. Zonder afbeelding toont de site een kleurverloop.
4. Webhook: *Settings → Webhooks → Add webhook*, URL = de Netlify build hook (zie hieronder), trigger op *Publish* en *Unpublish* van Entry en Asset. Zo staat gepubliceerde content binnen een paar minuten live.

De site vraagt eerst de beschikbare content types op en leest alleen de types die bestaan. Een ontbrekend type (bijvoorbeeld `trips`) geeft dus geen fout, maar lege content.

### Wat de site leest

Content type id's en velden (`*` = verplicht in Contentful):

| Content type | Velden |
| --- | --- |
| `countries` | `name`*, `description` (rich text) |
| `regions` | `regionName`, `country`* (→ countries), `description` (rich text) |
| `distilleries` | `name`*, `slug`*, `image`* (asset), `location` (Location), `country`* (→ countries), `region` (→ regions) |
| `whiskies` | `name`*, `slug`*, `image` (asset), `age`, `isNas`*, `alcoholPercentage`*, `notes` (rich text), `cask`* (lijst), `distilleries` (→ distilleries, many), `brand` (Short text), `country` (→ countries), `region` (→ regions), `distillery` (→ distilleries, oud) |
| `tastings` | `name`*, `date`* (datum met tijd), `description` (rich text), `images` (assets), `whiskies` (→ whiskies), `location` |
| `reviews` | `title`*, `description` (rich text), `whisky`* (→ whiskies), `rating`* (1 tot 5) |
| `trips` | bestaat nog niet, zie [Trips-model](#trips-model) |

Hoe dat op de site terechtkomt:

- **Slugs**: heeft een entry geen `slug`-veld, dan wordt die afgeleid van de naam (kleine letters, zonder accenten en `#`, met streepjes): "United States" wordt `united-states`, "#11 Cask finishes" wordt `11-cask-finishes`. Hebben twee entries van hetzelfde type dezelfde slug, dan houdt de entry met een eigen `slug` (of anders de oudste) de slug en krijgen de andere een stuk van hun entry-id erachter (`peaty-party-ab12cd`). **Let op:** een afgeleide slug is de URL van de pagina. Hernoem je een entry zonder `slug`-veld, dan verandert de URL. Voeg een `slug`-veld toe om URL's vast te zetten.
- **Landnamen en regionamen** worden getoond zoals ze in Contentful staan (nu Engels: "Scotland").
- **Vlaggen** komen uit een vaste lijst op Engelse landnaam (de tien landen die er nu in staan plus Taiwan, Sweden, Australia, Canada, England, Wales, Finland, Denmark, Switzerland, Italy, Austria, South Africa en New Zealand). Onbekend land: geen vlag.
- **Samenvattingen** van proeverijen, landen, regio's en distilleries zijn een korte tekst (±140 tekens) uit de `description`, tenzij er een `summary` is.
- **Omslagfoto van een proeverij**: `featuredImage`, anders de eerste afbeelding van `images`, anders een (per proeverij vaste) illustratie van een glas whisky.
- **Whisky**: ABV, leeftijd of "NAS" (als `isNas` aan staat), vaten als chips en `notes` als proefnotities. Land en regio komen uit de whisky zelf én uit al zijn distilleries (zonder dubbelen).
- **Blend**: een whisky met meer dan één distillery in `distilleries` is een blend (geen apart veld of type). `brand` is optioneel en staat op kaarten boven de naam; zonder brand staat daar de distillery, of "N distilleries" bij een blend. `distilleries` (Reference, many → distilleries), `distillery`, `country` en `region` zijn allemaal optioneel, maar een whisky zonder enige distillery wordt niet getoond. Het oude `distillery`-veld wordt nog steeds gelezen (samen met `distilleries`, zonder dubbelen) en kan weg zodra alle whisky's `distilleries` gebruiken.
- **Distillery zonder regio** staat onder het land (`/countries/<land>`, filters en kaart).
- **Reviews** verschijnen op de whisky-pagina met sterren en het gemiddelde; zonder reviews is het blok verborgen. Aankomende proeverijen tonen nooit hun whisky's.

### Optionele velden

Voeg je deze velden toe in Contentful, dan pakt de site ze zonder codewijziging op:

| Content type | Veld | Effect |
| --- | --- | --- |
| alle types | `seoTitle`, `seoDescription` | eigen paginatitel en -omschrijving |
| alle types | `ogImage` (asset) | afbeelding bij delen op social media |
| `countries`, `regions`, `tastings` | `slug` | vaste URL |
| `countries`, `regions`, `distilleries`, `tastings` | `summary` | korte tekst in plaats van de afgeleide |
| `countries` | `flag` | emoji-vlag als het land niet in de lijst staat |
| `countries`, `regions` | `image` (asset) | omslagfoto |
| `regions` | `flavourProfile` (lijst van korte teksten) | smaakprofiel-chips |
| `tastings` | `countries` (Reference, many, alleen entries van type `countries`), `regions` (Reference, many, alleen entries van type `regions`) | waar het thema over gaat: geen, één of meer landen en regio's. De proeverij toont voor alle gekoppelde plekken een chip en verschijnt op die land- en regiopagina's (en op de landpagina van elke gekoppelde regio) |
| `tastings` | `featuredImage` (Media, één bestand) | omslagfoto voor kaart en pagina; `images` blijft de galerij. Zonder omslagfoto wordt de eerste afbeelding van `images` gebruikt, en zonder afbeeldingen een whisky-illustratie |
| `tastings` | `report` (rich text) | verslag na afloop |
| `distilleries` | `description` (rich text), `town`, `founded` (getal), `website`, `visitable` (boolean) | verschijnt op de distillery-pagina; zonder deze velden worden de onderdelen verborgen |

### Trips-model

Maak handmatig het content type `trips` aan om reisverslagen te tonen. Gebruik exact deze veld-id's:

| Veld | Type |
| --- | --- |
| `name` | Short text (verplicht) |
| `slug` | Short text (uniek) |
| `startDate` | Date |
| `endDate` | Date |
| `summary` | Short text |
| `report` | Rich text |
| `photos` | Media, many files |
| `regions` | Reference, many → regions |
| `distilleries` | Reference, many → distilleries |
| `seoDescription` | Short text |

De eerste foto is de omslagfoto. Reizen zonder `startDate` worden overgeslagen. Optioneel: `itinerary` (JSON) met een dagverslag, `[{ "day": 1, "title": "…", "text": "…" }]`.

## Deploy naar Netlify

1. Nieuwe site vanuit deze repository; `netlify.toml` bevat het build-commando (`npm run build`), publish-map (`dist`) en `NODE_VERSION=24`.
2. Zet de omgevingsvariabelen uit het kopje hierboven in Netlify (*Site configuration → Environment variables*).
3. Maak een build hook (*Build & deploy → Build hooks*) en gebruik die URL in de Contentful-webhook.

### Snel online zonder GitHub (statisch)

`npm run generate:static` maakt een volledig statische site in `.output/public`. Sleep die map (of een zip ervan) naar https://app.netlify.com/drop. Content en aankomend/archief liggen dan vast op het moment van genereren; bij elke wijziging opnieuw genereren en uploaden. Voor automatische updates vanuit Contentful gebruik je de deploy hierboven.

Rendering: alleen `/about` en `/contact` worden bij de build geprerenderd (`nitro.prerender` in `nuxt.config.ts`); ze tonen geen Contentful-content. Alle andere pagina's worden bij elk bezoek opnieuw opgebouwd en er is geen cache: bij elke paginaweergave wordt de content vers uit Contentful opgehaald (gelijktijdige bezoekers delen één ophaalactie, en alleen als Contentful faalt wordt de laatst bekende content getoond). Een gepubliceerde wijziging staat dus na een refresh online, binnen de eigen vertraging van de Contentful CDN (enkele seconden). De site blijft portable: Nitro kiest het juiste preset automatisch (Netlify, Vercel) en voor andere hosts volstaat `NITRO_PRESET`.

## Contentmodel

Het domeinmodel (`shared/types/content.ts`) is onafhankelijk van Contentful; `server/utils/content/contentful.ts` vertaalt de velden hierboven daarnaar. Verwijzingen lopen via slugs.

```text
country <- region <- distillery <- whisky (distilleries[], blend bij > 1) <- review
                          ^           ^
trip  --regions[]--> region          |
trip  --distilleries[]--> distillery |
tasting --whiskies[]--> whisky (alleen na afloop),  tasting --countries[]/regions[] (optioneel)--> country/region
```

- **tasting**: `date` bepaalt aankomend vs. archief (afgeleid bij elk verzoek, nooit handmatig). `whiskies[]` en `report` vul je pas na afloop in: de contentlaag haalt de whisky's van aankomende proeverijen uit alle API-output, ook als het veld al gevuld is.
- **trip**: een reisverslag van iets wat de club al gedaan heeft; alle reizen staan nieuwste eerst.
- **distillery**: `location` is een Contentful Location-veld en voedt de kaart; distilleries zonder locatie staan niet op de kaart.
- Omgekeerde verwijzingen (whisky's van een distillerie, proeverijen van een land of regio of met een whisky, reizen langs een distillerie of regio) en gemiddelde review-scores worden in de contentlaag berekend (`server/utils/content/queries.ts`).

## Structuur

```text
app/            pages, components, composables, utils (Nuxt 4 app-map)
server/api/     Nitro API-routes (lijsten + op slug, 404 bij onbekende slug)
server/utils/   content provider: Contentful of fixtures, zelfde API
shared/         domeintypes en views, gedeelde helpers
content/fixtures/   voorbeeldcontent (fictieve data, prijzen en teksten)
tests/          Vitest
```

## Aandachtspunten

- Kaarttegels komen van de publieke OpenStreetMap-tileserver (met bronvermelding). Gebruik bij veel verkeer een eigen tileprovider.
- Contactgegevens op `/contact` en de teksten op `/about` zijn placeholders.
- Afbeeldingen: er worden geen auteursrechtelijk beschermde beelden meegeleverd. Het veld `image` accepteert een Contentful-asset-URL (`images.ctfassets.net`).
