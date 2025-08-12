const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { fixLengthExcess, formatDuration } = require("./utils");
const playingGif = "https://i.imgur.com/XCf9DRl.gif";

const platformEmojis = {
	youtube: "<a:youtube:1297353851791478835>",
	spotify: "<a:spotify:1316113294536347740>",
	soundcloud: "<a:soundcloud:1316125428733317140>",
	apple_music: "<a:applemusic:1316125371367952525>"
}

module.exports = {
	createPlayingNowEmbed(track) {
		return new EmbedBuilder({
			title: fixLengthExcess(track.title),
			url: track.url,
			fields: [
				{ name: "", value: `${platformEmojis[track.source]} ${track.author}`, inline: true },
				{ name: "", value: `\`${formatDuration(track.duration)}\``, inline: true }
			],
			author: {
			  name: "🎵 Reproduciendo ahora:"
			},
			footer: {
			  text: `Canción elegida por @${track.requestedBy.username}`,
			  icon_url: track.requestedBy.displayAvatarURL()
			},
			image: {
			  url: track.thumbnail
			},
			thumbnail: {
				url: playingGif
			}
		});
	},

	createSearchResultsButtons(tracks) {
		const actionRowsWithButtons = [];
		tracks.forEach( (track, index) => {
			const button = new ButtonBuilder({
				customId: String(index),
				label: track.title.trim().slice(0, 80),
				style: ButtonStyle.Secondary,
				emoji: platformEmojis[track.source]
			});
			const row = new ActionRowBuilder().addComponents(button);
			actionRowsWithButtons.push(row);
		});
		return actionRowsWithButtons;
	},

	createSelectedButton(track) {
		const button = new ButtonBuilder({
			label: track.title.trim().slice(0, 80),
			style: ButtonStyle.Link,
			emoji: platformEmojis[track.source],
			url: track.url
		});
		const rowWithTheButton = new ActionRowBuilder().addComponents(button);
		return rowWithTheButton;
	}
}