<template>
	<div class="project-view">
		<div id="project-chart"></div>
	</div>
</template>

<style lang="sass" scoped>
	.project-view {
		height: 100%;

		#project-chart {
			height: 100%;
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

	const MAX_CANVAS_HEIGHT = 16360;

	export default {
		data: () => ({
			projectChart: null,
			projectChartDom: null,
			projectInfo: [],
			staffList: [],
			queryParams: {
				startDate: '2017-01-01',
				endDate: moment().format('YYYY-MM-DD')
			}
		}),
		methods: {
			init: function() {
				this.projectChartDom = document.getElementById('project-chart');
				Promise.all([ProjectResource.query(this.queryParams), StaffResource.query()])
					.then(([projectInfo, staffList]) => {
						this.staffList = staffList;

						// 拉长画布
						if (staffList.length && projectInfo.length) {
							const expectHeight = staffList.length * projectInfo.length * 40;
							this.projectChartDom.style.height = `${expectHeight < MAX_CANVAS_HEIGHT ? expectHeight : MAX_CANVAS_HEIGHT}px`;
						}
						return this.generatorChartOptions(projectInfo, this.queryParams.startDate, this.queryParams.endDate);
					})
					.then(this.drawChart);
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
