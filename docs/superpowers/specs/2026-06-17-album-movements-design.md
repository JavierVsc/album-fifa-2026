# Album Movements Design

## Goal

Improve the album tracker by polishing the progress bar, adding a persistent movement log, distinguishing normal finds from exchange finds, simplifying the dashboard count, and documenting the project for GitHub Pages.

## Approved Behavior

- Replace the animated progress flow with a calmer progress bar that transitions smoothly when progress changes and does not run a permanent distracting animation.
- Add a final page section named "Registro de movimientos" that shows recent actions with date, time, movement text, sticker name, country or section, code, and number.
- Persist the movement log in localStorage alongside the current progress data.
- When a missing sticker is opened, show both "Marcar como encontrada" and "Marcar como encontrada (Intercambio)".
- Store normal finds as "Se encontró..." and exchange finds as "Se obtuvo por intercambio..." in the movement log.
- Replace the dashboard blocks "Cartas que tengo" and "Cartas faltantes" with a single "Láminas Encontradas" block rendered as "owned/total", for example "92/994".
- Keep the existing missing and duplicate filter sections available.
- Create a README with a brief project summary, usage notes, persistence behavior, and GitHub Pages context.

## Data Model

Existing card progress remains compatible with the current `album-fifa-2026-progreso` key. A new localStorage key will store log entries independently so importing old progress files remains low risk.

Each movement log entry contains:

- `id`: stable timestamp-based id.
- `type`: `found`, `foundExchange`, `duplicateAdded`, `duplicateExchanged`, or `markedMissing`.
- `createdAt`: ISO timestamp.
- `text`: user-facing Spanish sentence.
- `sticker`: `{ name, country, code, number }`.

## Verification

Automated tests should cover pure movement formatting and dashboard count behavior before production code changes. Browser verification should confirm desktop and mobile rendering, modal actions, movement logging, and console health.
