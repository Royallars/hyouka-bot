const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");
const { config } = require("./config");

if (!config.token || !config.clientId) {
  throw new Error("Missing DISCORD_TOKEN or DISCORD_CLIENT_ID in environment.");
}

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath, { withFileTypes: true })
  .flatMap((entry) => {
    if (entry.isDirectory()) {
      const nestedPath = path.join(commandsPath, entry.name);
      return fs
        .readdirSync(nestedPath)
        .filter((file) => file.endsWith(".js"))
        .map((file) => path.join(entry.name, file));
    }

    if (entry.isFile() && entry.name.endsWith(".js")) {
      return [entry.name];
    }

    return [];
  });

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command?.data) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(config.token);

rest
  .put(Routes.applicationCommands(config.clientId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
