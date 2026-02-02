const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Get server information."),
  async execute(interaction) {
    const { guild } = interaction;
    await interaction.reply(
      `Server: **${guild.name}**\nMembers: **${guild.memberCount}**\nCreated: **${guild.createdAt.toDateString()}**`,
    );
  },
};
