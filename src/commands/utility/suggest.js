const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Send a suggestion to the configured suggestions channel.")
    .addStringOption((option) =>
      option.setName("idea").setDescription("Your suggestion").setRequired(true),
    ),
  async execute(interaction) {
    const suggestion = interaction.options.getString("idea", true);
    const channelId = interaction.client.config.suggestionsChannelId;
    const channel = channelId
      ? await interaction.guild.channels.fetch(channelId)
      : interaction.channel;

    if (!channel || !channel.isTextBased()) {
      await interaction.reply({ content: "Suggestions channel is not available.", ephemeral: true });
      return;
    }

    const message = await channel.send({
      content: `💡 **Suggestion from ${interaction.user.tag}:** ${suggestion}`,
    });
    await message.react("👍");
    await message.react("👎");

    await interaction.reply({ content: "Suggestion sent!", ephemeral: true });
  },
};
