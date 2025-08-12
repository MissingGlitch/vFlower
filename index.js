// Requeriments and Initializations
const fs = require("node:fs");
const path = require("node:path");
const log = require("./utilities/logger");
const { Player, useMainPlayer } = require("discord-player");
const { YoutubeiExtractor } = require("discord-player-youtubei");
const { SpotifyExtractor, AppleMusicExtractor, SoundCloudExtractor } = require("@discord-player/extractor");
const handleInteraction = require("./utilities/interactionHandler");
const { Client, Events, Collection, GatewayIntentBits } = require("discord.js");

// Client
const TOKEN = process.env.TOKEN;
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildVoiceStates
] });
client.once(Events.ClientReady, () => {
	log.info(`¡Conectado! ${client.user.displayName} ya está en línea 🟢.`);
});

// Proxy Configuration
// const { HttpsProxyAgent } = require("https-proxy-agent");
// const { fetch: undiciFetch, ProxyAgent } = require("undici");
// const proxy = "http://106.42.30.243:82";
// const proxyAgent = new ProxyAgent(proxy);
// async function connectThroughProxy(input, init) {
// 	console.log("Usando el Proxy");
// 	const response = await undiciFetch(input, { ...init, dispatcher: proxyAgent });
// 	return response.body;
// }

// Player
const player = new Player(client);
// player.extractors.loadDefault(); // Esto es para cargar todos los extractores por defecto. Por supuesto no funciona 👍.
player.extractors.register(SpotifyExtractor);
// player.extractors.register(SoundCloudExtractor); // Por alguna razón este ya no funciona.
player.extractors.register(AppleMusicExtractor);
player.extractors.register(YoutubeiExtractor/*, { innertubeConfigRaw: { fetch: connectThroughProxy } }*/);
player.events.on("playerStart", queue => queue.removeTrack(0));
player.events.on("error", (queue, error) => {
    // Emitted when the player queue encounters error
    console.log(`General player error event: ${error.message}`);
    console.log(error);
});
player.events.on("playerError", (queue, error) => {
    // Emitted when the audio player errors while streaming audio track
    console.log(`Player error while streaming event: ${error.message}`);
    console.log(error);
});

// Debug Mode:
client.once(Events.ClientReady, () => {
	const player = useMainPlayer();

	// generate dependencies report
	console.log(player.scanDeps());
	// ^------ This is similar to discord-voip's `generateDependenciesReport()` function, but with additional informations related to discord-player

	// log metadata query, search execution, etc.
	player.on("debug", console.log);
	// ^------ This shows how your search query is interpreted, if the query was cached, which extractor resolved the query or which extractor failed to resolve, etc.

	// log debug logs of the queue, such as voice connection logs, player execution, streaming process etc.
	player.events.on("debug", (queue, message) => console.log(`[DEBUG ${queue.guild.id}] ${message}`));
	// ^------ This shows how queue handles the track. It logs informations like the status of audio player, streaming process, configurations used, if streaming failed or not, etc.
});

// Loading all Commands to the client
client.commands = new Collection();
const allCommandsFolderPath = path.join(__dirname, "commands");
const commandTypesList = fs.readdirSync(allCommandsFolderPath);
for (const type of commandTypesList) {
	const typePath = path.join(allCommandsFolderPath, type);
	const commandSubfoldersList = fs.readdirSync(typePath);
	for (const commandSubfolder of commandSubfoldersList) {
		const commandPath = path.join(typePath, commandSubfolder, "main.js");
		const command = require(commandPath);
		if ("data" in command && "execute" in command) {
			client.commands.set(`[${type}] ${command.data.name}`, command)
		} else {
			log.warn(`El comando (${type}) <${command.data.name}> de la ubicación "${commandPath}" le falta una propiedad <data> o <execute> obligatoria.`);
		}
	}
}

// Loading all Message Components to the client
// // client.messageComponents = new Collection();

// Loading all Modals to the client
// // client.modals = new Collection();

// Interaction Detector
client.on(Events.InteractionCreate, detectInteraction);
async function detectInteraction(interaction) {
	// Application Commands: Slash/User/Message Commands
	if (interaction.isCommand()) {
		handleInteraction.applicationCommand(interaction);
	}

	// Message Components: Buttons/Menus
	// // if (interaction.isMessageComponent()) {
	// // 	handleInteraction.messageComponent(interaction);
	// // }

	// Autocomplete
	// // if (interaction.isAutocomplete()) {
	// // 	handleInteraction.autocomplete(interaction);
	// // }

	// Modals
	// // if (interaction.isModalSubmit()) {
	// // 	handleInteraction.modal(interaction);
	// // }
}

// Connection to Discord
client.login(TOKEN);