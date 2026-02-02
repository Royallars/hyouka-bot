const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("servericon")
    .setDescription("Get the server icon."),
  async execute(interaction) {
    const icon = interaction.guild.iconURL({ size: 1024 });
    if (!icon) {
      await interaction.reply("This server has no icon.");
      return;
    }

    await interaction.reply(`Server icon: ${icon}`);
  },
};
