const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Show bot statistics and version info."),
  async execute(interaction) {
    const { client } = interaction;
    const guilds = client.guilds.cache.size;
    const users = client.users.cache.size;

    await interaction.reply(
      `Bot: **${client.user.tag}**\nServers: **${guilds}**\nUsers cached: **${users}**\nNode: **${process.version}**`,
    );
  },
};
