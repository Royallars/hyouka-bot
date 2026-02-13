const {
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require('discord.js');
const { sendModLog } = require('../../features/modLog');
const {
  addNote,
  addWarning,
  clearNotes,
  clearWarnings,
  createCase,
  deleteCase,
  getCaseById,
  getCasesByUser,
  listNotes,
  listWarnings,
  updateCaseReason,
} = require('../../moderation/store');

module.exports = {
  category: 'moderation',
  cooldownSeconds: 2,
  requiredPermissions: ['ModerateMembers'],
  data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('Erweiterte Moderation mit Subcommand-Groups.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((s) => s.setName('ban').setDescription('User bannen').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addStringOption((o) => o.setName('reason').setDescription('Grund')))
    .addSubcommand((s) => s.setName('unban').setDescription('User entbannen').addStringOption((o) => o.setName('user_id').setDescription('User ID').setRequired(true)).addStringOption((o) => o.setName('reason').setDescription('Grund')))
    .addSubcommand((s) => s.setName('kick').setDescription('User kicken').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addStringOption((o) => o.setName('reason').setDescription('Grund')))
    .addSubcommand((s) => s.setName('timeout').setDescription('User timeouten').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addIntegerOption((o) => o.setName('minutes').setDescription('Minuten').setRequired(true).setMinValue(1).setMaxValue(40320)).addStringOption((o) => o.setName('reason').setDescription('Grund')))
    .addSubcommand((s) => s.setName('untimeout').setDescription('Timeout entfernen').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addStringOption((o) => o.setName('reason').setDescription('Grund')))
    .addSubcommand((s) => s.setName('softban').setDescription('Softban (ban+unban)').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addStringOption((o) => o.setName('reason').setDescription('Grund')))
    .addSubcommandGroup((g) =>
      g
        .setName('warn')
        .setDescription('Warnings verwalten')
        .addSubcommand((s) => s.setName('add').setDescription('Warning hinzufügen').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addStringOption((o) => o.setName('reason').setDescription('Grund').setRequired(true)))
        .addSubcommand((s) => s.setName('list').setDescription('Warnings anzeigen').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)))
        .addSubcommand((s) => s.setName('clear').setDescription('Warnings löschen').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))),
    )
    .addSubcommandGroup((g) =>
      g
        .setName('note')
        .setDescription('Mod Notes')
        .addSubcommand((s) => s.setName('add').setDescription('Note hinzufügen').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addStringOption((o) => o.setName('text').setDescription('Notiz').setRequired(true)))
        .addSubcommand((s) => s.setName('list').setDescription('Notes anzeigen').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)))
        .addSubcommand((s) => s.setName('clear').setDescription('Notes löschen').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))),
    )
    .addSubcommand((s) => s.setName('history').setDescription('Cases+Warns+Notes').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)))
    .addSubcommandGroup((g) =>
      g
        .setName('case')
        .setDescription('Case-Management')
        .addSubcommand((s) => s.setName('view').setDescription('Case ansehen').addIntegerOption((o) => o.setName('id').setDescription('Case ID').setRequired(true)))
        .addSubcommand((s) => s.setName('edit-reason').setDescription('Grund ändern').addIntegerOption((o) => o.setName('id').setDescription('Case ID').setRequired(true)).addStringOption((o) => o.setName('reason').setDescription('Neuer Grund').setRequired(true)))
        .addSubcommand((s) => s.setName('delete').setDescription('Case löschen').addIntegerOption((o) => o.setName('id').setDescription('Case ID').setRequired(true))),
    )
    .addSubcommand((s) => s.setName('lock').setDescription('Kanal locken'))
    .addSubcommand((s) => s.setName('unlock').setDescription('Kanal unlocken'))
    .addSubcommand((s) => s.setName('purge').setDescription('Nachrichten löschen').addIntegerOption((o) => o.setName('amount').setDescription('Anzahl').setRequired(true).setMinValue(1).setMaxValue(100)).addUserOption((o) => o.setName('user').setDescription('Nur von User')).addBooleanOption((o) => o.setName('bots').setDescription('Nur Bots')).addStringOption((o) => o.setName('contains').setDescription('Muss enthalten')))
    .addSubcommandGroup((g) =>
      g
        .setName('slowmode')
        .setDescription('Slowmode')
        .addSubcommand((s) => s.setName('set').setDescription('Slowmode setzen').addIntegerOption((o) => o.setName('seconds').setDescription('Sekunden').setRequired(true).setMinValue(0).setMaxValue(21600))),
    )
    .addSubcommandGroup((g) =>
      g
        .setName('nick')
        .setDescription('Nickname')
        .addSubcommand((s) => s.setName('set').setDescription('Nickname setzen').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addStringOption((o) => o.setName('nickname').setDescription('Neuer Nick').setRequired(true)))
        .addSubcommand((s) => s.setName('reset').setDescription('Nickname reset').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))),
    )
    .addSubcommand((s) => s.setName('move').setDescription('Voice move').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)).addChannelOption((o) => o.setName('channel').setDescription('Voice channel').addChannelTypes(ChannelType.GuildVoice).setRequired(true)))
    .addSubcommand((s) => s.setName('deafen').setDescription('Voice deaf').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)))
    .addSubcommand((s) => s.setName('undeafen').setDescription('Voice undeaf').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))),
  async execute(interaction) {
    const subGroup = interaction.options.getSubcommandGroup(false);
    const sub = interaction.options.getSubcommand();

    const createActionCase = async (type, targetId, reason) => {
      const item = createCase(interaction.guildId, {
        type,
        targetId,
        moderatorId: interaction.user.id,
        reason: reason || 'Kein Grund',
      });
      await sendModLog(interaction.guild, interaction.client.config, `Case #${item.id}: ${type} • <@${targetId}> • ${item.reason}`);
      return item;
    };

    if (!subGroup && ['ban', 'kick', 'timeout', 'untimeout', 'softban', 'move', 'deafen', 'undeafen', 'unban', 'lock', 'unlock', 'purge'].includes(sub)) {
      try {
        if (sub === 'unban') {
          const id = interaction.options.getString('user_id', true);
          const reason = interaction.options.getString('reason') || 'Kein Grund';
          await interaction.guild.bans.remove(id, reason);
          const c = await createActionCase('unban', id, reason);
          await interaction.reply({ content: `✅ Unban ausgeführt. Case #${c.id}`, ephemeral: true });
          return;
        }

        if (sub === 'lock' || sub === 'unlock') {
          await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: sub === 'unlock' });
          const c = await createActionCase(sub, interaction.channel.id, `Channel ${sub}`);
          await interaction.reply({ content: `Kanal ${sub === 'lock' ? 'gesperrt' : 'entsperrt'}. Case #${c.id}`, ephemeral: true });
          return;
        }

        if (sub === 'purge') {
          const amount = interaction.options.getInteger('amount', true);
          const filterUser = interaction.options.getUser('user');
          const bots = interaction.options.getBoolean('bots') || false;
          const contains = interaction.options.getString('contains');
          const messages = await interaction.channel.messages.fetch({ limit: 100 });
          const selected = [...messages.values()]
            .filter((m) => !filterUser || m.author.id === filterUser.id)
            .filter((m) => !bots || m.author.bot)
            .filter((m) => !contains || m.content.toLowerCase().includes(contains.toLowerCase()))
            .slice(0, amount);
          await interaction.channel.bulkDelete(selected, true);
          const c = await createActionCase('purge', interaction.channel.id, `Deleted ${selected.length} messages`);
          await interaction.reply({ content: `🧹 ${selected.length} Nachrichten gelöscht. Case #${c.id}`, ephemeral: true });
          return;
        }

        const user = interaction.options.getUser('user', true);
        const member = await interaction.guild.members.fetch(user.id);
        const reason = interaction.options.getString('reason') || 'Kein Grund';

        if (sub === 'ban') await member.ban({ reason });
        if (sub === 'kick') await member.kick(reason);
        if (sub === 'timeout') await member.timeout(interaction.options.getInteger('minutes', true) * 60000, reason);
        if (sub === 'untimeout') await member.timeout(null, reason);
        if (sub === 'softban') {
          await member.ban({ reason, deleteMessageSeconds: 60 * 60 * 24 });
          await interaction.guild.bans.remove(user.id, reason);
        }
        if (sub === 'move') await member.voice.setChannel(interaction.options.getChannel('channel', true));
        if (sub === 'deafen') await member.voice.setDeaf(true, reason);
        if (sub === 'undeafen') await member.voice.setDeaf(false, reason);

        const c = await createActionCase(sub, user.id, reason);
        await interaction.reply({ content: `✅ /mod ${sub} erfolgreich. Case #${c.id}`, ephemeral: true });
      } catch (error) {
        await interaction.reply({ content: `❌ Aktion fehlgeschlagen: ${error.message || 'unbekannter Fehler'}`, ephemeral: true });
      }
      return;
    }

    if (subGroup === 'warn') {
      const user = interaction.options.getUser('user', true);
      if (sub === 'add') {
        const reason = interaction.options.getString('reason', true);
        addWarning(interaction.guildId, { targetId: user.id, moderatorId: interaction.user.id, reason });
        const c = await createActionCase('warn', user.id, reason);
        await interaction.reply({ content: `⚠️ Warnung hinzugefügt. Case #${c.id}`, ephemeral: true });
      }
      if (sub === 'list') {
        const entries = listWarnings(interaction.guildId, user.id);
        await interaction.reply({ content: entries.length ? entries.map((e, i) => `${i + 1}. ${e.reason}`).join('\n') : 'Keine Warnungen.', ephemeral: true });
      }
      if (sub === 'clear') {
        const count = clearWarnings(interaction.guildId, user.id);
        await interaction.reply({ content: `${count} Warnungen gelöscht.`, ephemeral: true });
      }
      return;
    }

    if (subGroup === 'note') {
      const user = interaction.options.getUser('user', true);
      if (sub === 'add') {
        const text = interaction.options.getString('text', true);
        addNote(interaction.guildId, { targetId: user.id, moderatorId: interaction.user.id, text });
        const c = await createActionCase('note', user.id, text);
        await interaction.reply({ content: `📝 Note gespeichert. Case #${c.id}`, ephemeral: true });
      }
      if (sub === 'list') {
        const entries = listNotes(interaction.guildId, user.id);
        await interaction.reply({ content: entries.length ? entries.map((e, i) => `${i + 1}. ${e.text}`).join('\n') : 'Keine Notes.', ephemeral: true });
      }
      if (sub === 'clear') {
        const count = clearNotes(interaction.guildId, user.id);
        await interaction.reply({ content: `${count} Notes gelöscht.`, ephemeral: true });
      }
      return;
    }

    if (subGroup === 'case') {
      const id = interaction.options.getInteger('id', true);
      if (sub === 'view') {
        const item = getCaseById(interaction.guildId, id);
        await interaction.reply({ content: item ? `Case #${item.id}: ${item.type} | ${item.reason}` : 'Case nicht gefunden.', ephemeral: true });
      }
      if (sub === 'edit-reason') {
        const reason = interaction.options.getString('reason', true);
        const item = updateCaseReason(interaction.guildId, id, reason);
        await interaction.reply({ content: item ? `Case #${id} aktualisiert.` : 'Case nicht gefunden.', ephemeral: true });
      }
      if (sub === 'delete') {
        const ok = deleteCase(interaction.guildId, id);
        await interaction.reply({ content: ok ? `Case #${id} gelöscht.` : 'Case nicht gefunden.', ephemeral: true });
      }
      return;
    }

    if (subGroup === 'slowmode' && sub === 'set') {
      const seconds = interaction.options.getInteger('seconds', true);
      await interaction.channel.setRateLimitPerUser(seconds);
      await interaction.reply({ content: `Slowmode gesetzt auf ${seconds}s`, ephemeral: true });
      return;
    }

    if (subGroup === 'nick') {
      const user = interaction.options.getUser('user', true);
      const member = await interaction.guild.members.fetch(user.id);
      if (sub === 'set') {
        await member.setNickname(interaction.options.getString('nickname', true));
        await interaction.reply({ content: 'Nickname gesetzt.', ephemeral: true });
      }
      if (sub === 'reset') {
        await member.setNickname(null);
        await interaction.reply({ content: 'Nickname zurückgesetzt.', ephemeral: true });
      }
      return;
    }

    if (sub === 'history') {
      const user = interaction.options.getUser('user', true);
      const cases = getCasesByUser(interaction.guildId, user.id).length;
      const warns = listWarnings(interaction.guildId, user.id).length;
      const notes = listNotes(interaction.guildId, user.id).length;
      await interaction.reply({
        embeds: [new EmbedBuilder().setTitle(`Historie ${user.tag}`).setDescription(`Cases: **${cases}**\nWarnings: **${warns}**\nNotes: **${notes}**`)],
        ephemeral: true,
      });
    }
  },
};
