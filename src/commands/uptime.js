const { SlashCommandBuilder } = require("discord.js");

const formatDuration = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [
    days ? `${days}d` : null,
    hours ? `${hours}h` : null,
    minutes ? `${minutes}m` : null,
    `${secs}s`,
  ]
    .filter(Boolean)
    .join(" ");
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Show how long the bot has been online."),
  async execute(interaction) {
    const uptime = formatDuration(process.uptime());
    await interaction.reply(`Uptime: **${uptime}**`);
  },
};
