const { SlashCommandBuilder } = require("discord.js");
const { setAfk } = require("../../afk/store");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set your AFK status.")
    .addStringOption((option) =>
      option.setName("reason").setDescription("Why you're AFK"),
    ),
  async execute(interaction) {
    const reason = interaction.options.getString("reason") || "AFK";
    setAfk(interaction.user.id, reason);
    await interaction.reply({ content: `You're now AFK: ${reason}`, ephemeral: true });
  },
};
