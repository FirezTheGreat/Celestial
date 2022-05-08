import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import Event from "../../structures/Event.mjs";

export default class VoiceStateUpdate extends Event {
    constructor(...args) {
        super(...args, {
            type: 'Guild'
        });
    };

    async EventRun(oldState, newState) {
        if (oldState.member.id === this.bot.user.id) {
            const connection = getVoiceConnection(newState.guild.id);

            if (!newState.channelId) {
                connection ? connection.disconnect() : null;
            } else if (oldState.channelId !== newState.channelId) {
                if (connection) {
                    joinVoiceChannel({
                        channelId: newState.channelId,
                        guildId: newState.guild.id,
                        adapterCreator: newState.channel.guild.voiceAdapterCreator
                    });
                };
            };
        };
    };
};