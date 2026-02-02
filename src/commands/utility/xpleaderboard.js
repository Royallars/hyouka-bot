const { SlashCommandBuilder } = require("discord.js");
const { getLeaderboard } = require("../../leveling/store");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xpleaderboard")
    .setDescription("Show the top XP leaders."),
  async execute(interaction) {
    const leaderboard = getLeaderboard(10);
    if (!leaderboard.length) {
      await interaction.reply("No XP data yet.");
      return;
    }

    const lines = await Promise.all(
      leaderboard.map(async (entry, index) => {
        const user = await interaction.client.users.fetch(entry.userId);
        return `${index + 1}. ${user.tag} — Level **${entry.level}** (${entry.xp} XP)`;
      }),
    );

    await interaction.reply(`**XP Leaderboard**\n${lines.join("\n")}`);
  },
};
