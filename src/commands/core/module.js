const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { getGuildConfig, save } = require('../../settings/store');

module.exports = {
  category: 'admin',
  cooldownSeconds: 3,
  requiredPermissions: ['ManageGuild'],
  data: new SlashCommandBuilder()
    .setName('module')
    .setDescription('Module pro Guild verwalten.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) => sub.setName('list').setDescription('Alle Module + Status anzeigen'))
    .addSubcommand((sub) =>
      sub
        .setName('enable')
        .setDescription('Ein Modul aktivieren')
        .addStringOption((opt) => opt.setName('name').setDescription('Modulname').setRequired(true).setAutocomplete(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('disable')
        .setDescription('Ein Modul deaktivieren')
        .addStringOption((opt) => opt.setName('name').setDescription('Modulname').setRequired(true).setAutocomplete(true)),
    ),
  async autocomplete(interaction) {
    const cfg = getGuildConfig(interaction.guildId);
    const focused = interaction.options.getFocused().toLowerCase();
    const keys = Object.keys(cfg.modules)
      .filter((key) => key.includes(focused))
      .slice(0, 25)
      .map((key) => ({ name: key, value: key }));
    await interaction.respond(keys);
  },
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const cfg = getGuildConfig(interaction.guildId);

    if (sub === 'list') {
      const lines = Object.entries(cfg.modules).map(([name, enabled]) => `${enabled ? '🟢' : '🔴'} **${name}**`);
      await interaction.reply({
        embeds: [new EmbedBuilder().setTitle('Module Status').setDescription(lines.join('\n')).setColor(0x5865f2)],
        ephemeral: true,
      });
      return;
    }

    const name = interaction.options.getString('name', true);
    if (!Object.hasOwn(cfg.modules, name)) {
      await interaction.reply({ content: 'Unbekanntes Modul.', ephemeral: true });
      return;
    }

    cfg.modules[name] = sub === 'enable';
    save();
    await interaction.reply({ content: `Modul **${name}** ist jetzt **${cfg.modules[name] ? 'aktiv' : 'deaktiviert'}**.`, ephemeral: true });
  },
};
