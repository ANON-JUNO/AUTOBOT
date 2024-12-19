module.exports.config = {
	name: "tiktok",
	version: "1.0.0",
	role: 0,
	credits: "Jonell Magallanes", //original code Kim Joseph DG Bien
	description: "tiktok search",
	hasPrefix: true,
	aliases: ["tik"],
	usage: "[Tiktok <search>]",
	cooldown: 5,
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
	try {
		const searchQuery = args.join(" ");
		if (!searchQuery) {
			api.sendMessage("Usage: tiktok <search text>", event.threadID);
			return;
		}

		api.sendMessage("Searching, please wait...", event.threadID);

		const response = await axios.get(`https://cc-project-apis-jonell-magallanes.onrender.com/api/tiktok/searchvideo?keywords=${encodeURIComponent(searchQuery)}`);
		const videos = response.data.data.videos;

		if (!videos || videos.length === 0) {
			api.sendMessage("No videos found for the given search query.", event.threadID);
			return;
		}

		const videoData = videos[0];
		const videoUrl = videoData.play;

		const message = `Tiktok result:\n\n𝐏𝐨𝐬𝐭 𝐛𝐲: ${videoData.author.nickname}\nUsername: ${videoData.author.unique_id}\n\nTitle: ${videoData.title}`;

		const filePath = path.join(__dirname, `/cache/tiktok_video.mp4`);
		const writer = fs.createWriteStream(filePath);

		const videoResponse = await axios({
			method: 'get',
			url: videoUrl,
			responseType: 'stream'
		});

		videoResponse.data.pipe(writer);

		writer.on('finish', () => {
			api.sendMessage(
				{ body: message, attachment: fs.createReadStream(filePath) },
				event.threadID,
				() => fs.unlinkSync(filePath)
			);
		});
	} catch (error) {
		console.error('Error:', error);
		api.sendMessage("An error occurred while processing the request.", event.threadID);
	}
};