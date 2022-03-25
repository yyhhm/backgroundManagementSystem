<template>
	<div class="login-container">
		<h3 class="title">后台管理系统</h3>
		<el-form label-position="top" :rules="rules" :model="ruleForm" ref="loginForm" class="login-form">
			<el-form-item label="账号" prop="username">
				<el-input type="text" v-model.trim="ruleForm.username" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input type="password" v-model.trim="ruleForm.password" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item>
				<div style="color: #333">登录表示您已同意<a>《服务条款》</a></div>
				<el-button style="width: 100%" type="primary" @click="submitForm">立即登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data() {
			return {
				ruleForm: {
					username: '',
					password: ''
				},
				rules: {
					username: [{
						required: 'true',
						message: '账户不能为空',
						trigger: 'blur'
					}],
					password: [{
						required: 'true',
						message: '密码不能为空',
						trigger: 'blur'
					}]
				}
			}
		},

		methods: {
			submitForm() {
				this.$refs.loginForm.validate((valid) => {
					if (valid) {
						this.$axios.post('/login', {
							loginName: this.ruleForm.username,
							loginPassword: this.ruleForm.password

						}).then(res => {
							if (res.code == 200) {
								window.localStorage.setItem('token', res.data)
								window.location.href = '/'
							} else {
								this.$message.error(res.data)
							}
						})
					} else {
						console.log('error submit!!')
						return false;
					}
				})
			}
		}
	}
</script>

<style scoped>
	.title{
		color: #7e8c9d;
		text-align: center;
		padding-top: 15px;
	}
	.login-container {
		margin: 80px auto;
		width: 420px;
		height: 370px;
		background-color: #fff;
		border-radius: 4px;
		box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
	}

	.login-form {
		margin: auto;
		width: 300px;
	}
</style>
