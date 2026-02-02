const { SlashCommandBuilder, ChannelType } = require("discord.js");

const typeLabels = {
  [ChannelType.GuildText]: "Text",
  [ChannelType.GuildVoice]: "Voice",
  [ChannelType.GuildCategory]: "Category",
  [ChannelType.GuildAnnouncement]: "Announcement",
  [ChannelType.GuildForum]: "Forum",
  [ChannelType.GuildStageVoice]: "Stage",
  [ChannelType.PublicThread]: "Public Thread",
  [ChannelType.PrivateThread]: "Private Thread",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channelinfo")
    .setDescription("Show information about a channel.")
    .addChannelOption((option) =>
      option.setName("target").setDescription("Channel to inspect"),
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel("target") || interaction.channel;
    const type = typeLabels[channel.type] || "Unknown";

    await interaction.reply(
      `Channel: **${channel.name}**\nType: **${type}**\nID: **${channel.id}**`,
    );
  },
};
