import { EmbedBuilder, Collection } from "discord.js";
import Celestial from "../Celestial.mjs";
import Config from "../../config.mjs";
import { Manager } from "erela.js";

const trackCollectors = new Collection();

export default class Music extends Manager {
    /**
     * 
     * @param {Celestial} bot Client
     */

    constructor(bot) {
        super({
            autoPlay: true,
            clientId: bot.user.id,
            nodes: [Config.music],
            trackPartial: [
                'author', 'duration',
                'requester', 'thumbnail',
                'title', 'uri'
            ],
            async send(id, payload) {
                const guild = await bot.guilds.fetch(id);
                if (guild.available) guild.shard.send(payload);
            }
        });


        this.on('nodeConnect', (node) => console.log(`Connected to ${node.options.identifier}:${node.options.port}`));

        this.on('nodeReconnect', (node) => console.log(`Reconnected to ${node.options.identifier}:${node.options.port}`));

        this.on('nodeDisconnect', (node, error) => console.warn(`${node.options.identifier} Disconnected\nReason - [${error.code}] - ${error.reason}}`));

        this.on('nodeError', (node, error) => console.error(`Error received from ${node.options.host}:${node.options.port} - ${error}`));

        this.on('trackStart', async (player, track) => {
            try {
                const text_channel = await bot.channels.fetch(player.textChannel);
                const requester = await bot.users.fetch(track.requester.id);

                const trackStartEmbed = new EmbedBuilder()
                    .setAuthor({ name: track.requester.username, iconURL: requester.displayAvatarURL() })
                    .setTitle('Now Playing')
                    .setColor('Green')
                    .setDescription(`${bot.utils.formatTime(player.position, true)}/${bot.utils.formatTime(player.queue.duration, true)}\n${bot.utils.progressBar({ position: player.position, duration: track.duration })}`)
                    .setFields([
                        { name: 'Track', value: track.title, inline: true },
                        { name: 'Requester', value: `${requester}`, inline: true },
                        { name: 'Duration', value: bot.utils.formatTime(player.queue.current.duration, true), inline: true }
                    ])
                    .setThumbnail(player.queue.current.thumbnail)
                    .setFooter({ text: requester.username, iconURL: requester.displayAvatarURL() })
                    .setTimestamp();
                // Create Buttons
                return await text_channel.send({ embeds: [trackStartEmbed] });
            } catch (error) {
                console.error(error);
            };
        });

        this.on('playerMove', async (player, _, current_channel) => {
            try {
                player.voiceChannel = (await bot.channels.fetch(current_channel)).id;
            } catch (error) {
                console.error(error);
            };
        });
    };
};