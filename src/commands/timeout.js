const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { sendModLog } = require("../features/modLog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a member for a set number of minutes.")
    .addUserOption((option) =>
      option.setName("target").setDescription("Member to timeout").setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("minutes")
        .setDescription("Duration in minutes")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(10080),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the timeout"),
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      await interaction.reply({ content: "You need Moderate Members to use this command.", ephemeral: true });
      return;
    }

    const target = interaction.options.getUser("target", true);
    const minutes = interaction.options.getInteger("minutes", true);
    const reason = interaction.options.getString("reason") || "No reason provided.";

    const member = await interaction.guild.members.fetch(target.id);
    await member.timeout(minutes * 60 * 1000, reason);

    await interaction.reply(`Timed out **${target.tag}** for ${minutes} minute(s).`);
    await sendModLog(
      interaction.guild,
      interaction.client.config,
      `**${target.tag}** was timed out for ${minutes} minute(s). Reason: ${reason}`,
    );
  },
};
