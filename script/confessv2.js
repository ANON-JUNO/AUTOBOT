module.exports.config = {
    name: "confessv2",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Deku",
    description: "Confess to someone",
    commandCategory: "...",
    usages: "confessv2 [Facebook profile link or UID] [your message]",
    cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
    async function r(m) {
        api.sendMessage(m, event.threadID, event.messageID);
    }
    if (args.length < 2) return r("Usage: confessv2 [Facebook profile link or UID] [your message]");
    let recipient = args[0];
    let message = args.slice(1).join(" ");
    try {
        let uid;
        if (recipient.startsWith("https://facebook.com")) {
            uid = await api.getUID(recipient);
        } else {
            uid = recipient;
        }
        api.sendMessage(
            `You've got a message\n\nConfession: ${message}\n\nDon't bother me to ask who's the sender, you're just wasting your time (◍•ᴗ•◍)`,
            uid,
            () => r("Confession has been sent successfully!")
        );
    } catch (err) {
        r("I'm sorry but your confession has failed to send, I think it's time to chat with that person and confess your feelings (◍•ᴗ•◍)");
    }
};
