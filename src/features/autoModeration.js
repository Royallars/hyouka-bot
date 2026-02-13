const { PermissionsBitField } = require('discord.js');
const { sendModLog } = require('./modLog');
const { getGuildConfig } = require('../settings/store');

const inviteRegex = /(discord\.gg|discord\.com\/invite)\//i;
const urlRegex = /(https?:\/\/[^\s]+)/i;
const zalgoRegex = /[\u0300-\u036F]{3,}/;

const tooManyCaps = (text) => {
  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (letters.length < 8) return false;
  const caps = letters.replace(/[^A-Z]/g, '').length;
  return caps / letters.length > 0.7;
};

const handleAutoModeration = async (message, config) => {
  const guildConfig = getGuildConfig(message.guild.id);
  const rules = guildConfig.automod;

  const content = message.content || '';
  const isLink = urlRegex.test(content);
  const hasInvite = inviteRegex.test(content);
  const hasBadWord = rules.blacklistWords.some((word) => content.toLowerCase().includes(word.toLowerCase()))
    || config.badWords.some((word) => content.toLowerCase().includes(word.toLowerCase()));
  const hasZalgo = zalgoRegex.test(content);
  const mentions = message.mentions.users.size;

  const whitelistAllow = rules.whitelistDomains.some((domain) => content.includes(domain));

  let violation = null;
  if (hasBadWord) violation = 'blacklist-word';
  if (!violation && rules.antiInvite && hasInvite) violation = 'invite-link';
  if (!violation && rules.antiLink && isLink && !whitelistAllow) violation = 'external-link';
  if (!violation && rules.antiCaps && tooManyCaps(content)) violation = 'caps';
  if (!violation && rules.antiMassMention && mentions > (rules.mention?.maxMentions || 5)) violation = 'mass-mention';
  if (!violation && rules.antiZalgo && hasZalgo) violation = 'zalgo';

  if (!violation) return;

  try {
    await message.delete();
  } catch {
    return;
  }

  await message.channel.send({ content: `${message.author}, deine Nachricht wurde durch AutoMod entfernt (**${violation}**).` });
  await sendModLog(message.guild, config, `AutoMod: **${violation}** von ${message.author.tag} in <#${message.channel.id}>`);

  const action = rules.action?.type || (config.autoModTimeoutMinutes ? 'timeout' : 'warn');
  if (action === 'timeout' && message.member && message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
    const mins = rules.action?.durationMinutes || config.autoModTimeoutMinutes || 10;
    await message.member.timeout(mins * 60 * 1000, `AutoMod: ${violation}`);
  }

  if (rules.phishing.enabled && hasInvite && rules.phishing.alertChannelId) {
    const channel = await message.guild.channels.fetch(rules.phishing.alertChannelId).catch(() => null);
    if (channel?.isTextBased()) {
      await channel.send(`🚨 Möglicher Scam-Link von ${message.author} in <#${message.channel.id}>: ${content.slice(0, 1800)}`);
    }
  }
};

module.exports = { handleAutoModeration };
