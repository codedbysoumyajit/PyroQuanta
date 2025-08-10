const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const model = require("./../model/gemini.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tone") // Changed the command name for brevity
    .setDescription("Change the tone of a piece of text to a selected style.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text you want to change the tone of.")
        .setRequired(true),
    )
  .addStringOption((option) =>
      option
        .setName("style") // Changed 'tone' to 'style' for better clarity
        .setDescription("The style of tone you want to use.")
        .setRequired(true)
        .addChoices(
            { name: 'Funny', value: 'funny' },
            { name: 'Professional', value: 'professional' },
            { name: 'Casual', value: 'casual' },
            { name: 'Friendly', value: 'friendly' },
            { name: 'Media Post', value: 'media post' },
            { name: 'Sarcastic', value: 'sarcastic' },
            { name: 'Introvert', value: 'introvert' },
        ),
    ),
  async execute(interaction, client) {
    const textToChange = interaction.options.getString("text");
    const toneStyle = interaction.options.getString("style");

    try {
      // An improved prompt to be more specific with the AI
      const prompt = `Change the tone of the following text to a ${toneStyle} style. Provide only the changed text in your response, with no extra conversational text or formatting. The original text is: "${textToChange}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const tonedText = response.text();

      const embed = new EmbedBuilder()
        .setTitle(`AI Tone Changer: ${toneStyle}`) // Dynamic title based on the tone
        .setDescription(tonedText)
        .setColor("Gold") // A new color for a new command
        .setFooter({ text: `Powered by Google's Gemini AI` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        // Bad request, possibly due to a safety policy violation
        await interaction.editReply({
          content: "I couldn't change the tone of that text. Your request may violate a safety policy.",
          ephemeral: true,
        });
      } else {
        // General error handling
        await interaction.editReply({
          content: "An error occurred while trying to change the tone. Please try again later.",
          ephemeral: true,
        });
      }
    }
  },
};
