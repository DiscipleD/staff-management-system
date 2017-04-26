/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 26/04/2017
 */

import bodyParser from 'co-body';

import ProjectService from '../service/ProjectService';

class ProjectController {
	async save(ctx) {
		const body = await bodyParser(ctx.request);
		await ProjectService
			.create(body)
			.then(() => {
				ctx.status = 200;
			})
			.catch(msg => {
				ctx.status = 409;
				ctx.body = msg;
			});
	}

	async find(ctx) {
		await ProjectService
			.findAll()
			.then(data => {
				ctx.status = 200;
				ctx.body = data;
			})
			.catch(msg => {
				ctx.status = 409;
				ctx.body = msg;
			});
	}

	async findById(ctx) {
		await ProjectService
			.findById(ctx.params.id)
			.then(data => {
				ctx.status = 200;
				ctx.body = data;
			})
			.catch(msg => {
				ctx.status = 409;
				ctx.body = msg;
			});
	}

	async removeById(ctx) {
		await ProjectService
			.removeById(ctx.params.id)
			.then(() => {
				ctx.status = 200;
			})
			.catch(msg => {
				ctx.status = 409;
				ctx.body = msg;
			});
	}
}

module.exports = new ProjectController();
