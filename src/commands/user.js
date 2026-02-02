const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Get information about a user.")
    .addUserOption((option) =>
      option.setName("target").setDescription("User to inspect"),
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("target") || interaction.user;
    await interaction.reply(
      `User: **${target.tag}**\nID: **${target.id}**\nCreated: **${target.createdAt.toDateString()}**`,
    );
  },
};
