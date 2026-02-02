const { SlashCommandBuilder } = require("discord.js");
const { transferBalance } = require("../../economy/store");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Send coins to another user.")
    .addUserOption((option) =>
      option.setName("target").setDescription("User to pay").setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of coins")
        .setRequired(true)
        .setMinValue(1),
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("target", true);
    const amount = interaction.options.getInteger("amount", true);

    if (target.id === interaction.user.id) {
      await interaction.reply({ content: "You can't pay yourself.", ephemeral: true });
      return;
    }

    const result = transferBalance(
      interaction.user.id,
      target.id,
      amount,
      interaction.client.config,
    );

    if (!result) {
      await interaction.reply({ content: "You don't have enough coins.", ephemeral: true });
      return;
    }

    await interaction.reply(
      `You paid **${amount}** coins to ${target.tag}. Your balance: **${result.from}**.`,
    );
  },
};
