<template>
  <div>
    <el-card class="category-container">
      <template #header>
        <div class="header">
          <el-button type="primary"
                     size="small"
                     icon="el-icon-plus"
                     @click="handleAdd">增加</el-button>
        </div>
      </template>

      <el-table v-loading="loading"
                :data="catelist"
                style="width: 100%;margin-bottom: 20px;"
                row-key="categoryId"
                border
                height="280"
                :tree-props="{children: 'children'}">
        <el-table-column prop="categoryName"
                         label="分类名称">
        </el-table-column>
        <el-table-column label="是否有效"
                         width="100">
          <template slot-scope="scope">
            <i class="el-icon-success"
               v-if="scope.row.isOk === true"
               style="color: lightgreen"></i>
            <i class="el-icon-error"
               v-else
               style="color: red"></i>
          </template>
        </el-table-column>
        <el-table-column label="级别"
                         width="100">
          <template slot-scope="scope">
            <el-tag size="mini"
                    v-if="scope.row.categoryLevel === 1">一级</el-tag>
            <el-tag type="success"
                    size="mini"
                    v-else-if="scope.row.categoryLevel === 2">二级</el-tag>
            <el-tag type="warning"
                    size="mini"
                    v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="categoryRank"
                         label="排序值"
                         width="100">
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditCateDialog(scope.row.categoryId)">
              编辑
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="queryInfo.pageNum"
                       :page-sizes="[3, 5, 7, 9]"
                       :page-size="queryInfo.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
      <!-- <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
				:current-page="currentPage" @current-change="changePage" /> -->
    </el-card>
    <AddCategoryDialiog ref='addDialog'
                        :reload="getCategory"
                        :type="type" />
  </div>

</template>
<script>
import AddCategoryDialiog from '../components/AddCategoryDialog.vue'
export default {
    name: 'Category',
    components: {
        AddCategoryDialiog,
    },

    data() {
        return {
            loading: true,
            // 对话框类型
            type: 'add',

            catelist: [],

            // 查询条件
            queryInfo: {
                type: 3,
                pageNum: 1,
                pageSize: 5,
            },
            /* 总数据条数 */
            total: 0,
        }
    },
    methods: {
        // 获取分类所有数据
        getCategory() {
            this.$axios
                .get('/categories', {
                    params: this.queryInfo,
                })
                .then(res => {
                    this.catelist = res.data.list
                    this.total = res.data.total
                    this.loading = false
                })
                .catch(error => {
                    console.log(error)
                })
        },
        // 打开添加类型对话框
        handleAdd() {
            this.type = 'add'
            this.$refs.addDialog.open()
        },
        // 打开修改类型对话框
        showEditCateDialog(id) {
            this.type = 'edit'
            this.$refs.addDialog.open(id)
        },
        // 点击删除时出现提示框
        remover_handleClick(id) {
            this.$confirm('此操作将永久删除该模块, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.removeCate(id)
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    })
                })
        },

        // 删除分类
        removeCate(id) {
            this.queryInfo.pageNum = 1
            this.$axios
                .delete('/categories', {
                    params: {
                        id: id,
                    },
                })
                .then(() => {
                    this.$message.success('删除成功')
                    this.getCategory()
                })
        },

        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize
            this.getCategory()
        },
        // 监听pagenum改变事件
        handleCurrentChange(newPage) {
            this.queryInfo.pageNum = newPage
            this.getCategory()
        },
    },

    mounted() {
        this.getCategory()
        console.log('挂载成功')
    },
}
</script>
<style scoped>
/* .category-container {
		min-height: 100%;
	}

	.el-card.is-always-shadow {
		min-height: 100% !important;
	} */
</style>
