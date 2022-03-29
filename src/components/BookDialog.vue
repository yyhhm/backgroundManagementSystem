<template>
    <el-dialog
        :title="type == 'add' ? '添加图书' : '修改图书'"
        :close-on-click-modal="false"
        :visible.sync="visible"
        width="600px"
        @close="handleClose"
    >
        <el-form ref="refForm" :model="bookForm" :rules="rules" label-width="100px">
            <el-form-item label="图书分类" prop="selectedKeys">
                <el-cascader
                    v-model="bookForm.selectedKeys"
                    style="width: 300px"
                    :options="cateList"
                    :props="cascaderProps"
                    @change="handleChangeCate"
                    clearable
                    placeholder="只能选择第三级"
                >
                </el-cascader>
            </el-form-item>
            <el-form-item label="图书名" prop="name">
                <el-input v-model="bookForm.name" class="input"></el-input>
            </el-form-item>

            <el-form-item label="作者" prop="author">
                <el-input v-model="bookForm.author" class="input"></el-input>
            </el-form-item>
            <el-form-item label="出版社" prop="publish">
                <el-input v-model="bookForm.publish" class="input"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="originalPrice">
                <el-input
                    type="number"
                    v-model="bookForm.originalPrice"
                    class="input"
                    min="0.01"
                    step="0.01"
                ></el-input>
            </el-form-item>
            <el-form-item label="实际售价" prop="sellingPrice">
                <el-input type="number" v-model="bookForm.sellingPrice" class="input"></el-input>
            </el-form-item>
            <el-form-item label="库存" prop="stockNum">
                <el-input type="number" v-model="bookForm.stockNum" class="input"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="intro">
                <el-input type="textarea" v-model="bookForm.intro" class="input"></el-input>
            </el-form-item>
            <el-form-item label="上架状态" prop="sellStatus">
                <el-radio-group v-model="bookForm.sellStatus">
                    <el-radio :label="0">上架</el-radio>
                    <el-radio :label="1">下架</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="图书主图" prop="file">
                <el-upload
                    accept="jpg,jpeg,png"
                    :class="{ disUoloadSty: noneBtnImg }"
                    :limit="this.limit"
                    action="/admin/upload"
                    :on-success="handleUrlSuccess"
                    :on-remove="handleRemove"
                    ref="upload"
                    list-type="picture-card"
                    :file-list="bookForm.file"
                    :on-change="handleChange"
                    :auto-upload="false"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>

            <el-form-item label="详情" pro="bookDetailContent">
                <Editor @change="getDetail" :content="bookForm.detailContent" ref="editor"></Editor>
            </el-form-item>

            <!-- <el-form-item>
				<el-button type="primary" @click="submitAdd()">{{ id ? '立即修改' : '立即创建' }}</el-button>
			</el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="submitAdd">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import Editor from './Editor.vue'
