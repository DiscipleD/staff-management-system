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

	update(id, project = {}) {
		return ProjectModel.findByIdAndUpdate(id, project);
	}

	findAll(query) {
		return ProjectModel.find(query);
	}

	findById(id) {
		return ProjectModel.findById(id);
	}

	removeById(id) {
		return ProjectModel.findByIdAndRemove(id);
	}
}

export default new ProjectService();
