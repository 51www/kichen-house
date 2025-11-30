# Repository Guidelines

## Project Structure & Module Organization
- `src/main.js` bootstraps Vue 3 + Element Plus and registers map icons.
- `src/App.vue` loads the `DeviceLayoutDesigner` component; layout-specific logic lives under `src/components/`.
- Variation prototypes such as `DeviceLayoutDesigner copy.vue` should either be promoted or removed before release.
- Domain data (panel definitions, device metadata) sits in `src/data/deviceData.js`.
- Styles live in `src/style.css`; static assets stay under `public/`. Config files `vite.config.js` and `package.json` drive build tuning.

## Build, Test, and Development Commands
- `npm install` (or `pnpm install`) syncs dependencies; run whenever `package*.json` changes.
- `npm run dev` launches the Vite dev server with hot reload at http://localhost:5173.
- `npm run build` outputs the production bundle into `dist/`, using Vite + Rollup tree-shaking.
- `npm run preview` serves the `dist/` bundle exactly as it will ship; run it before pushing changes.

## Coding Style & Naming Conventions
- Use Vue SFCs with `<script setup>` and 2-space indentation; keep template blocks lean and move logic into composables when they grow.
- Component filenames/registrations use PascalCase (`DeviceLayoutDesigner.vue`); functions, refs, and state use camelCase, and shared constants use UPPER_SNAKE_CASE.
- Prefer Element Plus components over raw HTML controls; centralize shared styles in `src/style.css` and add scoped styles to components for isolated tweaks.

## Testing Guidelines
- Automated tests are not configured yet; add Vitest + Vue Test Utils whenever introducing non-trivial logic or map interactions.
- Place specs next to the component (`DeviceLayoutDesigner.spec.js`) or under `src/__tests__/`.
- Target >=80% coverage on new modules, mock Tianditu responses, and validate layout changes manually in Chrome and Edge until regression tests exist.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`) with concise, imperative subject lines.
- Keep commits focused (one feature or fix) and add context in the body whenever you touch layout geometry or map APIs.
- PRs must describe the change, link tracker items, list manual test steps (`npm run preview` screenshots for visual updates), and mention pending follow-ups.
- Request at least one review for mapping or Element Plus refactors; avoid merging copy prototypes (`DeviceLayoutDesigner copy.vue`) without cleanup.

## Security & Configuration Tips
- Tianditu keys must live in `.env.local` using Vite prefixes (for example, `VITE_TIANDITU_KEY`) and must never be committed.
- Do not embed credentials or dynamic tokens inside `src/data/deviceData.js`; load them from environment-aware config helpers.
- Audit third-party packages whenever they are bumped; pin exact versions in `package-lock.json` and use `npm audit fix --force` only after code review.
