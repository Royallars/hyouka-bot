const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Link a lyrics search for the current track."),
  async execute(interaction) {
    const { getQueue } = require("../../music/manager");
    const current = getQueue(interaction.guildId).currentTrack;

    if (!current) {
      await interaction.reply("Nothing is playing right now.");
      return;
    }

    const query = encodeURIComponent(current.title);
    const url = `https://www.google.com/search?q=${query}+lyrics`;
    await interaction.reply(`Lyrics search: ${url}`);
  },
};
