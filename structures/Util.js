import { CommandInteraction } from 'discord.js';
import { sep, parse } from 'path';
import glob from 'glob';

export default class Util {
    /**
     * 
     * @param {import('./Celestial.js').default} bot 
     */

    constructor(bot) {
        this.bot = bot;
    };
    /**
     * 
     * @param {Function} input 
     * @returns {boolean} Boolean
     */

    isClass(input) {
        return typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class';
    };

    /**
     * @returns Main Folder Directory
     */

    get directory() {
        return `${process.cwd()}${sep}`;
    };

    /**
     * 
     * @param {object} command Command Object
     * @returns Refreshes Command(s)
     */

    async loadCommands(command = null) {
        const { default: Command } = await import('./Command.js');

        if (command) {
            try {
                const [commandFile] = glob.sync(`${this.directory}commands/${command.category.split(' ').join('-').toLowerCase()}/${command.name.split(' ').join('-').toLowerCase()}.js`.replace(/\\/g, '/'));

                const { name } = parse(commandFile);
                const { default: File } = await import(`file:///${commandFile}`);

                if (!File) return new Error(`*${name} is not a file constructor*`);

                const command = new File(this.bot, name.toLowerCase());
                this.bot.commands.set(command.name, command);

                return command;
            } catch (error) {
                return new Error({ code: error.code, message: error.message });
            };
        };

        const commands = glob.sync(`${this.directory}commands/**/*.js`.replace(/\\/g, '/'));

        for (const commandFile of commands) {
            try {
                const { name } = parse(commandFile);
                const { default: File } = await import(`file:///${commandFile}`);

                if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);

                const command = new File(this.bot, name.toLowerCase());
                if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesnt belong in Commands.`);

                this.bot.commands.set(command.name, command);
            } catch (error) {
                console.error(error);
            };
        };
    };
    /**
     * 
     * @param {object} event Event Object
     * @returns Refreshes and Loads Event(s)
     */

    async loadEvents(event = null) {
        const { default: Event } = await import('./Event.js');

        if (event) {
            try {
                const [eventFile] = glob.sync(`${this.directory}events/${event.category.toLowerCase()}/${event.name}.js`.replace(/\\/g, '/'));

                const { name } = parse(eventFile);
                const { default: File } = await import(`file:///${eventFile}`);

                if (!File) return new Error(`*${name} is not a file constructor*`);

                const event = new File(this.bot, name.toLowerCase());
                this.bot.events.set(event.name, event);

                return event;
            } catch (error) {
                return new Error({ code: error.code, message: error.message });
            };
        };

        const events = glob.sync(`${this.directory}events/discord/**/*.js`.replace(/\\/g, '/'));

        for (const eventFile of events) {
            try {
                const { name } = parse(eventFile);
                const { default: File } = await import(`file:///${eventFile}`);

                if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);

                const event = new File(this.bot, name.toLowerCase());

                if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events`);

                this.bot.events.set(event.name, event);
                event.emitter[event.type](name, (...args) => event.EventRun(...args));
            } catch (error) {
                console.error(error);
            };
        };
    };

    async loadPlayerEvents() {
        const { default: PlayerEvent } = await import('./PlayerEvent.js');

        const events = glob.sync(`${this.directory}events/lavalink/**/*.js`.replace(/\\/g, '/'));

        for (const eventFile of events) {
            try {
                const { name } = parse(eventFile);
                const { default: File } = await import(`file:///${eventFile}`);

                if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);

                const event = new File(this.bot, name.toLowerCase(), this.bot.music);

                if (!(event instanceof PlayerEvent)) throw new TypeError(`Event ${name} doesn't belong in Events`);

