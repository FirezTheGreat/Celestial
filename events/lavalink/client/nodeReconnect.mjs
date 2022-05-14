import { Node } from "erela.js";
import PlayerEvent from "../../../structures/PlayerEvent.mjs";

export default class nodeReconnect extends PlayerEvent {
    constructor(...args) {
        super(...args);
    };

    /**
     * 
     * @param {Node} node Node
     */
    
    async PlayerEventRun(node) {
        console.log(`Reconnecting to ${node.options.identifier}:${node.options.port}`);
    };
};