<template>
	<el-card>
		<template #header>
			<div class="header">
				<el-input 
				placeholder="请输入内容" 
				size="small"
				v-model="inputVal" 
				clearable style="width: 250px; margin-right: 20px;">
				</el-input>
				<el-button type="info" @click="handleChange" size="small">查询</el-button>
				<el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">新增图书</el-button>
			</div>
		</template>
		<el-table :data="tableData"  style="width: 100%" v-loading="loading">
			<el-table-column type="expand">
				<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item label="图书分类id">
							<span>{{ props.row.bookCategoryId }}</span>
						</el-form-item>
						<el-form-item label="作者">
							<span>{{ props.row.bookAuthor }}</span>
						</el-form-item>
						<el-form-item label="出版社">
							<span>{{ props.row.bookPublish }}</span>
						</el-form-item>
						<el-form-item label="价格">
							<span>{{ props.row.originalPrice}}</span>
						</el-form-item>
						<el-form-item label="简介">
							<span>{{ props.row.bookIntro }}</span>
						</el-form-item>
						<el-form-item label="详情">
							<p v-html="props.row.bookDetailContent">{{props.row.bookDetailContent}}</p>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column label="图书ID" prop="bookId" width="80">
			</el-table-column>
			<el-table-column label="图书名称" prop="bookName">
			</el-table-column>
			<el-table-column label="主图">
				<template #default="scope">
					<img style="width: 100px; height: 100px;" :src="scope.row.bookCoverImg.split('#')[0]" alt="主图" >
				</template>
			</el-table-column>
		
			<el-table-column label="库存" prop="stockNum" width="80">
			</el-table-column>
			<el-table-column label="销售量" prop="saleNum" width="80">
			</el-table-column>
			<el-table-column label="实际售价" prop="sellingPrice" width="100">
			</el-table-column>
			<el-table-column label="上架状态" width="100">
				<template #default="scope">
					<span style="color: green;" v-if="scope.row.bookSellStatus == 0">销售中</span>
					<span style="color: red;" v-else>已下架</span>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleEdit(scope.row.bookId)">编辑</el-button>
					<el-button type="danger" size="mini" v-if="scope.row.bookSellStatus == 0" @click="handleStatus(scope.row.bookId, 1)">下架</el-button>
					<el-button type="success" size="mini" v-else @click="handleStatus(scope.row.bookId, 0)">上架</el-button>
	<!-- 				<el-button size="mini" type="danger" @click="handleDelete(scope.row.bookId)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<!-- @size-change="handleSizeChange" @current-change="handleCurrentChange" -->
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="currentPage" :page-sizes="[3, 5, 7, 9]" :page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<BookDialog ref='bookDialog' :reload="getBooksList" :type="type" />
	</el-card>
</template>

<script>
	import BookDialog from '../components/BookDialog.vue'
	export default {
		name: 'Book',
		components:{
			BookDialog,
		},
		data() {
			return {
				inputVal:'',
				loading:true,
				tableData: [],
				//查询条件			
				currentPage: 1,
				pageSize: 5,

				/* 总数据条数 */
				total: 0,
				type:'add',
			}

		},
		methods: {
			handleChange(){
				this.getBooksList()
			},
			getBooksList() {
				this.$axios.get('/books/list', {
					params: {
						currentPage: this.currentPage,
						pageSize: this.pageSize,
						val:this.inputVal
					}
				}).then(res => {
					this.tableData = res.data.list
					this.total = res.data.total
					this.loading=false
				})
			},
			//修改上级
			handleStatus(id, status){		
				this.$axios.put('/books', {		  
					bookId:id,
					bookSellStatus:status
				}).then(() => {
					this.$message.success('修改成功')
					this.getBooksList()
				})
			},
			handleAdd() {
				this.type = 'add'
				this.$refs.bookDialog.open()
			},
			handleEdit(id) {
				this.type = 'edit'
				this.$refs.bookDialog.open(id)
			},
			handleSizeChange(newSize) {
				this.pageSize = newSize
				this.getBooksList()
			
			},
			// 监听pagenum改变事件
			handleCurrentChange(newPage) {
				this.currentPage = newPage
				this.getBooksList()
			},
			handleDelete(){
				
			},
		},
		mounted(){
			this.getBooksList()
		},
		
	}
</script>

<style>	
	.demo-table-expand {
		font-size: 0;
	}
	.demo-table-expand label {
		width: 90px;
		color: #99a9bf;
	}
	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}
</style>
