const { SlashCommandBuilder } = require("discord.js");
const { getQueue, stopQueue } = require("../../music/manager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop playback and clear the queue."),
  async execute(interaction) {
    const queue = getQueue(interaction.guildId);
    stopQueue(queue);
    await interaction.reply("Stopped playback and cleared the queue.");
  },
};
