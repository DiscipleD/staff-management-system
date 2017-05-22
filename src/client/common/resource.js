/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 01/05/2017
 */

import axios from 'axios';

const URI_PREFIX = '/staff-management';

const ProjectResource = {
	query: params => axios
		.get(`${URI_PREFIX}/projects`, { params })
		.then(res => res.data),

	create: project => axios
		.post(`${URI_PREFIX}/projects`, project),

	update: (id, project) => axios
		.put(`${URI_PREFIX}/projects/${id}`, project),

	remove: id => axios
		.delete(`${URI_PREFIX}/projects/${id}`)
};

const StaffResource = {
	query: params => axios
		.get(`${URI_PREFIX}/staffs`, { params })
		.then(res => res.data),

	create: staff => axios
		.post(`${URI_PREFIX}/staffs`, staff),

	update: (id, staff) => axios
		.put(`${URI_PREFIX}/staffs/${id}`, staff),

	remove: id => axios
		.delete(`${URI_PREFIX}/staffs/${id}`)
};

export { ProjectResource, StaffResource };
