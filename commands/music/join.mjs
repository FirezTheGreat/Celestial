import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../../structures/Command.mjs";

export default class Join extends Command {
    constructor(...args) {
        super(...args, {
            name: 'join',
            description: 'Joins a Voice Channel',
            category: 'Music'
        })
    };

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction CommandInteraction
     * @returns Joins a Voice Channel
     */

    async InteractionRun(interaction) {
        try {
            if (!interaction.member.voice.channelId) return await interaction.reply({ content: '*Please join a Voice Channel!*', ephemeral: true });

            let player = this.bot.music.get(interaction.guildId);

            if (player) {
                return await interaction.reply({ content: '*I am connected to the same Voice Channel*', ephemeral: true });
            } else {
                this.bot.music.create({
                    guild: interaction.guildId,
                    selfDeafen: true,
                    textChannel: interaction.channelId,
                    voiceChannel: interaction.member.voice.channelId,
                    volume: 100
                }).connect();

                const playerEmbed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                    .setColor('Green')
                    .setDescription(`*Joined and Connected to ${interaction.member.voice.channel}*`)
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp();

                return await interaction.reply({ embeds: [playerEmbed] });
            };
        } catch (error) {
            console.error(error);
            return this.bot.utils.error(interaction, error);
        };
    };
};