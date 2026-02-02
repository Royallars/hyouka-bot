const sendModLog = async (guild, config, message) => {
  if (!config.modLogChannelId) {
    return;
  }

  const channel = await guild.channels.fetch(config.modLogChannelId);
  if (!channel || !channel.isTextBased()) {
    return;
  }

  await channel.send({ content: message });
};

module.exports = { sendModLog };
