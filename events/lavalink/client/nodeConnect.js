import { Node } from "erela.js";
import PlayerEvent from "../../../structures/PlayerEvent.js";

export default class nodeConnect extends PlayerEvent {
    constructor(...args) {
        super(...args);
    };

    /**
     * 
     * @param {Node} node Node
     * @returns Connection Status of Node
     */

    PlayerEventRun(node) {
        return console.log(`Connected to ${node.options.identifier}:${node.options.port}`);
    };
};