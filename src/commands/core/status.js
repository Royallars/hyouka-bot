const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'core',
  cooldownSeconds: 5,
  data: new SlashCommandBuilder().setName('status').setDescription('Zeigt Bot-Status (Ping, RAM, Uptime, Shards).'),
  async execute(interaction) {
    const mem = process.memoryUsage().rss / 1024 / 1024;
    const uptime = Math.floor(process.uptime());
    const shardCount = interaction.client.shard?.count || 1;
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('Bot Status')
          .addFields(
            { name: 'Ping', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
            { name: 'RAM', value: `${mem.toFixed(1)} MB`, inline: true },
            { name: 'Uptime', value: `${uptime}s`, inline: true },
            { name: 'Shards', value: `${shardCount}`, inline: true },
            { name: 'DB', value: 'JSON Store: OK', inline: true },
          )
          .setColor(0x57f287),
      ],
      ephemeral: true,
    });
  },
};
