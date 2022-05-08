import Event from "../../structures/Event.mjs";

export default class Ready extends Event {
    constructor(...args) {
        super(...args, {
            once: true,
            type: 'Client'
        });
    };

    async EventRun() {
        console.log(`${this.bot.user.username} is Online!`);
    };
};