const { SlashCommandBuilder } = require("discord.js");
const { addBalance, getCooldowns } = require("../../economy/store");

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily coins."),
  async execute(interaction) {
    const { config } = interaction.client;
    const cooldowns = getCooldowns(interaction.user.id);
    const now = Date.now();

    if (now - cooldowns.daily < COOLDOWN_MS) {
      const remainingMs = COOLDOWN_MS - (now - cooldowns.daily);
      const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));
      await interaction.reply({
        content: `You can claim daily again in ${remainingHours} hour(s).`,
        ephemeral: true,
      });
      return;
    }

    cooldowns.daily = now;
    const newBalance = addBalance(interaction.user.id, config.economyDailyAmount, config);
    await interaction.reply(`You claimed **${config.economyDailyAmount}** coins. New balance: **${newBalance}**.`);
  },
};
