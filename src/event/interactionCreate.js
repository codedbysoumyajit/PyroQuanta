const { Events, EmbedBuilder } = require("discord.js");
const config = require("./../../config/config.json");
const model = require("./../model/gemini.js");
const { codeBlock } = require("@discordjs/builders");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // Check for maintenance mode first
    if (config.settings.maintenance) {
      if (!config.settings.admin.includes(interaction.user.id)) {
        return interaction.reply({
          content: "**Bot Is Under Maintenance. Please Try Again Later.**",
          ephemeral: true,
        });
      }
    }
    
    // --- Modal Submit Handler ---
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'fixCodeModal') {
            await interaction.deferReply({ ephemeral: false });

            const errorMessage = interaction.fields.getTextInputValue('errorMessageInput');
            const code = interaction.fields.getTextInputValue('codeInput');
            const language = interaction.fields.getTextInputValue('languageInput');
            
            try {
                const prompt = `I received the following error in my ${language} code: "${errorMessage}".
                The code is: \`\`\`${language}\n${code}\n\`\`\`
                
                Please explain the cause of the error and provide the corrected code.
                The response should start with a clear explanation, followed by the corrected code in a code block.`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // Check if the response is too long for an embed
                const maxEmbedDescriptionLength = 4096;
                if (text.length > maxEmbedDescriptionLength) {
                    await interaction.editReply({
                        content: `**AI Error Fixer**\n\n${text}`
                    });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle(`**AI Error Fixer**`)
                        .setDescription(text)
                        .setColor("Red")
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
                        content: "There was an error while trying to fix your code. Please try again later.",
                        ephemeral: true,
                    });
                }
            }
        } else if (interaction.customId === 'evalCodeModal') {
            await interaction.deferReply({ ephemeral: true });

            const code = interaction.fields.getTextInputValue('codeInput');
            
            try {
                const result = eval(code);
                
                await interaction.editReply({
                    content: `Result: ${codeBlock("js", result)}`,
                });
            } catch (error) {
                await interaction.editReply({
                    content: `Error: ${codeBlock("bash", error)}`,
                });
            }
        }
        return;
    }

    // --- Chat Input Command Handler ---
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return await interaction.reply({
                content: "That command was not found!",
                ephemeral: true,
            });
        }
        
        const commandsThatUseModals = ['fix', 'eval'];
        if (!commandsThatUseModals.includes(command.data.name)) {
            await interaction.deferReply();
        }

        try {
            await command.execute(interaction, interaction.client);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            } else {
                 await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    }
  },
};
