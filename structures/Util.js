const { ChatInputCommandInteraction } = require('discord.js');
const path = require('path');
const { sync } = require('glob');

module.exports = class Util {
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
        return `${process.cwd()}${path.sep}`;
    };

    /**
     * 
     * @param {object} command Command Object
     * @returns Refreshes Command(s)
     */

    async loadCommands(command = null) {
        const { default: Command } = await import('./Command.mjs');

        if (command) {
            try {
                const [commandFile] = sync(`${this.directory}commands/${command.category.split(' ').join('-').toLowerCase()}/${command.name.split(' ').join('-').toLowerCase()}.mjs`.replace(/\\/g, '/'));

                delete require.cache[commandFile];

                const { name } = path.parse(commandFile);
                const { default: File } = await import(`file:///${commandFile}`);

                if (!File) return new Error(`*${name} is not a file constructor*`);

                const command = new File(this.bot, name.toLowerCase());
                this.bot.commands.set(command.name, command);

                return command;
            } catch (error) {
                return new Error({ code: error.code, message: error.message });
            };
        };

        const commands = sync(`${this.directory}commands/**/*.mjs`.replace(/\\/g, '/'));

        for (const commandFile of commands) {
            try {
                delete require.cache[commandFile];

                const { name } = path.parse(commandFile);
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
        const { default: Event } = await import('./Event.mjs');

        if (event) {
            try {
                const [eventFile] = sync(`${this.directory}events/${event.category.toLowerCase()}/${event.name}.mjs`.replace(/\\/g, '/'));

                delete require.cache[eventFile];

                const { name } = path.parse(eventFile);
                const { default: File } = await import(`file:///${eventFile}`);

                if (!File) return new Error(`*${name} is not a file constructor*`);

                const event = new File(this.bot, name.toLowerCase());
                this.bot.events.set(event.name, event);

                return event;
            } catch (error) {
                return new Error({ code: error.code, message: error.message });
            };
        };

        const events = sync(`${this.directory}events/**/*.mjs`.replace(/\\/g, '/'));

        for (const eventFile of events) {
            try {
                delete require.cache[eventFile];

                const { name } = path.parse(eventFile);
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

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Error} error 
     * @param {boolean} ephemeral 
     * @returns {string} Error Message
     */

    async error(interaction, error, ephemeral = false) {
        if (interaction.deferred && !interaction.replied) {
            return await interaction.editReply({ content: `An Error Occurred: \`${error.message}\`!`, ephemeral });
        } else if (interaction.replied) {
            return await interaction.followUp({ content: `An Error Occurred: \`${error.message}\`!`, ephemeral });
        } else {
            return await interaction.reply({ content: `An Error Occurred: \`${error.message}\`!`, ephemeral });
        };
    };

    /**
     * 
     * @param {number} milliseconds Date in MS
     * @param {boolean} minimal Formats in hh:mm:ss
     * @returns formatted time in 1h 1m 1s or 01:01:01
     */

    formatTime(milliseconds, minimal = false) {
        if (!milliseconds || isNaN(milliseconds) || milliseconds <= 0) {
            throw new RangeError("Utils#formatTime(milliseconds: number) Milliseconds must be a number greater than 0");
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
};