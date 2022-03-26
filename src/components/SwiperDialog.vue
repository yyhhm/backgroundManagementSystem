<template>
	<el-dialog :title="id == '' ? '添加轮播图' : '修改轮播图'" :close-on-click-modal="false" :visible.sync="visible" width="400px"
		@close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="formlRef" label-width="100px">
			<el-form-item label="轮播图" prop="imageUrl">
				<el-upload accept="jpg,jpeg,png" action="/admin/upload" :show-file-list="false"
					:on-success="handleSuccess" :before-upload="beforeAvatarUpload" class="avatar-uploader">
					<img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</el-form-item>
			<el-form-item label="排序值" prop="carousel_rank">
				<el-input type="number" max='200' v-model="ruleForm.carousel_rank"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		name: 'SwiperDialog',
		props: {
			//type: String,
			reload: Function
		},
		data() {
			return {
				isSubmit: false,
				imgNum: 0,

				//是否显示对话框
				visible: false,		
				id: '',
				carousel_url: '',
			//用来验证
				ruleForm: {
					//提交的数据			
					carousel_rank: '',
					//显示图片用的
					imageUrl: '',				
				},
				rules: {
					imageUrl: [{
						required: 'true',
						message: '图片不能为空',
						trigger: 'change'
					}],
					carousel_rank: [{
						required: 'true',
						message: '排序值不能为空',
						trigger: 'change'
					}]
				}
			}
		},
		methods: {
			//判断上传成功的次数，删除以前上传的图
			async handleSuccess(val) {
				this.imgNum++
				if (this.imgNum > 1) {
					await this.delUrl(this.ruleForm.imageUrl)
				}
				this.ruleForm.imageUrl = val.data
			},
			//删除没用的已上传图片
			async delUrl(file) {
				await this.$axios.delete('/deleteFile', {
					params: {
						path: file
					}
				})
			},
			beforeAvatarUpload(file) {
				const sufix = file.name.split('.')[1] || ''
				if (!['jpg', 'jpeg', 'png'].includes(sufix)) {
					this.$message.error('请上传 jpg、jpeg、png 格式的图片')
					return false
				}
			},
			async open(id) {
				this.visible = true
				if (id > 0) {				
					this.id = id
					await this.getDetail(id)
				}				
			},			
			async getDetail(id){
				await this.$axios.get(`/carousel/${id}`).then(res=>{
					this.carousel_url=res.data.carouselUrl
					this.ruleForm.imageUrl=res.data.carouselUrl
					this.ruleForm.carousel_rank=res.data.carouselRank
				
				})
			},
			//重置
			async handleClose() {
				//如果增加或修改数据，就删除上传的图片
				if (this.imgNum > 0 && !this.isSubmit) {
					await this.delUrl(this.ruleForm.imageUrl)
				}
				this.$refs.formlRef.resetFields()
				this.carousel_url=''
				this.id=''
				this.imgNum = 0	
			},
			async submitForm() {
				this.$refs.formlRef.validate((valid) => {
					if (valid) {
						const delImg=this.carousel_url
						this.carousel_url = this.ruleForm.imageUrl
						if (this.id > 0) {
							this.$axios.put('/carousel', {
								carouselId:this.id,
								carouselUrl: this.carousel_url,
								carouselRank: this.ruleForm.carousel_rank
							}).then(() => {					
								this.isSubmit = true
								this.delUrl(delImg)
								this.reload()			
								this.visible = false
								this.$message({
									message: '修改成功',
									type: 'success'
								})
							})					
						} else {
							this.$axios.post('/carousel', {
								carouselUrl: this.carousel_url,
								carouselRank: this.ruleForm.carousel_rank
							}).then(() => {
								this.isSubmit = true
								this.reload()
								this.visible = false
								this.$message({
									message: '添加成功',
									type: 'success'
								})
							})
						}
					}
				})
			},
		}
	}
</script>


<style>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>
