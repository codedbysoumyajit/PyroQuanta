const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const model = require("./../model/gemini.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("grammarify") // Changed the command name for brevity
    .setDescription("Fix grammar mistakes and improve the readability of your text.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text you want the AI to fix.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const textToFix = interaction.options.getString("text");

    // The bot's reply has been deferred in the interactionCreate event handler.
    // So we'll use editReply to send the final response.

    try {
      // An improved prompt to be more specific with the AI
      const prompt = `Fix the grammar of the following text and make it more readable. Provide only the corrected text in your response, with no extra conversational text or formatting. The original text is: "${textToFix}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const fixedText = response.text();

      const embed = new EmbedBuilder()
        .setTitle(`AI Grammar Fixer`)
        .setDescription(fixedText)
        .setColor("Purple") // Using a different color for variety
        .setFooter({ text: `Powered by Google's Gemini AI` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        // Bad request, possibly due to a safety policy violation
        await interaction.editReply({
          content: "I couldn't fix the grammar of that text. Your request may violate a safety policy.",
          ephemeral: true,
        });
      } else {
        // General error handling
        await interaction.editReply({
          content: "An error occurred while trying to fix the grammar. Please try again later.",
          ephemeral: true,
        });
      }
    }
  },
};
