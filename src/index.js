const { Client, GatewayIntentBits, Collection, Events } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const config = require("./../config/config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();
client.activeSessions = new Map();

// Event listener for when the bot is ready
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    // Dynamically load command files
    const commandsPath = path.join(__dirname, "command");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    console.log(`Loading Commands...`);
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`➥ Loaded ${command.data.name} command.`);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    // Dynamically load event files
    const eventsPath = path.join(__dirname, "event");
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

    console.log(`Loading Events...`);
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`➥ Loaded ${event.name} Event`);
    }
    
});

client.login(config.bot.token);
