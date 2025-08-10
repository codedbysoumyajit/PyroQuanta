const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const config = require("./../../config/config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate JavaScript code in a sandboxed environment."),
  async execute(interaction, client) {
    // Only allow admins to use this command
    if (!config.settings.admin.includes(interaction.user.id)) {
      return await interaction.reply({
        content: "This command is only for developers.",
        ephemeral: true,
      });
    }
    
    // Create the modal to collect the code
    const modal = new ModalBuilder()
      .setCustomId('evalCodeModal')
      .setTitle('Evaluate JavaScript Code');

    const codeInput = new TextInputBuilder()
      .setCustomId('codeInput')
      .setLabel("Paste the JavaScript code here")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(codeInput);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  },
};
