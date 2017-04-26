/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 24/04/2017
 */

import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const Schema = mongoose.Schema;

const ModuleName = 'Project';
const ProjectSchema = new Schema({
	name: String,
	charger: String,
	startDate: String,
	endDate: String,
	url: String,
	members: [{
		memberId: Number,
		startDate: String,
		endDate: String
	}]
});

ProjectSchema.plugin(autoIncrement.plugin, ModuleName);
const Project = mongoose.model(ModuleName, ProjectSchema);

export default Project;
