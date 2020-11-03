const Command = require("../../structures/Command");

module.exports = class Avatar extends Command {
    constructor(...args) {
        super(...args, {
            name: 'avatar',
            aliases: ['av'],
            category: 'fun',
            description: 'Shows Avatar Of An User Or Your Avatar',
            usage: '[mention | username | ID | nickname] (optional)',
            accessableby: 'everyone'
        });
    };

    async run(message, args) {
        try {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args.join('')) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.member;
            if (!member) return message.channel.send('**Member Not Found!**');

            if (args[0]) {
                message.channel.send({
                    embed: {
                        title: `${member.user.username}'s Avatar`,
                        color: 'GREEN',
                        image: {
                            url: `${member.user.displayAvatarURL({ dynamic: true })}?size=4096`
                        },
                        timestamp: new Date(),
                        footer: {
                            text: message.guild.name,
                            icon_url: message.guild.iconURL({ dynamic: true })
                        }
                    }
                });
            } else {
                message.channel.send({
                    embed: {
                        title: `${message.author.username}'s Avatar`,
                        color: 'GREEN',
                        image: {
                            url: `${message.author.displayAvatarURL({ dynamic: true })}?size=4096`
                        },
                        timestamp: new Date(),
                        footer: {
                            text: message.guild.name,
                            icon_url: message.guild.iconURL({ dynamic: true })
                        }
                    }
                });
            };
        } catch (error) {
            console.error(error);
            return message.channel.send(`An Error Occurred: \`${error.message}\`!`);
        };
    };
};