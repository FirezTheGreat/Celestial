import { Client, Partials, ActivityType, IntentsBitField, Collection } from "discord.js";
import Mongoose from "./Mongoose.js";
import Util from "./Util.js";

export default class Celestial extends Client {
    constructor(options = {}) {
        super({
            partials: [Partials.GuildMember],
            presence: {
                status: 'online',
                activities: [
                    { name: 'Music In Firez\'s Lair', type: ActivityType.Playing }
                ]
            },
            intents: [
                IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildVoiceStates
            ]
        });

        this.validate(options);

        this.commands = new Collection();
        this.events = new Collection();
        this.mongoose = new Mongoose();
        this.utils = new Util(this);
    };

    validate(options) {
        if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

        if (!options.token) throw new Error('You must pass the token for the bot.');
        this.token = options.token;
    };

    async start() {
        await this.utils.loadCommands();
        await this.utils.loadEvents();
        this.mongoose.init();
        await super.login(this.token);
    };
};