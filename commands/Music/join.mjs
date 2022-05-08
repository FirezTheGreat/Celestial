import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import { ApplicationCommandType } from 'discord.js';
import Command from '../../structures/Command.mjs';

export default class Join extends Command {
    constructor(...args) {
        super(...args, {
            name: 'join',
            description: 'Join a Voice Channel',
            category: 'Music',
            type: ApplicationCommandType.ChatInput,
        });
    };

    async InteractionRun(interaction) {
        try {
            if (!interaction.member.voice.channelId) return interaction.reply({ content: '*You need to join a Voice Channel first.*', ephemeral: true });

            await interaction.deferReply();

            let connection = getVoiceConnection(interaction.guild.id);
            if (connection && connection.joinConfig.channelId === interaction.member.voice.channelId) {
                const has_rejoined = connection.rejoin(connection.joinConfig);

                if (has_rejoined) return await interaction.editReply({ content: `*Rejoined ${interaction.member.voice.channel} Successfully!*` });
                else return await interaction.editReply({ content: `*Couldn't Rejoin ${interaction.member.voice.channel}!*` });
            } else {
                connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: interaction.guild.id,
                    selfDeaf: false,
                    adapterCreator: interaction.channel.guild.voiceAdapterCreator
                });

                return await interaction.editReply({ content: `*Joined ${interaction.member.voice.channel} Successfully!*` });
            };
        } catch (error) {
            console.error(error);
            return this.bot.utils.error(interaction, error);
        };
    };
};