const { SlashCommandBuilder } = require('discord.js');
const { config } = require('../../config');

module.exports = {
  category: 'admin',
  cooldownSeconds: 2,
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Owner-only Eval command.')
    .addStringOption((opt) => opt.setName('code').setDescription('JavaScript code').setRequired(true)),
  async execute(interaction) {
    if (!config.ownerId || interaction.user.id !== config.ownerId) {
      await interaction.reply({ content: 'Dieser Command ist nur für den Bot Owner.', ephemeral: true });
      return;
    }

    const code = interaction.options.getString('code', true);
    try {
      const result = await eval(`(async () => { ${code} })()`); // eslint-disable-line no-eval
      await interaction.reply({ content: `\`\`\`js\n${String(result).slice(0, 3900)}\n\`\`\``, ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: `\`\`\`\n${String(error).slice(0, 3900)}\n\`\`\``, ephemeral: true });
    }
  },
};
