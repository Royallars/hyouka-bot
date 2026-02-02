const { SlashCommandBuilder } = require("discord.js");
const { addBalance, getCooldowns } = require("../../economy/store");

const COOLDOWN_MS = 30 * 60 * 1000;

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Do some work to earn coins."),
  async execute(interaction) {
    const { config } = interaction.client;
    const cooldowns = getCooldowns(interaction.user.id);
    const now = Date.now();

    if (now - cooldowns.work < COOLDOWN_MS) {
      const remainingMs = COOLDOWN_MS - (now - cooldowns.work);
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
      await interaction.reply({
        content: `You can work again in ${remainingMinutes} minute(s).`,
        ephemeral: true,
      });
      return;
    }

    cooldowns.work = now;
    const earnings = randomBetween(config.economyWorkMin, config.economyWorkMax);
    const newBalance = addBalance(interaction.user.id, earnings, config);
    await interaction.reply(`You earned **${earnings}** coins. New balance: **${newBalance}**.`);
  },
};
