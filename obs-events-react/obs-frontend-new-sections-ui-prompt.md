# OBS EVENTS — NEW SECTIONS UI BUILD PROMPT (Prompt 3 of the UI series)
**White + red · sponsors · 100 Days Program · speakers · media · launches · Our/Partner/All events · open chapter creation · global loader**

Prerequisite: the homepage (`obs-home-ui-prompt.md`) and inner pages (`obs-inner-pages-ui-prompt.md`) are built. Reuse their Header, SubNav, Footer, PublicLayout, tokens (Prompt 1 §1), rules (Prompt 1 §9.5: React 18 functional components, Tailwind tokens only, no UI/carousel libraries, hand-rolled carousels), the `EventImage` component, and the `mock/api.js` pattern (page components call ONLY api.js). This file IS the visual reference — do not browse any website. Use given values exactly.

Backend for these features is Phase 5 in obs-events-build-plan.md; build the UI now against mock data so it drops onto the real API later by swapping api.js.

---

## 0. NEW ROUTES (react-router-dom)

```
/program                     100 Days Program — overview + day-by-day agenda
/program/day/:n              a single day (1–100): programs + events that day across countries
/speakers                    Speakers directory
/speakers/:slug              Speaker profile
/sponsors                    Sponsors showcase (by tier) + what we offer
/become-a-sponsor            Sponsor / Partner application form
/news                        News & Articles listing
/news/:slug                  Article detail
/launches                    Launchpad — featured launch events
/chapters/create             Create a chapter (any signed-in user)
/account/chapters            Chapters I created
```
Plus additions to existing pages: a global loader, a chapter-highlight band + new rails on the Home page, and Our/Partner/All tabs on `/events`.

## 1. GLOBAL LOADER (branded)

- **Initial app load:** full-screen white overlay, centered. The "OBS" wordmark in brand-red at 40px/800 with "One Business Season" 11px/500 #999 beneath; below it a 3-dot bounce (three 8px brand-red dots, staggered `@keyframes` bounce, 1.4s infinite) OR a thin 2px brand-red progress bar sliding L→R. Fades out (opacity 300ms) once the first data resolves. Build as `components/common/AppLoader.jsx`.
- **Route transitions & data fetches:** a 3px brand-red top progress bar (like a slim NProgress) that animates 0→80% on navigation start and completes on load. Build `components/common/RouteProgress.jsx` driven by router navigation state; never block the whole screen for in-page fetches — use the skeletons from Prompts 1–2 for content areas.
- **Section loaders:** reuse the shimmer skeleton; spinner only inside buttons (16px ring) during submit.

## 2. HOME PAGE ADDITIONS (extend the Prompt-1 Home)

Insert these in this order between existing homepage blocks:

**A. Chapter-system highlight band** (below the hero). Full-container, brand-gradient background, radius 12, 32px padding, centered white text: eyebrow 12px/600 uppercase +0.4px "THE OBS NETWORK"; headline 30px/800 "108 chapters. One global business season."; sub 15px/500 white/90% "Explore events by country, city, or interest — and start your own chapter."; two buttons: white "Explore chapters" (brand-red text) + ghost outline-white "Create a chapter" → /chapters/create. Numbers strip beneath (3–4 counters, 22px/800 white + 12px label): "108 Chapters · 54 Countries · 100-Day Season · N Events".

**B. 100 Days Program banner** (own section). Wide card, radius 12, dark-photo `EventImage 16/5` with gradient scrim; overlay left: badge "OBS 100 DAYS", title 26/700 white "The 100 Days — 15 Oct to 22 Jan", sub "100 days of business events across the OBS world, every year", white "View the agenda" button → /program. If the program is live, add a small "Day 42 of 100" pill.

**C. Featured speakers rail.** Section header "Speakers" + "See all ›" → /speakers. Horizontal rail of speaker cards (see §4 card) — 5/4/3/2.2 responsive.

**D. Launches rail.** Header "Launchpad" + "See all ›" → /launches. Rail of launch event cards (EventCard with a red "LAUNCH" badge top-left; if a launch date is future, show a compact countdown chip "in 4d 6h").

**E. Sponsors strip.** Centered heading "Our sponsors & partners" 20/700 + sub 12 muted. A grayscale logo row (logos 120×48, `EventImage` contain on white, opacity 0.7 → 1 on hover), grouped subtly by tier label above small clusters (Title · Technology · Media · Partners). Ends with a text link "Become a sponsor ›" → /become-a-sponsor.

**F. From the newsroom rail.** Header "News & articles" + "See all ›" → /news. Rail of 4 article cards (§7).

## 3. 100 DAYS PROGRAM

