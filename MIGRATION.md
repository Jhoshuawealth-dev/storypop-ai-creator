# Storypop AI — production data migration (in progress)

`src/lib/mock-data.ts` has been DELETED. All demo/fake content must be removed from the app.
The app must behave like a real, empty, production account.

## New modules

### `src/lib/catalog.ts` — static product config only

Exports: types (`Project`, `ProjectStatus`, `Character`, `Scene`, `Voice`, `AppNotification`,
`ScheduledPost`, `Plan`, `PlatformSpec`), `formatDuration`, `characterStyles`, `voices`,
`videoStyles`, `emptyScript`, `sceneTemplate`, `platformSpecs`, `plans` (each with
`minuteSeconds`), `creditPacks` (each with `seconds`), `editorTools`, `suggestedCommands`, `faqs`.

There is NO `platforms`, `captionMock`, `defaultScript`, `defaultScenes`, `analyticsSeries`,
`retentionSeries`, `analyticsTotals`, `aiInsights`, `currentUser`, `usage`, `projects`,
`characters`, `notifications`, `scheduledPosts`, `avatarJoshua`/`avatarSarah`/`avatarDavid`/
`avatarAva`/`thumbSneaker` (those image assets were deleted too).

### `src/lib/store.tsx` — `useApp()` holds all user data (persisted to localStorage, empty by default)

```
user: { fullName, name, email, avatar, bio, language }   // all "" initially
subscription: { planId: string|null, billing, minutesTotalSeconds, minutesUsedSeconds, renewsOn }
planName: string            // "Free" when no plan
minutesTotal / minutesUsed  // seconds
projects: Project[]         // [] initially
characters: Character[]     // []
notifications: AppNotification[]  // []  (n.time is an ISO string)
posts: ScheduledPost[]      // []
socialAccounts: { id, name, connected, handle }[]  // all disconnected
isAuthenticated, hydrated
draft: CreateDraft          // includes draft.post: { title, description, hashtags[], cta, keyword, platforms[] }
```

Actions: `signIn(profile?)`, `signOut()`, `updateUser`, `subscribe(planId, billing)`, `cancelPlan`,
`addMinutes(seconds)`, `consumeMinutes(seconds)`, `addProject`, `updateProject`, `removeProject`,
`addCharacter`, `removeCharacter`, `addNotification({type,title,body})`, `markNotificationsRead`,
`clearNotifications`, `addPost`, `updatePost`, `removePost`, `toggleSocial(id, handle?)`,
`updateDraft`, `updatePost_Draft` (patches `draft.post`), `resetDraft`.

`src/lib/post-seo.ts`: `analysePost`, `combinedLimits`, `specFor`, `suggestHashtags`, `normaliseHashtag`.

## Rules for every screen

1. Never import `@/lib/mock-data` (gone). Import types/catalog from `@/lib/catalog`, user data from `useApp()`.
2. No hardcoded fake user content anywhere: no fake names, handles, project titles, thumbnails,
   view counts, dates, analytics numbers, devices, chat transcripts, or "Sneaker Promo" style copy.
3. Empty data must render a real empty state (`EmptyState` from `@/components/ui/feedback`) or
   zeroed metrics ("0", "—"), not invented numbers.
4. Derive stats from store data (e.g. total projects = `projects.length`, analytics totals = 0 until
   posts exist). Keep the UI/design identical — same layout, purple design system, same components.
5. Where a screen previously read a mock record by id, read from `useApp()` collections and render a
   graceful "not found" empty state when missing.
6. Images: avatar assets were deleted. Use initials in a `bg-primary-soft` circle when
   `user.avatar` / `character.image` / `project.thumb` is empty.
7. TypeScript is strict (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`). Type all callbacks;
   never use `any`; guard array index access.
8. Do not change routing/file names. Do not add backend code.
