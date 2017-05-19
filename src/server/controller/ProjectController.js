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
		const params = ctx.query;
		const query = {};
		for (let attr in params) {
			if (params[attr] !== undefined && params[attr] !== '') {
				let condition = {};
				switch(attr) {
					case 'projectIds':
						condition.$in = params[attr].split(',');
						query._id = condition;
						break;
					case 'staffIds':
						condition.$elemMatch = {
							memberId: {
								$in: params[attr].split(',')
							}
						};
						query.members = condition;
						break;
					case 'startDate':
						condition.$gt = params[attr];
						query['endDate'] = condition;
						break;
					case 'endDate':
						condition.$lt = params[attr];
						query['startDate'] = condition;
						break;
					default:
						break;
				}
			}
		}
		await ProjectService
			.findAll(query)
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
