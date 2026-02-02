const { SlashCommandBuilder } = require("discord.js");
const { getQueue } = require("../../music/manager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the current music queue."),
  async execute(interaction) {
    const queue = getQueue(interaction.guildId);
    if (!queue.tracks.length) {
      await interaction.reply("The queue is empty.");
      return;
    }

    const list = queue.tracks
      .slice(0, 10)
      .map((track, index) => `${index + 1}. ${track.title}`)
      .join("\n");

    await interaction.reply(`Up next:\n${list}`);
  },
};
