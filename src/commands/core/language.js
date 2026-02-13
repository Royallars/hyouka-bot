const { SlashCommandBuilder } = require('discord.js');
const { setGuildSetting } = require('../../settings/store');

module.exports = {
  category: 'core',
  cooldownSeconds: 3,
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Sprache verwalten')
    .addSubcommand((sub) =>
      sub
        .setName('set')
        .setDescription('Bot-Sprache setzen')
        .addStringOption((opt) =>
          opt
            .setName('locale')
            .setDescription('de oder en')
            .setRequired(true)
            .addChoices({ name: 'Deutsch', value: 'de' }, { name: 'English', value: 'en' }),
        ),
    ),
  async execute(interaction) {
    const locale = interaction.options.getString('locale', true);
    setGuildSetting(interaction.guildId, 'language', locale);
    await interaction.reply({ content: `Sprache auf **${locale}** gesetzt.`, ephemeral: true });
  },
};
