const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const model = require("./../model/gemini.js");
const { codeBlock } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("simplify")
    .setDescription("Simplify a complex idea, piece of code, or block of text.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of content you want to simplify.")
        .setRequired(true)
        .addChoices(
          { name: "Code", value: "code" },
          { name: "Text", value: "text" },
          { name: "Complex Idea", value: "complex idea" },
        )
    )
    .addStringOption((option) =>
      option
        .setName("content") // Renamed from 'prompt' to 'content' for clarity
        .setDescription("The content you want the AI to simplify.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const contentToSimplify = interaction.options.getString("content");
    const type = interaction.options.getString("type");

    try {
      // An improved prompt to be more specific with the AI
      const prompt = `Simplify the following ${type} and explain it in a clear and concise way. Provide only the simplified version in your response, with no extra conversational text or formatting. The original ${type} is: "${contentToSimplify}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let simplifiedText = response.text();

      // Check the type and format the output accordingly
      if (type === "code") {
        simplifiedText = codeBlock("javascript", simplifiedText); // Assuming javascript, but this can be improved
      }

      const embed = new EmbedBuilder()
        .setTitle(`AI Simplifier: ${type}`) // Dynamic title based on the type
        .setDescription(simplifiedText)
        .setColor("Orange") // A different color for a new command
        .setFooter({ text: `Powered by Google's Gemini AI` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        // Bad request, possibly due to a safety policy violation
        await interaction.editReply({
          content: "I couldn't simplify that content. Your request may violate a safety policy.",
          ephemeral: true,
        });
      } else {
        // General error handling
        await interaction.editReply({
          content: "An error occurred while trying to simplify the content. Please try again later.",
          ephemeral: true,
        });
      }
    }
  },
};
