const { SlashCommandBuilder, EmbedBuilder, version } = require("discord.js");
const os = require("node:os");
const config = require("./../../config/config.json");

// Helper function to format uptime without the 'ms' library
const formatUptime = (timeInSeconds) => {
  const seconds = Math.floor(timeInSeconds % 60);
  const minutes = Math.floor((timeInSeconds / 60) % 60);
  const hours = Math.floor((timeInSeconds / (60 * 60)) % 24);
  const days = Math.floor(timeInSeconds / (60 * 60 * 24));

  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);

  return parts.join(', ');
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("system")
    .setDescription("Check the bot's system information and performance."),
  async execute(interaction, client) {
    if (!config.settings.admin.includes(interaction.user.id)) {
      return interaction.reply({
        content: "This command is only for developers.",
        ephemeral: true,
      });
    }

    // The reply has been deferred in the interactionCreate handler
    try {
      const totalMemory = os.totalmem();
      const usedMemory = totalMemory - os.freemem();
      const totalMemoryMB = (totalMemory / 1024 / 1024).toFixed(2);
      const usedMemoryMB = (usedMemory / 1024 / 1024).toFixed(2);

      const SYSuptimeString = formatUptime(os.uptime());
      const BOTuptimeString = formatUptime(interaction.client.uptime / 1000);

      const embed = new EmbedBuilder()
        .setTitle(`**System Info**`)
        .setColor("Greyple")
        .addFields(
          {
            name: "Gateway Ping",
            value: `${interaction.client.ws.ping}ms`,
            inline: true,
          },
          {
            name: "RAM Usage",
            value: `${usedMemoryMB}MB / ${totalMemoryMB}MB`,
            inline: true,
          },
          {
            name: "CPU Model",
            value: `${os.cpus()[0].model}`,
            inline: false,
          },
          {
            name: "CPU Arch",
            value: `${os.arch()}`,
            inline: true,
          },
          {
            name: "OS Platform",
            value: `${os.platform()}`,
            inline: true,
          },
          {
            name: "NodeJS Version",
            value: `${process.version}`,
            inline: true,
          },
          {
            name: "Discord.js Version",
            value: `v${version}`,
            inline: true,
          },
          {
            name: "Bot Uptime",
            value: BOTuptimeString,
            inline: true,
          },
          {
            name: "System Uptime",
            value: SYSuptimeString,
            inline: true,
          },
        )
        .setFooter({ text: `PyroQuanta` })
        .setTimestamp();
      
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply({ content: "An error occurred while executing this command." });
      console.error(error);
    }
  },
};
