# Arhaan Khan — Portfolio

Personal portfolio site. Vite + vanilla JS + anime.js v4. Deployed to GitHub Pages
(https://arhaandev24.github.io) via `.github/workflows/deploy.yml` on every push to main.

- `index.html` — all content and demo markup
- `src/style.css` — design system (colors/type tokens in `:root`)
- `src/main.js` — cursor, hero intro, scroll reveals, click-to-explain system, clockwork timeline
- `src/demos.js` — the seven interactive project demos

Run locally: `npm run dev` (port 5173). Build: `npm run build`.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
