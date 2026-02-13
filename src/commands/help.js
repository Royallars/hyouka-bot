const {
  ActionRowBuilder,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');

const groupedCommands = (client) => {
  const map = new Map();
  for (const command of client.commands.values()) {
    const category = command.category || 'utility';
    if (!map.has(category)) map.set(category, []);
    map.get(category).push(command);
  }

  for (const [, list] of map) {
    list.sort((a, b) => a.data.name.localeCompare(b.data.name));
  }

  return map;
};

const buildCategoryEmbed = (category, commands) =>
  new EmbedBuilder()
    .setTitle(`Help • ${category}`)
    .setDescription(commands.map((c) => `• **/${c.data.name}** — ${c.data.description}`).join('\n') || 'Keine Commands.')
    .setColor(0x5865f2);

module.exports = {
  category: 'core',
  cooldownSeconds: 5,
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Interaktives Hilfe-Menü mit Kategorien und Command-Suche.')
    .addStringOption((opt) =>
      opt.setName('category').setDescription('Kategorie filtern').setAutocomplete(true),
    )
    .addStringOption((opt) =>
      opt.setName('command').setDescription('Direkt einen Command suchen').setAutocomplete(true),
    ),
  async autocomplete(interaction) {
    const focused = interaction.options.getFocused(true);
    const all = [...interaction.client.commands.values()];

    if (focused.name === 'category') {
      const cats = [...new Set(all.map((c) => c.category || 'utility'))].sort();
      const choices = cats
        .filter((cat) => cat.toLowerCase().includes(focused.value.toLowerCase()))
        .slice(0, 25)
        .map((cat) => ({ name: cat, value: cat }));
      await interaction.respond(choices);
      return;
    }

    const commands = all
      .map((c) => c.data.name)
      .filter((name) => name.includes(focused.value.toLowerCase()))
      .slice(0, 25)
      .map((name) => ({ name: `/${name}`, value: name }));
    await interaction.respond(commands);
  },
  async execute(interaction) {
    const category = interaction.options.getString('category');
    const commandSearch = interaction.options.getString('command');

    if (commandSearch) {
      const command = interaction.client.commands.get(commandSearch);
      if (!command) {
        await interaction.reply({ content: 'Command nicht gefunden.', ephemeral: true });
        return;
      }

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`/${command.data.name}`)
            .setDescription(command.data.description)
            .addFields(
              { name: 'Kategorie', value: command.category || 'utility', inline: true },
              { name: 'Cooldown', value: `${command.cooldownSeconds || 0}s`, inline: true },
            )
            .setColor(0x57f287),
        ],
        ephemeral: true,
      });
      return;
    }

    const grouped = groupedCommands(interaction.client);
    const categories = [...grouped.keys()].sort();
    const activeCategory = category && grouped.has(category) ? category : categories[0];

    const select = new StringSelectMenuBuilder()
      .setCustomId('help-category-select')
      .setPlaceholder('Kategorie auswählen')
      .addOptions(
        categories.slice(0, 25).map((cat) => ({
          label: cat,
          value: cat,
          default: cat === activeCategory,
        })),
      );

    const row = new ActionRowBuilder().addComponents(select);

    const reply = await interaction.reply({
      embeds: [buildCategoryEmbed(activeCategory, grouped.get(activeCategory))],
      components: [row],
      ephemeral: true,
      fetchReply: true,
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 120000,
    });

    collector.on('collect', async (menuInteraction) => {
      if (menuInteraction.user.id !== interaction.user.id) {
        await menuInteraction.reply({ content: 'Nur der Command-Aufrufer kann dieses Menü benutzen.', ephemeral: true });
        return;
      }

      const selected = menuInteraction.values[0];
      await menuInteraction.update({
        embeds: [buildCategoryEmbed(selected, grouped.get(selected) || [])],
        components: [row],
      });
    });
  },
};
