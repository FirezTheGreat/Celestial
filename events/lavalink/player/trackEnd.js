import { Player } from "erela.js";
import PlayerEvent from "../../../structures/PlayerEvent.js";

export default class trackEnd extends PlayerEvent {
    constructor(...args) {
        super(...args)
    };

    /**
     * 
     * @param {Player} player Player Manager
     * @returns Deletes Existing Player Collector
     */

    PlayerEventRun(player) {
        try {
            const trackCollectorMessage = this.bot.trackCollectors.get(player.guild);
            if (trackCollectorMessage) trackCollectorMessage.stop();

            return this.bot.trackCollectors.delete(player.guild);
        } catch (error) {
            console.error(error);
        };
    };
};