const { PermissionsBitField } = require("discord.js");

const buildWordPattern = (word) => new RegExp(`\\b${word}\\b`, "i");

const { sendModLog } = require("./modLog");

const handleAutoModeration = async (message, config) => {
  if (!config.badWords.length) {
    return;
  }

  const content = message.content.toLowerCase();
  const matched = config.badWords.some((word) => buildWordPattern(word).test(content));

  if (!matched) {
    return;
  }

  try {
    await message.delete();
  } catch (error) {
    return;
  }

  const warning = `${message.author}, your message was removed for violating the rules.`;
  await message.channel.send({ content: warning });
  await sendModLog(
    message.guild,
    config,
    `Auto-mod deleted a message from **${message.author.tag}** in <#${message.channel.id}>.`,
  );

  const timeoutMinutes = config.autoModTimeoutMinutes;
  if (!timeoutMinutes || !message.member) {
    return;
  }

  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
    return;
  }

  try {
    await message.member.timeout(timeoutMinutes * 60 * 1000, "Auto moderation warning.");
  } catch (error) {
    return;
  }
};

module.exports = { handleAutoModeration };
