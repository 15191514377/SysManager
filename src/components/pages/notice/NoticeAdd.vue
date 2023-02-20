<template>
    <div class="editor">
        <div class="head">
            <span>公告新增</span>
        </div>
        <!-- 标题 -->
        <div class="title">
            <el-input placeholder="请输入公告标题" v-model="title" clearable></el-input>
        </div>
        <!-- 内容 -->
        <div class="content">
            <div class="wangEditor">
                <Toolbar style="border-bottom: 1px solid #ccc" 
                :defaultConfig="toolbarConfig"
                :editor="editor"
                :mode="mode" />
                <Editor v-model="html" :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" />
            </div>
        </div>
        <div class="appendix">
            <el-upload
                class="upload-attachment"
                action="#"
                :before-remove="beforeRemove"
                multiple
                :limit="3"
                :on-exceed="handleExceed"
                :before-upload="beforeUpload"
                :file-list="fileList">
                <span>上传文件</span>
            </el-upload>
        </div>
        <div class="date">
            <el-date-picker v-model="publishTime" type="datetime" placeholder="请选择发布日期" value-format="yyyy/MM/dd HH:mm:ss"></el-date-picker>
        </div>
        <div class="foot">
            <el-button type="primary" @click.stop="submitAddNotice()">提交</el-button><el-button type="danger">取消</el-button>
        </div>
    </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { mapActions, mapState } from 'vuex'
export default {
    name: 'NoticeAdd',
    components: { Editor, Toolbar },
    data() {
        return {
            editor:null,
            //公告标题
            title:'',
            html: '',
            toolbarConfig: {
                // 取消toolbar中上传视频图标
                excludeKeys: ['group-video']
            },
            editorConfig: {
                placeholder: '请输入内容...',
                MENU_CONF: {
                    uploadImage: {
                        server: 'http://127.0.0.1:3000/api/editor/img',
                    }
                }
            },
            mode: 'default',
            fileList:[],
            //发布时间
            publishTime:''
        }
    },
    computed:{
        ...mapState('user',['loginUser'])
    },
    methods: {
        ...mapActions('notice',['addNotice']),
        ...mapActions('file',['uploadFile']),
        onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        submitAddNotice(){
            if(this.title.trim() === ''){
                this.$message.error({message:'请输入标题',duration:800})
                return
            }
            if(this.html.trim() === ''){
                this.$message.error({message:"公告内容不能为空",duration:800})
                return
            }
            const formData = new FormData();
            formData.append('title',this.title)
            formData.append('html',this.html)
            formData.append('editorId',this.loginUser?.id)
            formData.append('attachment',JSON.stringify(this.fileList))
            if(this.publishTime) formData.append('publishTime',new Date(this.publishTime))
            else formData.append('publishTime',new Date(0))
            
            // 发送添加请求
            this.addNotice(formData).then((res)=>{
                if(res) this.$router.push('/sys/notice/nManager')
            })
        },
        //文件列表移除文件时的钩子
        beforeRemove(file){
            if(file&&file.status == 'success'){
                this.axios({
                    url:'/api/file/delete',
                    method:'post',
                    data:{fileJSON:JSON.stringify(file)}
                }).then(()=>{
                    this.fileList = this.fileList.filter(item=>item.uid!==file.uid)
                })
            }
        },
        //文件超出个数限制时的钩子
        handleExceed(file,fileList){
            console.log({file});
            console.log({fileList});
        },
        beforeUpload(file){
            const fm = new FormData()
            fm.append('attachment',file)
            this.uploadFile(fm).then(fileList=>{
                this.fileList = fileList
            })
            return false
        }
    },
    mounted() {
        if(this.loginUser&&!Object.keys(this.loginUser).length){
            this.$message({message:'您未登录,请先登录',duration:1000})
            this.$router.push('/login')
        }
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    }
}
</script>

<style lang="less" scoped>
// 导入wangEditor样式
@import url('@wangeditor/editor/dist/css/style.css');

/deep/ .el-input{
    width: 900px;
}

/deep/ .el-upload-list__item{
    width: 300px;
}
.editor {
    height: 1000px;
    padding: 10px;

    .head {
        text-align: center;

        span {
            display: inline-block;
        }
    }

    .title,
    .content,
    .appendix {
        margin-top: 20px;

        .wangEditor {
            display: inline-block;
            width: 900px;
            height: 500px;
            border: 1px solid rgb(151, 137, 137);
        }

        form {
            display: inline-block;
        }
    }

    .appendix{
        padding: 10px 0px;
        height: 100px;
        width: 900px;
        border-radius: 5px;
        border: 1px solid rgb(183, 180, 180);
        span{
            font-size: 12px;
            color: rgb(135, 133, 133);
            margin-left: 30px;
            &:hover{
                cursor: pointer;
                color: rgb(73, 85, 253);
            }
        }
    }
    .date{
        padding: 20px 0px;
        /deep/ .el-date-editor{
            width: 200px;
        }
    }

    .foot{
        float: right;
        /deep/ .el-button{
            padding: 5px 10px;
            margin-left: 30px;
            span{
                vertical-align: middle;
                height: 10px;
                line-height: 10px;
            }
        }
    }
}
</style>