import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../../structures/Command.js";

export default class nowPlaying extends Command {
    constructor(...args) {
        super(...args, {
            name: 'nowplaying',
            description: 'Shows details about current playing song',
            category: 'Music'
        });
    };

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction CommandInteraction
     * @returns Shows details about current playing song
     */
    async InteractionRun(interaction) {
        try {
            const player = this.bot.music.get(interaction.guildId);
            if (!player.queue?.current || (player.position === 0 && !player.playing)) return await interaction.reply({ content: '*Nothing playing!*' });

            const { current } = player.queue;

            const nowPlayingEmbed = new EmbedBuilder()
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                .setTitle(current.title)
                .setColor('Green')
                .setThumbnail(current.thumbnail)
                .setURL(current.uri)
                .setDescription(`${this.bot.utils.progressBar({ position: player.position, duration: current.duration })}\n\n\`${this.bot.utils.formatTime(player.position, true)} / ${this.bot.utils.formatTime(current.duration, true)}\``)
                .setFooter({ text: `Requested By - ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();
            
            return await interaction.reply({ embeds: [nowPlayingEmbed] });
        } catch (error) {
            console.error(error);
            return this.bot.utils.error(interaction, error);
        };
    };
};