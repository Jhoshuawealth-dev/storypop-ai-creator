# Storypop platform update

## Goal
Evolve the existing Storypop project into the responsive creator workspace described in the uploaded brief while preserving its recognizable purple design and existing creation, editing, publishing, and account flows.

## Work
1. Finish the interrupted empty-account migration: replace the remaining calendar and analytics sample-data imports with store-backed posts/projects and honest empty or zero states; clear any other obsolete sample references and restore the build.
2. Rework the existing public entry and local account flow for the web-app positioning: a Storypop landing page with consistent “Start Creating” and “Log In” actions, local-only signup/login, and a dashboard destination. Preserve old paths where practical.
3. Replace the mobile-only app frame as the sole app layout with a responsive, Storypop-styled workspace: grouped collapsible navigation for Dashboard, Create, Intelligence, Growth, Analytics, Settings, and Business-only Monetization; mobile uses a navigation drawer. Keep the existing create/editor/publish routes intact.
4. Add focused, reusable screens for Storypop Clips, Reverse Engineer, Storypop Brain, Content DNA, Trends, Competitor Radar, Experiments, Autopilot, Community Agent, Revenue Intelligence, Affiliate Marketing, and Affiliate Autopilot. Use local state and clearly identified product examples where the brief calls for sample intelligence; do not seed fictional user profiles, projects, posts, or analytics into an account.
5. Build a navigable Settings center for the requested profile, brand, AI/content, characters/voices, social, publishing, notifications, autopilot, monetization, workspace, billing, usage, security/privacy, connected apps, and general preference areas. Reuse existing settings screens where they already work.
6. Align catalog prices, allowances, and feature availability with the uploaded plan structure; apply plan-aware locks and upgrade links to gated features.
7. Verify route loading, local signup/login-to-dashboard, sidebar/drawer navigation, core creator flows, settings, feature gates, mobile/desktop layouts, and the final build.

## Technical details
- Stay frontend-only: no database, production authentication, payment processing, AI deployment, or live social integrations.
- Keep existing TanStack Start routing and Storypop design tokens/components; add route files for newly linked destinations.
- Keep account-owned collections empty by default; isolate requested example intelligence/trend/experiment content from persisted user data.
- Use local app state and small reusable feature modules so future integrations can replace the mock service boundary.