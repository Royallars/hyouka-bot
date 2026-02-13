const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'core',
  cooldownSeconds: 5,
  data: new SlashCommandBuilder().setName('support').setDescription('Support Server / Kontakt.'),
  async execute(interaction) {
    await interaction.reply({ content: 'Support: https://discord.gg/example (anpassen).', ephemeral: true });
  },
};
