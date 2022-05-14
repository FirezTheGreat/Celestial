import { Manager } from "erela.js";
import Celestial from "./Celestial.mjs";

export default class PlayerEvent {
    /**
     * 
     * @param {Celestial} bot Client
     * @param {object} options Player Event Options
     * @param {Manager} options.player Player
     * @param {string} options.type Type of Player Event
     * @param {boolean} options.once Once Event Emitter Boolean
     * @param {Function} options.emitter Event Emitter
     */

    constructor(bot, name, player, options = {}) {
        this.bot = bot;
        this.name = name;
        this.player = player;
        this.type = options.once ? 'once' : 'on';
        this.emitter = (typeof options.emitter === 'string' ? this.player[options.emitter] : options.emitter) || this.player;
    };

    async PlayerEventRun(...args) {
        throw new Error(`The run method has not been implemented in ${this.name}`);
    };
};