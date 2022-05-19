import { Client, Partials, ActivityType, IntentsBitField, Collection } from "discord.js";
import { Manager } from "erela.js";
import Mongoose from "./Mongoose.js";
import Config from '../config.js';
import Util from "./Util.js";
import './music/Filters.js';

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

        this.trackCollectors = new Collection();
        this.playerEvents = new Collection();
        this.commands = new Collection();
        this.events = new Collection();
        this.utils = new Util(this);
    };

    /**
     * 
     * @param {Client} options Client Options
     */

    validate(options) {
        if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

        if (!options.token) throw new Error('You must pass the token for the bot.');
        this.token = options.token;
    };

    /**
     * 
     * @returns Starts the bot and loads all Commands, Events and Initiates Mongoose Client
     */

    async start() {
        try {
            await this.utils.loadCommands();
            await this.utils.loadEvents();
            await super.login(this.token);

            setImmediate(async () => {
                const guilds = this.guilds;

                this.music = new Manager({
                    autoPlay: true,
                    clientId: this.user.id,
                    nodes: [Config.music],
                    trackPartial: [
                        'author', 'duration',
                        'requester', 'thumbnail',
                        'title', 'uri'
                    ],
                    async send(id, payload) {
                        const guild = guilds.cache.get(id);
                        if (guild.available) guild.shard.send(payload);
                    }
                });

                this.music.init(this.user.id);
                new Mongoose().init();

                await this.utils.loadLavalinkEvents();
            });
        } catch (error) {
            console.error(error);
        };
    };
};