const { SlashCommandBuilder } = require("discord.js");
const { getLeaderboard, getBalance } = require("../../economy/store");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show the top balances."),
  async execute(interaction) {
    const leaderboard = getLeaderboard(10);
    if (!leaderboard.length) {
      const balance = getBalance(interaction.user.id, interaction.client.config);
      await interaction.reply(`No leaderboard data yet. Your balance is **${balance}**.`);
      return;
    }

    const lines = await Promise.all(
      leaderboard.map(async (entry, index) => {
        const user = await interaction.client.users.fetch(entry.userId);
        return `${index + 1}. ${user.tag} — **${entry.balance}** coins`;
      }),
    );

    await interaction.reply(`**Economy Leaderboard**\n${lines.join("\n")}`);
  },
};
