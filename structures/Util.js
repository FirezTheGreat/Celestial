const path = require('path');
const { sync } = require('glob');

module.exports = class Util {
    constructor(bot) {
        this.bot = bot;
    };

    isClass(input) {
        return typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class';
    };

    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`;
    };

    async loadCommands(command = null) {
        const { default: Command } = await import('./Command.mjs');

        if (command) {
            const commandFile = sync(`${this.directory}commands/${command.category.split(' ').join('-').toLowerCase()}/${command.name.split(' ').join('-').toLowerCase()}.mjs`.replace(/\\/g, '/'))[0];

            delete require.cache[commandFile];

            const { name } = path.parse(commandFile);
            const File = require(commandFile);

            if (!File) return new Error(`*${name} is not a file constructor*`);

            const command = new File(this.bot, name.toLowerCase());
            this.bot.commands.set(command.name, command);

            return command;
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

    async loadEvents(event = null) {
        const { default: Event } = await import('./Event.mjs');

        if (event) {
            const eventFile = sync(`${this.directory}events/${event.category.toLowerCase()}/${event.name}.mjs`.replace(/\\/g, '/'))[0];

            delete require.cache[eventFile];

            const { name } = path.parse(eventFile);
            const { default: File } = require(eventFile);

            if (!File) return new Error(`*${name} is not a file constructor*`);

            const event = new File(this.bot, name.toLowerCase());
            this.bot.events.set(event.name, event);

            return event;
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

    async error(interaction, error) {
        if (interaction.deferred && !interaction.replied) {
            return interaction.editReply({ content: `An Error Occurred: \`${error.message}\`!` });
        } else if (interaction.replied) {
            return interaction.followUp({ content: `An Error Occurred: \`${error.message}\`!` });
        } else {
            return interaction.reply({ content: `An Error Occurred: \`${error.message}\`!` });
        };
    };
};