/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 19/05/2017
 */

class ProjectService {
	getProjectByName(projects, name) {
		return projects.find(project => `${project.name}` === `${name}`) || {};
	}
}

export default new ProjectService();
