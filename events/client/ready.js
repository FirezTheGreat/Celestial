const Event = require('../../structures/Event');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			once: true
		});
	};

	run() {
		try {
			this.bot.user.setActivity(`Firez's Server`, { type: 'WATCHING' });
			console.log(`${this.bot.user.username} is Online!`);
			this.bot.erela.connect(this.bot);
			this.bot.music.init(this.bot.user.id);

			if (this.bot.memePoster) {
				this.bot.setInterval(async () => {
					try {
						const post = await this.bot.memePoster.fetchRandomPost(false);
						await this.bot.memePoster.post(post);
					} catch (error) {
						console.error(error);
					}
				}, this.bot.memePoster.options.postInterval);
			};
		} catch (error) {
			console.error(error);
		};
	};
};