import { ApplicationCommandType } from "discord.js";
import Event from "../../../structures/Event.mjs";

export default class Ready extends Event {
    constructor(...args) {
        super(...args, {
            once: true,
            type: 'Client'
        });
    };

    /**
     * Initiates Ready Event
     */
    
    async EventRun() {
        try {
            const InteractionCommands = this.bot.commands.filter(({ type }) => [ApplicationCommandType.User, ApplicationCommandType.Message, ApplicationCommandType.ChatInput].includes(type));
            const Commands = [];

            for (const [name, { description, type, options }] of InteractionCommands) {
                [ApplicationCommandType.User, ApplicationCommandType.Message].includes(type)
                    ? Commands.push({ name, type })
                    : Commands.push({ name, description, type, options })
            };

            await this.bot.guilds.cache.first().commands.set(Commands);

            console.log(`${this.bot.user.username} is Online!`);
        } catch (error) {
            console.error(error);
        };
    };
};