const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const model = require('./../model/gemini.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('define')
    .setDescription('Get a definition for a word or concept from the AI.')
    .addStringOption(option =>
        option
            .setName('term')
            .setDescription('The word or concept you want to define.')
            .setRequired(true)),
  async execute(interaction, client) {
    const term = interaction.options.getString('term');

    try {
      const prompt = `Provide a clear and concise definition for the following term: "${term}". Provide only the definition in your response, without any extra conversational text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const definition = response.text();

      const embed = new EmbedBuilder()
        .setTitle(`AI Definition for: ${term}`)
        .setDescription(definition)
        .setColor('Grey')
        .setFooter({ text: `Powered by Google's Gemini AI` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: 'An error occurred while trying to get a definition. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
