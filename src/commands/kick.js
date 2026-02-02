const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { sendModLog } = require("../features/modLog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server.")
    .addUserOption((option) =>
      option.setName("target").setDescription("Member to kick").setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the kick"),
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      await interaction.reply({ content: "You need Kick Members to use this command.", ephemeral: true });
      return;
    }

    const target = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason") || "No reason provided.";

    const member = await interaction.guild.members.fetch(target.id);
    await member.kick(reason);

    await interaction.reply(`Kicked **${target.tag}**.`);
    await sendModLog(interaction.guild, interaction.client.config, `**${target.tag}** was kicked. Reason: ${reason}`);
  },
};
