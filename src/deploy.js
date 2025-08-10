// Import necessary modules
const { REST, Routes } = require("discord.js");
const config = require("./../config/config.json");
const fs = require("node:fs");
const path = require("node:path");

// Define an array to hold the command data
const commands = [];

// Correct the path to the command files
const commandsPath = path.join(__dirname, "command");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Create a REST instance to interact with the Discord API
const rest = new REST({ version: "10" }).setToken(config.bot.token);

// Deploy the commands to Discord
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const isGlobal = config.settings.globalCommands;
        let data;

        if (isGlobal) {
            data = await rest.put(
                Routes.applicationCommands(config.bot.clientId),
                { body: commands },
            );
        } else {
            data = await rest.put(
                Routes.applicationGuildCommands(
                    config.bot.clientId,
                    config.bot.guildId,
                ),
                { body: commands },
            );
        }

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
