const { SlashCommandBuilder } = require("discord.js");
const config = require("./../../config/config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Start a conversational chat with the AI."),
  async execute(interaction, client) {
    // Defer the reply to give the bot time to start the session
    await interaction.deferReply({ ephemeral: false });

    // Check if a session already exists for this user
    if (client.activeSessions.has(interaction.user.id)) {
        await interaction.editReply("You already have an active chat session. Just send your message to continue.");
        return;
    }

    // Store the session for this user and channel
    const session = {
        channelId: interaction.channel.id,
        history: [],
        timeout: setTimeout(() => {
            client.activeSessions.delete(interaction.user.id);
            interaction.channel.send(`The chat session for ${interaction.user} has expired. You can start a new one with \`/chat\`.`);
        }, 200000) // 200 seconds
    };
    client.activeSessions.set(interaction.user.id, session);
    
    await interaction.editReply("Chat session started! Send me a message, and I'll reply. The session will expire after 200 seconds of inactivity.");
  },
};
