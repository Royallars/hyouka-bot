const levels = new Map();
const messageCooldowns = new Map();

const getProfile = (userId) => {
  if (!levels.has(userId)) {
    levels.set(userId, { xp: 0, level: 1 });
  }
  return levels.get(userId);
};

const getXpForLevel = (level) => 5 * level * level + 50 * level + 100;

const addXp = (userId, xpToAdd) => {
  const profile = getProfile(userId);
  profile.xp += xpToAdd;

  let leveledUp = false;
  while (profile.xp >= getXpForLevel(profile.level)) {
    profile.xp -= getXpForLevel(profile.level);
    profile.level += 1;
    leveledUp = true;
  }

  levels.set(userId, profile);
  return { ...profile, leveledUp };
};

const setXp = (userId, xp, level = 1) => {
  levels.set(userId, { xp, level });
  return levels.get(userId);
};

const getLeaderboard = (limit = 10) =>
  Array.from(levels.entries())
    .sort((a, b) => {
      if (b[1].level === a[1].level) {
        return b[1].xp - a[1].xp;
      }
      return b[1].level - a[1].level;
    })
    .slice(0, limit)
    .map(([userId, profile]) => ({ userId, ...profile }));

const getCooldown = (userId) => messageCooldowns.get(userId) || 0;

const setCooldown = (userId, timestamp) => {
  messageCooldowns.set(userId, timestamp);
};

module.exports = {
  addXp,
  getCooldown,
  getLeaderboard,
  getProfile,
  getXpForLevel,
  setCooldown,
  setXp,
};
