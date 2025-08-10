const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const model = require("./../model/gemini.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Get an answer to your question from a powerful AI.")
    .addStringOption((option) =>
      option
        .setName("question") // Renamed from 'prompt' for clarity
        .setDescription("The question you want the AI to answer.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const question = interaction.options.getString("question");

    try {
      const result = await model.generateContent(question);
      const response = await result.response;
      const text = response.text();

      const embed = new EmbedBuilder()
        .setTitle(`AI Assistant`)
        .setDescription(text)
        .setColor("Blurple")
        .setFooter({ text: "Powered by Google's Gemini AI" })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        await interaction.editReply({
          content: "Your request was rejected due to a safety policy violation. Please be civil and friendly.",
          ephemeral: true,
        });
      } else {
        console.error(error);
        await interaction.editReply({
          content: "An unknown error occurred. Please try again later.",
          ephemeral: true,
        });
      }
    }
  },
};
