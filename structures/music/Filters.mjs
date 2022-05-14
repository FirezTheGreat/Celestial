import { Structure } from "erela.js";

export default Structure.extend('Player', (Player) => class extends Player {
    /**
     * 
     * @param {import("erela.js").PlayerOptions} options Erela Player Options
     */
    
    constructor(options = {}) {
        super(options);

        this.nightcore = false;
        this.bassboost = false;
    };

    /**
     * 
     * @param {Boolean} boolean Nightcore Boolean
     * @returns Enables or Disables Nightcore
     */

    setNightcore(boolean = Boolean) {
        this.nightcore = boolean;

        if (boolean) {
            this.setBassboost(false);

            this.node.send({
                op: 'filters',
                guildId: this.guild,
                timescale: {
                    speed: 1.3,
                    pitch: 1.3,
                    rate: 1
                }
            });
        } else {
            this.node.send({
                op: 'filters',
                guildId: this.guild,
                timescale: {
                    speed: 1,
                    pitch: 1,
                    rate: 1
                }
            });
        };

        return this;
    };

    /**
     * 
     * @param {Boolean} boolean Bassboost Boolean
     * @returns Enables or Disables Bassboost
     */

    setBassboost(boolean) {
        this.bassboost = boolean;

        if (boolean) {
            this.setNightcore(false);

            this.node.send({
                op: 'filters',
                guildId: this.guild,
                equalizer: Array(6).fill().map(() => ({ band: 1, gain: 0.85 }))
            });
        } else {
            this.node.send({
                op: 'filters',
                guildId: this.guild,
                timescale: {
                    speed: 1,
                    pitch: 1,
                    rate: 1
                }
            });
        };

        return this;
    };
});