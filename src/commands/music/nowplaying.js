const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../../music/manager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Show the currently playing track."),
  async execute(interaction) {
    const queue = getQueue(interaction.guildId);
    if (!queue.currentTrack) {
      await interaction.reply("Nothing is playing right now.");
      return;
    }

    await interaction.reply(`Now playing: **${queue.currentTrack.title}**`);
  },
};
