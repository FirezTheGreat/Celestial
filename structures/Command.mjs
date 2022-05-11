import { ApplicationCommandType } from 'discord.js';
import Celestial from './Celestial.mjs'

export default class Command {
    /**
     * 
     * @param {Celestial} bot Client
     * @param {string} name Command Name
     * @param {object} options Command Options
     */

    constructor(bot, name, options = {}) {
        this.bot = bot;
        this.name = options.name || name;
        this.description = options.description || null;
        this.category = options.category;
        this.usage = options.usage || null;
        this.type = options.type || ApplicationCommandType.ChatInput;
        this.sub_commands = options.sub_commands || [];
        this.options = options.options || [];
    };

    async InteractionRun(interaction) {
        throw new Error(`InteractionCommand ${this.name} doesn't provide a run method!`);
    };
};