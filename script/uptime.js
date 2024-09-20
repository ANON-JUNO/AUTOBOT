module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "upt"],
    version: "1.0",
    author: "GeoDevz69",
    role: 0,
    shortDescription: {
      en: "Displays the uptime of the bot."
    },
    longDescription: {
      en: "Displays the amount of time that the bot has been running for."
    },
    category: "System",
    guide: {
      en: "Use {p}uptime to display the uptime of the bot."
    }
  },
  onStart: async function ({ api, event, args }) {
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${hours} hours ${minutes} minutes ${seconds} second`;
    api.sendMessage(`🎀 𝗚𝗖𝗛𝗔𝗧 𝗕𝗢𝗧 🎀\n━━━━━━━━━━━━━━━━━━\nThe bot has been running for\n${uptimeString}\nғʀᴏᴍ: 💕 ᴀᴅᴍɪɴ ɢᴇᴏʀᴀʏ 💕.`, event.threadID);
  }
};