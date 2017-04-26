/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 24/04/2017
 */

import Koa from 'koa';
import KoaRouter from 'koa-router';

import { createDbConnection } from './db/connection';
createDbConnection();

const StaffController = require('./controller/StaffController');
const ProjectController = require('./controller/ProjectController');
const app = new Koa();
const router = new KoaRouter();

// staff
router.get('/staffs', StaffController.find);
router.get('/staffs/:id', StaffController.findById);
router.post('/staffs', StaffController.save);
router.del('/staffs/:id', StaffController.removeById);

// project
router.get('/projects', ProjectController.find);
router.get('/projects/:id', ProjectController.findById);
router.post('/projects', ProjectController.save);
router.del('/projects/:id', ProjectController.removeById);

app
	.use(router.routes())
	.use(router.allowedMethods());

export default app;
