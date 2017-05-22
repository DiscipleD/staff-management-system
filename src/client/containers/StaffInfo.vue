<template>
	<div>
		<header><h3>人员情况录入</h3></header>
		<div class="section-content">
			<el-form class="content-form" :inline="true" :model="staff" label-width="60px">
				<el-form-item label="姓名">
					<el-input v-model="staff.name"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="staff.email"></el-input>
				</el-form-item>
				<el-form-item label="职位">
					<el-input v-model="staff.position"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-if="!staff._id && staff._id !== 0" @click="save">保存</el-button>
					<el-button type="primary" v-else @click="save">编辑</el-button>
					<el-button type="primary" @click="reset">取消</el-button>
				</el-form-item>
			</el-form>

			<el-table class="content-table" :data="tableData">
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="email" label="邮箱"></el-table-column>
				<el-table-column prop="position" label="职位"></el-table-column>
				<el-table-column label="操作">
					<template scope="scope">
						<el-button @click="edit(scope.$index)" type="text" size="small">编辑</el-button>
						<el-button @click="remove(scope.$index)" type="text" size="small">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	.section-content {
		display: flex;
		flex-flow: column nowrap;
		align-items: center;

		.content-form {
			width: 820px;
		}

	  .content-table {
		  width: 600px;
	  }
	}
</style>

<script>
	import { StaffResource } from '../common/resource';
	import { copy } from '../common/utils';

	const defaultStaff = {
		name: '',
		email: '',
		position: ''
	};

	export default {
		data: () => ({
			staff: {
				...defaultStaff
			},
			tableData: []
		}),
		mounted: function() {
			this.query();
		},
		methods: {
			query: function() {
				StaffResource
					.query()
					.then(data => {
						this.tableData = data;
					});
			},
			save: function() {
				const params = this.staff;
				const request = params._id === undefined ? StaffResource.create(params) : StaffResource.update(params._id, params);

				request
					.then(() => this.$message.success('保存成功'))
					.then(this.reset)
					.catch(() => this.$message.error('保存失败'))
					.then(this.query);
			},
			edit: function(index) {
				this.staff = copy(this.tableData[index]);
			},
			remove: function(index) {
				const staffId = this.tableData[index]._id;
				StaffResource
					.remove(staffId)
					.then(() => this.$message.success('删除成功'))
					.then(this.query);
			},
			reset: function() {
				this.staff = { ...defaultStaff };
			}
		}
	};
</script>
