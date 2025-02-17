const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "wiki",
  version: "1.0.0",
  role: 1,
  credits: "Clarence",
  description: "Fetch a summary from Wikipedia for a given topic",
  hasPrefix: true,
  cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const query = args.join(' ').trim();

  if (!query) {
    return api.sendMessage('Please provide a topic to search on Wikipedia.', threadID, messageID);
  }

  try {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);
    const { title, extract, description, thumbnail, content_urls } = response.data;

    if (title && extract) {
      let message = `${title}\n\n`;

      if (description) {
        message += `Description: ${description}\n\n`;
      }

      message += `Summary:\n${extract}\n\n`;

      if (thumbnail && thumbnail.source) {
        message += `Image: ${thumbnail.source}\n\n`;
      }

      message += `Read more: [Wikipedia Page](${content_urls.desktop.page})`;

      await api.sendMessage(message, threadID, messageID);
    } else {
      await api.sendMessage('No information found for the specified topic.', threadID, messageID);
    }
  } catch (error) {
    console.error('Error fetching Wikipedia summary:', error);
    await api.sendMessage('Sorry, there was an error processing your request.', threadID, messageID);
  }
};
