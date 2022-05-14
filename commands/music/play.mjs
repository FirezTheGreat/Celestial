import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../../structures/Command.mjs";

export default class Play extends Command {
    constructor(...args) {
        super(...args, {
            name: 'play',
            description: 'Play\s Music Track',
            category: 'Music',
            usage: '[query | link]',
            options: [
                { name: 'query', type: ApplicationCommandOptionType.String, description: 'Song Query or Link', required: true }
            ]
        });
    };

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @returns Plays Song
     */

    async InteractionRun(interaction) {
        try {
            const query = interaction.options.getString('query');
            const { channelId } = interaction.member.voice;

            if (!channelId) return await interaction.reply({ content: '*Please join a Voice Channel!*', ephemeral: true });

            let player = this.bot.music.get(interaction.guildId);

            if (!player) {
                player = this.bot.music.create({
                    guild: interaction.guildId,
                    selfDeafen: true,
                    textChannel: interaction.channelId,
                    voiceChannel: channelId,
                    volume: 100
                });

                player.connect();
            } else {
                if (player.voiceChannel !== channelId) return await interaction.reply({ content: '*Currently active in another queue!*', ephemeral: true });
                player.state !== 'CONNECTED' ? player.connect() : null;
            };

            await interaction.deferReply();

            switch (true) {
                default:
                    try {
                        const track = await player.search({ query: query, source: 'youtube' }, interaction.user);

                        switch (track.loadType) {
                            case 'NO_MATCHES':
                                await interaction.editReply({ content: '*No Matches found*' });

                                break;
                            case 'LOAD_FAILED':
                                throw track.exception
                            case 'TRACK_LOADED':
                            case 'SEARCH_RESULT':
                                const [playTrack] = track.tracks;
                                player.queue.add(playTrack);

                                if (!player.playing && !player.paused && !player.queue.size) {
                                    await player.play();
                                };

                                const trackAddEmbed = new EmbedBuilder()
                                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                                    .setTitle('Added to Queue')
                                    .setThumbnail(playTrack.thumbnail)
                                    .setColor('Green')
                                    .setDescription(`*Track has been added to queue!*\n${this.bot.utils.formatTime(0, true)}/${this.bot.utils.formatTime(playTrack.duration, true)}\n${this.bot.utils.progressBar({ position: 0, duration: playTrack.duration })}`)
                                    .setFields([
                                        { name: 'Track', value: playTrack.title, inline: true },
                                        { name: 'Requester', value: `${interaction.user}`, inline: true },
                                        { name: 'Duration', value: this.bot.utils.formatTime(playTrack.duration, true), inline: true }
                                    ])
                                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                                    .setTimestamp();

                                await interaction.editReply({ embeds: [trackAddEmbed] });

                                break;
                            case 'PLAYLIST_LOADED':
                                
                        };
                    } catch (error) {
                        player.destroy();

                        console.error(error);
                        this.bot.utils.error(interaction, error);
                    };
            };
        } catch (error) {
            console.error(error);
            return this.bot.utils.error(interaction, error);
        };
    };
};