const YOUTUBE_VIDEO = /(https?:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu\.be\/))[^&\s]+/i;

module.exports = {
	getVideoUrl(youtubeLink) {
		const videoUrl = youtubeLink.match(YOUTUBE_VIDEO)[0];
		return videoUrl;
	},

	hasSpecificVideo(link) {
		return YOUTUBE_VIDEO.test(link);
	}
}