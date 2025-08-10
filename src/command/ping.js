const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the bot's latency and responsiveness."),
  async execute(interaction, client) {
    // The bot's reply has been deferred in the interactionCreate event handler.
    // So we'll use editReply to send the final response.

    const apiLatency = Math.round(interaction.client.ws.ping);
    const botLatency = Date.now() - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setTitle(`**Pong!**`)
      .setDescription("Here is my current latency to Discord.")
      .addFields(
        {
          name: "Gateway Ping",
          value: `${apiLatency}ms`,
          inline: true,
        },
        {
          name: "API Latency",
          value: `${botLatency}ms`,
          inline: true,
        }
      )
      .setColor("Grey") // Using a neutral color
      .setFooter({ text: `PyroQuanta` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
