const Celestial = require('./structures/Celestial');
const config = require('./config.json');

const bot = new Celestial(config);
bot.start();