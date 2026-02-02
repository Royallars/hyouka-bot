const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { sendModLog } = require("../features/modLog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set slowmode for the current channel.")
    .addIntegerOption((option) =>
      option
        .setName("seconds")
        .setDescription("Slowmode duration in seconds")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600),
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      await interaction.reply({ content: "You need Manage Channels to use this command.", ephemeral: true });
      return;
    }

    const seconds = interaction.options.getInteger("seconds", true);
    await interaction.channel.setRateLimitPerUser(seconds, "Slowmode updated via command");

    await interaction.reply(`Set slowmode to ${seconds} second(s).`);
    await sendModLog(
      interaction.guild,
      interaction.client.config,
      `Slowmode set to ${seconds}s in <#${interaction.channel.id}> by **${interaction.user.tag}**.`,
    );
  },
};
