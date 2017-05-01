/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 01/05/2017
 */

import axios from 'axios';

const Project = {
	query: params => axios
		.get('/projects', params)
		.then(res => res.data)
};

const Staff = {
	query: params => axios
		.get('/staffs', params)
		.then(res => res.data)
};

export { Project, Staff };
