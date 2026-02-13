const {
  AttachmentBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const {
  exportGuildConfig,
  getGuildConfig,
  importGuildConfig,
  listKeys,
  resetGuildConfig,
  setGuildSetting,
} = require('../../settings/store');

module.exports = {
  category: 'admin',
  cooldownSeconds: 5,
  requiredPermissions: ['ManageGuild'],
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Guild Settings ansehen und verwalten.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) => sub.setName('view').setDescription('Aktuelle Settings als JSON anzeigen'))
    .addSubcommand((sub) =>
      sub
        .setName('set')
        .setDescription('Setting setzen')
        .addStringOption((opt) => opt.setName('key').setDescription('settings key path').setRequired(true).setAutocomplete(true))
        .addStringOption((opt) => opt.setName('value').setDescription('Neuer Wert').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('reset')
        .setDescription('Alle Settings zurücksetzen')
        .addBooleanOption((opt) => opt.setName('confirm').setDescription('Bestätigung').setRequired(true)),
    )
    .addSubcommand((sub) => sub.setName('export').setDescription('Settings als JSON Datei exportieren'))
    .addSubcommand((sub) =>
      sub
        .setName('import')
        .setDescription('Settings aus JSON importieren')
        .addStringOption((opt) => opt.setName('json').setDescription('JSON payload').setRequired(true)),
    ),
  async autocomplete(interaction) {
    const key = interaction.options.getFocused().toLowerCase();
    const keys = listKeys(getGuildConfig(interaction.guildId))
      .filter((k) => k.toLowerCase().includes(key))
      .slice(0, 25)
      .map((k) => ({ name: k, value: k }));
    await interaction.respond(keys);
  },
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'view') {
      const json = exportGuildConfig(interaction.guildId);
      await interaction.reply({ content: `\`\`\`json\n${json.slice(0, 3900)}\n\`\`\``, ephemeral: true });
      return;
    }

    if (sub === 'set') {
      const key = interaction.options.getString('key', true);
      const value = interaction.options.getString('value', true);
      const updated = setGuildSetting(interaction.guildId, key, value);
      await interaction.reply({ content: `Setting **${key}** = \`${JSON.stringify(updated)}\` gesetzt.`, ephemeral: true });
      return;
    }

    if (sub === 'reset') {
      const confirm = interaction.options.getBoolean('confirm', true);
      if (!confirm) {
        await interaction.reply({ content: 'Abgebrochen. Setze `confirm=true` um zurückzusetzen.', ephemeral: true });
        return;
      }
      resetGuildConfig(interaction.guildId);
      await interaction.reply({ content: 'Settings wurden auf Standard zurückgesetzt.', ephemeral: true });
      return;
    }

    if (sub === 'export') {
      const json = exportGuildConfig(interaction.guildId);
      const file = new AttachmentBuilder(Buffer.from(json, 'utf8'), { name: `settings-${interaction.guildId}.json` });
      await interaction.reply({ content: 'Settings Export:', files: [file], ephemeral: true });
      return;
    }

    if (sub === 'import') {
      try {
        importGuildConfig(interaction.guildId, interaction.options.getString('json', true));
        await interaction.reply({ content: 'Settings erfolgreich importiert.', ephemeral: true });
      } catch {
        await interaction.reply({ content: 'Ungültiges JSON. Import fehlgeschlagen.', ephemeral: true });
      }
    }
  },
};
