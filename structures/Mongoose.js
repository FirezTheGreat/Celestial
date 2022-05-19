import mongoose from 'mongoose';

export default class Mongoose {
    /**
     * Initiates Mongoose Client
     */

    init() {
        const dbOptions = {
            autoIndex: false,
            family: 4,
            connectTimeoutMS: 10000
        };

        mongoose.connect('mongodb+srv://firez:skyhighup@sky-high.s6amn.mongodb.net/skyr6m?authSource=admin&replicaSet=atlas-tbixx0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', dbOptions);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB Successfully!');
        });

        mongoose.connection.on('err', error => {
            console.error(`Error Occured From MongoDB: \n${error.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Connection Disconnected!');
        });
    };
};