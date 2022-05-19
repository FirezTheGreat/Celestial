import { Node } from "erela.js";
import PlayerEvent from "../../../structures/PlayerEvent.js";

export default class nodeReconnect extends PlayerEvent {
    constructor(...args) {
        super(...args);
    };

    /**
     * 
     * @param {Node} node Node
     * @returns Reconnection Status of Node
     */

    async PlayerEventRun(node) {
        return console.log(`Reconnecting to ${node.options.identifier}:${node.options.port}`);
    };
};