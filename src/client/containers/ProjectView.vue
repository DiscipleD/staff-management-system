<template>
	<div class="project-view">
		<el-form class="search-block" :model="project" label-width="100px">
			<el-form-item label="项目名称">
				<el-select v-model="queryParams.projectIds" multiple>
					<el-option v-for="project in projectList" :label="project.name" :value="project._id"></el-option>
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
		<div id="project-chart"></div>
	</div>
</template>

<style lang="sass" scoped>
	.project-view {
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

		#project-chart {
			height: 500px;
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
			projectChart: null,
			projectChartDom: null,
			projectInfo: [],
			projectList: [],
			staffList: [],
			queryParams: {
				dateRange: [moment().subtract(30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
				projectIds: []
			}
		}),
		methods: {
			init: function() {
				this.projectChartDom = document.getElementById('project-chart');
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
					projectIds: this.queryParams.projectIds.toString()
				};
				ProjectResource
					.query(params)
					.then(projectInfo => {
						// 拉长画布
						if (this.staffList.length && projectInfo.length) {
							const expectHeight = this.staffList.length * projectInfo.length * 40;
							this.projectChartDom.style.height = `${expectHeight < MAX_CANVAS_HEIGHT ? expectHeight : MAX_CANVAS_HEIGHT}px`;
						}
						return this.generatorChartOptions(projectInfo, startDate, endDate);
					})
					.then(this.drawChart);
			},
			reset: function() {
				this.queryParams = {
					dateRange: [],
					projectIds: []
				};
			},
			drawChart: function(option) {
				this.projectChart = echarts.init(this.projectChartDom);
				this.projectChart.setOption(option);
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
			createSeries: function(category, memberArray, date) {
				let endDate = date;
				const series = [];
				memberArray.forEach(member => {
					if (member.startDate > endDate) series.push(this.createSeriesItem(category, StaffService.getStaffById(this.staffList, member.memberId).name, member.memberId, moment(member.startDate).subtract(1, 'days'), true));
					series.push(this.createSeriesItem(category, StaffService.getStaffById(this.staffList, member.memberId).name, member.memberId, member.endDate));
					endDate = member.endDate;
				});

				return series;
			},
			generatorChartOptions: function(projectInfo, startDate, endDate) {
				const projectCategory = [];
				let series = [];

				[].forEach.call(projectInfo, (project, index) => {
					const category = {
						length: projectInfo.length,
						index
					};
					projectCategory.push(project.name);

					// 这步操作可以通过数据库 sort by id 和 startDate 代替
					// 合并项目中，同一人员的记录
					const projectMembersInfo = {};
					[].forEach.call(project.members, member => {
						if (!projectMembersInfo[member._id]) projectMembersInfo[member._id] = [];
						projectMembersInfo[member._id].push(member);
					});
					// 为同一人员的记录按进入项目时间排序
					Object.keys(projectMembersInfo).map(key => projectMembersInfo[key].sort((prev, curr) => prev.startDate > curr.startDate));

					// 生成同一项目的 series
					series = series.concat(Object.keys(projectMembersInfo)
						.reduce((series, key) => series.concat(this.createSeries(category, projectMembersInfo[key], startDate)), []));
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
							name: "项目名称",
							splitLine: {
								show: false
							},
							data: projectCategory
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
