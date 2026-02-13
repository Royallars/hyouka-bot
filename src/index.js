const fs = require("node:fs");
const path = require("node:path");
const { ActivityType, Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { config } = require("./config");
const { handleAutoModeration } = require("./features/autoModeration");
const { assignAutoRole } = require("./features/autoRole");
const { sendWelcomeBanner } = require("./features/welcomeBanner");
const { addXp, getCooldown, setCooldown } = require("./leveling/store");
const { canRunCommand } = require('./command-utils');

process.on("warning", (warning) => {
  if (warning.code === "DEP0180") {
    console.warn("DEP0180 warning detected (likely dependency under Node 25):", warning.message);
    return;
  }
  console.warn(warning);
});

if (!config.token || !config.clientId) {
  throw new Error("Missing DISCORD_TOKEN or DISCORD_CLIENT_ID in environment.");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();
client.config = config;

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
  if (command?.data?.name) {
    client.commands.set(command.data.name, command);
  }
}

const activityTypeMap = {
  PLAYING: ActivityType.Playing,
  STREAMING: ActivityType.Streaming,
  LISTENING: ActivityType.Listening,
  WATCHING: ActivityType.Watching,
  COMPETING: ActivityType.Competing,
  CUSTOM: ActivityType.Custom,
};

client.once("clientReady", () => {
  const type = activityTypeMap[config.statusType] || ActivityType.Watching;
  client.user.setPresence({
    activities: [{ name: config.statusText, type }],
    status: config.statusOnline,
  });
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Presence set: ${config.statusType} ${config.statusText} (${config.statusOnline})`);
});

client.on("guildMemberAdd", async (member) => {
  await sendWelcomeBanner(member, config);
  await assignAutoRole(member, config);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  await handleAutoModeration(message, config);


  const now = Date.now();
  const cooldownMs = config.xpCooldownSeconds * 1000;
  const lastMessage = getCooldown(message.author.id);
  if (now - lastMessage >= cooldownMs) {
    const xpGain =
      Math.floor(Math.random() * (config.xpGainMax - config.xpGainMin + 1)) + config.xpGainMin;
    const profile = addXp(message.author.id, xpGain);
    setCooldown(message.author.id, now);

    if (profile.leveledUp) {
      await message.channel.send(
        `🎉 ${message.author} leveled up to **${profile.level}**!`,
      );
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (command?.autocomplete) {
      try {
        await command.autocomplete(interaction);
      } catch {
        await interaction.respond([]);
      }
    }
    return;
  }

  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return;
  }

  try {
    const guard = await canRunCommand(interaction, command);
    if (!guard.ok) {
      await interaction.reply({ content: guard.reason, ephemeral: guard.ephemeral ?? true });
      return;
    }

    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: "There was an error executing this command.", ephemeral: true });
    } else {
      await interaction.reply({ content: "There was an error executing this command.", ephemeral: true });
    }
  }
});

client.login(config.token);
