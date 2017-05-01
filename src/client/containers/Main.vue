<template>
	<div id="app">
		<el-menu default-active="1" mode="horizontal">
			<el-menu-item index="1">
				<router-link class="nav-link" to="/project-view">项目分布</router-link>
			</el-menu-item>
			<el-menu-item index="2">
				<router-link class="nav-link" to="/staff-view">人员分布</router-link>
			</el-menu-item>
			<el-submenu index="3">
				<template slot="title">数据录入</template>
				<router-link to="/staff-info">
					<el-menu-item index="3-1">人员信息录入</el-menu-item>
				</router-link>
				<router-link to="/project-info">
					<el-menu-item index="3-2">项目信息录入</el-menu-item>
				</router-link>
			</el-submenu>
		</el-menu>
		<section class="app-content">
			<router-view></router-view>
		</section>
	</div>
</template>

<style scoped>
	.app-content {
		height: calc(100% - 60px);
	}

	.nav-link {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
