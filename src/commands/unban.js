const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { sendModLog } = require("../features/modLog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user by ID.")
    .addStringOption((option) =>
      option.setName("user_id").setDescription("User ID to unban").setRequired(true),
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      await interaction.reply({ content: "You need Ban Members to use this command.", ephemeral: true });
      return;
    }

    const userId = interaction.options.getString("user_id", true);
    await interaction.guild.members.unban(userId);

    await interaction.reply(`Unbanned user ID **${userId}**.`);
    await sendModLog(interaction.guild, interaction.client.config, `User ID **${userId}** was unbanned.`);
  },
};
