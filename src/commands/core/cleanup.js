const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { resetGuildConfig } = require('../../settings/store');

module.exports = {
  category: 'admin',
  cooldownSeconds: 10,
  requiredPermissions: ['Administrator'],
  data: new SlashCommandBuilder()
    .setName('cleanup')
    .setDescription('DB Housekeeping.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName('orphaned-data')
        .setDescription('Entfernt verwaiste Daten (hier: Konfig-Reset).')
        .addBooleanOption((opt) => opt.setName('confirm').setDescription('Bestätigung').setRequired(true)),
    ),
  async execute(interaction) {
    if (!interaction.options.getBoolean('confirm', true)) {
      await interaction.reply({ content: 'Abgebrochen. confirm=true erforderlich.', ephemeral: true });
      return;
    }

    resetGuildConfig(interaction.guildId);
    await interaction.reply({ content: 'Cleanup abgeschlossen.', ephemeral: true });
  },
};
