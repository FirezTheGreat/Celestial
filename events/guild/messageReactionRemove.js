const Event = require("../../structures/Event");

module.exports = class MessageReactionRemove extends Event {
    constructor(...args) {
        super(...args)
    };

    async run(reaction, user) {
        try {
            if (user.bot) return;
            if (reaction.message.id !== '773172751645016075') return;

            let roleName = reaction.emoji.name;
            if (roleName === '🏏') {
                roleName = 'cricket'
            } else if (roleName === '⚽') {
                roleName = 'football'
            } else if (roleName === '🏀') {
                roleName = 'basketball'
            } else {
                roleName = 'badminton'
            };

            let role = reaction.message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
            if (!role) return;
            let member = reaction.message.guild.members.cache.get(user.id);

            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role.id)
            };
        } catch (error) {
            console.error(error);
        };
    };
};