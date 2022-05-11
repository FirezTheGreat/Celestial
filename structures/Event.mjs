import Celestial from "./Celestial.mjs";

export default class Event {
    /**
     * 
     * @param {Celestial} bot Client
     * @param {string} name Event Name
     * @param {object} options Event Options
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