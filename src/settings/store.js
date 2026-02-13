const fs = require('node:fs');
const path = require('node:path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_PATH = path.join(DATA_DIR, 'guild-config.json');

const DEFAULT_SETTINGS = {
  language: 'de',
  modules: {
    moderation: true,
    automod: true,
    logging: true,
    tickets: true,
    giveaways: true,
    leveling: true,
    economy: false,
    music: false,
    fun: true,
    utility: true,
    suggestions: true,
    starboard: true,
    tags: true,
    announcements: true,
  },
  channels: {
    modlog: null,
    msglog: null,
    voicelog: null,
    joinlog: null,
    serverlog: null,
  },
  logs: {
    messageDelete: true,
    messageEdit: true,
    memberJoin: true,
    memberLeave: true,
    voice: false,
    roleChanges: false,
    channelChanges: false,
  },
  roles: {
    supportRole: null,
    autoRole: null,
    verifiedRole: null,
  },
  automod: {
    antiSpam: false,
    antiCaps: false,
    antiInvite: false,
    antiLink: false,
    antiMassMention: false,
    antiEmojiSpam: false,
    antiZalgo: false,
    flood: { messagesPerXSeconds: 6, action: 'warn' },
    raid: { joinRate: 12, minAccountAgeDays: 3, action: 'kick' },
    mention: { maxMentions: 5, action: 'warn' },
    action: { type: 'warn', durationMinutes: 10 },
    whitelistDomains: [],
    blacklistWords: [],
    exemptions: { roles: [], channels: [] },
    phishing: { enabled: true, alertChannelId: null },
  },
};

let state = { guilds: {} };

const ensureStore = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(state, null, 2));
    return;
  }

  try {
    state = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  } catch {
    state = { guilds: {} };
  }
};

const save = () => {
  fs.writeFileSync(STORE_PATH, JSON.stringify(state, null, 2));
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const getGuildConfig = (guildId) => {
  if (!state.guilds[guildId]) {
    state.guilds[guildId] = clone(DEFAULT_SETTINGS);
    save();
  }

  return state.guilds[guildId];
};

const resetGuildConfig = (guildId) => {
  state.guilds[guildId] = clone(DEFAULT_SETTINGS);
  save();
  return state.guilds[guildId];
};

const setValueByPath = (target, keyPath, value) => {
  const keys = keyPath.split('.');
  let current = target;

  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    if (typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys.at(-1)] = value;
};

const getValueByPath = (target, keyPath) =>
  keyPath.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), target);

const setGuildSetting = (guildId, keyPath, rawValue) => {
  const config = getGuildConfig(guildId);
  let parsedValue = rawValue;

  if (rawValue === 'true') parsedValue = true;
  if (rawValue === 'false') parsedValue = false;
  if (!Number.isNaN(Number(rawValue)) && rawValue.trim() !== '') parsedValue = Number(rawValue);
  if (rawValue === 'null') parsedValue = null;

  setValueByPath(config, keyPath, parsedValue);
  save();
  return parsedValue;
};

const listKeys = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return listKeys(value, full);
    }
    return [full];
  });

const exportGuildConfig = (guildId) => JSON.stringify(getGuildConfig(guildId), null, 2);

const importGuildConfig = (guildId, payload) => {
  const parsed = JSON.parse(payload);
  state.guilds[guildId] = { ...clone(DEFAULT_SETTINGS), ...parsed };
  save();
  return state.guilds[guildId];
};

ensureStore();

module.exports = {
  DEFAULT_SETTINGS,
  exportGuildConfig,
  getGuildConfig,
  getValueByPath,
  importGuildConfig,
  listKeys,
  resetGuildConfig,
  setGuildSetting,
  save,
};
