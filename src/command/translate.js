const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const model = require("./../model/gemini.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate a block of text from one language to another.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text you want to translate.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("to-language")
        .setDescription("The language to translate the text into.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const textToTranslate = interaction.options.getString("text");
    const toLanguage = interaction.options.getString("to-language");

    // The bot's reply has been deferred in the interactionCreate event handler.
    // So we'll use editReply to send the final response.

    try {
      // An improved prompt to be more specific with the AI
      const prompt = `Translate the following text into ${toLanguage}: "${textToTranslate}". Provide only the translated text in your response, with no extra conversational text or formatting.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text();

      const embed = new EmbedBuilder()
        .setTitle(`AI Translation`)
        .setDescription(translatedText)
        .setColor("Blue")
        .setFooter({ text: `Powered by Google's Gemini AI` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        // Bad request, possibly due to a language not being supported
        await interaction.editReply({
          content: "I couldn't translate that text. The language might not be supported, or your request violates a safety policy.",
          ephemeral: true,
        });
      } else {
        // General error handling
        await interaction.editReply({
          content: "An error occurred while translating. Please try again later.",
          ephemeral: true,
        });
      }
    }
  },
};
