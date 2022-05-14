import Event from "../../../structures/Event.mjs";

export default class Raw extends Event {
    constructor(...args) {
        super(...args, {
            type: 'Guild'
        });
    };

    /**
     * 
     * @param {import("discord-api-types/v10").GatewaySendPayload} payload Gateway Payload Data
     */
    
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