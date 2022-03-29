<template>
    <el-dialog
        :title="type == 'add' ? '添加分类' : '修改分类'"
        :close-on-click-modal="false"
        :visible.sync="visible"
        width="400px"
        @close="handleClose"
    >
        <el-form ref="formRef" :model="ruleForm" :rules="rules" label-width="100px">
            <el-form-item label="分类名称" prop="category_name">
                <el-input v-model="ruleForm.category_name" type="text"></el-input>
            </el-form-item>
            <el-form-item label="父级分类:">
                <el-cascader
                    v-if="id == ''"
                    v-model="selectedKeys"
                    :options="parentCateList"
                    :props="cascaderProps"
                    clearable
                    @change="parentCateChanged"
                >
                </el-cascader>
                <el-breadcrumb v-else separator="/" style="line-height: 40px">
                    <el-breadcrumb-item v-for="(item, index) in catName" :key="index">
                        {{ item }}
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </el-form-item>

            <el-form-item label="是否有效" prop="is_ok">
                <el-switch v-model="ruleForm.is_ok"></el-switch>
            </el-form-item>
            <el-form-item label="排序值" prop="category_rank">
                <el-input v-model="ruleForm.category_rank" type="number" max="200"></el-input>
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
    name: 'AddCategoryDialog',
    props: {
        type: String,
        reload: Function,
    },
    data() {
        return {
            // 是否显示对话框
            visible: false,
            // 父级分类的列表数据
            parentCateList: [],
            // 选中的父级分类的Id数组
            selectedKeys: [],
            // 编辑时分类名字
            catName: [],
            // 级联选择器配置对象
            cascaderProps: {
                value: 'categoryId',
                label: 'categoryName',
                children: 'children',
                expandTrigger: 'hover',
                checkStrictly: true,
            },
            category_level: 1,
            parent_id: 0,
            id: '',
            // 表单数据
            ruleForm: {
                category_name: '',
                category_rank: '',
                is_ok: true,
            },
            // 校验规则 prop的名字
            rules: {
                category_name: [
                    {
                        required: 'true',
                        message: '名称不能为空',
                        trigger: 'change',
                    },
                ],
                category_rank: [
                    {
                        required: 'true',
                        message: '排序值不能为空',
                        trigger: 'change',
                    },
                ],
            },
        }
    },
    methods: {
        // 开启弹窗
        open(id) {
            // 先获得分类级联
            this.visible = true

            if (id > 0) {
                // 获取详情
                this.id = id
                this.getDetail(id)
                this.getCatId(id)
            } else {
                this.getPatentCateList()
            }
            console.log(this.selectedKeys)
        },

        // 获取分类详情
        async getDetail(id) {
            await this.$axios.get(`/categories/${id}`).then(res => {
                this.ruleForm.category_name = res.data.categoryName
                this.ruleForm.category_rank = res.data.categoryRank
                this.ruleForm.is_ok = res.data.isOk
                this.category_level = res.data.categoryLevel
                this.parent_id = res.data.parentId
            })
        },
        // 编辑时，通过id获取父级分类id数组
        async getCatId(id) {
            await this.$axios
                .get('/getParentId', {
                    params: {
                        id: id,
                    },
                })
                .then(res => {
                    this.catName = res.data
                })
        },
        // 获得一二级级联数据
        getPatentCateList() {
            console.log('获得一二级级联')
            this.$axios
                .get('/categories', {
                    params: {
                        type: 2,
                    },
                })
                .then(res => {
                    this.parentCateList = res.data
                })
        },
        // 级联选择项发生变化时触发这个函数
        parentCateChanged(val) {
            // val为选中的分类id数字
            console.log('val=' + val)
            // >0表示有父分类
            if (this.selectedKeys.length > 0) {
                // 父级分类的Id ==数组最后
                this.parent_id = this.selectedKeys[this.selectedKeys.length - 1]
                // 父类的等级+1=当前分类的等级
                this.category_level = this.selectedKeys.length + 1
            } else {
                // 父级分类的Id
                this.parent_id = 0
                // 当前分类的等级
                this.category_level = 1
            }
        },
        // 提交
        submitForm() {
            this.$refs.formRef.validate(valid => {
                if (valid) {
                    if (this.type === 'add') {
                        this.$axios
                            .post('/categories', {
                                categoryLevel: this.category_level,
                                parentId: this.parent_id,
                                categoryName: this.ruleForm.category_name,
                                categoryRank: this.ruleForm.category_rank,
                                isOk: this.ruleForm.is_ok,
                            })
                            .then(() => {
                                this.visible = false
                                this.reload()
                                this.$message({
                                    message: '添加成功',
                                    type: 'success',
                                })
                            })
                    } else {
                        this.$axios
                            .put('/categories', {
                                categoryId: this.id,
                                categoryLevel: this.category_level,
                                parentId: this.parent_id,
                                categoryName: this.ruleForm.category_name,
                                categoryRank: this.ruleForm.category_rank,
                                isOk: this.ruleForm.is_ok,
                            })
                            .then(() => {
                                this.visible = false
                                this.reload()
                                this.$message({
                                    message: '修改成功',
                                    type: 'success',
                                })
                            })
                    }
                } else {
                    console.log('验证失败')
                }
            })
        },
        // 监听对话框的关闭事件，重置表单数据
        handleClose() {
            this.$refs.formRef.resetFields()
            this.id = ''
            this.catName = []
            this.selectedKeys = []
            console.log('key=' + this.selectedKeys)
            // 父级分类的Id
            this.parent_id = 0
            // 当前分类的等级
            this.category_level = 1
        },
    },
}
</script>
<style scoped></style>
