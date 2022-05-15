import { ApplicationCommandType } from 'discord.js';
import Celestial from './Celestial.js'

export default class Command {
    /**
     * 
     * @param {Celestial} bot Client
     * @param {string} name Command Name
     * @param {object} options Command Options
     * @param {string} options.name Command Name
     * @param {string} options.description Command Description
     * @param {string} options.category Command Category
     * @param {string} options.usage Command Usage
     * @param {number} options.type Command Type
     * @param {array} options.sub_commands Sub Commands Array
     * @param {array} options.options Command Options
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