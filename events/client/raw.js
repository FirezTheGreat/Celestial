const Event = require('../../structures/Event');

module.exports = class extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(r) {
        try {
            if (this.bot.music) {
                this.bot.music.updateVoiceState(r);
            };
        } catch (error) {
            console.error(error);
        };
    };
};