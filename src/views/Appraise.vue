<template>
    <el-card>
        <template #header>
            <div class="header">
                <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete()">
                    删除评价</el-button
                >
            </div>
        </template>
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            height="350"
        >
            <el-table-column type="selection" width="80"> </el-table-column>
            <el-table-column label="商品信息" width="130">
                <template #default="scope">
                    <img
                        style="width: 100px; height: 100px"
                        :src="scope.row.orderItem.bookCoverImg.split('#')[0]"
                        alt="主图"
                    />
                </template>
            </el-table-column>
            <el-table-column width="200" prop="orderItem.bookName"> </el-table-column>
            <el-table-column width="100" prop="users.userId" label="用户Id"> </el-table-column>
            <el-table-column width="100" prop="grade" label="评分"> </el-table-column>
            <el-table-column width="200" label="评价" s :show-overflow-tooltip="true">
                <template #default="scope">
                    <div v-if="scope.row.appraiseContact.length > 0">
                        <el-popover
                            placement="top-start"
                            width="300"
                            trigger="hover"
                            :disabled="scope.row.appraiseContact.length <= 10"
                        >
                            <div>{{ scope.row.appraiseContact }}</div>
                            <span slot="reference" v-if="scope.row.appraiseContact.length <= 10">{{
                                scope.row.appraiseContact
                            }}</span>
                            <span slot="reference" v-if="scope.row.appraiseContact.length > 10">{{
                                scope.row.appraiseContact.substr(0, 10) + '...'
                            }}</span>
                        </el-popover>
                    </div>
                    <div v-else>此用户没有评价</div>
                </template>
            </el-table-column>
            <el-table-column width="200" label="发表时间">
                <template #default="scope">
                    <span>{{ scope.row.createTime | time }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="" label="操作" fixed="right">
                <template #default="scope">
                    <el-button @click="handleDelete(scope.row.appraiseId)" type="text" size="small">
                        删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[8, 12, 16, 20]"
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
    name: 'Appraise',
    data() {
        return {
            tableData: [],
            // 查询条件
            currentPage: 1,
            pageSize: 10,
            /* 总数据条数 */
            total: 0,
            multipleSelection: [],
        }
    },
    methods: {
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getAppraise()
        },

        // 监听pagenum改变事件
        handleCurrentChange(newPage) {
            this.currentPage = newPage
            this.getAppraise()
        },
        getAppraise() {
            this.$axios
                .get('/appraise/list', {
                    params: {
                        pageSize: this.pageSize,
                        currentPage: this.currentPage,
                    },
                })
                .then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleDelete(id) {
            let ids = []
            if (id) {
                ids = [id]
            } else {
                if (this.multipleSelection.length === 0) {
                    this.$message.error('请选择项')
                    return
                }
                ids = this.multipleSelection.map(item => item.appraiseId)
            }
            this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$axios
                        .delete('/appraise/delByIds', {
                            params: {
                                ids: ids.join(','),
                            },
                        })
                        .then(() => {
                            this.getAppraise()
                            this.$message.success('删除成功')
                        })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    })
                })
        },
    },
    created() {
        this.getAppraise()
    },
}
</script>

<style></style>
