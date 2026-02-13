# Hyouka Discord Bot

Discord.js Bot mit Moderation, AutoMod, Musik, Economy, Leveling und interaktiven Slash-Command-Systemen.

## Setup

```bash
npm install
npm run deploy
npm start
```

## Wichtige Architektur

- **Global Guard** für alle Slash-Commands:
  - Permission-Check
  - Cooldown-Check
  - Module on/off per Guild
- **Persistente Daten (JSON)**:
  - `src/data/guild-config.json` (Settings + Module + AutoMod)
  - `src/data/moderation.json` (Cases, Warnings, Notes)
- **Autocomplete + UI-Komponenten** für große Listen und Help-Navigation.

## Neue große Command-Systeme

## 1) Core / Meta
- `/help` (Kategorie + Command-Suche + SelectMenu)
- `/about`
- `/support`
- `/privacy`
- `/status`
- `/changelog`
- `/language set`
- `/eval` (Owner-only, `OWNER_ID`)

## 2) Admin / Server Management
- `/module list|enable|disable` *(ManageGuild)*
- `/settings view|set|reset|export|import` *(ManageGuild)*
- `/cleanup orphaned-data` *(Administrator)*
- `/logs set|toggle|test` *(ManageGuild)*

## 3) Moderation (Subcommand-Groups)
- `/mod ban|unban|kick|timeout|untimeout|softban`
- `/mod warn add|list|clear`
- `/mod note add|list|clear`
- `/mod purge` (amount, user, bots, contains)
- `/mod lock|unlock`
- `/mod slowmode set`
- `/mod nick set|reset`
- `/mod deafen|undeafen|move`
- `/mod history`
- `/mod case view|edit-reason|delete`

## 4) AutoMod / Security
- `/automod status`
- `/automod toggle`
- `/automod whitelist domain-add|domain-remove|domain-list`
- `/automod blacklist word-add|word-remove|word-list`
- `/automod flood`
- `/automod mention`
- `/automod action-set`
- `/automod phishing-alert`

## Bestehende Command-Pakete
- Moderation Basis: `/ban`, `/kick`, `/timeout`, `/unban`, `/purge`, `/slowmode`
- Musik: `/play`, `/pause`, `/resume`, `/skip`, `/queue`, `/stop`, `/nowplaying`, `/lyrics`
- Economy: `/balance`, `/daily`, `/work`, `/pay`, `/leaderboard`
- Leveling/Community: `/rank`, `/xpleaderboard`, `/afk`, `/suggest`, `/ticket`
- Fun: `/8ball`, `/roll`

## Datenschutz

Gespeichert werden ausschließlich Betriebsdaten für Botfunktionen (Guild-Settings, Moderationsdaten, Level/Economy etc.).
Löschen/Reset:
- `/settings reset`
- `/cleanup orphaned-data`

## ENV

- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- `OWNER_ID` (für `/eval`)
- plus weitere Variablen in `src/config.js`
