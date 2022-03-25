<template>
	<div class="header">
		<div class="left">	 
			<span style="font-size: 20px">{{ this.$store.getters.title}}</span>
		</div>
		<div class="right">
			<el-popover placement="bottom" :width="320" trigger="click" popper-class="popper-user-box">
				<template #reference>
					<div class="author">
						<i class="icon el-icon-s-custom" />
						{{ userInfo && userInfo.nickName || '' }}
						<i class="el-icon-caret-bottom" />
					</div>
				</template>
				<div class="nickname">
					<p>登录名：{{ userInfo && userInfo.loginName || '' }}</p>
					<p>昵称：{{ userInfo && userInfo.nickName || '' }}</p>
					 <el-button size="small" type="primary"  @click="logout">退出</el-button> 
				</div>
			</el-popover>
		</div>
	</div>
</template>

<script>
	import {pathMap} from '../until/index.js'
	export default {
		name: "Header",
		components: {
			
		},
		data() {
			return {
				userInfo: null,
				hasBack: false,
				name:"系统介绍"
			}
		},
		
		methods: {
			
			getUserInfo() {
				this.$axios.get('/profile').then(res => {
					this.userInfo = res.data
				})
			},
			logout() {
			  this.$axios.delete('/logout').then(() => {
				window.localStorage.removeItem('token')
			    window.location.reload()
			  })
			}
		},
		mounted(){	
			const pathname = window.location.hash.split('/')[1] || ''
			if (!['login'].includes(pathname)) {
				this.getUserInfo()
				
			}
		}
	}
</script>
<style scoped>
	
	.header {
		height: 50px;	
		display: flex;
		justify-content: space-between;
				align-items: center;
		
	}

	/* .el-icon-back {
		border: 1px solid #e9e9e9;
		padding: 4px;
		border-radius: 50px;
		margin-right: 10px;
	}
 */
	.right>div>.icon {
		font-size: 18px;
		margin-right: 6px;
	}

	.author {
		margin-left: 10px;
		cursor: pointer;
	}
</style>
<style>
</style>