                this.bot.playerEvents.set(event.name, event);
                event.emitter[event.type](name, (...args) => event.PlayerEventRun(...args));
            } catch (error) {
                console.error(error);
            };
        };
    };

    /**
     * 
     * @param {CommandInteraction} interaction Interaction
     * @param {Error} error Error Message
     * @param {String} custom Custom Error Message
     * @param {boolean} ephemeral Ephemeral Boolean
     * @returns {string} Error Message
     */

    async error(interaction, error, custom = false, ephemeral = false) {
        try {
            if (interaction.deferred && !interaction.replied) {
                await interaction.editReply({ content: `An Error Occurred: \`${error.message}\`!` });
                return custom ? await interaction.followUp({ content: `Custom Error Message: ${custom}` }) : null;
            } else if (interaction.replied) {
                await interaction.followUp({ content: `An Error Occurred: \`${error.message}\`!` });
                return custom ? await interaction.followUp({ content: `Custom Error Message: ${custom}` }) : null;
            } else {
                await interaction.reply({ content: `An Error Occurred: \`${error.message}\`!`, ephemeral });
                return custom ? await interaction.followUp({ content: `Custom Error Message: ${custom}` }) : null;
            };
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * 
     * @param {number} milliseconds Date in MS
     * @param {boolean} minimal Formats in hh:mm:ss
     * @returns formatted time in 1h 1m 1s or 01:01:01
     */

    formatTime(milliseconds, minimal = false) {
        if (!milliseconds || isNaN(milliseconds) || milliseconds <= 0) {
            return '00:00'
        }
        if (typeof minimal !== "boolean") {
            throw new RangeError("Utils#formatTime(milliseconds: number, minimal: boolean) Minimal must be a boolean");
        }
        const times = {
            years: 0,
            months: 0,
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
        while (milliseconds > 0) {
            if (milliseconds - 31557600000 >= 0) {
                milliseconds -= 31557600000;
                times.years++;
            }
            else if (milliseconds - 2628000000 >= 0) {
                milliseconds -= 2628000000;
                times.months++;
            }
            else if (milliseconds - 604800000 >= 0) {
                milliseconds -= 604800000;
                times.weeks += 7;
            }
            else if (milliseconds - 86400000 >= 0) {
                milliseconds -= 86400000;
                times.days++;
            }
            else if (milliseconds - 3600000 >= 0) {
                milliseconds -= 3600000;
                times.hours++;
            }
            else if (milliseconds - 60000 >= 0) {
                milliseconds -= 60000;
                times.minutes++;
            }
            else {
                times.seconds = Math.round(milliseconds / 1000);
                milliseconds = 0;
            }
        }
        const finalTime = [];
        let first = false;
        for (const [k, v] of Object.entries(times)) {
            if (minimal) {
                if (v === 0 && !first && !['minutes', 'seconds'].includes(k)) {
                    continue;
                }
                finalTime.push(v < 10 ? `0${v}` : `${v}`);
                first = true;
                continue;
            }
            if (v > 0) {
                finalTime.push(`${v} ${v > 1 ? k : k.slice(0, -1)}`);
            }
        }
        let time = finalTime.join(minimal ? ":" : ", ");
        if (time.includes(",")) {
            const pos = time.lastIndexOf(",");
            time = `${time.slice(0, pos)} and ${time.slice(pos + 1)}`;
        }
        return time;
    };

    /**
     * 
     * @param {string} string String to Capitalize
     * @returns Capitalized String
     */

    capitalizeString(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    /**
     * 
     * @param {number} position Position MS
     * @param {number} duration Duration MS
     * @returns progress slidebar
     */

    progressBar({ position, duration }) {
        const [bar_size, bar, slider] = [15, "▬", "🔘"];

        let sliderPosition = Math.ceil((position / duration * 100) / 100 * bar_size);
        let indexPosition = sliderPosition - 1 >= bar_size ? bar_size : sliderPosition - 1 < 0 ? 0 : sliderPosition - 1;
        let durationPosition = sliderPosition > bar_size ? bar_size : bar_size - sliderPosition;

        return `${bar.repeat(indexPosition)}${slider}${bar.repeat(durationPosition)}`;
    };
};