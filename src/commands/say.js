const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make the bot say something.")
    .addStringOption((option) =>
      option.setName("message").setDescription("Message to send").setRequired(true),
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      await interaction.reply({ content: "You need Manage Messages to use this command.", ephemeral: true });
      return;
    }

    const message = interaction.options.getString("message", true);
    await interaction.reply({ content: "Message sent.", ephemeral: true });
    await interaction.channel.send(message);
  },
};
