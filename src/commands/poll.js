const { SlashCommandBuilder } = require("discord.js");

const emojiOptions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a quick poll with up to 5 options.")
    .addStringOption((option) =>
      option.setName("question").setDescription("Poll question").setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("options").setDescription("Comma-separated options"),
    ),
  async execute(interaction) {
    const question = interaction.options.getString("question", true);
    const optionsInput = interaction.options.getString("options") || "";
    const options = optionsInput
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean)
      .slice(0, 5);

    const lines = options.length
      ? options.map((option, index) => `${emojiOptions[index]} ${option}`)
      : ["👍 Yes", "👎 No"];

    const pollMessage = await interaction.reply({
      content: `**${question}**\n${lines.join("\n")}`,
      fetchReply: true,
    });

    const reactions = options.length ? emojiOptions.slice(0, options.length) : ["👍", "👎"];
    for (const reaction of reactions) {
      await pollMessage.react(reaction);
    }
  },
};
