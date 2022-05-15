import { Node } from "erela.js";
import PlayerEvent from "../../../structures/PlayerEvent.js";

export default class nodeDisconnect extends PlayerEvent {
    constructor(...args) {
        super(...args);
    };

    /**
     * 
     * @param {Node} node Node
     * @param {Error} error Node Error
     */

    async PlayerEventRun(node, error) {
        console.warn(`${node.options.identifier} Disconnected\nReason - [${error.code}]${error.message}`);
    };
};