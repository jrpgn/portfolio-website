# Programming Paradigms Portfolio

A multi-tab personal portfolio website built for **CCOM/ICOM** at UPRM. The project demonstrates six programming paradigms running entirely in the browser, plus a curriculum vitae rendered from a JSON data source.

---

## Live Tabs

| Tab | Content |
|---|---|
| **Film** | Puerto Rico Film Trivia — TypeScript OOP quiz engine with scoring |
| **Computer Science** | CV rendered from `cv.json` + Tau Prolog logic knowledge base |
| **Options Trader** | Institutional options flow scanner + Black-Scholes pricer in Python |

---

## Programming Paradigms Implemented

| Paradigm | Language / Tool | Location |
|---|---|---|
| Object-Oriented | TypeScript (`class FilmTrivia`) | `film_trivia.ts` |
| Object-Oriented | JavaScript (`class PortfolioApp`) | `app.js` |
| Functional | JavaScript — `Array.filter()` + `Array.map()`, pure functions, no mutation | `app.js` — `renderCV()`, `renderTradingFlows()` |
| Logic | Prolog via Tau Prolog (in-browser interpreter) | `index.html` — CS tab |
| Imperative | Python via PyScript (WebAssembly) | `index.html` — Trader tab |
| Asynchronous | JavaScript `async/await`, `fetch`, `DOMContentLoaded` | `app.js`, `film_trivia.ts` |
| Event-Driven | DOM event handlers — `onclick`, `addEventListener` | `app.js`, `index.html` |

---

## Project Structure

```
portfolio/
├── index.html          # Main HTML — all three tab sections
├── styles.css          # CSS variables per theme, layout
├── app.js              # PortfolioApp class, tab switching, PDF export
├── cv.json             # CV data — edit this to update your resume
├── film_trivia.json    # Trivia questions — add/remove freely
├── film_trivia.ts      # FilmTrivia TypeScript class (transpiled at runtime)
├── cs_profile_image.png
├── film_profile_image.jpg
├── trader_profile_image.jpg
└── README.md
```

### Key design decisions

- **No build step.** TypeScript is compiled at runtime in the browser using the TypeScript compiler CDN. No `tsc`, no Webpack, no Node.js required.
- **No backend.** All data (`cv.json`, `film_trivia.json`) is fetched client-side with the Fetch API.
- **Theme per tab.** The `data-theme` attribute on `<html>` switches CSS custom properties, giving each tab its own color palette.
- **CV is data-driven.** Set `"is_active": false` on any entry in `cv.json` to hide it from the rendered CV and PDF export without deleting it.

---

## Running Locally

You need a local HTTP server — opening `index.html` directly as a `file://` URL will block `fetch()` calls due to browser CORS policy, so the CV and trivia data will not load.

### Option 1 — VS Code + Live Server (recommended, easiest)

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code.
2. Open the project folder in VS Code (`File → Open Folder`).
3. Right-click `index.html` in the file explorer → **Open with Live Server**.
4. The browser opens automatically at `http://127.0.0.1:5500`.
5. Any file save triggers an automatic page reload.

### Option 2 — Python (no install needed on macOS/Linux)

```bash
# Python 3
cd path/to/portfolio
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.  
Windows users: run the same command in PowerShell or Command Prompt.

### Option 3 — Node.js `serve`

```bash
npm install -g serve
cd path/to/portfolio
serve .
```

Opens at `http://localhost:3000`.

### Option 4 — Node.js `http-server`

```bash
npm install -g http-server
cd path/to/portfolio
http-server -p 8080
```

---

## Cloning this Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

Then start any of the local servers above from inside that folder.

---

## Customizing the CV

Open `cv.json`. Each entry has an `"is_active"` field:

```json
{
  "id": 7,
  "category_name": "Certifications",
  "items": [
    { "detail": "CompTIA Security+", "is_active": true  },
    { "detail": "CCNA (in progress)", "is_active": false }
  ],
  "is_active": true
}
```

- `"is_active": true` on the category → category is rendered.
- `"is_active": false` on a category → entire section hidden.
- `"is_active": false` on an item → that line is excluded; the rest of the category still shows.

To export the CV as PDF, go to the **Computer Science** tab and click **Download CV 📥**.

---

## Adding Trivia Questions

Open `film_trivia.json` and append a new object to the array. The quiz auto-detects the number of questions — no code changes needed.

```json
{
  "id": 11,
  "question": "Your question here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "fact": "Explanatory fact shown after the user answers."
}
```

`"correct"` is the zero-based index of the right answer (`0` = Option A, `1` = Option B, etc.).

---

## External Libraries Used

| Library | Purpose | CDN |
|---|---|---|
| html2pdf.js 0.10.1 | PDF export from HTML | cdnjs.cloudflare.com |
| Tau Prolog 0.3.2 | In-browser Prolog interpreter | jsdelivr.net |
| TypeScript 5.3.3 | Runtime transpilation of `film_trivia.ts` | jsdelivr.net |
| PyScript 2024.1.1 | Python via WebAssembly in the browser | pyscript.net |

All libraries are loaded from public CDNs — no `npm install` required.

---

## Academic Context

This project was developed for a Programming Languages course at the **University of Puerto Rico, Mayagüez (UPRM)**. The assignment required at least seven programs covering four mandatory paradigms (Imperative, Functional, Logic, Object-Oriented), a CV rendered from structured data, and PDF export functionality.

---

## References

### External Libraries
- **html2pdf.js** — Erik Knobl. *html2pdf.js v0.10.1*. https://github.com/eKoopmans/html2pdf.js
- **Tau Prolog** — José Antonio Riaza Valverde. *Tau Prolog v0.3.2 — A Prolog interpreter in JavaScript*. http://tau-prolog.org
- **TypeScript** — Microsoft. *TypeScript v5.3.3*. https://www.typescriptlang.org
- **PyScript** — Anaconda, Inc. *PyScript 2024.1.1 — Python in the browser via WebAssembly*. https://pyscript.net

### Paradigm References
- **Black-Scholes Model** — Black, F., & Scholes, M. (1973). *The Pricing of Options and Corporate Liabilities*. Journal of Political Economy, 81(3), 637–654. https://doi.org/10.1086/260062
- **Functional Programming** — Hughes, J. (1989). *Why Functional Programming Matters*. The Computer Journal, 32(2), 98–107. https://doi.org/10.1093/comjnl/32.2.98
- **Logic Programming** — Kowalski, R. (1979). *Algorithm = Logic + Control*. Communications of the ACM, 22(7), 424–436. https://doi.org/10.1145/359131.359136
- **Object-Oriented Programming** — MDN Web Docs. *Classes — JavaScript*. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
- **Async/Await** — MDN Web Docs. *async function*. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

### Navy IT Rating
- United States Navy. *Information Systems Technician (IT)*. https://www.navy.com/careers-benefits/careers/electronics-technology/information-systems-technician

### Puerto Rico Film Trivia Sources
- Britannica. *Raúl Juliá*. https://www.britannica.com/biography/Raul-Julia
- Britannica. *Benicio del Toro*. https://www.britannica.com/biography/Benicio-Del-Toro
- Britannica. *Rita Moreno*. https://www.britannica.com/biography/Rita-Moreno
- Britannica. *José Ferrer*. https://www.britannica.com/biography/Jose-Ferrer
- Library of Congress. *DIVEDCO — Division of Community Education Film Collection*. https://www.loc.gov/collections/puerto-rico-division-of-community-education/