export default {
    name: 'AddBook',
    components: {
        Editor,
    },
    props: {
        reload: Function,
        type: String,
    },

    data() {
        const validateCheckPrice = (rule, value, callback) => {
            if (value <= 0) {
                callback(new Error('价格不能为负或0'))
            }
            const ArrMen = value.toString().split('.') // 截取字符串
            if (ArrMen.length === 2) {
                if (ArrMen[1].length > 2) {
                    // 判断小数点后面的字符串长度
                    callback(new Error('只能输出两位小数'))
                }
            }
            if (this.bookForm.originalPrice && this.bookForm.sellingPrice) {
                if (this.bookForm.sellingPrice > this.bookForm.originalPrice) {
                    callback(new Error('实际售价必须小于或等于原价'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        return {
            visible: false,
            // 编辑时获取已上传图片数量
            imgCount: 0,
            // 图片限制数量
            limit: 4,
            // 隐藏图片添加框
            noneBtnImg: false,
            // 编辑时，传递到子组件的数据
            id: '',
            // 编辑成功，获取要删除的已上传图片名称
            delUrl: [],
            // 分类的列表数据
            cateList: [],
            // 用来编辑时回显已经上传过的图片数据
            bookForm: {
                // 用来判断有没有图
                file: [],
                // 判段有没有选择第三级数据
                selectedKeys: [],
                // 提交的图片路径数据
                coverImg: '',
                name: '',
                intro: '',
                detailContent: '',
                originalPrice: '',
                sellingPrice: '',
                stockNum: '',
                sellStatus: 0,
                author: '',
                publish: '',
            },
            // 级联选择器配置对象
            cascaderProps: {
                value: 'categoryId',
                label: 'categoryName',
                children: 'children',
            },
            // 获取分类Id
            categoryId: '',
            categoryPid: '',
            rules: {
                selectedKeys: [
                    {
                        required: true, // 是否必填
                        message: '必须选择第三级数据', // 规则
                        trigger: 'change', // 何事件触发
                    },
                ],
                file: [
                    {
                        required: true, // 是否必填
                        message: '图片不能为空', // 规则
                        trigger: 'change', // 何事件触发
                    },
                ],

                name: [
                    {
                        required: true, // 是否必填
                        message: '图书名不能为空', // 规则
                        trigger: 'change', // 何事件触发
                    },
                ],
                intro: [
                    {
                        message: '简介长度不能超过200字符',
                        max: 200, // 规则
                        trigger: 'change', // 何事件触发
                    },
                ],

                originalPrice: [
                    {
                        required: true, // 要求输入不能为空

                        message: '原价不能为空', // 规则
                        trigger: 'change', // 何事件触发
                    },

                    {
                        validator: validateCheckPrice,
                        trigger: 'change',
                    },
                ],
                sellingPrice: [
                    {
                        required: true, // 是否必填
                        message: '实际售价不能为空', // 规则
                        trigger: 'change', // 何事件触发
                    },
                    {
                        validator: validateCheckPrice,
                        trigger: 'change',
                    },
                ],
                stockNum: [
                    {
                        required: true, // 是否必填
                        message: '库存不能为空', // 规则
                        trigger: 'change', // 何事件触发
                    },
                ],

                author: [
                    {
                        required: true, // 是否必填
                        message: '作者不为空', // 规则
                        trigger: 'change', // 何事件触发
                    },
                    {
                        message: '长度不能超过10字符',
                        max: 10, // 规则
                        trigger: 'change', // 何事件触发
                    },
                ],
                publish: [
                    {
                        required: true, // 是否必填
                        message: '出版社不能为空', // 规则
                        trigger: 'change', // 何事件触发
                    },
                    {
                        message: '长度不能超过20字符',
                        max: 20, // 规则
                        trigger: 'change', // 何事件触发
                    },
                ],
            },
        }
    },
    methods: {
        // 编辑框 实时赋值
        getDetail(html) {
            console.log(html)
            this.bookForm.detailContent = html
        },
        // 主图改变时，判断图片数量
        async handleChange(file, fileList) {
            // 只有添加图片时才调用handleChange
            if (file.status !== 'ready') {
                return
            }
            const sufix = file.name.split('.')[1] || ''
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!['jpg', 'jpeg', 'png'].includes(sufix)) {
                this.$message.error('请上传 jpg、jpeg、png 格式的图片')
                this.$refs.upload.handleRemove(file)
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
                this.$refs.upload.handleRemove(file)
                return false
            }
            if (this.id) {
                this.bookForm.coverImg = ''
                this.imgCount = 0
                for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].url.indexOf('image') !== -1) {
                        this.bookForm.coverImg += fileList[i].url
                        this.bookForm.coverImg += '#'
                        this.imgCount++
                    }
                }
            }
            // 是否显示后面的图片增加框
            this.noneBtnImg = fileList.length >= this.limit
            // 每次图片改变都要做验证
            this.bookForm.file = fileList
            this.$refs.refForm.validateField('file')
            return file
        },
        // 删除主图
        handleRemove(file, fileList) {
            // 编辑时,删除图片
            if (this.id) {
                this.bookForm.coverImg = ''
                this.imgCount = 0
                for (let i = 0; i < fileList.length; i++) {
                    // 记录已上传的图片路径和数量
                    if (fileList[i].url.indexOf('image') !== -1) {
                        this.bookForm.coverImg += fileList[i].url
                        this.bookForm.coverImg += '#'
                        this.imgCount++
                    }
                }
            }
            this.noneBtnImg = fileList.length >= this.limit
            this.bookForm.file = fileList
            this.$refs.refForm.validateField('file')
        },
        // 提交事件，

        async submitAdd() {
            // 先做验证
            await this.$refs.refForm.validate(valid => {
                if (valid) {
                    console.log('hggtrf' + this.imgCount)
                    if (this.id && this.imgCount === this.bookForm.file.length) {
                        this.submitForm()
                    } else {
                        this.$refs.upload.submit()
                    }
                } else {
                    console.log('error submit!!')
                }
            })
        },
        // 提交数据
        async submitForm() {
            const data = {
                bookName: this.bookForm.name,
                bookIntro: this.bookForm.intro,
                bookCategoryId: this.categoryId,
                bookCoverImg: this.bookForm.coverImg,
                bookDetailContent: this.bookForm.detailContent,
                originalPrice: this.bookForm.originalPrice,
                sellingPrice: this.bookForm.sellingPrice,
                stockNum: this.bookForm.stockNum,
                bookSellStatus: this.bookForm.sellStatus,
                bookAuthor: this.bookForm.author,
                bookPublish: this.bookForm.publish,
                bookCategoryPid: this.categoryPid,
            }
            if (this.id) {
                data.bookId = this.id
                await this.$axios.put('/books', data).then(res => {
                    console.log(res)
                    if (res.code === 200) {
                        this.$message.success('修改成功')

                        this.visible = false
                        this.reload()
                    } else {
                        this.$message.fail('修改失败')
                        this.visible = false
                        this.reload()
                    }
                })
            } else {
                this.$axios.post('/books', data).then(res => {
                    console.log(res)
                    if (res.code === 200) {
                        this.$message.success('添加成功')
                        this.visible = false
                        this.reload()
                    } else {
                        this.$message.fail('添加失败')
                        this.visible = false
                        this.reload()
                    }
                })
            }
        },
        // 编辑时，提交表单成功后，如果有已上传的删除，便删除本地图片

        // 获得级联数据
        async getCateList() {
            await this.$axios
                .get('/categories', {
                    params: {
                        type: 3,
                    },
                })
                .then(res => {
                    this.cateList = res.data
                })
        },
        // 分类数据改变时
        handleChangeCate(val) {
            this.categoryId = val[2]
            this.categoryPid = val[1]
        },

        handleUrlSuccess(res, file, fileList) {
            this.bookForm.coverImg += res.data || ''
            this.bookForm.coverImg += '#'
            this.imgCount++
            console.log('dddddd+' + this.imgCount)
            if (this.imgCount === fileList.length) {
                this.submitForm()
            }
        },
        // 获取图片数据
        // this.bookForm.coverImg是类似"image/aaa.jpg#image/bbb.jpg#""字符串
        getImg() {
            const str = this.bookForm.coverImg.split('#')
            for (let i = 0; i < str.length - 1; i++) {
                const obj = {}
                obj.url = str[i]
                // 编辑时用来回显已上传过的图片
                this.bookForm.file.push(obj)
                this.imgCount++
            }
            this.noneBtnImg = this.bookForm.file.length >= this.limit
        },
        // 通过id获取到数据
        async getBookDetail(id) {
            await this.$axios.get(`/books/${id}`).then(res => {
                this.bookForm.selectedKeys = res.data.list
                this.bookForm.coverImg = res.data.bookCoverImg
                this.bookForm.name = res.data.bookName
                this.bookForm.intro = res.data.bookIntro
                this.bookForm.detailContent = res.data.bookDetailContent
                this.bookForm.originalPrice = res.data.originalPrice
                this.bookForm.sellingPrice = res.data.sellingPrice
                this.bookForm.stockNum = res.data.stockNum
                this.bookForm.sellStatus = res.data.bookSellStatus
                this.bookForm.author = res.data.bookAuthor
                this.bookForm.publish = res.data.bookPublish
                this.categoryId = res.data.bookCategoryId
            })
        },
        // 编辑初始化事件
        async open(id) {
            this.id = id
            this.visible = true
            await this.getCateList()
            if (id > 0) {
                await this.getBookDetail(id)
                await this.getImg()
            }
            console.log('init完成')
        },
        handleClose() {
            this.$refs.editor.isClear()
            this.visible = false
            this.$refs.refForm.resetFields()
            this.imgCount = 0
        },
    },
    mounted() {},
    created() {},
}
</script>

<style>
.disUoloadSty .el-upload--picture-card {
    display: none;
}
</style>
<style scoped>
.input {
    width: 300px;
}
</style>
