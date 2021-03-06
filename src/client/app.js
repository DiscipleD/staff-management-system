/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 21/04/2017
 */

import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

import './assets/resets.scss';
import './assets/main.scss';
import router from './router';
import Main from './containers/Main.vue';

Vue.use(ElementUI);

const app = new Vue({
	router,
	render() {
		return (
			<Main />
		);
	}
});

app.$mount('#app');
