import Celestial from "./Celestial.mjs";

export default class Event {
    /**
     * 
     * @param {Celestial} bot Client
     * @param {string} name Event Name
     * @param {object} options Event Options
     * @param {string} options.type Type of Event
     * @param {boolean} options.once Once Event Emitter Boolean
     * @param {Function} options.emitter Event Emitter
     */

    constructor(bot, name, options = {}) {
        this.bot = bot;
        this.name = name;
        this.category = options.type
        this.type = options.once ? 'once' : 'on';
        this.emitter = (typeof options.emitter === 'string' ? this.bot[options.emitter] : options.emitter) || this.bot;
    };

    async EventRun(...args) {
        throw new Error(`The run method has not been implemented in ${this.name}`);
    };
};