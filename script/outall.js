module.exports.config = {
    name: "outall",
    version: "1.0.0",
    role: 2,
    credits: "Juno",
    description: "Out of whole group except the owner",
    usages: "{p}outall",
    hasPrefix: true,
    cooldown: 5
};

module.exports.run = async ({ api, event, args }) => {
    try {
        const list = await api.getThreadList(100, null, ["INBOX"]);
        list.forEach(async (item) => {
            if (item.isGroup && item.threadID !== event.threadID) {
                await api.removeUserFromGroup(api.getCurrentUserID(), item.threadID);
            }
        });
        await api.sendMessage('Out of all other groups successfully...', event.threadID);
    } catch (err) {
        console.error(err);
    }
};
