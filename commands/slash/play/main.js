const { SlashCommandBuilder } = require("discord.js");
const { hasSpecificVideo, getVideoUrl } = require("./utils");
const { play } = require("./../../../functionalities/play/main");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Realiza una búsqueda en youtube o Directamente reproduce el link del video/canción proporcionado.")
		.addStringOption(option => option
			.setName("link-o-búsqueda")
			.setDescription("El enlace del video/canción o la búsqueda que quieres realizar")
			.setRequired(true)
			.setMaxLength(300)
		),

	async execute(interaction) {
		const input = interaction.options.getString("link-o-búsqueda").trim();
		const query = hasSpecificVideo(input) ? getVideoUrl(input) : input;
		await play(interaction, query);
	}
}