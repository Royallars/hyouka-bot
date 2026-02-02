const balances = new Map();
const cooldowns = new Map();

const getCooldowns = (userId) => {
  if (!cooldowns.has(userId)) {
    cooldowns.set(userId, { daily: 0, work: 0 });
  }
  return cooldowns.get(userId);
};

const getBalance = (userId, config) => {
  if (!balances.has(userId)) {
    balances.set(userId, config.economyStartBalance);
  }
  return balances.get(userId);
};

const addBalance = (userId, amount, config) => {
  const current = getBalance(userId, config);
  const updated = current + amount;
  balances.set(userId, updated);
  return updated;
};

const transferBalance = (fromUserId, toUserId, amount, config) => {
  const fromBalance = getBalance(fromUserId, config);
  if (fromBalance < amount) {
    return null;
  }

  balances.set(fromUserId, fromBalance - amount);
  const toBalance = getBalance(toUserId, config);
  balances.set(toUserId, toBalance + amount);
  return { from: balances.get(fromUserId), to: balances.get(toUserId) };
};

const getLeaderboard = (limit = 10) =>
  Array.from(balances.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([userId, balance]) => ({ userId, balance }));

module.exports = {
  addBalance,
  getBalance,
  getCooldowns,
  getLeaderboard,
  transferBalance,
};
