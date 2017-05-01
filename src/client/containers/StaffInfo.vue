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
					<el-button type="primary" @click="create">保存</el-button>
				</el-form-item>
			</el-form>

			<el-table class="content-table" :data="tableData">
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="email" label="邮箱"></el-table-column>
				<el-table-column prop="position" label="职位"></el-table-column>
				<el-table-column label="操作">
					<template scope="scope">
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
	import axios from 'axios';

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
				axios
					.get('/staffs')
					.then(res => {
						this.tableData = res.data;
					});
			},
			create: function() {
				axios
					.post(`/staffs`, this.staff)
					.then(() => this.$message.success('添加成功'))
					.then(() => (this.staff = { ...defaultStaff }))
					.catch(() => this.$message.error('添加失败'))
					.then(this.query);
			},
			remove: function(index) {
				const staffId = this.tableData[index]._id;
				axios
					.delete(`/staffs/${staffId}`)
					.then(() => this.$message.success('删除成功'))
					.then(this.query);
			}
		}
	};
</script>
