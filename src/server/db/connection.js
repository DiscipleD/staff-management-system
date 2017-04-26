/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 24/04/2017
 */

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import * as dbSetting from './config';

const createDbConnection = () => {
	mongoose.connect(dbSetting.url, dbSetting.options, console.error);
	mongoose.Promise = global.Promise;
	autoIncrement.initialize(mongoose.connection);

	process.on('SIGINT', function() {
		mongoose.connection.close(function () {
			console.log('Mongoose default connection disconnected through app termination');
			process.exit(0);
		});
	});
};

export { createDbConnection };
