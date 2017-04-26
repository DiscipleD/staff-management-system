/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 25/04/2017
 */

import ProjectModel from '../db/models/Project';

class ProjectService {
	create(project = {}) {
		if (project.name) {
			const model = new ProjectModel(project);
			return model.save();
		} else {
			return Promise.reject('Project name should be input.');
		}
	}

	findAll() {
		return ProjectModel.find();
	}

	findById(id) {
		return ProjectModel.findById(id);
	}

	removeById(id) {
		return ProjectModel.findByIdAndRemove(id);
	}
}

export default new ProjectService();
