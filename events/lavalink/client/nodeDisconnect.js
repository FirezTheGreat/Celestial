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
     * @returns Disconnection Status of Node
     */

    async PlayerEventRun(node, error) {
        return console.warn(`${node.options.identifier} Disconnected\nReason - [${error.code}]${error.message}`);
    };
};