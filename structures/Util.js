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

    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`;
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
                const commandFile = sync(`${this.directory}commands/${command.category.split(' ').join('-').toLowerCase()}/${command.name.split(' ').join('-').toLowerCase()}.mjs`.replace(/\\/g, '/'))[0];

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
                const eventFile = sync(`${this.directory}events/${event.category.toLowerCase()}/${event.name}.mjs`.replace(/\\/g, '/'))[0];

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
};