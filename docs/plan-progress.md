## Shoot Extension – Plan & Progress Log

### Next Focus – Popup API Integration Plan
- Introduce a typed API client in the extension (`fetch + zod`) driven by `VITE_API_BASE_URL`, defaulting to `http://localhost:8787/api/v1`.
- Replace mock data in the popup with live queries to backend endpoints (me, friends, friend-requests, groups, group-messages).
- Normalize server responses into UI view-models (friend presence, saved contact, group summaries) and surface loading/error states.
- Trigger user search against `/users/search`, enriching results with friend/request status and wiring friend-request lists to backend payloads.

### Phase Roadmap
- **Phase 0 – Foundations:** Scaffold monorepo structure (`apps/extension`, `apps/backend`, `packages/shared`), establish TypeScript config, linting, shared UI primitives with shadcn/Tailwind, placeholder env handling.
- **Phase 1 – Extension UI:** Implement popup shell with tabs (`Friends`, `Add Friends`, `Groups`), FAB content script, state management with mocked services, Storybook stories for core components.
- **Phase 2 – Backend Services:** Spin up Hono-based API (REST) with Supabase/Postgres integration, OAuth (GitHub & Google) via Auth provider (e.g. Supabase Auth or Auth.js), WebSocket for realtime link delivery.
- **Phase 3 – Integration & Hardening:** Wire extension to live APIs, implement background service worker flows, notifications, end-to-end OAuth in-browser, testing & telemetry.

### Progress Log
- **2025-11-13 @ 00:08 IST** – Drafted high-level architecture and phased roadmap aligning with specs; ready to scaffold project structure next.
- **2025-11-13 @ 00:14 IST** – Scaffolded workspace structure (extension, backend, shared packages) with TypeScript configs and installed dependencies; ready to build extension UI skeleton.
- **2025-11-13 @ 00:26 IST** – Built extension popup UI skeleton (React + Tailwind), tabs per wireframe with mock data, FAB content script, and background worker stub; workspace typecheck passing.
- **2025-11-13 @ 00:38 IST** – Fixed Tailwind PostCSS config by adding `@tailwindcss/postcss`, clearing dev build error.
- **2025-11-13 @ 00:46 IST** – Implemented backend placeholder API (auth, users, friends, groups, messages) with mock data, CORS, and health checks; typecheck green across workspaces.
- **2025-11-13 @ 01:13 IST** – Replaced popup mock data with live API integration (friends, requests, groups, messages, search), added typed client + env config, and surfaced loading/error states; workspace typecheck still clean.
- **2025-11-13 @ 01:54 IST** – Added message send flow (backend `/messages/send`, popup Send button hooked to active tab URL, basic error/loader handling) and refreshed manifest permissions.
- **2025-11-13 @ 02:08 IST** – Introduced glassmorphism theme tokens (colors, blur, gradients) and refreshed popup primitives + layout for cohesive frosted-glass styling with generous spacing and clear active states.


