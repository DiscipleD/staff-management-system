<template>
	<div class="staff-view">
		<div id="staff-chart"></div>
	</div>
</template>

<style lang="sass" scoped>
	.staff-view {
		height: 100%;

	#staff-chart {
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

	const MAX_CANVAS_HEIGHT = 16360;

	export default {
		data: () => ({
			staffChart: null,
			staffChartDom: null,
			projectInfo: [],
			staffList: [],
			queryParams: {
				startDate: '2017-01-01',
				endDate: moment().format('YYYY-MM-DD')
			}
		}),
		methods: {
			init: function() {
				this.staffChartDom = document.getElementById('staff-chart');
				Promise.all([ProjectResource.query(this.queryParams), StaffResource.query()])
					.then(([projectInfo, staffList]) => {
						this.staffList = staffList;

						// 拉长画布
						// 拉长画布
						if (staffList.length && projectInfo.length) {
							const expectHeight = staffList.length * projectInfo.length * 40;
							this.staffChartDom.style.height = `${expectHeight < MAX_CANVAS_HEIGHT ? expectHeight : MAX_CANVAS_HEIGHT}px`;
						}

						return this.generatorChartOptions(staffList, projectInfo, this.queryParams.startDate, this.queryParams.endDate);
					})
					.then(this.drawChart);
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
