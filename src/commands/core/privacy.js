const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'core',
  cooldownSeconds: 5,
  data: new SlashCommandBuilder().setName('privacy').setDescription('Zeigt gespeicherte Daten + Datenschutz-Hinweis.'),
  async execute(interaction) {
    await interaction.reply({
      content: 'Gespeichert werden nur Bot-Funktionsdaten (Guild-Settings, Moderationseinträge, Levels/Economy, Reminder, Tickets-Metadaten). Inhalte können über /settings reset und /cleanup gelöscht werden.',
      ephemeral: true,
    });
  },
};
