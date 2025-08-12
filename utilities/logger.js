const path = require("node:path");
const logsFolder = path.join(__dirname, "..", "logs");
const { createLogger, format, transports } = require("winston");

const logger = createLogger({
	format: format.combine(
		format.colorize(),
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.printf( info => `> ${info.timestamp} [${info.level}]: ${info.message}` )
	),

	transports: [
		new transports.Console({
			format: format.combine(
				format.timestamp({ format: "HH:mm:ss" }),
				format.printf( info => `> ${info.timestamp} [${info.level}]: ${info.message}\n` )
			)
		}),
		new transports.File({
			filename: `${logsFolder}/general.log`,
			maxsize: 2000000,
			maxFiles: 1
		}),
		new transports.File({
			filename: `${logsFolder}/error.log`,
			maxsize: 2000000,
			maxFiles: 1,
			level: "error"
		}),
	]
});

logger.interaction = (interaction) => {
	const user = interaction.user.username;
	const command = interaction.isCommand() ? interaction.commandName : null;

	if (interaction.isChatInputCommand()) {
		logger.info(`<@${user}> usó el comando slash "${command}".\nComando Completo: ${interaction}`);
	}

	if (interaction.isUserContextMenuCommand()) {
		const target = interaction.targetUser.username;
		logger.info(`<@${user}> usó el comando de usuario "${command}" con <@${target}>.`);
	}

	if (interaction.isMessageContextMenuCommand()) {
		const target = interaction.targetMessage.author.username;
		logger.info(`<@${user}> usó el comando de mensaje "${command}" con un mensaje de <@${target}>.`);
	}

	// if (interaction.isButton()) {
	// 	// log para botones.
	// }

	// if (interaction.isAnySelectMenu()) {
	// 	// log para menús.
	// }

	// if (interaction.isModalSubmit()) {
	// 	// log para modals.
	// }

}

module.exports = logger;