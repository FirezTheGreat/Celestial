import { Interaction } from 'discord.js';
import Event from '../../structures/Event.mjs';

export default class interactionCreate extends Event {
    constructor(...args) {
        super(...args, {
            type: 'Client'
        });
    };

    /**
     * 
     * @param {Interaction} interaction 
     */
    
    async EventRun(interaction) {
        if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
            const command = this.bot.commands.get(interaction.commandName);
            if (command) command.InteractionRun(interaction);
        };
    };
};