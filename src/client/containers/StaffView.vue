<template>
	<div class="staff-view">
		<el-form class="search-block" :model="project" label-width="100px">
			<el-form-item label="项目名称">
				<el-select v-model="queryParams.projectIds" multiple>
					<el-option v-for="project in projectList" :label="project.name" :value="project._id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="项目人员">
				<el-select v-model="queryParams.staffIds" multiple>
					<el-option v-for="staff in staffList" :label="staff.name" :value="staff._id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="项目时间">
				<el-date-picker
						v-model="queryParams.dateRange"
						type="daterange"
						align="right"
						placeholder="选择日期范围"
						:picker-options="dateRangeOption">
				</el-date-picker>
			</el-form-item>

			<div class="search-button-block">
				<el-button type="primary" @click="search">筛选</el-button>
				<el-button type="primary" @click="reset">清空</el-button>
			</div>
		</el-form>
		<div id="staff-chart"></div>
	</div>
</template>

<style lang="sass" scoped>
	.staff-view {
		height: 100%;

		.search-block {
			display: flex;
			justify-content: center;
			margin-top: 20px;

			.search-button-block {
				margin-left: 20px;
				width: 140px;
				flex: none;
			}
		}

		#staff-chart {
			min-height: 500px;
		}
	}
</style>

<script>
	import moment from 'moment';
	import echarts from 'echarts/lib/echarts';
	import 'echarts/lib/chart/bar';
	import 'echarts/lib/component/title';
	import 'echarts/lib/component/tooltip';

	import { ProjectResource, StaffResource } from '../common/resource';
	import StaffService from '../services/StaffService';

	const MAX_CANVAS_HEIGHT = 12000;
	const CHART_PADDING = 60;
	const dateRangeOption = {
		shortcuts: [{
			text: '最近一周',
			onClick(picker) {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
				picker.$emit('pick', [start, end]);
			}
		}, {
			text: '最近一个月',
			onClick(picker) {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
				picker.$emit('pick', [start, end]);
			}
		}, {
			text: '最近三个月',
			onClick(picker) {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
				picker.$emit('pick', [start, end]);
			}
		}]
	};

	export default {
		data: () => ({
			dateRangeOption,
			staffChart: null,
			staffChartDom: null,
			projectInfo: [],
			projectList: [],
			staffList: [],
			queryParams: {
				dateRange: [moment().subtract(30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
				projectIds: [],
				staffIds: []
			}
		}),
		methods: {
			init: function() {
				this.staffChartDom = document.getElementById('staff-chart');
				Promise.all([ProjectResource.query(), StaffResource.query()])
					.then(([projectList, staffList]) => {
						this.staffList = staffList;
						this.projectList = projectList;
					})
					.then(this.search);
			},
			search: function() {
				const [startDate, endDate] = this.queryParams.dateRange;
				const params = {
					startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : '',
					endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : '',
					projectIds: this.queryParams.projectIds.toString(),
					staffIds: this.queryParams.staffIds.toString()
				};
				ProjectResource
					.query(params)
					.then(projectInfo => {
						let staffList = this.staffList;
						if (this.queryParams.staffIds.length) staffList = StaffService.filterStaffsByIds(this.staffList, this.queryParams.staffIds);
						// 拉长画布
						if (projectInfo && projectInfo.length) {
							const expectHeight = staffList.length * projectInfo.length * 50 + CHART_PADDING;
							this.staffChartDom.style.height = `${expectHeight < MAX_CANVAS_HEIGHT ? expectHeight : MAX_CANVAS_HEIGHT}px`;
						}
						return this.generatorChartOptions(staffList, projectInfo, params.startDate, params.endDate);
					})
					.then(this.drawChart);
			},
			reset: function() {
				this.queryParams = {
					dateRange: [],
					projectIds: [],
					staffIds: []
				};
			},
			drawChart: function(option) {
				this.staffChart = echarts.init(this.staffChartDom);
				this.staffChart.setOption(option);
			},
			createSeriesItem: function(category, name, stack, endDate, isBlank) {
				const BLANK_COLOR = 'rgba(0,0,0,0)';
				const data = new Array(category.length);
				data[category.index] = {
					value: new Date(endDate),
					caption: name
				};
				return {
					name,
					stack,
					data,
					type: 'bar',
					itemStyle: isBlank
						? {
							normal: {
								barBorderColor: BLANK_COLOR,
								color: BLANK_COLOR
							},
							emphasis: {
								barBorderColor: BLANK_COLOR,
								color: BLANK_COLOR
							}
						}
						: {
							normal: {
								label: {
									show: true,
									position: 'inside',
									formatter: function(params) {
										return params.data.caption;
									}
								}
							}
						}
				};
			},
			createSeries: function(category, id, project, date) {
				let endDate = date;
				const series = [];
				project.data.forEach(member => {
					if (member.startDate > endDate) series.push(this.createSeriesItem(category, project.name, id, moment(member.startDate).subtract(1, 'days'), true));
					series.push(this.createSeriesItem(category, project.name, id, member.endDate));
					endDate = member.endDate;
				});

				return series;
			},
			generatorChartOptions: function(staffList, projectInfo, startDate, endDate) {
				const staffCategory = [];
				let series = [];

				[].forEach.call(staffList, (staff, index) => {
					const category = {
						length: staffCategory.length,
						index
					};
					staffCategory.push(staff.name);

					// 这步操作可以通过数据库 sort by id 和 startDate 代替
					// 合并同一人员的所有项目记录
					const projectRecordsHash = {};
					[].forEach.call(projectInfo, project => {
						[].forEach.call(project.members, record => {
							if (record.memberId === staff._id) {
								if (!projectRecordsHash[project._id]) {
									projectRecordsHash[project._id] = {
										name: project.name,
										data: []
									};
								}
								projectRecordsHash[project._id].data.push(record);
							}
						});
					});

					// 为同一人员的记录按进入项目时间排序
					Object.keys(projectRecordsHash).map(key => projectRecordsHash[key].data.sort((prev, curr) => prev.startDate > curr.startDate));

					// 生成同一人员的 series
					series = series.concat(
						Object.keys(projectRecordsHash)
							.reduce((series, key) => series.concat(this.createSeries(category, key, projectRecordsHash[key], startDate)), [])
					);
				});

				return {
					title: {
						show: false
					},
					tooltip: {
						show: false
					},
					xAxis: [
						{
							type: 'time',
							name: "时间",
							min: new Date(startDate),
							max: new Date(endDate)
						}
						/* {
						 type: 'category',
						 name: "周",
						 data: ['W1', 'W2', 'W3']
						 }*/
					],
					yAxis: [
						{
							type: 'category',
							name: "项目人员",
							splitLine: {
								show: false
							},
							data: staffCategory
						}
					],
					series
				};
			}
		},
		mounted: function() {
			this.init();
		}
	};
</script>
