const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'core',
  cooldownSeconds: 5,
  data: new SlashCommandBuilder().setName('about').setDescription('Infos über den Bot.'),
  async execute(interaction) {
    await interaction.reply({ content: 'Hyouka Bot • Moderation, Utility, Tickets, Automod, Settings-System.', ephemeral: true });
  },
};
