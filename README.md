# Arhaan Khan — Portfolio

Dark, minimal portfolio with interactive project demos. Every control inside a
project card is clickable and explains what it does in the real project
(watch the `EXPLAINER` bar at the bottom of each card).

Built with [Vite](https://vitejs.dev) and [anime.js v4](https://animejs.com).

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Structure

- `index.html` — all content and demo markup
- `src/style.css` — design system (colors/type in `:root`)
- `src/main.js` — cursor, hero intro, scroll reveals, click-to-explain system
- `src/demos.js` — the seven interactive project demos
