(async () => {
    const { default: Celestial} = await import("./structures/Celestial.mjs");
    const { default: Config } = await import("./config.mjs");

    const celestial = new Celestial(Config);
    celestial.start();
})();