const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('summarize')
    .setDescription('Summarize a long block of text into a few key points.'),
  async execute(interaction) {
    // Create the modal with a custom ID
    const modal = new ModalBuilder()
      .setCustomId('summarizeModal')
      .setTitle('Summarize Text');

    // Create the text input field
    const textInput = new TextInputBuilder()
      .setCustomId('textInput')
      .setLabel("Paste the text to summarize here")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    // Add the input field to the modal
    const firstActionRow = new ActionRowBuilder().addComponents(textInput);
    modal.addComponents(firstActionRow);

    // Show the modal to the user
    await interaction.showModal(modal);
  },
};
