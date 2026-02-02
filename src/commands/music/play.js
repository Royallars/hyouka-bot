const { SlashCommandBuilder } = require("discord.js");
const ytdl = require("ytdl-core");
const { connectToChannel, enqueueTrack, getQueue } = require("../../music/manager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music from a YouTube URL.")
    .addStringOption((option) =>
      option.setName("url").setDescription("YouTube URL").setRequired(true),
    ),
  async execute(interaction) {
    const url = interaction.options.getString("url", true);
    if (!ytdl.validateURL(url)) {
      await interaction.reply({ content: "Please provide a valid YouTube URL.", ephemeral: true });
      return;
    }

    const channel = interaction.member.voice.channel;
    if (!channel) {
      await interaction.reply({
        content: "Join a voice channel first.",
        ephemeral: true,
      });
      return;
    }

    const queue = getQueue(interaction.guildId);
    connectToChannel(queue, channel);

    const info = await ytdl.getInfo(url);
    enqueueTrack(queue, { url, title: info.videoDetails.title });

    await interaction.reply(`Queued **${info.videoDetails.title}**.`);
  },
};
