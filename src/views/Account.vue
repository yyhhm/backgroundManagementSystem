<template>
    <div>
        <el-card>
            <!-- label-width	表单域标签的宽度
			label-position	表单域标签的位置 -->
            <el-form :model="nameForm" :rules="rules" ref="nameRef" label-width="80px" label-position="right" class="demo-ruleForm">
                <el-form-item label="登录名：" prop="loginName">
                    <el-input style="width: 200px" v-model="nameForm.loginName"></el-input>
                </el-form-item>
                <el-form-item label="昵称：" prop="nickName">
                    <el-input style="width: 200px" v-model="nameForm.nickName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="submitName">确认修改</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top: 30px">
            <el-form :model="passForm" :rules="rules" ref="passRef" label-width="80px" label-position="right" class="demo-ruleForm">
                <el-form-item label="原密码：" prop="oldpass">
                    <el-input style="width: 200px" v-model="passForm.oldpass"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newpass">
                    <el-input style="width: 200px" v-model="passForm.newpass"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="submitPass">确认修改</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'Account',
    data() {
        return {
            nameForm: {
                loginName: '',
                nickName: ''
            },
            passForm: {
                oldpass: '',
                newpass: ''
            },
            rules: {
                loginName: [
                    {
                        required: 'true',
                        message: '登录名不能为空',
                        trigger: ['change']
                    }
                ],
                nickName: [
                    {
                        required: 'true',
                        message: '昵称不能为空',
                        trigger: ['change']
                    }
                ],
                oldpass: [
                    {
                        required: 'true',
                        message: '原密码不能为空',
                        trigger: ['change']
                    }
                ],
                newpass: [
                    {
                        required: 'true',
                        message: '新密码不能为空',
                        trigger: ['change']
                    }
                ]
            }
        }
    },
    methods: {
        submitName() {
            this.$refs.nameRef.validate(valid => {
                if (valid) {
                    this.$axios
                        .put('/name', {
                            loginName: this.nameForm.loginName,
                            nickName: this.nameForm.nickName
                        })
                        .then(() => {
                            this.$message.success('账户修改成功')
                            window.location.reload()
                        })
                }
            })
        },
        submitPass() {
            console.log('11=' + this.passForm.oldpass instanceof String)
            this.$refs.passRef.validate(valid => {
                if (valid) {
                    console.log('ces')

                    this.$axios
                        .put('/password', {
                            oldPass: this.passForm.oldpass,
                            loginPassword: this.passForm.newpass
                        })
                        .then(res => {
                            this.$message.success(res.data)
                            window.location.reload()
                        })
                }
            })
        },
        init() {
            this.$axios.get('/profile').then(res => {
                this.nameForm.loginName = res.data.loginName
                this.nameForm.nickName = res.data.nickName
            })
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style scoped>
.account-container {
    margin-top: 30px;
}
</style>
