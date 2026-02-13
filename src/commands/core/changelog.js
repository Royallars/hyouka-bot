const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'core',
  cooldownSeconds: 5,
  data: new SlashCommandBuilder().setName('changelog').setDescription('Zeigt letzte Änderungen (aus CHANGELOG.md).'),
  async execute(interaction) {
    const p = path.join(process.cwd(), 'CHANGELOG.md');
    if (!fs.existsSync(p)) {
      await interaction.reply({ content: 'Kein CHANGELOG.md gefunden.', ephemeral: true });
      return;
    }

    const text = fs.readFileSync(p, 'utf8').slice(0, 3900);
    await interaction.reply({ content: `\`\`\`md\n${text}\n\`\`\``, ephemeral: true });
  },
};
