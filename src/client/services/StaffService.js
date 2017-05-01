/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 01/05/2017
 */

class StaffService {
	getStaffById(staffs, id) {
		return staffs.find(staff => staff._id === id) || {};
	}
}

export default new StaffService();
