const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List available commands."),
  async execute(interaction) {
    const commands = interaction.client.commands;
    const list = commands
      .map((command) => `/${command.data.name} - ${command.data.description}`)
      .sort()
      .join("\n");

    await interaction.reply({
      content: `Here are my commands:\n${list}`,
      ephemeral: true,
    });
  },
};
