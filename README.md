# Hyouka Discord Bot

A Discord.js bot featuring:

- Auto moderation with configurable word filtering and optional timeouts.
- Welcome banners with generated images for new members.
- Automatic role assignment for new members.
- Mod log channel support for moderation actions.
- Music playback from YouTube URLs with queue controls.
- Utility, moderation, fun, economy, and leveling commands for day-to-day server management.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

3. Register slash commands:

```bash
npm run deploy
```

4. Start the bot:

```bash
npm start
```

## Configuration

- `WELCOME_CHANNEL_ID` (optional): Channel ID for welcome banners. If empty, the server system channel is used.
- `AUTO_ROLE_ID` (optional): Role ID to assign to new members.
- `MOD_LOG_CHANNEL_ID` (optional): Channel ID to receive moderation logs.
- `AUTO_MOD_TIMEOUT_MINUTES` (optional): Set to `0` to disable timeouts.
- `BAD_WORDS`: Comma-separated list of banned words used for auto moderation.
- `ECONOMY_START_BALANCE`: Starting balance for new users.
- `ECONOMY_DAILY_AMOUNT`: Coins rewarded for `/daily`.
- `ECONOMY_WORK_MIN`: Minimum coins for `/work`.
- `ECONOMY_WORK_MAX`: Maximum coins for `/work`.
- `XP_GAIN_MIN`: Minimum XP gained per message.
- `XP_GAIN_MAX`: Maximum XP gained per message.
- `XP_COOLDOWN_SECONDS`: Message cooldown for XP.
- `SUGGESTIONS_CHANNEL_ID` (optional): Channel for `/suggest` submissions.

## How to Play Music

1. Join a voice channel.
2. Run `/play <youtube url>`.
3. Use `/pause`, `/resume`, `/skip`, `/stop`, `/queue`, `/nowplaying`, or `/lyrics`.

## Music Commands

- `/play <url>`: Plays a YouTube URL or queues it if something is already playing.
- `/pause`: Pauses the current track.
- `/resume`: Resumes playback.
- `/skip`: Skips the current track.
- `/stop`: Stops playback and clears the queue.
- `/queue`: Lists upcoming tracks.
- `/nowplaying`: Displays the currently playing track.
- `/lyrics`: Provides a lyrics search link for the current track.

## Moderation Commands

- `/purge`: Bulk deletes messages (requires Manage Messages).
- `/timeout`: Times out a member (requires Moderate Members).
- `/kick`: Kicks a member (requires Kick Members).
- `/ban`: Bans a member (requires Ban Members).
- `/unban`: Unbans a user by ID (requires Ban Members).
- `/slowmode`: Sets slowmode for the current channel (requires Manage Channels).
- `/say`: Sends a message as the bot (requires Manage Messages).

## Utility Commands

- `/help`: Lists all available commands.
- `/ping`: Checks bot latency.
- `/server`: Displays server info.
- `/user`: Displays user info.
- `/avatar`: Shows a user's avatar.
- `/poll`: Creates a quick poll with reactions.
- `/uptime`: Shows how long the bot has been online.
- `/botinfo`: Displays bot statistics.
- `/invite`: Generates the bot invite link.
- `/remind`: Sets a reminder (resets on bot restart).
- `/suggest`: Sends a suggestion to the suggestions channel.
- `/ticket create`: Opens a private ticket thread.
- `/ticket close`: Closes the current ticket thread.
- `/rank`: Shows a user's level and XP.
- `/xpleaderboard`: Displays the XP leaderboard.
- `/setxp`: Sets a user's XP (requires Manage Server).
- `/afk`: Set your AFK status.
- `/channelinfo`: Shows information about a channel.
- `/roleinfo`: Shows information about a role.
- `/membercount`: Displays the member count.
- `/servericon`: Shows the server icon.

## Economy Commands

- `/balance`: Shows a user's balance.
- `/daily`: Claims daily coins (24h cooldown).
- `/work`: Earns coins (30m cooldown).
- `/pay`: Transfers coins to another user.
- `/leaderboard`: Shows the top balances.

## Fun Commands

- `/roll`: Rolls dice.
- `/8ball`: Answers a question with a random response.
