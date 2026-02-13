const fs = require('node:fs');
const path = require('node:path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'moderation.json');

let db = { guilds: {} };

const ensure = () => {
  if (!fs.existsSync(path.dirname(DATA_PATH))) fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  if (fs.existsSync(DATA_PATH)) {
    try {
      db = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    } catch {
      db = { guilds: {} };
    }
  } else {
    fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2));
  }
};

const save = () => fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2));

const getGuild = (guildId) => {
  if (!db.guilds[guildId]) {
    db.guilds[guildId] = { nextCaseId: 1, cases: [], warnings: [], notes: [] };
    save();
  }
  return db.guilds[guildId];
};

const createCase = (guildId, payload) => {
  const g = getGuild(guildId);
  const entry = {
    id: g.nextCaseId++,
    createdAt: Date.now(),
    ...payload,
  };
  g.cases.push(entry);
  save();
  return entry;
};

const getCasesByUser = (guildId, userId) => getGuild(guildId).cases.filter((c) => c.targetId === userId);
const getCaseById = (guildId, id) => getGuild(guildId).cases.find((c) => c.id === id);

const updateCaseReason = (guildId, id, reason) => {
  const target = getCaseById(guildId, id);
  if (!target) return null;
  target.reason = reason;
  save();
  return target;
};

const deleteCase = (guildId, id) => {
  const g = getGuild(guildId);
  const idx = g.cases.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  g.cases.splice(idx, 1);
  save();
  return true;
};

const addWarning = (guildId, payload) => {
  const g = getGuild(guildId);
  const item = { id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`, createdAt: Date.now(), ...payload };
  g.warnings.push(item);
  save();
  return item;
};

const addNote = (guildId, payload) => {
  const g = getGuild(guildId);
  const item = { id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`, createdAt: Date.now(), ...payload };
  g.notes.push(item);
  save();
  return item;
};

const listWarnings = (guildId, userId) => getGuild(guildId).warnings.filter((w) => w.targetId === userId);
const listNotes = (guildId, userId) => getGuild(guildId).notes.filter((n) => n.targetId === userId);

const clearWarnings = (guildId, userId) => {
  const g = getGuild(guildId);
  const before = g.warnings.length;
  g.warnings = g.warnings.filter((w) => w.targetId !== userId);
  save();
  return before - g.warnings.length;
};

const clearNotes = (guildId, userId) => {
  const g = getGuild(guildId);
  const before = g.notes.length;
  g.notes = g.notes.filter((n) => n.targetId !== userId);
  save();
  return before - g.notes.length;
};

ensure();

module.exports = {
  addNote,
  addWarning,
  clearNotes,
  clearWarnings,
  createCase,
  deleteCase,
  getCaseById,
  getCasesByUser,
  listNotes,
  listWarnings,
  updateCaseReason,
};
