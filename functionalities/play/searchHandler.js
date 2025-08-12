const { QueryType } = require("discord-player");
const replyMessages = require("./reply-messages");
const { createSearchResultsButtons, createSelectedButton } = require("./embeds-and-components");

async function handleSearch(interaction, searchResult) {
	const type = searchResult.queryType;
	console.log(type);

	if (type === QueryType.AUTO_SEARCH) {
		const tracks = searchResult.tracks.slice(0, 5);
		const searchResultsButtons = createSearchResultsButtons(tracks);
		const resultsMessage = await interaction.followUp({
			content: `# "\`${searchResult.query}\`"`,
			components: [...searchResultsButtons],
		});
		try {
			const selectedButton = await resultsMessage.awaitMessageComponent({time: 40_000});
			const selectedTrack = tracks[selectedButton.customId];
			await selectedButton.update({ content: "Canción Selecionada:", components: [createSelectedButton(selectedTrack)] });
			return selectedTrack;
		} catch (error) {
			await interaction.editReply({ content: replyMessages.noButtonSelected, components: [] });
		}
	}

	else if (
		type === QueryType.YOUTUBE_PLAYLIST || type === QueryType.SOUNDCLOUD_PLAYLIST ||
		type === QueryType.SPOTIFY_PLAYLIST || type === QueryType.SPOTIFY_ALBUM ||
		type === QueryType.APPLE_MUSIC_ALBUM || type === QueryType.APPLE_MUSIC_PLAYLIST
	) {
		await interaction.followUp(replyMessages.playlistSent);
		return null;
	}

	else if (
		type === QueryType.YOUTUBE_VIDEO || type === QueryType.SOUNDCLOUD_TRACK ||
		type === QueryType.SPOTIFY_SONG || type === QueryType.APPLE_MUSIC_SONG
	) {
		const track = searchResult.tracks[0];
		return track;
	}

	else {
		interaction.followUp(replyMessages.unknownQuery);
		console.log(`Unknown Query: ${type}`);
		return null;
	}
}

module.exports = handleSearch;