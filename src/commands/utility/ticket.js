const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Create or close a support ticket.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a ticket thread.")
        .addStringOption((option) =>
          option.setName("reason").setDescription("Why you need help"),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("close").setDescription("Close the current ticket thread."),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "create") {
      const reason = interaction.options.getString("reason") || "No reason provided.";
      if (!interaction.channel.isTextBased()) {
        await interaction.reply({ content: "Tickets can only be created in text channels.", ephemeral: true });
        return;
      }

      const thread = await interaction.channel.threads.create({
        name: `ticket-${interaction.user.username}`,
        autoArchiveDuration: 1440,
        type: ChannelType.PrivateThread,
        reason: `Ticket created by ${interaction.user.tag}`,
      });

      await thread.members.add(interaction.user.id);
      await thread.send(`Ticket opened by ${interaction.user}. Reason: ${reason}`);
      await interaction.reply({ content: `Created ticket: ${thread.toString()}`, ephemeral: true });
      return;
    }

    if (subcommand === "close") {
      if (interaction.channel.type !== ChannelType.PrivateThread) {
        await interaction.reply({ content: "You can only close a ticket thread.", ephemeral: true });
        return;
      }

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageThreads)) {
        await interaction.reply({ content: "You need Manage Threads to close tickets.", ephemeral: true });
        return;
      }

      await interaction.channel.setLocked(true, "Ticket closed");
      await interaction.channel.setArchived(true, "Ticket closed");
      await interaction.reply({ content: "Ticket closed.", ephemeral: true });
    }
  },
};
