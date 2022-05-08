import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { VoiceState } from "discord.js";
import Event from "../../structures/Event.mjs";

export default class VoiceStateUpdate extends Event {
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

    async EventRun(oldState, newState) {
        if (oldState.member.id === this.bot.user.id) {
            const connection = getVoiceConnection(newState.guild.id);

            if (!newState.channelId) {
                connection ? connection.destroy() : null;
            } else if (connection && oldState.channelId !== newState.channelId) {
                joinVoiceChannel({
                    channelId: newState.channelId,
                    guildId: newState.guild.id,
                    adapterCreator: newState.channel.guild.voiceAdapterCreator
                });
            };
        };
    };
};