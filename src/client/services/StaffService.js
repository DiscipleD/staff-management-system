/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 01/05/2017
 */

class StaffService {
	getStaffById(staffs, id) {
		return staffs.find(staff => `${staff._id}` === `${id}`) || {};
	}

	filterStaffsByIds(staffs, ids) {
		return ids && ids.length > 0
			? ids.map(id => this.getStaffById(staffs, id))
			: [];
	}

	filterProjectsStaffs(staffs, projects) {
		if (!projects || !projects.length) return [];
		const staffIdsHash = {};
		projects.forEach(project => {
			project.members.forEach(member => {
				staffIdsHash[member.memberId] = true;
			});
		});
		return this.filterStaffsByIds(staffs, Object.keys(staffIdsHash));
	}
}

export default new StaffService();
