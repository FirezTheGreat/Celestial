import { Node } from "erela.js";
import PlayerEvent from "../../../structures/PlayerEvent.js";

export default class nodeError extends PlayerEvent {
    constructor(...args) {
        super(...args);
    };

    /**
     * 
     * @param {Node} node Node
     * @param {Error} error Node Error
     */

    async PlayerEventRun(node, error) {
        console.error(`Error received from ${node.options.host}:${node.options.port} - ${error}`);
    };
};