# Shannon Liu — Portfolio

React + Vite, deployed to GitHub Pages by `.github/workflows/deploy.yml`. Hash routing (`#/work/mini-clint`) keeps deep links working on Pages.

    npm install
    npm run dev      # local
    npm run build    # production build into dist/

## Adding content
- **Projects, experience, résumé link:** edit `src/data.js`. A project is one object; add it to `projects`.
- **Images:** put files in `public/assets/img/` and reference them in the project's `media` list with their real width/height (used to prevent layout shift). Add public-safe PDFs or other files under `public/` and link them from the project's `links`.
- **Résumé PDF:** place `Shannon_Liu_Resume.pdf` in `public/`, then set `RESUME_URL` in `src/data.js`. Until then the page says plainly that the PDF is not published.

## Media provenance (read before publishing more)
- `mini-clint-team.jpg`, `mini-clint-first-place.jpg`, `flavors-pass.jpg`, `flavors-scanner.jpg` are the real images, cropped out of the old SVG wrappers. They are **small previews (<= 390px)**, not originals. Replace them with the original files when available; the layout adapts.
- The old AWS and Chinchilla certificate previews were **corrupted** (the embedded JPEG data was damaged) and were removed. Certificates appear as text credentials until clean originals are added.
- The Physics AI diagram is drawn from `physics-aid/src/app/api/chat/route.ts` and is labeled as a diagram, not a screenshot.
- Flavors images are privacy-redacted. Never add member names, student info, scannable QR codes or private backend URLs.
