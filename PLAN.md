# Juomalaskuri - Juhlien juomatarjoilulaskuri

## Yleiskuvaus

Web-sovellus, joka laskee juhlien juomatarpeen osallistujamäärän ja juhlatyypin perusteella.
Tuottaa selkeän ostoslistan hinta-arvioineen (Alko vs. Viro -vertailu).

## Teknologiavalinta

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** - nopea tyylittely, responsiivinen
- **Suomenkielinen UI**

## Price Provider -arkkitehtuuri (plugin-malli)

```
PriceProvider (interface)
├── StaticAlkoProvider      ← v1: kovakoodatut keskihinnat
├── StaticEstoniaProvider   ← v1: kovakoodatut Viron keskihinnat
├── AlkoExcelProvider       ← myöhemmin: parsii Alkon Excel-hinnaston
├── AlkoScraperProvider     ← myöhemmin: hakee alko.fi:stä
├── SuperalkoProvider       ← myöhemmin: hakee superalko.ee:stä
└── ...                     ← uusia providereja tarpeen mukaan
```

### PriceProvider interface

```typescript
interface PriceProvider {
  id: string;                    // esim. "alko-static", "superalko"
  name: string;                  // esim. "Alko (keskihinnat)", "Superalko"
  country: "FI" | "EE";
  type: "static" | "api" | "scraper" | "excel";

  // Hae hinta juomatyypille
  getPrice(drinkType: DrinkType, unit: DrinkUnit): Promise<PriceResult>;

  // Hae kaikki hinnat kerralla (bulk)
  getAllPrices(): Promise<Map<DrinkType, PriceResult>>;

  // Onko provider saatavilla (esim. API-yhteys toimii)
  isAvailable(): Promise<boolean>;

  // Milloin hinnat päivitetty viimeksi
  lastUpdated(): Date | null;
}

interface PriceResult {
  price: number;              // euroa
  unit: DrinkUnit;            // esim. "bottle_75cl", "pack_24"
  confidence: "exact" | "estimate";  // onko tarkka vai arvio
  source: string;             // mistä hinta tulee
  url?: string;               // linkki tuotteeseen
}
```

## Sovelluksen rakenne

```
juomalaskuri/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── GuestInput.tsx        # Vierasmäärän syöttö
│   │   ├── PartyTypeSelector.tsx # Juhlatyypin valinta (pohjat)
│   │   ├── CategorySelector.tsx  # Kategorioiden valinta
│   │   ├── DrinkTypeSelector.tsx # Juomatyyppien valinta
│   │   ├── ResultView.tsx        # Tulossivu: ostoslista
│   │   └── PriceComparison.tsx   # Hintavertailu providerien välillä
│   ├── lib/
│   │   ├── calculator.ts         # Laskentalogiikka
│   │   ├── types.ts              # TypeScript-tyypit
│   │   └── partyPresets.ts       # Juhlapohjat
│   └── providers/
│       ├── index.ts              # Provider registry
│       ├── types.ts              # PriceProvider interface
│       ├── StaticAlkoProvider.ts # v1: Alkon keskihinnat
│       └── StaticEstoniaProvider.ts # v1: Viron keskihinnat
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Käyttöliittymän flow

### Vaihe 1: Juhlan tyyppi (valinnainen pikakäynnistys)
- Valmiit pohjat: Häät, Synttärit, Vappu/Juhannus, Pikkujoulut, Oma juhla
- Pohja esitäyttää kategoriat ja juomatyypit

### Vaihe 2: Vierasmäärä
- Aikuisten lukumäärä
- Lasten lukumäärä
- Juhlan kesto: lyhyt (2-3h), normaali (4-5h), pitkä (6h+)

### Vaihe 3: Kategoriat
- [ ] Alkumalja (alkoholi / alkoholiton)
- [ ] Ruokajuomat
- [ ] Iltajuomat / jatkot

### Vaihe 4: Juomatyypit
**Alkoholilliset:**
- Viinit (punaviini, valkoviini, rosé)
- Kuohuviini / samppanja
- Oluet
- Siiderit
- Lonkerot
- Väkevät (drinkkeihin)

**Alkoholittomat:**
- Alkoholiton kuohuviini
- Alkoholiton olut
- Alkoholiton siideri
- Mehut
- Limsat (Coca-Cola, Jaffa ym.)
- Kivennäisvedet / Vichy
- Vesi

### Vaihe 5: Tulokset
- Ostoslista juomatyypeittäin
- Hintavertailu: Alko vs. Viro (provider-kohtaisesti)
- Säästöpotentiaali
- Tulostus / jako

## Laskentalogiikka

### Kulutusarviot per aikuinen

| Tilaisuuden osa | Juomia/hlö | Huomio |
|-----------------|------------|--------|
| Alkumalja       | 1 lasi     | - |
| Ruokajuomat     | 2-3 lasia  | ruokailun ajan |
| Iltajuomat      | 2-3/tunti  | juhlan loppuaika |

### Alkoholittomat
- Aina mukana: +20% kokonaismäärästä alkoholittomina vaihtoehtoina
- Vesi: 0.5L per henkilö
- Limsat/mehut lapsille: 3-4 lasia per lapsi
- Vichy/kivennäisvesi: 1 pullo per 3 aikuista

### Juhlapohjat (presets)

**Häät (30 hlö esim.):**
- Alkumalja: kuohuviini + alkoholiton kuohuviini
- Ruoka: punaviini + valkoviini + vesi + limsa
- Ilta: olut, lonkero, siideri + alkoholittomat

**Synttärit:**
- Alkumalja: valinnainen
- Olut, siideri, lonkero + limsat, mehut

**Vappu/Juhannus:**
- Kuohuviini/sima, lonkero, olut, siideri

**Pikkujoulut:**
- Glögi, viinit, olut + glögi alkoholiton

## Toteutusvaiheet

1. Projektin perustaminen (Next.js + Tailwind)
2. Tyypit + PriceProvider-interface + staattiset providerit
3. Laskentalogiikka + juhlapohjat
4. UI-komponentit (wizard)
5. Tulossivu + hintavertailu
6. Viimeistely + deploy
