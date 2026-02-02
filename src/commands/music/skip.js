const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../../music/manager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current track."),
  async execute(interaction) {
    const queue = getQueue(interaction.guildId);
    queue.player.stop(true);
    await interaction.reply("Skipped the current track.");
  },
};
