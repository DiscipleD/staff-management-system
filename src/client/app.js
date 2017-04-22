/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 21/04/2017
 */

import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

import './assets/resets.scss';
import Layout from './containers/Layout.vue';

Vue.use(ElementUI);

const app = new Vue({
	render() {
		return (
			<Layout />
		);
	}
});

app.$mount('#app');
