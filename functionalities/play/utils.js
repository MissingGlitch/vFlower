module.exports = {
	formatDuration(duration) {
		const separator = ":";
		let count = 0;
		const indexes = [];
		for (let index = 0; index < duration.length; index++) {
			if (duration.charAt(index) === separator) {
				indexes.push(index);
				count++;
			}
		}
		const hours = count === 2 ? duration.slice(0, indexes[0]) : null;
		const minutes = count === 2 ? duration.slice(indexes[0]+1, indexes[1]) : duration.slice(0, indexes[0]);
		const seconds = duration.slice(-2);
		let durationFormatted = "";
		if (Number(hours)) durationFormatted+= `${Number(hours)} hr `;
		if (Number(minutes)) durationFormatted+= `${Number(minutes)} min `;
		if (Number(seconds)) durationFormatted+= `${Number(seconds)} s`;
		return durationFormatted.trim();
	},

	fixLengthExcess(string) {
		let fixedString = string;
		if (string.length > 200) fixedString = fixedString.slice(0, 100).concat("...");
		return fixedString;
	},

	isLink(string) {
		const regex = /https?:\/\/./i
		return regex.test(string);
	}
}