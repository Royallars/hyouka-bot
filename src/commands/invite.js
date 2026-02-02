const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get the bot invite link."),
  async execute(interaction) {
    const invite = await interaction.client.generateInvite({
      scopes: ["bot", "applications.commands"],
      permissions: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ManageMessages,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak,
        PermissionsBitField.Flags.ModerateMembers,
        PermissionsBitField.Flags.KickMembers,
        PermissionsBitField.Flags.BanMembers,
        PermissionsBitField.Flags.ManageRoles,
        PermissionsBitField.Flags.ManageChannels,
      ],
    });

    await interaction.reply({ content: `Invite me using this link: ${invite}`, ephemeral: true });
  },
};
