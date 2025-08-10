const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Check the full list of commands for the bot."),
  async execute(interaction, client) {
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("help_select")
        .setPlaceholder("Select a command category")
        .addOptions([
          {
            label: "General",
            description: "General and informational commands.",
            value: "help_general",
          },
          {
            label: "Generative AI",
            description: "All AI-powered commands.",
            value: "help_genAI",
          },
          {
            label: "Developer Only",
            description: "Commands restricted to bot developers.",
            value: "help_dev",
          },
        ]),
    );

    const mainEmbed = new EmbedBuilder()
      .setTitle(`**Welcome To PyroQuanta!**`)
      .setDescription(
        `Hello! I am a powerful AI assistant with a variety of commands to help you with your coding, writing, and more.

Please use the menu below to browse through my commands.`
      )
      .setFooter({ text: "PyroQuanta" })
      .setTimestamp();

    await interaction.editReply({ embeds: [mainEmbed], components: [row] });

    const generalEmbed = new EmbedBuilder()
      .setTitle(`**PyroQuanta's Commands**`)
      .setDescription("General Commands:")
      .addFields(
        { name: "/help", value: "Check the full list of bot commands.", inline: false },
        { name: "/ping", value: "Check the bot's latency and responsiveness.", inline: false },
      )
      .setFooter({ text: `PyroQuanta` })
      .setTimestamp();

    const genAiEmbed = new EmbedBuilder()
      .setTitle(`**PyroQuanta's Commands**`)
      .setDescription("Generative AI Commands:")
      .addFields(
        { name: "/ask", value: "Get an answer to your question from a powerful AI.", inline: false },
        { name: "/code", value: "Generate a code snippet for a programming task.", inline: false },
        { name: "/define", value: "Get a definition for a word or concept from the AI.", inline: false },
        { name: "/fix", value: "Get help fixing an error in your code using a pop-up form.", inline: false },
        { name: "/grammar", value: "Fix grammar mistakes and improve the readability of your text.", inline: false },
        { name: "/simplify", value: "Simplify a complex idea, piece of code, or block of text.", inline: false },
        { name: "/summarize", value: "Summarize a long block of text into a few key points.", inline: false },
        { name: "/tone", value: "Change the tone of a piece of text to a selected style.", inline: false },
        { name: "/translate", value: "Translate a block of text from one language to another.", inline: false },
        { name: "/write", value: "Have the AI write a piece of text based on your instructions.", inline: false },
      )
      .setFooter({ text: `PyroQuanta` })
      .setTimestamp();

    const devEmbed = new EmbedBuilder()
      .setTitle(`**PyroQuanta's Commands**`)
      .setDescription("Developer Only Commands:")
      .addFields(
        { name: "/eval", value: "Evaluate JavaScript code in a sandboxed environment.", inline: false },
        { name: "/system-info", value: "Check the bot's system information and performance.", inline: false },
      )
      .setFooter({ text: `PyroQuanta` })
      .setTimestamp();

    const collector = interaction.channel.createMessageComponentCollector({
      ComponentType: "SELECT_MENU",
      customId: "help_select",
      time: 60000,
    });

    collector.on("collect", async (collected) => {
      const value = collected.values[0];

      if (value === "help_general") {
        await collected.reply({ embeds: [generalEmbed], ephemeral: true });
      }

      if (value === "help_genAI") {
        await collected.reply({ embeds: [genAiEmbed], ephemeral: true });
      }

      if (value === "help_dev") {
        await collected.reply({ embeds: [devEmbed], ephemeral: true });
      }
    });

    collector.on("end", () => {
        // You could add a message here to indicate the menu has expired
    });
  },
};
