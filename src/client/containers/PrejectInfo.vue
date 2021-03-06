<template>
	<div>
		<header><h3>项目情况录入</h3></header>
		<div class="section-content">
			<el-form class="content-form" :inline="true" :model="project" label-width="100px">
				<el-form-item label="项目名称">
					<el-input v-model="project.name"></el-input>
				</el-form-item>
				<el-form-item label="项目开始日期">
					<el-date-picker
							v-model="project.startDate"
							type="date"
							placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="项目结束日期">
					<el-date-picker
							v-model="project.endDate"
							type="date"
							placeholder="选择日期">
					</el-date-picker>
				</el-form-item><br>
				<el-form-item label="项目负责人">
					<el-input v-model="project.charger"></el-input>
				</el-form-item>
				<el-form-item label="项目 URL">
					<el-input v-model="project.url"></el-input>
				</el-form-item><br>
				<el-form-item label="项目目标">
					<el-input type="textarea" v-model="project.target" style="width: 480px"></el-input>
				</el-form-item>

				<div>
					<el-form v-for="(member, index) in project.members" :key="index" :inline="true" :model="member">
						<el-form-item label="参与人员">
							<el-select v-model="member.memberId" placeholder="请选择参与人员">
								<el-option v-for="(staff, index) in staffList" :label="staff.name" :value="staff._id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="进入项目日期">
							<el-date-picker
									v-model="member.startDate"
									type="date"
									placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="离开项目日期">
							<el-date-picker
									v-model="member.endDate"
									type="date"
									placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
						<i class="el-icon-plus member-operator" @click="addMember(index)"></i>
						<i class="el-icon-minus member-operator" @click="removeMember(index)"></i>
					</el-form>
				</div>

				<el-form-item class="save-button">
					<el-button type="primary" v-if="!project._id && project._id !== 0" @click="save">保存</el-button>
					<el-button type="primary" v-else @click="save">编辑</el-button>
					<el-button type="primary" @click="reset">取消</el-button>
				</el-form-item>
			</el-form>

			<el-table class="content-table" :data="tableData">
				<el-table-column type="expand">
					<template scope="table">
						<el-table :data="table.row.members">
							<el-table-column label="参与人员">
								<template scope="scope">
									{{getMemberById(scope.row.memberId).name}}
								</template>
							</el-table-column>
							<el-table-column prop="startDate" label="进入项目日期"></el-table-column>
							<el-table-column prop="endDate" label="离开项目日期"></el-table-column>
						</el-table>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="项目名称"></el-table-column>
				<el-table-column prop="startDate" label="项目开始日期"></el-table-column>
				<el-table-column prop="endDate" label="项目结束日期"></el-table-column>
				<el-table-column prop="charger" label="负责人"></el-table-column>
				<el-table-column prop="url" label="URL"></el-table-column>
				<el-table-column prop="target" label="项目目标"></el-table-column>
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
			width: 950px;

			.member-operator {
				color: #8492a6;
				cursor: pointer;
				font-size: 20px;
				line-height: 36px;
			}

	    .save-button {
		    float: right;
	    }
		}

		.content-table {
			width: 860px;
		}
	}
</style>

<script>
	import moment from 'moment';

	import { copy } from '../common/utils';
	import { ProjectResource, StaffResource } from '../common/resource';

	const defaultMember = {
		memberId: null,
		startDate: null,
		endDate: null
	};

	const defaultProject = {
		name: '',
		startDate: '',
		endDate: '',
		charger: '',
		url: '',
		target: ''
	};

	export default {
		data: () => ({
			project: {
				...defaultProject,
				members: [{ ...defaultMember }]
			},
			tableData: [],
			staffList: []
		}),
		mounted: function() {
			this.query();
			this.queryStaff();
		},
		methods: {
			query: function() {
				ProjectResource.query()
					.then(data => {
						this.tableData = data;
					});
			},
			queryStaff: function() {
				StaffResource.query()
					.then(data => {
						this.staffList = data;
					});
			},
			save: function() {
				const params = {
					...this.project,
					startDate: moment(this.project.startDate).format('YYYY-MM-DD'),
					endDate: moment(this.project.endDate).format('YYYY-MM-DD'),
					members: this.project.members.map(member => ({
						...member,
						startDate: moment(member.startDate).format('YYYY-MM-DD'),
						endDate: moment(member.endDate).format('YYYY-MM-DD')
					}))
				};

				const request = params._id === undefined ? ProjectResource.create(params) : ProjectResource.update(params._id, params);
				request
					.then(() => this.$message.success('保存成功'))
					.then(this.reset)
					.catch(() => this.$message.error('保存失败'))
					.then(this.query);
			},
			edit: function(index) {
				this.project = copy(this.tableData[index]);
			},
			remove: function(index) {
				const projectId = this.tableData[index]._id;
				ProjectResource.remove(projectId)
					.then(() => this.$message.success('删除成功'))
					.then(this.query);
			},
			reset: function() {
				this.project = { ...defaultProject, members: [{ ...defaultMember }] };
			},
			addMember(index) {
				this.project.members.splice(index + 1, 0, { ...defaultMember });
			},
			removeMember(index) {
				this.project.members.splice(index, 1);
			},
			getMemberById(memberId) {
				return this.staffList.find(staff => staff._id === memberId) || {};
			}
		}
	};
</script>
