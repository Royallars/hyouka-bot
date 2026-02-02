const { SlashCommandBuilder } = require("discord.js");
const { getBalance } = require("../../economy/store");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your balance or another user's balance.")
    .addUserOption((option) =>
      option.setName("target").setDescription("User to check"),
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("target") || interaction.user;
    const balance = getBalance(target.id, interaction.client.config);
    await interaction.reply(`${target.tag} has **${balance}** coins.`);
  },
};
