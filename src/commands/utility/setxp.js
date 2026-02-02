const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { setXp } = require("../../leveling/store");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setxp")
    .setDescription("Set a user's XP and level.")
    .addUserOption((option) =>
      option.setName("target").setDescription("User to update").setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("level")
        .setDescription("Level to set")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1000),
    )
    .addIntegerOption((option) =>
      option
        .setName("xp")
        .setDescription("XP within the level")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(1000000),
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      await interaction.reply({ content: "You need Manage Server to use this command.", ephemeral: true });
      return;
    }

    const target = interaction.options.getUser("target", true);
    const level = interaction.options.getInteger("level", true);
    const xp = interaction.options.getInteger("xp", true);

    setXp(target.id, xp, level);
    await interaction.reply(`Set **${target.tag}** to level **${level}** with **${xp}** XP.`);
  },
};
