# Whack-A-Lindestrand

Ett "Whack-A-Mole"-spel byggt med React, TypeScript och Vite, där målet är att träffa bilder på Alicia och Alexander så snabbt som möjligt.

## Skärmdump

![Skärmdump av spelet](screenshot.png)

## Funktioner

*   **Spelmekanik:** Träffa mullvadarna (Alicia/Alexander) som slumpmässigt dyker upp i ett 3x3-rutnät.
*   **Poängsystem:** Få poäng för varje träff. Svårighetsgraden påverkar poängen per träff.
*   **Streak:** Bygg upp en streak genom att träffa flera mullvadar i rad för bonuspoäng (framtida funktion).
*   **Tidsgräns:** Spelet har en tidsgräns (standard 30 sekunder).
*   **Power-ups:** Samla power-ups slumpmässigt under spelets gång:
    *   ✨ Dubbla poäng
    *   ⏰ Slow motion (mullvadarna rör sig långsammare)
    *   ⌛ Extra tid (+5 sekunder)
*   **Svårighetsgrader:** Välj mellan Lätt, Normal och Svår, vilket påverkar mullvadarnas hastighet och poäng.
*   **Karaktärsval:** Spela med enbart Alicia, enbart Alexander, eller båda blandat.
*   **High Scores:** Spelet sparar de 10 bästa poängen lokalt i webbläsaren.
*   **Spelstatistik:** Håller reda på totalt antal spel, total poäng, bästa poäng och längsta streak lokalt.
*   **Ljud & Vibration:** Ljudeffekter vid träffar, power-ups, start och slut. Vibration vid träff (om enheten stödjer det).
*   **Animationer:** Använder Framer Motion för smidiga animationer och `canvas-confetti` för konfetti vid träffar.
*   **Responsiv design:** Anpassar sig till olika skärmstorlekar.

## Teknologier

*   **Frontend:** React, TypeScript
*   **Byggverktyg:** Vite
*   **Styling:** Tailwind CSS
*   **Animationer:** Framer Motion, Canvas Confetti
*   **Linting/Formatering:** ESLint

## Hur man kör projektet

1.  **Klona repot (om du inte redan gjort det):**
    ```bash
    git clone <repo-url>
    cd WhackALindestrand
    ```
2.  **Installera beroenden:**
    ```bash
    npm install
    # eller yarn install / pnpm install
    ```
3.  **Starta utvecklingsservern:**
    ```bash
    npm run dev
    # eller yarn dev / pnpm dev
    ```
4.  Öppna webbläsaren och gå till den lokala adressen som anges i terminalen (oftast `http://localhost:5173`).

## Tillgängliga skript

*   `npm run dev`: Startar utvecklingsservern med Hot Module Replacement (HMR).
*   `npm run build`: Bygger applikationen för produktion till `dist`-mappen.
*   `npm run lint`: Kör ESLint för att hitta och fixa problem i koden.
*   `npm run preview`: Startar en lokal server för att förhandsgranska produktionsbygget.
