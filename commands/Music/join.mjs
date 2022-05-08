import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import { ApplicationCommandType, ChatInputCommandInteraction } from 'discord.js';
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

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @returns Joins or Rejoins VC
     */
    
    async InteractionRun(interaction) {
        try {
            if (!interaction.member.voice.channelId) return interaction.reply({ content: '*You need to join a Voice Channel first.*', ephemeral: true });

            await interaction.deferReply();

            let connection = getVoiceConnection(interaction.guild.id);
            if (connection && connection.joinConfig.channelId === interaction.member.voice.channelId && interaction.guild.me.voice.channelId) {
                return interaction.editReply({ content: '*I am already connected to the same Voice Channel!*', ephemeral: true });
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