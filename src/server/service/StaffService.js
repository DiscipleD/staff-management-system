/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 25/04/2017
 */

import StaffModel from '../db/models/Staff';

class StaffService {
	create(staff = {}) {
		if (staff.name && staff.email && staff.position) {
			const model = new StaffModel(staff);
			return model.save();
		} else {
			return Promise.reject('params not match.');
		}
	}

	update(id, staff = {}) {
		return StaffModel.findByIdAndUpdate(id, staff);
	}

	findAll() {
		return StaffModel.find();
	}

	findById(id) {
		return StaffModel.findById(id);
	}

	removeById(id) {
		return StaffModel.findByIdAndRemove(id);
	}
}

export default new StaffService();
