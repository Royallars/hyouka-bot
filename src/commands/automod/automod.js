const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { getGuildConfig, save, setGuildSetting } = require('../../settings/store');

const TOGGLE_KEYS = ['antiSpam', 'antiCaps', 'antiInvite', 'antiLink', 'antiMassMention', 'antiEmojiSpam', 'antiZalgo'];

module.exports = {
  category: 'automod',
  cooldownSeconds: 3,
  requiredPermissions: ['ManageGuild'],
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('AutoMod und Security konfigurieren')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((s) => s.setName('status').setDescription('AutoMod Status anzeigen'))
    .addSubcommand((s) => s.setName('toggle').setDescription('Feature an/aus').addStringOption((o) => o.setName('feature').setDescription('Feature').setRequired(true).addChoices(...TOGGLE_KEYS.map((k) => ({ name: k, value: k })))).addBooleanOption((o) => o.setName('enabled').setDescription('aktiv').setRequired(true)))
    .addSubcommandGroup((g) => g.setName('whitelist').setDescription('Whitelist')
      .addSubcommand((s) => s.setName('domain-add').setDescription('Domain erlauben').addStringOption((o) => o.setName('domain').setDescription('Domain').setRequired(true)))
      .addSubcommand((s) => s.setName('domain-remove').setDescription('Domain entfernen').addStringOption((o) => o.setName('domain').setDescription('Domain').setRequired(true)))
      .addSubcommand((s) => s.setName('domain-list').setDescription('Domains anzeigen')))
    .addSubcommandGroup((g) => g.setName('blacklist').setDescription('Blacklist')
      .addSubcommand((s) => s.setName('word-add').setDescription('Wort blocken').addStringOption((o) => o.setName('word').setDescription('Wort').setRequired(true)))
      .addSubcommand((s) => s.setName('word-remove').setDescription('Wort erlauben').addStringOption((o) => o.setName('word').setDescription('Wort').setRequired(true)))
      .addSubcommand((s) => s.setName('word-list').setDescription('Wörter anzeigen')))
    .addSubcommand((s) => s.setName('flood').setDescription('Flood Regel').addIntegerOption((o) => o.setName('messages').setDescription('Nachrichten in Fenster').setRequired(true).setMinValue(2).setMaxValue(20)).addIntegerOption((o) => o.setName('seconds').setDescription('Sekunden').setRequired(true).setMinValue(2).setMaxValue(30)).addStringOption((o) => o.setName('action').setDescription('Aktion').setRequired(true).addChoices({ name: 'warn', value: 'warn' }, { name: 'timeout', value: 'timeout' }, { name: 'kick', value: 'kick' })))
    .addSubcommand((s) => s.setName('mention').setDescription('Mention Regel').addIntegerOption((o) => o.setName('max').setDescription('Max mentions').setRequired(true).setMinValue(1).setMaxValue(20)).addStringOption((o) => o.setName('action').setDescription('Aktion').setRequired(true).addChoices({ name: 'warn', value: 'warn' }, { name: 'timeout', value: 'timeout' }, { name: 'kick', value: 'kick' })))
    .addSubcommand((s) => s.setName('action-set').setDescription('Default Aktion').addStringOption((o) => o.setName('type').setDescription('Aktion').setRequired(true).addChoices({ name: 'warn', value: 'warn' }, { name: 'timeout', value: 'timeout' }, { name: 'kick', value: 'kick' })).addIntegerOption((o) => o.setName('duration').setDescription('Timeout Minuten').setRequired(false)))
    .addSubcommand((s) => s.setName('phishing-alert').setDescription('Phishing Alert Channel').addChannelOption((o) => o.setName('channel').setDescription('Log channel').setRequired(true))),
  async execute(interaction) {
    const group = interaction.options.getSubcommandGroup(false);
    const sub = interaction.options.getSubcommand();
    const cfg = getGuildConfig(interaction.guildId);

    if (sub === 'status') {
      const desc = [
        ...TOGGLE_KEYS.map((k) => `${cfg.automod[k] ? '🟢' : '🔴'} ${k}`),
        `Whitelist Domains: **${cfg.automod.whitelistDomains.length}**`,
        `Blacklist Words: **${cfg.automod.blacklistWords.length}**`,
        `Flood: **${cfg.automod.flood.messagesPerXSeconds}** msgs/action=${cfg.automod.flood.action}`,
      ].join('\n');
      await interaction.reply({ embeds: [new EmbedBuilder().setTitle('AutoMod Status').setDescription(desc)], ephemeral: true });
      return;
    }

    if (sub === 'toggle') {
      const feature = interaction.options.getString('feature', true);
      const enabled = interaction.options.getBoolean('enabled', true);
      cfg.automod[feature] = enabled;
      save();
      await interaction.reply({ content: `${feature} => ${enabled ? 'aktiv' : 'aus'}`, ephemeral: true });
      return;
    }

    if (group === 'whitelist') {
      const domain = interaction.options.getString('domain');
      if (sub === 'domain-add' && domain) {
        if (!cfg.automod.whitelistDomains.includes(domain)) cfg.automod.whitelistDomains.push(domain);
      }
      if (sub === 'domain-remove' && domain) {
        cfg.automod.whitelistDomains = cfg.automod.whitelistDomains.filter((d) => d !== domain);
      }
      save();
      await interaction.reply({ content: sub === 'domain-list' ? (cfg.automod.whitelistDomains.join(', ') || 'leer') : 'Whitelist aktualisiert.', ephemeral: true });
      return;
    }

    if (group === 'blacklist') {
      const word = interaction.options.getString('word');
      if (sub === 'word-add' && word) {
        if (!cfg.automod.blacklistWords.includes(word)) cfg.automod.blacklistWords.push(word.toLowerCase());
      }
      if (sub === 'word-remove' && word) {
        cfg.automod.blacklistWords = cfg.automod.blacklistWords.filter((d) => d !== word.toLowerCase());
      }
      save();
      await interaction.reply({ content: sub === 'word-list' ? (cfg.automod.blacklistWords.join(', ') || 'leer') : 'Blacklist aktualisiert.', ephemeral: true });
      return;
    }

    if (sub === 'flood') {
      cfg.automod.flood = {
        messagesPerXSeconds: interaction.options.getInteger('messages', true),
        seconds: interaction.options.getInteger('seconds', true),
        action: interaction.options.getString('action', true),
      };
      save();
      await interaction.reply({ content: 'Flood-Regel gespeichert.', ephemeral: true });
      return;
    }

    if (sub === 'mention') {
      cfg.automod.mention = { maxMentions: interaction.options.getInteger('max', true), action: interaction.options.getString('action', true) };
      save();
      await interaction.reply({ content: 'Mention-Regel gespeichert.', ephemeral: true });
      return;
    }

    if (sub === 'action-set') {
      setGuildSetting(interaction.guildId, 'automod.action.type', interaction.options.getString('type', true));
      const duration = interaction.options.getInteger('duration');
      if (duration) setGuildSetting(interaction.guildId, 'automod.action.durationMinutes', String(duration));
      await interaction.reply({ content: 'AutoMod Default-Aktion aktualisiert.', ephemeral: true });
      return;
    }

    if (sub === 'phishing-alert') {
      const ch = interaction.options.getChannel('channel', true);
      setGuildSetting(interaction.guildId, 'automod.phishing.alertChannelId', ch.id);
      await interaction.reply({ content: `Phishing Alert Channel: ${ch}`, ephemeral: true });
    }
  },
};
