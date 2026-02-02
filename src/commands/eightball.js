const { SlashCommandBuilder } = require("discord.js");

const responses = [
  "It is certain.",
  "Without a doubt.",
  "Yes — definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Ask again later.",
  "Cannot predict now.",
  "Don't count on it.",
  "My reply is no.",
  "Very doubtful.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask the magic 8-ball a question.")
    .addStringOption((option) =>
      option.setName("question").setDescription("Your question").setRequired(true),
    ),
  async execute(interaction) {
    const question = interaction.options.getString("question", true);
    const answer = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply(`**Question:** ${question}\n**Answer:** ${answer}`);
  },
};
