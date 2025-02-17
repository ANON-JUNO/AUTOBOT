const axios = require("axios");

module.exports.config = {
    name: "gpt3",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Juno",
    description: "GPT architecture",
    usePrefix: true,
    commandCategory: "GPT3",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID, messageReply, threadID, senderID } = event;
        let prompt = args.join(" ");

        if (messageReply && messageReply.body) {
            const repliedMessage = messageReply.body;
            prompt = `${repliedMessage} ${prompt}`;
        }

        if (!prompt.trim()) {
            return api.sendMessage(
                "Please provide a prompt to get a response from GPT 3.",
                threadID,
                messageID
            );
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const apiUrl = `https://haji-mix.onrender.com/gpt4om?prompt=${encodeURIComponent(prompt)}`;

        let attempts = 0;
        let response;

        while (attempts < 3) {
            try {
                response = await axios.get(apiUrl);
                if (response.data && response.data.message) {
                    break;
                }
            } catch (error) {
                attempts++;
                if (attempts >= 3) {
                    return api.sendMessage(
                        "An error occurred while communicating with the API. Please try again later.",
                        threadID,
                        messageID
                    );
                }
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }

        if (response && response.data && response.data.message) {
            const generatedText = response.data.message;

            api.sendMessage(
                `Answer GPT 3:\n${generatedText}\n\nType 'clear' to delete the conversation history.`,
                threadID,
                messageID
            );
        } else {
            api.sendMessage(
                "The response from the server is empty or invalid. Please try again later.",
                threadID,
                messageID
            );
        }
    } catch (error) {
        api.sendMessage(
            "An error occurred while processing your request. Please try again later.",
            event.threadID,
            messageID
        );
    }
};
