let { connect, Promise, connection } = require('mongoose');

module.exports = class Mongoose {
    /**
     * Initiates Mongoose Client
     */
    
    init() {
        const dbOptions = {
            autoIndex: false,
            family: 4,
            connectTimeoutMS: 10000
        };

        connect('mongodb+srv://firez:skyhighup@sky-high.s6amn.mongodb.net/skyr6m?authSource=admin&replicaSet=atlas-tbixx0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', dbOptions);
        Promise = global.Promise;

        connection.on('connected', () => {
            console.log('Connected to MongoDB Successfully!');
        });

        connection.on('err', error => {
            console.error(`Error Occured From MongoDB: \n${error.message}`);
        });

        connection.on('disconnected', () => {
            console.warn('Connection Disconnected!');
        });
    }
};