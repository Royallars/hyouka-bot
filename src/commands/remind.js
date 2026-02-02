const { SlashCommandBuilder } = require("discord.js");

const reminders = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Set a reminder (in minutes).")
    .addIntegerOption((option) =>
      option
        .setName("minutes")
        .setDescription("Minutes from now")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1440),
    )
    .addStringOption((option) =>
      option.setName("message").setDescription("Reminder message").setRequired(true),
    ),
  async execute(interaction) {
    const minutes = interaction.options.getInteger("minutes", true);
    const reminderMessage = interaction.options.getString("message", true);
    const triggerAt = Date.now() + minutes * 60 * 1000;

    const timeoutId = setTimeout(async () => {
      reminders.delete(interaction.id);
      await interaction.followUp({
        content: `⏰ Reminder for ${interaction.user}: ${reminderMessage}`,
      });
    }, minutes * 60 * 1000);

    reminders.set(interaction.id, timeoutId);

    await interaction.reply({
      content: `I'll remind you in ${minutes} minute(s).`,
      ephemeral: true,
    });
  },
};
