import mongoose from 'mongoose';
import Config from '../config';

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

        mongoose.connect(Config.mongo_url, dbOptions);
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