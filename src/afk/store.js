const afkMap = new Map();

const setAfk = (userId, reason) => {
  afkMap.set(userId, { reason, since: Date.now() });
};

const clearAfk = (userId) => {
  afkMap.delete(userId);
};

const getAfk = (userId) => afkMap.get(userId) || null;

module.exports = {
  clearAfk,
  getAfk,
  setAfk,
};
