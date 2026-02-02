const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../../music/manager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current track."),
  async execute(interaction) {
    const queue = getQueue(interaction.guildId);
    if (!queue.currentTrack) {
      await interaction.reply("Nothing is playing right now.");
      return;
    }

    queue.player.pause(true);
    await interaction.reply("Paused the current track.");
  },
};
