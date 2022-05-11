import { VoiceState } from "discord.js";
import Event from "../../structures/Event.mjs";

export default class voiceStateUpdate extends Event {
    constructor(...args) {
        super(...args, {
            type: 'Guild'
        });
    };

    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */

    EventRun(oldState, newState) {
        try {
            if (oldState.member.id === this.bot.user.id && !newState.channelId) {
                const player = this.bot.music.get(newState.guild.id);

                player ? player.destroy() : null;
            };
        } catch (error) {
            console.error(error);
        };
    };
};