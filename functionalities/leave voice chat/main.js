const replyMessages = require("./reply-messages");
const { useQueue } = require("discord-player");

module.exports = {
	async leaveVoiceChat(interaction) {
		try {
			const queue = useQueue(interaction.guild.id);
			if (!queue) await interaction.reply(replyMessages.noQueue);
			else {
				queue.delete();
				await interaction.reply(replyMessages.chatLeft);
			}
		} catch (error) {
			console.error(error);
			await interaction.channel.send(replyMessages.somethingWentWrong);
			throw error;
		}
	}
}