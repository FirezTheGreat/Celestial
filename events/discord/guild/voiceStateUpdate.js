import { VoiceState } from "discord.js";
import Event from "../../../structures/Event.js";

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
            if (oldState.member.id === this.bot.user.id) {
                const player = this.bot.music.get(newState.guild.id);

                if (!newState.channelId) {
                    this.bot.trackCollectors.delete(newState.guild.id);
                    player ? player.destroy() : null;
                } else {
                    player.voiceChannel = newState.channelId;
                };
            };
        } catch (error) {
            console.error(error);
        };
    };
};