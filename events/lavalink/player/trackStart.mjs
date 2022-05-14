import { EmbedBuilder } from "discord.js";
import { Player } from "erela.js";
import PlayerEvent from "../../../structures/PlayerEvent.mjs";

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
            const requester = this.bot.users.cache.get(track.requester.id);

            const trackStartEmbed = new EmbedBuilder()
                .setAuthor({ name: track.requester.username, iconURL: requester.displayAvatarURL() })
                .setTitle('Now Playing')
                .setColor('Green')
                .setDescription(`${this.bot.utils.formatTime(player.position, true)}/${this.bot.utils.formatTime(player.queue.duration, true)}\n${this.bot.utils.progressBar({ position: player.position, duration: track.duration })}`)
                .setFields([
                    { name: 'Track', value: track.title, inline: true },
                    { name: 'Requester', value: `${requester}`, inline: true },
                    { name: 'Duration', value: this.bot.utils.formatTime(player.queue.current.duration, true), inline: true }
                ])
                .setThumbnail(player.queue.current.thumbnail)
                .setFooter({ text: requester.username, iconURL: requester.displayAvatarURL() })
                .setTimestamp();
            // Create Buttons
            await text_channel.send({ embeds: [trackStartEmbed] });
        } catch (error) {
            console.error(error);
        };
    };
};