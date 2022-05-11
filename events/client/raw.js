import Event from "../../structures/Event.mjs";

export default class raw extends Event {
    constructor(...args) {
        super(...args, {
            type: 'Guild'
        });
    };

    EventRun(payload) {
        try {
            if (this.bot.music) {
                this.bot.music.updateVoiceState(payload);
            };
        } catch (error) {
            console.error(error);
        };
    };
};