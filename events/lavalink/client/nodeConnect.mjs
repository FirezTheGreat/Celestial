import { Node } from "erela.js";
import PlayerEvent from "../../../structures/PlayerEvent.mjs";

export default class nodeConnect extends PlayerEvent {
    constructor(...args) {
        super(...args);
    };

    /**
     * 
     * @param {Node} node Node
     */

    async PlayerEventRun(node) {
        console.log(`Connected to ${node.options.identifier}:${node.options.port}`);
    };
};