**/program overview:** hero band (brand-gradient or dark photo) — "OBS 100 Days", "15 October → 22 January", one-paragraph intro, and a **season status**: if today is inside the window show "Day X of 100" with a slim progress bar; else "Starts in N days" / "Next season: 15 Oct {year}". Note it repeats every year.
- **Country filter chips** (All + top countries with flags) that scope the agenda.
- **Day-by-day agenda:** a vertical list of 100 day-rows (virtualize/lazy-render in chunks of ~20 with a "Load more days" button). Each day-row: left rail date block ("Day 12 · 26 Oct"), title/theme 15/600, then a compact horizontal strip of that day's event cards (mini EventCard: 120px wide, banner + title + city + chapter flag). Days with no events show a muted "No events yet — add one" with a link. Today's day-row highlighted (brand-red-soft left border).
- Sticky mini-nav on the side (desktop): jump to "This week / Day 1 / Day 50 / Day 100".

**/program/day/:n:** header "Day N · {date} · {theme}"; the events happening that day as a full EventCard grid, with the country filter; prev/next day arrows. Empty state if none.

## 4. SPEAKERS

**/speakers directory:** H1 "Speakers", search input (name/topic, 200ms debounce), topic filter chips. Grid of speaker cards: 4/3/2 columns.
**Speaker card:** square `EventImage 1/1` photo (radius 10), name 16/600, role + company 12 muted 1-line ("Partner, Acme Capital"), up to 2 topic chips (10px, brand-red-soft), hover lift + shadow. Featured speakers show a small gold-free red "★ Featured" 10px chip.
**/speakers/:slug profile:** two-column (stacks mobile) — left: large photo `1/1` (radius 12), social icon row (LinkedIn, X, website, 28px circles); right: name 28/700, role + company 15 muted, topic chips, "About" bio 14/1.7 with read-more clamp. Below: "Speaking at" — grid of their upcoming EventCards; empty state if none.

## 5. SPONSORS (display + tiers + what we offer)

**/sponsors showcase:** hero line "Our sponsors & partners" 28/700 + intro. Then **one section per tier, in this order** with a tier heading (18/700) + one-line description: **Title**, **Presenting**, **Event**, **Technology**, **Media**, **Community Partners**. Each section = logo grid (logos 160×72, `EventImage` contain on white cards, 1px border, radius 10, hover border brand-red; click → sponsor.website new tab). Title/Presenting tiers get larger cards (240×108) in a centered single row.
**"What we offer" block:** a comparison of tiers as cards (not a dense table) — each tier card lists its placements as check bullets, e.g. Title: "Logo in site header area · top of every event page · 100 Days hero · dedicated feature article · on-stage & booth space at flagship events". Technology/Media/Event/Partner list their (smaller) placements. End every sponsors surface with a prominent red CTA "Become a sponsor / partner" → /become-a-sponsor.
**On event details page (extend Prompt 2 §3):** add a "Sponsors" block below the organizer card — small grayscale logo row grouped by tier; only shows if the event has sponsors. Comes from the event's mock data (`sponsors` array).

## 6. BECOME A SPONSOR / PARTNER

**/become-a-sponsor:** intro band restating the offer + tiers at a glance (small chips). Form card (max-w 640, white, radius 12, shadow): fields — Organization name, Contact name, Email, Phone, Website (optional), **Interested tier** (select: Title / Presenting / Event / Technology / Media / Community Partner), Message (textarea). 40px inputs, focus ring brand-red, inline validation. Submit = full-width red "Submit application" → button spinner → success card (green check, "Thanks — our partnerships team will be in touch."). Posts via `api.submitPartnerApplication(payload)` (mock: 500ms, returns ok). 12px note: "This starts a conversation; nothing is charged."

## 7. MEDIA — NEWS & ARTICLES

**/news listing:** H1 "News & articles"; type filter chips (All · News · Articles · Press); a featured lead article card on top (wide `16/6` cover + title 22/700 + excerpt + date), then a grid of article cards.
**Article card:** `EventImage 16/9` cover (radius 10), type chip (10px brand-red-soft), title 16/600 2-line clamp, excerpt 13 muted 2-line, date + author 12 muted. Hover lift.
**/news/:slug detail:** centered max-w 760 — cover `16/6`, type chip, title 30/800, byline "By {author} · {date}", body rendered from markdown 16/1.8 (headings, lists, quotes, images via EventImage), share row (WhatsApp/X/LinkedIn/copy), and a "Related" rail of 3 article cards at the end. Reading-friendly line length.

## 8. LAUNCHES — LAUNCHPAD

**/launches:** hero line "Launchpad — what's launching across OBS". Grid of launch EventCards (events flagged `isLaunch`), each with a red "LAUNCH" badge and, for future launches, a live countdown chip ("in 4d 6h", ticking). Optional segmented control "Upcoming · Recently launched". Empty state if none.

## 9. EVENTS BY OWNERSHIP — OUR / PARTNER / ALL

Extend the Prompt-2 `/events` listing: add a **segmented tab control** above the filter chips — **All events · OBS events · Partner events** — bound to `?owner=all|obs|partner` in the URL (default `all`). Each event card gets a tiny ownership tag ("OBS" solid red-soft, "Partner" outline) near the chapter tag. `filterEvents()` gains an `owner` predicate over the mock data's `ownership` field ("OBS" | "PARTNER"). Everything else (filters, sort, pagination, mobile sheet) stays.

