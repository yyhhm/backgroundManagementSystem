<template>
    <el-card class="guest-container">
        <template #header>
            <div class="header">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="handleSolve"
                    >解除禁用</el-button
                >
                <el-button type="danger" size="small" icon="el-icon-delete" @click="handleForbid"
                    >禁用账户</el-button
                >
            </div>
        </template>
        <el-table
            v-loading="loading"
            border
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="loginName" label="登录名"> </el-table-column>
            <el-table-column prop="nickName" label="昵称"> </el-table-column>
            <el-table-column label="身份状态">
                <template #default="scope">
                    <span :style="scope.row.lockedFlag == 0 ? 'color: green;' : 'color: red;'">
                        {{ scope.row.lockedFlag == 0 ? '正常' : '禁用' }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column label="注册时间">
                <template #default="scope">
                    {{ scope.row.createTime | time }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="scope">
                    <el-button
                        type="text"
                        @click="handleSolve(scope.row.userId)"
                        v-if="scope.row.lockedFlag == 1"
                        >解除禁用
                    </el-button>
                    <el-popconfirm
                        title="确定禁用吗？"
                        @confirm="handleForbid(scope.row.userId)"
                        v-else
                    >
                        <template #reference>
                            <el-button type="text" style="color: red">禁用账户</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!--总数超过一页，再展示分页器-->
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
    </el-card>
</template>

<script>
export default {
    name: 'User',
    data() {
        return {
            loading: false,
            tableData: [], // 数据列表
            multipleSelection: [], // 选中项
            total: 0, // 总条数
            currentPage: 1, // 当前页
            pageSize: 10, // 分页大小
        }
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleSolve(id) {
            let ids = []
            if (this.multipleSelection.length > 0 || id > 0) {
                if (this.multipleSelection.length) {
                    console.log('fffffff')
                    ids = this.multipleSelection.map(item => item.userId)
                }
                if (id > 0) {
                    console.log('fffffgggggggff' + id)
                    ids.push(id)
                }
            } else {
                this.$message.error('请选择项')
                return
            }
            this.$axios
                .put(`/users/${0}`, {
                    ids,
                })
                .then(() => {
                    this.$message.success('解除成功')
                    this.getUserList()
                })
        },
        handleForbid(id) {
            let ids = []
            if (this.multipleSelection.length > 0 || id > 0) {
                if (this.multipleSelection.length) {
                    ids = this.multipleSelection.map(item => item.userId)
                }
                if (id > 0) {
                    ids.push(id)
                }
            } else {
                this.$message.error('请选择项')
                return
            }
            this.$axios
                .put(`/users/${1}`, {
                    ids,
                })
                .then(() => {
                    this.$message.success('禁用成功')
                    this.getUserList()
                })
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getUserList()
        },

        // 监听pagenum改变事件
        handleCurrentChange(newPage) {
            this.currentPage = newPage
            this.getUserList()
        },
        getUserList() {
            this.$axios
                .get('/user/list', {
                    params: {
                        currentPage: this.currentPage,
                        pageSize: this.pageSize,
                    },
                })
                .then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                    this.loading = false
                })
        },
    },
    created() {
        this.getUserList()
    },
    mounted() {},
}
</script>

<style scoped lang="less"></style>
