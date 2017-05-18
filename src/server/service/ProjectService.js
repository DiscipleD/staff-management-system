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

	findAll(params) {
		const query = {};
		for (let attr in params) {
			if (params[attr] !== undefined && params[attr] !== '') {
				let condition = {};
				switch(attr) {
					case '_id':
						condition.$in = params[attr];
						break;
					case 'startDate':
						condition.$gte = params[attr];
						break;
					case 'endDate':
						condition.$lte = params[attr];
						break;
					default:
						break;
				}
				query[attr] = condition;
			}
		}
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
