const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roleinfo")
    .setDescription("Show information about a role.")
    .addRoleOption((option) =>
      option.setName("role").setDescription("Role to inspect").setRequired(true),
    ),
  async execute(interaction) {
    const role = interaction.options.getRole("role", true);
    await interaction.reply(
      `Role: **${role.name}**\nColor: **${role.hexColor}**\nMembers: **${role.members.size}**\nID: **${role.id}**`,
    );
  },
};
