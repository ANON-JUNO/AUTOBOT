const axios = require('axios');

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    hasPermission: 0,
    credits: "GeoDevz", // cmd by George, not the API
    description: "GPT architecture",
    usePrefix: false,
    commandCategory: "GPT4",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, messageReply } = event;
        let prompt = args.join(' ');

        // Include replied message in the prompt if it exists
        if (messageReply) {
            const repliedMessage = messageReply.body;
            prompt = `${repliedMessage} ${prompt}`;
        }

        // Check for attachment in the replied message
        let content = "";
        if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
            const attachment = event.messageReply.attachments[0];
            content = attachment.url;
        }

        // If no prompt is provided, send a help message
        if (!prompt) {
            return api.sendMessage(
                `╭─『 𝗧𝗘𝗫𝗧𝗦 𝗕𝗢𝗧 』✧✧✧\n╰✧✧✧───────────✧\n╭✧✧✧───────────✧\n𝙂𝙪𝙞𝙙𝙚: Hello po, I am 𝗚𝗖𝗛𝗔𝗧 𝗕𝗢𝗧 created by George Nakila, way uyab 😂\nBtaw kung gusto mo gumamit ng AI nato kindly follow examples below.\n\n𝙴𝚇𝙰𝙼𝙿𝙻𝙴:\nai mapagmahal ba si George?\n╰─────────────✧✧✧\n╭✧✧✧───────────✧\n   ᴏᴡɴᴇʀ : ɢᴇᴏʀɢᴇ ɴᴀᴋɪʟᴀ\n╰─────────────✧✧✧`,
                event.threadID,
                messageID
            );
        }

        // Delay
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay time as needed

        const roleplay = "You're George Nakila, Bisayang dako";

        const gpt4_api = `https://rest-api-production-5054.up.railway.app/gemini?prompt=${encodeURIComponent(prompt)}&roleplay=${encodeURIComponent(roleplay)}&uid=${event.senderID}&file_url=${encodeURIComponent(content)}`;

        const response = await axios.get(gpt4_api);

        if (response.data && response.data.message) {
            const generatedText = response.data.message;

            // AI Answer
            api.sendMessage(
                `╭─『 𝗧𝗘𝗫𝗧𝗦 𝗕𝗢𝗧 』✧✧✧\n╰✧✧✧───────────✧\n╭✧✧✧───────────✧\n𝘼𝙣𝙨𝙬𝙚𝙧: ${generatedText}\n╰─────────────✧✧✧\n╭✧✧✧───────────✧\n   ᴏᴡɴᴇʀ : ɢᴇᴏʀɢᴇ ɴᴀᴋɪʟᴀ\n╰─────────────✧✧✧`,
                event.threadID,
                messageID
            );
        } else {
            console.error('API response did not contain expected data:', response.data);
            api.sendMessage(
                `❌ 𝙰𝙽 𝙴𝚁𝚁𝙾𝚁 𝙾𝙲𝙲𝚄𝚁𝚁𝙴𝙳 𝚆𝙷𝙄𝙻𝙴 𝙶𝙴𝙉𝙴𝚁𝙰𝚃𝙸𝙽𝙶 𝚃𝙷𝙴 𝚃𝙴𝚇𝚃 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴. 𝙿𝙻𝙴𝙰𝚂𝙴 𝚃𝚁𝚈 𝙰𝙶𝙰𝙸𝙽 𝙻𝙰𝚃𝙴𝚁. 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴 𝙳𝙰𝚃𝙰: ${JSON.stringify(response.data)}`,
                event.threadID,
                messageID
            );
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage(
            `╭─『 𝗧𝗘𝗫𝗧𝗦 𝗕𝗢𝗧 』✧✧✧\n╰✧✧✧───────────✧\n╭✧✧✧───────────✧\nSorry, down pa yong API, baka pwedeng mag-antay ka nalang muna. Inaayos pa ni admin George Nakila yong API. Thanks for understanding 🥰: ${error.message}\n╰─────────────✧✧✧\n╭✧✧✧───────────✧\n   ᴏᴡɴᴇʀ : ɢᴇᴏʀɢᴇ ɴᴀᴋɪʟᴀ\n╰─────────────✧✧✧`,
            event.threadID,
            event.messageID
        );
    }
};
