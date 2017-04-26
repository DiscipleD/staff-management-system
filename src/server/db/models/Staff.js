/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 24/04/2017
 */

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const Schema = mongoose.Schema;

const ModuleName = 'Staff';
const INDEX_START = 100;
const StaffSchema = new Schema({
	name: String,
	email: String,
	position: String
});

StaffSchema.plugin(autoIncrement.plugin, {
	model: ModuleName,
	startAt: INDEX_START
});
const Staff = mongoose.model(ModuleName, StaffSchema);

export default Staff;
