/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 25/04/2017
 */

import bodyParser from 'co-body';

import StaffService from '../service/StaffService';

class StaffController {
	async save(ctx) {
		const body = await bodyParser(ctx.request);
		await StaffService
			.create(body)
			.then(() => {
				ctx.status = 200;
				ctx.body = '';
			})
			.catch(msg => {
				ctx.status = 409;
				ctx.body = msg;
			});
	};

	async find(ctx) {
		await StaffService
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
		await StaffService
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
		await StaffService
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

module.exports = new StaffController();
