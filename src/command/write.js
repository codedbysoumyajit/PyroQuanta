const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const model = require("./../model/gemini.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("write")
    .setDescription("Have the AI write a piece of text based on your instructions.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of content you want the AI to write.")
        .setRequired(true)
        .addChoices(
          { name: "Email", value: "email" },
          { name: "Short Story", value: "short story" },
          { name: "Poem", value: "poem" },
          { name: "Blog Post", value: "blog post" },
          { name: "Social Media Post", value: "social media post" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("instructions")
        .setDescription("Give the AI instructions on what to write.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const type = interaction.options.getString("type");
    const instructions = interaction.options.getString("instructions");

    try {
      const prompt = `Write a ${type} based on the following instructions: "${instructions}". Provide only the written text in your response, with no extra conversational text or formatting.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const writtenText = response.text();

      const maxEmbedDescriptionLength = 4096;
      if (writtenText.length > maxEmbedDescriptionLength) {
        await interaction.editReply({
          content: `**AI Writer**\n\n${writtenText}`,
        });
      } else {
        const embed = new EmbedBuilder()
          .setTitle(`AI Writer: ${type}`)
          .setDescription(writtenText)
          .setColor("Blue")
          .setFooter({ text: `Powered by Google's Gemini AI` })
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "An error occurred while trying to write the text. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
