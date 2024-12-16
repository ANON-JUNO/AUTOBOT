module.exports.config = {
  name: "leaveall",
  version: "1.0.0",
  role: 2,
  hasPrefix: true,
  credits: "Juno",
  description: "Bot leaves all threads",
  usages: "leaveall",
  cooldowns: 10,
};

module.exports.run = async function ({ api, event, Users }) {
  try {
    const userInfo = await api.getUserInfo(event.senderID);
    const userRole = userInfo[event.senderID]?.isAdmin || false;

    if (!userRole) {
      return api.sendMessage("This command is restricted to admins only.", event.threadID);
    }

    const threads = await api.getThreadList(100, null, ["INBOX"]);
    const threadIDs = threads.map(thread => thread.threadID);

    for (const threadID of threadIDs) {
      try {
        await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
      } catch (err) {
        api.sendMessage(`Failed to leave thread: ${threadID}\nError: ${err.message}`, event.threadID);
      }
    }

    api.sendMessage("Successfully left all threads.", event.threadID);
  } catch (error) {
    api.sendMessage(`An error occurred: ${error.message}`, event.threadID);
  }
};
