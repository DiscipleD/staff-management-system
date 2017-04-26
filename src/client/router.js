/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 26/04/2017
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

import ProjectView from './containers/ProjectView';
import StaffView from './containers/StaffView';
import ProjectInfo from './containers/PrejectInfo';
import StaffInfo from './containers/StaffInfo';

// Inject vue plugin
Vue.use(VueRouter);

const ROUTER_SETTING = {
	mode: 'history', // default value 'hash'
	routes: [
		{path: '/project-view', component: ProjectView},
		{path: '/staff-view', component: StaffView},
		{path: '/project-info', component: ProjectInfo},
		{path: '/staff-info', component: StaffInfo},
		// catch all redirect, not matched path will be redirected to the home path
		{path: '*', redirect: '/project-view'}
	]
};

const router = new VueRouter(ROUTER_SETTING);

// manually hook: page not scroll to top when router changes
// github issue: https://github.com/vuejs/vue-router/issues/173
router.beforeEach((route, redirect, next) => {
	window.scrollTo(0, 0);
	next();
});

router.afterEach(route => {
	console.info(`${new Date()}: ${route.path}`);
});

export default router;
