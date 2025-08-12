const { SlashCommandBuilder } = require("discord.js");
const { leaveVoiceChat } = require("./../../../functionalities/leave voice chat/main");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("leave-voice-chat")
		.setDescription("Finaliza la reproducción y abandona el chat de voz."),

	async execute(interaction) {
		await leaveVoiceChat(interaction);
	}
}