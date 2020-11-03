const Event = require('../../structures/Event');

module.exports = class Message extends Event {
	async run(message) {
		try {
			if (!message.guild || message.author.bot || !message.content.startsWith(this.bot.prefix)) return;

			const [cmd, ...args] = message.content.slice(this.bot.prefix.length).split(/ +/g);

			const command = this.bot.commands.get(cmd.toLowerCase()) || this.bot.commands.get(this.bot.aliases.get(cmd.toLowerCase()));
			if (command) command.run(message, args);
		} catch (error) {
			console.error(error);
		};
	};
};