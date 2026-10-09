# Ocean Portfolio

Personal portfolio for Prem Thakkar. Scrolling dives from a moonlit ocean surface down through the sunlight, twilight and midnight zones into the abyss, built with Next.js and Three.js (React Three Fiber).

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in out/
```

## Edit

- Text, projects and links: `src/lib/content.ts` (set `linkedin` to show the LinkedIn button)
- 3D scene: `src/components/ocean/`
- Section depths: the `data-depth` attributes in `src/app/page.tsx`

## Deploy

Every push to `main` builds the site and publishes it to [premthakkar8.github.io](https://premthakkar8.github.io) through GitHub Actions (`.github/workflows/deploy.yml`).
