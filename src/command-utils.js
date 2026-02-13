const { PermissionsBitField } = require('discord.js');
const { getGuildConfig } = require('./settings/store');

const cooldowns = new Map();

const CATEGORY_MODULE_MAP = {
  moderation: 'moderation',
  automod: 'automod',
  logging: 'logging',
  ticket: 'tickets',
  giveaways: 'giveaways',
  leveling: 'leveling',
  economy: 'economy',
  music: 'music',
  fun: 'fun',
  utility: 'utility',
  suggestions: 'suggestions',
  starboard: 'starboard',
  tags: 'tags',
  announcements: 'announcements',
  core: 'utility',
  admin: 'utility',
};

const canRunCommand = async (interaction, command) => {
  if (!interaction.inGuild()) {
    return { ok: true };
  }

  const memberPerms = command.requiredPermissions || [];
  if (memberPerms.length > 0) {
    const missing = memberPerms.find((perm) => !interaction.member.permissions.has(PermissionsBitField.Flags[perm] || perm));
    if (missing) {
      return { ok: false, reason: `Dir fehlt die Permission: **${missing}**.`, ephemeral: true };
    }
  }

  const config = getGuildConfig(interaction.guildId);
  const category = (command.category || 'utility').toLowerCase();
  const moduleKey = CATEGORY_MODULE_MAP[category] || 'utility';

  if (config.modules[moduleKey] === false) {
    return { ok: false, reason: `Das Modul **${moduleKey}** ist auf diesem Server deaktiviert.`, ephemeral: true };
  }

  const cooldown = command.cooldownSeconds || 0;
  if (cooldown > 0) {
    const key = `${interaction.user.id}:${command.data.name}`;
    const now = Date.now();
    const readyAt = cooldowns.get(key) || 0;
    if (readyAt > now) {
      const seconds = Math.ceil((readyAt - now) / 1000);
      return { ok: false, reason: `Bitte warte noch **${seconds}s** bevor du \/${command.data.name} erneut nutzt.`, ephemeral: true };
    }
    cooldowns.set(key, now + cooldown * 1000);
  }

  return { ok: true };
};

module.exports = { canRunCommand };
