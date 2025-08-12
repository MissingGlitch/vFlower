const log = require("./logger");

function serializeError(error) {
	console.log(error);
	console.log("\n"); // ! corregir esto. Esta feo tener dos console.log seguidos solo para un \n
	return JSON.stringify(error, Object.getOwnPropertyNames(error));
}

function handleInteractionError(interaction, error) {
	const user = interaction.user.username;
	const command = interaction.isCommand() ? interaction.commandName : null;

	if (interaction.isChatInputCommand()) {
		log.error(
			`Ocurrió un error al momento de intentar ejecutar el comando slash "${command}".\n` +
			`<@${user}> fue quien intentó ejecutar el comando.\n` +
			`El comando completo a ejecutar era: ${interaction}\n` +
			"Y eso ocasionó el siguiente error:\n" + serializeError(error)
		);
	}

	if (interaction.isUserContextMenuCommand()) {
		const target = interaction.targetUser.username;
		log.error(
			`Ocurrió un error al momento de intentar ejecutar el comando de usuario "${command}".\n` +
			`<@${user}> fue quien intentó ejecutar el comando sobre <@${target}>.\n` +
			"Y eso ocasionó el siguiente error:\n" + serializeError(error)
		);
	}

	if (interaction.isMessageContextMenuCommand()) {
		const target = interaction.targetMessage.author.username;
		log.error(
			`Ocurrió un error al momento de intentar ejecutar el comando de mensaje "${command}".\n` +
			`<@${user}> fue quien intentó ejecutar el comando sobre un mensaje de <@${target}>.\n` +
			"Y eso ocasionó el siguiente error:\n" + serializeError(error)
		);
	}

	// if (interaction.isButton()) {
	// 	// log de error para botones.
	// }

	// if (interaction.isAnySelectMenu()) {
	// 	// log de error para menús.
	// }

	// if (interaction.isModalSubmit()) {
	// 	// log de error para modals.
	// }
}

module.exports = { serializeError, handleInteractionError }