const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { setGuildSetting, getGuildConfig } = require('../../settings/store');

const CHANNEL_KEYS = ['modlog', 'msglog', 'voicelog', 'joinlog', 'serverlog'];
const TOGGLE_KEYS = ['messageDelete', 'messageEdit', 'memberJoin', 'memberLeave', 'voice', 'roleChanges', 'channelChanges'];

module.exports = {
  category: 'logging',
  cooldownSeconds: 3,
  requiredPermissions: ['ManageGuild'],
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Audit/Log Einstellungen')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) => s.setName('set').setDescription('Log-Kanal setzen').addStringOption((o) => o.setName('type').setDescription('Typ').setRequired(true).addChoices(...CHANNEL_KEYS.map((k) => ({ name: k, value: k })))).addChannelOption((o) => o.setName('channel').setDescription('Kanal').setRequired(true)))
    .addSubcommand((s) => s.setName('toggle').setDescription('Event togglen').addStringOption((o) => o.setName('event').setDescription('Event').setRequired(true).addChoices(...TOGGLE_KEYS.map((k) => ({ name: k, value: k })))).addBooleanOption((o) => o.setName('enabled').setDescription('aktiv').setRequired(true)))
    .addSubcommand((s) => s.setName('test').setDescription('Testnachricht senden')),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const cfg = getGuildConfig(interaction.guildId);

    if (sub === 'set') {
      const type = interaction.options.getString('type', true);
      const channel = interaction.options.getChannel('channel', true);
      setGuildSetting(interaction.guildId, `channels.${type}`, channel.id);
      if (type === 'modlog') {
        interaction.client.config.modLogChannelId = channel.id;
      }
      await interaction.reply({ content: `Log-Kanal ${type} gesetzt auf ${channel}.`, ephemeral: true });
      return;
    }

    if (sub === 'toggle') {
      if (!cfg.logs) cfg.logs = {};
      const event = interaction.options.getString('event', true);
      cfg.logs[event] = interaction.options.getBoolean('enabled', true);
      setGuildSetting(interaction.guildId, `logs.${event}`, String(cfg.logs[event]));
      await interaction.reply({ content: `Log Event ${event}: ${cfg.logs[event] ? 'an' : 'aus'}`, ephemeral: true });
      return;
    }

    if (sub === 'test') {
      const id = cfg.channels.modlog;
      if (!id) {
        await interaction.reply({ content: 'Kein modlog Kanal konfiguriert.', ephemeral: true });
        return;
      }
      const channel = await interaction.guild.channels.fetch(id);
      if (!channel || !channel.isTextBased()) {
        await interaction.reply({ content: 'Modlog Kanal ungültig.', ephemeral: true });
        return;
      }
      await channel.send(`✅ Log-Test von ${interaction.user}`);
      await interaction.reply({ content: 'Log-Test gesendet.', ephemeral: true });
    }
  },
};
