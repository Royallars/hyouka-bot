const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { sendModLog } = require("../features/modLog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Bulk delete messages from the current channel.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete (1-100)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100),
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      await interaction.reply({ content: "You need Manage Messages to use this command.", ephemeral: true });
      return;
    }

    const amount = interaction.options.getInteger("amount", true);
    const deleted = await interaction.channel.bulkDelete(amount, true);

    await interaction.reply({
      content: `Deleted ${deleted.size} message(s).`,
      ephemeral: true,
    });
    await sendModLog(
      interaction.guild,
      interaction.client.config,
      `Purged ${deleted.size} message(s) in <#${interaction.channel.id}> by **${interaction.user.tag}**.`,
    );
  },
};
