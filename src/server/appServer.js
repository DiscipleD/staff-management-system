/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 24/04/2017
 */

import Koa from 'koa';
import KoaRouter from 'koa-router';

import { publicPath } from './config';
import { createDbConnection } from './db/connection';
createDbConnection();

const StaffController = require('./controller/StaffController');
const ProjectController = require('./controller/ProjectController');
const app = new Koa();
const router = new KoaRouter();

// staff
router.get(`${publicPath}/staffs`, StaffController.find);
router.get(`${publicPath}/staffs/:id`, StaffController.findById);
router.post(`${publicPath}/staffs`, StaffController.save);
router.put(`${publicPath}/staffs/:id`, StaffController.update);
router.del(`${publicPath}/staffs/:id`, StaffController.removeById);

// project
router.get(`${publicPath}/projects`, ProjectController.find);
router.get(`${publicPath}/projects/:id`, ProjectController.findById);
router.post(`${publicPath}/projects`, ProjectController.save);
router.put(`${publicPath}/projects/:id`, ProjectController.update);
router.del(`${publicPath}/projects/:id`, ProjectController.removeById);

app
	.use(router.routes())
	.use(router.allowedMethods());

export default app;