## 10. CREATE A CHAPTER (open to any signed-in user)

**Rule:** any signed-in user can create a chapter. (Creating *events* is NOT open — that stays behind organizer approval; do not add event-creation entry points here.)
**/chapters/create:** requires sign-in (redirect to login with return URL if not). Form card (max-w 640): Chapter name; Type (select: Country · City · Community · Industry · Interest); Country (shown only if type = Country/City, with flag); Short description (textarea); Cover image (uploader → in mock, accept a URL or use a default `EventImage`). Live preview of the chapter card as they type. Submit = red "Create chapter" → `api.createChapter(payload)` (mock returns the new chapter with a slug) → redirect to the new chapter page with a success toast "Chapter created". 12px note: "New chapters are reviewed by the OBS team and may be marked official later." (Reflects moderation flag; see build plan.)
**/account/chapters:** a simple list/grid of chapters I created (reuse the chapter card), each with an "Edit" link (edit description/cover only) and a status pill (Live / Under review / Hidden). Empty state with a "Create your first chapter" red button.
**Chapters directory (extend Prompt 2 §6):** keep official chapters in their tier/thematic groups; add a "Community chapters" section at the bottom for user-created ones, and a persistent "＋ Create a chapter" button in the page header.

## 11. MOCK DATA + FILES

Add to `client/src/mock/`:
- `program.json` — one current 100 Days edition `{ name, year, slug, startAt:"YYYY-10-15", endAt:"(YYYY+1)-01-22", theme, coverUrl, status }` + `days: [{ dayNumber 1..100, date, title, theme }]` (generate all 100 with dates from startAt; sprinkle events across ~40 of them).
- `speakers.json` — 16 speakers `{ _id, name, slug, photoUrl(picsum square), title, company, topics[], linkedin, twitter, website, isFeatured }`.
- `sponsors.json` — ~18 sponsors `{ _id, name, slug, logoUrl(picsum), website, tier: TITLE|PRESENTING|EVENT|TECHNOLOGY|MEDIA|PARTNER, scope: PLATFORM|PROGRAM|EVENT, eventId? }`.
- `articles.json` — 10 articles `{ _id, title, slug, coverUrl, excerpt, content(markdown), type: NEWS|ARTICLE|PRESS, authorName, publishedAt, tags[] }`.
- Extend `events.json`: add `ownership: "OBS"|"PARTNER"`, `isLaunch: bool`, `launchAt?`, `programDayNumber?`, `speakers: [speakerId]`, and an event-scoped `sponsors: [{name, logoUrl, tier}]` on a few events.
- Extend `chapters.json`: add `isOfficial: true` on the 108; include 3–4 sample `isOfficial:false` community chapters with `status`.
Extend `mock/api.js` with: `getProgram()`, `getProgramDay(n, country)`, `getSpeakers(params)`, `getSpeaker(slug)`, `getSponsors(params)`, `submitPartnerApplication(p)`, `getArticles(params)`, `getArticle(slug)`, `getLaunches(params)`, `createChapter(p)`, `getMyChapters()` — all promise-based with 400–600ms delay. Page components call ONLY api.js.

New components: `components/common/{AppLoader,RouteProgress}.jsx`; `components/cards/{SpeakerCard,ArticleCard,SponsorLogo,MiniEventCard}.jsx`; `components/home/{ChapterHighlightBand,ProgramBanner,SpeakersRail,LaunchesRail,SponsorsStrip,NewsRail}.jsx`; pages under `pages/public/` for each new route + `pages/account/MyChapters.jsx` + `pages/public/CreateChapter.jsx`.

## 12. ACCEPTANCE CHECKLIST

- [ ] App shows the branded AppLoader on first load (fades out on data ready); route changes show the red top progress bar
- [ ] Home has, in order: chapter-highlight band, 100 Days banner, speakers rail, launches rail, sponsors strip, news rail
- [ ] /program shows season status (Day X of 100 / starts in N days), country filter, and a day-by-day agenda (lazy-loaded) with per-day events; /program/day/:n works with prev/next
- [ ] /speakers directory + /speakers/:slug profile (with "Speaking at") render from mock
- [ ] /sponsors shows tiers Title→Community Partner with the "what we offer" cards; event pages show a sponsors block when present
- [ ] /become-a-sponsor form validates, submits via api.js, shows success
- [ ] /news listing + /news/:slug article (markdown body, related) render
- [ ] /launches shows launch-flagged events with live countdowns
- [ ] /events has All/OBS/Partner tabs bound to ?owner=; cards show ownership tag
- [ ] Any signed-in user can create a chapter at /chapters/create (live preview, success redirect); /account/chapters lists mine; event creation is NOT exposed here
- [ ] All styling via Prompt-1 tokens; real photos via EventImage; only page data through api.js; no raw hex, no UI/carousel libraries
- [ ] No third-party brand names, logos, or assets anywhere
