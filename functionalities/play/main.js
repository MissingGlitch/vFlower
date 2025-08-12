const { isLink, getExtractorsToBlock } = require("./utils");
const handleSearch = require("./searchHandler");
const replyMessages = require("./reply-messages");
const { useMainPlayer, QueueRepeatMode } = require("discord-player");
const { createPlayingNowEmbed } = require("./embeds-and-components");

module.exports = {
	async play(interaction, query) {
		try {
			const user = interaction.user;
			const player = useMainPlayer();
			const currentQueue = player.queues.resolve(interaction.guild);
			const voiceChannel = interaction.member.voice.channel;
			if (!voiceChannel) return interaction.reply(replyMessages.noConnected);
			if (currentQueue && currentQueue.channel.id !== voiceChannel.id) return interaction.reply(replyMessages.alreadyInUse);

			await interaction.deferReply({ ephemeral: !isLink(query) });
			const result = await player.search(query, { requestedBy: user });
			const track = await handleSearch(interaction, result, platform);

			if (track) {
				const embed = createPlayingNowEmbed(track);
				if (isLink(query)) await interaction.followUp({ embeds: [embed] });
				else await interaction.channel.send({ content: `Resultado de la Búsqueda: "**\`${query}\`**"`, embeds: [embed] });

				const aditionalOptions = { maxSize: 1, maxHistorySize: 1, repeatMode: QueueRepeatMode.QUEUE, metadata: interaction };
				const queue = player.queues.create(interaction.guild, aditionalOptions);
				const entry = queue.tasksQueue.acquire();
				await entry.getTask();
				if (queue.isFull) queue.removeTrack(0);
				// queue.setRepeatMode(QueueRepeatMode.QUEUE);
				if (queue.isPlaying()) queue.addTrack(track);
				if (!queue.connection) await queue.connect(voiceChannel);
				if (queue.isPlaying()) queue.node.skip();
				if (!queue.isPlaying()) await queue.node.play(track);
				// setTimeout(() => queue.setRepeatMode(QueueRepeatMode.TRACK), 1_000);
				queue.tasksQueue.release();
			}
		} catch (error) {
			console.error(error);
			await interaction.channel.send(replyMessages.somethingWentWrong);
			throw error;
		}
	}
}