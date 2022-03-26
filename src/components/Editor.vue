<template>
    <div>
        <div id="editor" class="editor"></div>
    </div>
</template>

<script>
import E from 'wangeditor'
export default {
    name: 'Editor',

    props: {
        content: String,
    },
    data() {
        return {
            editor: '',
            name: '',
        }
    },
    methods: {
        isClear() {
            this.editor.txt.clear()
            this.info_ = null
        },
    },
    mounted() {
        this.editor = new E('#editor')

        this.editor.config.focus = false
        this.editor.config.excludeMenus = ['emoticon', 'video', 'code', 'quote']
        this.editor.config.uploadImgServer = '/admin/upload'
        this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
        this.editor.config.uploadImgMaxLength = 1
        this.editor.config.showLinkImg = false
        this.editor.config.showLinkImgAlt = false
        this.editor.config.showLinkImgHref = false
        this.editor.config.uploadFileName = 'file'
        this.editor.config.uploadImgHooks = {
            // 图片上传并返回了结果，图片插入已成功
            success: function (xhr) {
                console.log('success', xhr)
            },
            // 图片上传并返回了结果，但图片插入时出错了
            fail: function (xhr, editor, resData) {
                console.log('fail', resData)
            },
            // 上传图片出错，一般为 http 请求的错误
            error: function (xhr, editor, resData) {
                console.log('error', xhr, resData)
            },
            // 上传图片超时
            timeout: function () {
                console.log('timeout')
            },
            // 图片上传并返回了结果，想要自己把图片插入到编辑器中
            // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
            customInsert: function (insertImgFn, result) {
                // result 即服务端返回的接口
                console.log('customInsert', result)

                // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
                insertImgFn(result.data)
            },
        }
        this.editor.create()
        // 修改的时候，需要富文本内容回显，则需要加入以下代码

        // 详情有文字或图片时，删掉请输入正文
        this.editor.config.onchange = html => {
            this.info_ = html
            this.$emit('change', this.info_)
        }
    },
    watch: {
        // 编辑图书时初始化
        content: function (val) {
            if (val !== this.editor.txt.html()) {
                console.log('LLl')
                this.editor.txt.html(val)
            }
        },
    },
}
</script>

<style></style>
