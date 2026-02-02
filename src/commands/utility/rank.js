const { SlashCommandBuilder } = require("discord.js");
const { getProfile, getXpForLevel } = require("../../leveling/store");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Check a user's level and XP.")
    .addUserOption((option) =>
      option.setName("target").setDescription("User to check"),
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("target") || interaction.user;
    const profile = getProfile(target.id);
    const nextLevelXp = getXpForLevel(profile.level);

    await interaction.reply(
      `${target.tag} is level **${profile.level}** with **${profile.xp}/${nextLevelXp}** XP.`,
    );
  },
};
