const { Client, Collection, Intents } = require('discord.js');
const MemePosterClient = require('./MemePoster');
const Util = require('./Util');
const { POSTER_ID, POSTER_TOKEN, POSTER_TIME } = require('../config.json');

module.exports = class Celestial extends Client {
    constructor(options = {}) {
        super({
            fetchAllMembers: true,
            partials: ['MESSAGE', 'REACTION'],
            ws: {
                intents: Intents.ALL
            }
        });

        this.validate(options);

        this.commands = new Collection();
        this.aliases = new Collection();
        this.events = new Collection();
        this.utils = new Util(this);
        this.erela = require('../structures/music/erela');
        this.owners = options.owners;
        this.memePoster = POSTER_ID && POSTER_TOKEN ? new MemePosterClient(POSTER_ID, POSTER_TOKEN, {
            subreddits: ["memes", "wholesomememes", "tumblr", "meirl", "historymemes", "programmerhumor", "prequelmemes", "meme", "politicalhumor"],
            postTypes: ['image', 'rich:video'],
            postInterval: POSTER_TIME,
            disableMentions: 'none'
        }) : null;
    };

    validate(options) {
        if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

        if (!options.TOKEN) throw new Error('You must pass the token for the bot.');
        this.token = options.TOKEN;

        if (!options.PREFIX) throw new Error('You must pass a prefix for the bot.');
        if (typeof options.PREFIX !== 'string') throw new TypeError('Prefix should be a type of String.');
        this.prefix = options.PREFIX;
    };

    async start(token = this.token) {
        this.utils.loadCommands();
        this.utils.loadEvents();
        super.login(token);
    };
};