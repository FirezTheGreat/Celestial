import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
import { Player } from "erela.js";
import PlayerEvent from "../../../structures/PlayerEvent.js";

export default class trackStart extends PlayerEvent {
    constructor(...args) {
        super(...args);
    };

    /**
     * 
     * @param {Player} player Player Manager
     * @param {import("erela.js").Track} track Track
     */

    async PlayerEventRun(player, track) {
        try {
            const text_channel = this.bot.channels.cache.get(player.textChannel);

            const trackCollectorMessage = this.bot.trackCollectors.get(`${player.guild}_${track.track}`);
            if (trackCollectorMessage && (player.trackRepeat || player.queueRepeat)) {
                this.bot.trackCollectors.delete(track.track);

                trackCollectorMessage.stop();
            };

            const trackStartEmbed = new EmbedBuilder()
                .setAuthor({ name: text_channel.guild.name, iconURL: text_channel.guild.iconURL() })
                .setTitle('Now Playing')
                .setColor('Green')
                .setThumbnail(player.queue.current.thumbnail)
                .setDescription(`${this.bot.utils.formatTime(0, true)}/${this.bot.utils.formatTime(track.duration, true)}\n${this.bot.utils.progressBar({ position: 0, duration: track.duration })}`)
                .setFields([
                    { name: 'Track', value: `[${track.title}](${track.uri})`, inline: true },
                    { name: 'Artist', value: track.author, inline: true },
                    { name: 'Duration', value: this.bot.utils.formatTime(player.queue.current.duration, true), inline: true }
                ])
                .setFooter({ text: `Requested By - ${track.requester.username}`, iconURL: track.requester.displayAvatarURL() })
                .setTimestamp();

            const trackEmbedPlayComponents = new ActionRowBuilder()
                .setComponents([
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setEmoji('⏮')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(player.queue.previous ? false : true),
                    new ButtonBuilder()
                        .setCustomId('play')
                        .setEmoji('⏯')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('stop')
                        .setEmoji('⬜')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setEmoji('⏭')
                        .setStyle(ButtonStyle.Primary)
                ]);

            const trackEmbedLoopComponents = new ActionRowBuilder()
                .setComponents([
                    new ButtonBuilder()
                        .setCustomId('loop_track')
                        .setEmoji('🔂')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('loop_queue')
                        .setEmoji('🔁')
                        .setStyle(ButtonStyle.Primary)
                ]);


            const trackMessage = await text_channel.send({ embeds: [trackStartEmbed], components: [trackEmbedPlayComponents, trackEmbedLoopComponents] });
            const trackCollector = trackMessage.createMessageComponentCollector({ filter: (message) => message.member.voice?.channelId === player.voiceChannel, componentType: ComponentType.Button });

            this.bot.trackCollectors.set(`${player.guild}_${track.track}`, trackCollector);

            trackCollector.on('collect', async (interaction) => {
                try {
                    switch (interaction.customId) {
                        case 'previous':
                            if (player.queue.previous) {
                                player.play(player.queue.previous);

                                return trackCollector.stop('previous');
                            } else {
                                await interaction.reply({ content: '*Previous Track Unavailable*', ephemeral: true });
                            };

                            break;
                        case 'next':
                            if (player.queue.size) {
                                player.stop();

                                return trackCollector.stop('stop');
                            } else {
                                await interaction.reply({ content: '*Next Track Unavailable*', ephemeral: true });
                            };

                            break;
                        case 'play':
                            if (player.playing) {
                                player.pause(true);

                                await interaction.reply({ content: '*Track Paused*', ephemeral: true });
                            } else {
                                player.pause(false);

                                await interaction.reply({ content: '*Track Unpaused*', ephemeral: true });
                            };

                            break;
                        case 'stop':
                            player.stop();

                            await interaction.reply({ content: '*Track Skipped*', ephemeral: true });
                            trackCollector.stop('stop');

                            break;
                        case 'loop_track':
                            if (player.trackRepeat) {
                                player.setTrackRepeat(false);

                                await interaction.reply({ content: '*Track Unlooped*', ephemeral: true });
                            } else {
                                player.setTrackRepeat(true);

                                await interaction.reply({ content: '*Track Looped*', ephemeral: true });
                            };

                            break;
                        case 'loop_queue':
                            if (player.queueRepeat) {
                                player.setQueueRepeat(false);

                                await interaction.reply({ content: '*Queue Unlooped*', ephemeral: true });
                            } else {
                                player.setQueueRepeat(true);

                                await interaction.reply({ content: '*Queue Looped*', ephemeral: true });
                            };

                            break;
                    };
                } catch (error) {
                    console.error(error);
                };
            });

            trackCollector.on('end', async () => {
                try {
                    trackMessage.deletable ? await trackMessage.delete().catch : null;

                    this.bot.trackCollectors.delete(track.track);
                } catch { };
            });
        } catch (error) {
            console.error(error);
        };
    };
};