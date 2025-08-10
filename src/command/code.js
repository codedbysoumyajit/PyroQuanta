const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const model = require("./../model/gemini.js");
const { codeBlock } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("code")
    .setDescription("Generate a code snippet for a programming task.")
    .addStringOption((option) =>
      option
        .setName("task") // Renamed from 'project' to 'task'
        .setDescription("The specific programming task you need code for.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("language") // Renamed from 'coding-lang' to 'language'
        .setDescription("The programming language to use (e.g., python, javascript).")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const task = interaction.options.getString("task");
    const language = interaction.options.getString("language");

    try {
      // Improved prompt for better AI responses
      const prompt = `Write a code snippet for the following task in ${language}. The task is: "${task}". Please provide only the code and nothing else.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const maxEmbedDescriptionLength = 4096;

      if (text.length > maxEmbedDescriptionLength) {
        await interaction.editReply({
          content: `Here is the code you requested:\n${codeBlock(language, text)}`,
        });
      } else {
        const embed = new EmbedBuilder()
          .setTitle(`Code Generator`)
          .setDescription(codeBlock(language, text))
          .setColor("Green")
          .setFooter({ text: `Powered by Google's Gemini AI` })
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        await interaction.editReply({
          content: "Your request was rejected due to a safety policy violation. Please be civil and friendly.",
          ephemeral: true,
        });
      } else {
        await interaction.editReply({
          content: "There was an error generating your code. Please try again later.",
          ephemeral: true,
        });
      }
    }
  },
};
