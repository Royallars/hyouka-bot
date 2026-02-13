const dotenv = require("dotenv");

dotenv.config();

const parseList = (value) =>
  value
    ? value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];

const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID || null,
  autoRoleId: process.env.AUTO_ROLE_ID || null,
  modLogChannelId: process.env.MOD_LOG_CHANNEL_ID || null,
  autoModTimeoutMinutes: Number(process.env.AUTO_MOD_TIMEOUT_MINUTES || 0),
  badWords: parseList(process.env.BAD_WORDS || ""),
  economyStartBalance: Number(process.env.ECONOMY_START_BALANCE || 100),
  economyDailyAmount: Number(process.env.ECONOMY_DAILY_AMOUNT || 250),
  economyWorkMin: Number(process.env.ECONOMY_WORK_MIN || 25),
  economyWorkMax: Number(process.env.ECONOMY_WORK_MAX || 200),
  xpGainMin: Number(process.env.XP_GAIN_MIN || 5),
  xpGainMax: Number(process.env.XP_GAIN_MAX || 25),
  xpCooldownSeconds: Number(process.env.XP_COOLDOWN_SECONDS || 30),
  suggestionsChannelId: process.env.SUGGESTIONS_CHANNEL_ID || null,
  ownerId: process.env.OWNER_ID || null,
  statusText: process.env.BOT_STATUS_TEXT || '/help',
  statusType: (process.env.BOT_STATUS_TYPE || 'Watching').toUpperCase(),
  statusOnline: process.env.BOT_STATUS_ONLINE || 'online',
};

module.exports = { config };
