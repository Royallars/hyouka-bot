const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Show a user's avatar.")
    .addUserOption((option) =>
      option.setName("target").setDescription("User to show"),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("target") || interaction.user;
    const avatarUrl = user.displayAvatarURL({ size: 512 });
    await interaction.reply({ content: `${user.tag}'s avatar: ${avatarUrl}` });
  },
};
