const { getGuildConfig } = require('../settings/store');

const sendModLog = async (guild, config, message) => {
  const guildCfg = getGuildConfig(guild.id);
  const channelId = guildCfg.channels.modlog || config.modLogChannelId;
  if (!channelId) return;

  const channel = await guild.channels.fetch(channelId).catch(() => null);
  if (!channel || !channel.isTextBased()) return;

  await channel.send({ content: message });
};

module.exports = { sendModLog };
