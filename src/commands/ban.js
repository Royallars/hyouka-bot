const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { sendModLog } = require("../features/modLog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server.")
    .addUserOption((option) =>
      option.setName("target").setDescription("Member to ban").setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the ban"),
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      await interaction.reply({ content: "You need Ban Members to use this command.", ephemeral: true });
      return;
    }

    const target = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason") || "No reason provided.";

    const member = await interaction.guild.members.fetch(target.id);
    await member.ban({ reason });

    await interaction.reply(`Banned **${target.tag}**.`);
    await sendModLog(interaction.guild, interaction.client.config, `**${target.tag}** was banned. Reason: ${reason}`);
  },
};
