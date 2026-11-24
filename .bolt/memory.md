# Project memory

## Product intent & audience

- App intended for students; UI content is in **French**.
- Includes a **« Vie étudiante »** section covering student life resources: housing/roommates and local deals/discounts.

## Brand personality & voice

- Friendly, practical, student-oriented tone.
- Content labels in French (e.g., « Logement & Coloc », « Bons plans », « Établissement »).

## Visual design & UX direction

- Built with **Vite + React**.
- Listing-based UI: cards with a photo beside title, number, description, and key info (e.g., rent for housing).
- Housing listings include details: room type (chambre, studio, colocation), description, loyer.
- Bons plans listings cover local businesses: café, resto, imprimerie, librairie, etc., each with a photo.
- Images sourced from **Pexels** (royalty-free); loaded with **lazy loading** to keep page fast.
- Existing interactions: **search** and **favorites** functionality.

## Decisions, constraints & rationale

- Real photos preferred over placeholders for housing and deals.
- Lazy loading used to avoid performance regressions when adding images.
- Search and favorites must continue to work after UI changes.
- Project must compile without errors after modifications.

## Open questions & assumptions

- App likely has other sections/pages beyond « Vie étudiante » — not yet explored.
- Data source for listings (hardcoded, JSON, or API) is unknown.
- No `.bolt/prompt` provided; no global instructions or constraints are defined.