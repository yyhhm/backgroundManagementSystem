<template>
	<div>
		<el-card>
			<template #header>
				<div class="header">
					<el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">新增轮播图</el-button>
				</div>
			</template>
			<el-table :data="tableData" style="width: 100%" v-loading="loading">
				<el-table-column label="主图">
					<template #default="scope">
						<img class="img" :src="scope.row.carouselUrl" alt="主图" >
					</template>
				</el-table-column>
				<el-table-column label="排序值" prop="carouselRank" >
				</el-table-column>
				<el-table-column label="创建时间" prop="createTime">
					<template slot-scope="scope">	
					{{scope.row.createTime | time}}
					</template>
				</el-table-column>
				<el-table-column label="操作" >
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini"
							@click="handleEadit(scope.row.carouselId)">
							编辑
						</el-button>
				
						<el-button type="danger" icon="el-icon-delete" size="mini"
							@click="remover_handleClick(scope.row.carouselId)">
							删除
						</el-button>		
					</template>
				</el-table-column>
			</el-table>
			<div class="block">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="currentPage" :page-sizes="[3, 5, 7, 9]" :page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>	
		</el-card>
		<SwiperDialog ref='dialog' :reload="getSwiper" :type="type" />
	</div>
	
</template>

<script>
	import SwiperDialog from "../components/SwiperDialog.vue"
	export default{
		name:"Swiper",
		components:{
			SwiperDialog
		},
		data(){
			return{
				loading:true,
				tableData: [],
				//查询条件			
				currentPage: 1,
				pageSize: 5,
				type:'add',
				/* 总数据条数 */
				total: 0,
			}
		},
		
		methods:{
			handleAdd() {
				this.$refs.dialog.open()
			},
			remover_handleClick(id) {
				this.$confirm("此操作将永久删除该模块, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					this.handleRemove(id)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			},
			handleEadit(id){
				this.$refs.dialog.open(id)
			},
			handleRemove(){},
			
			handleSizeChange(newSize) {
				this.pageSize = newSize
				this.getSwiper()
			
			},
			// 监听pagenum改变事件
			handleCurrentChange(newPage) {
				this.currentPage = newPage
				this.getSwiper()
			},		
			getSwiper(){
				this.$axios.get("/carousel/list",{
					params: {
						currentPage: this.currentPage,
						pageSize: this.pageSize,
					}
				}).then(res => {
					this.tableData = res.data.list
					this.total = res.data.total
					this.loading=false
				})
			},
		},
		mounted() {
			this.getSwiper()
		}
	}

</script>

<style>
</style>
