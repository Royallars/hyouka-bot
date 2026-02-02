const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll some dice.")
    .addIntegerOption((option) =>
      option
        .setName("sides")
        .setDescription("Number of sides on the die")
        .setRequired(true)
        .setMinValue(2)
        .setMaxValue(1000),
    )
    .addIntegerOption((option) =>
      option
        .setName("count")
        .setDescription("Number of dice to roll")
        .setMinValue(1)
        .setMaxValue(20),
    ),
  async execute(interaction) {
    const sides = interaction.options.getInteger("sides", true);
    const count = interaction.options.getInteger("count") || 1;
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = rolls.reduce((sum, value) => sum + value, 0);

    await interaction.reply(`Rolled **${count}d${sides}**: ${rolls.join(", ")} (Total: ${total})`);
  },
};
