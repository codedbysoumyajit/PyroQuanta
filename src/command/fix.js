const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fix')
    .setDescription('Get help fixing an error in your code using a pop-up form.'),
  async execute(interaction) {
    // Create the modal with a custom ID
    const modal = new ModalBuilder()
      .setCustomId('fixCodeModal') // This ID is what we will listen for later
      .setTitle('Fix Your Code');

    // Create the text input fields
    const errorMessageInput = new TextInputBuilder()
      .setCustomId('errorMessageInput')
      .setLabel("What is the error message?")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g., "TypeError: Cannot read properties of undefined"')
      .setRequired(true);

    const codeInput = new TextInputBuilder()
      .setCustomId('codeInput')
      .setLabel("Paste the code block here")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);
    
    const languageInput = new TextInputBuilder()
      .setCustomId('languageInput')
      .setLabel("What is the programming language?")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g., javascript, python')
      .setRequired(true);

    // Add the input fields to the modal
    const firstActionRow = new ActionRowBuilder().addComponents(errorMessageInput);
    const secondActionRow = new ActionRowBuilder().addComponents(codeInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(languageInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    // Show the modal to the user
    await interaction.showModal(modal);
  },
};
